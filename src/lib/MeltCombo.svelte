<script lang="ts" context="module">
  export type MeltComboSuggestion = { info: string; value: string };

  export type MeltComboData = {
    value: string;
    suggestions?: MeltComboSuggestion[];
    title?: string;
    validator?: {
      value: boolean;
      func?: (e: string) => boolean;
    };
    preProcessor?: (value: string) => string;
    postProcessor?: (value: string) => string;
    size?: "auto" | "full";
    searchable?: boolean;
    placeholder?: string;
    disabled: boolean;
    valueInfoEnabled?: boolean;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { createPopover } from "@melt-ui/svelte";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";

  export let value: string;
  export let size: "auto" | "full" = "auto";
  export let suggestions: Array<MeltComboSuggestion> = [];
  export let placeholder = "";
  export let validator = (value: string) => {
    return true;
  };
  export let disabled = false;
  export let preProcessor = (value: string) => {
    return value;
  };
  export let postProcessor = (value: string) => {
    return value;
  };
  export let title = "";
  export let searchable = false;
  export let valueInfoEnabled = true;
  export let availableCharacters: number = Infinity;

  const dispatch = createEventDispatcher();

  let isError = false;

  let oldValue: string | undefined = undefined;
  let inputValue: string = "";
  let selected: Writable<MeltComboSuggestion> = writable();

  let inputElement: any;

  const open = writable(false);

  const {
    elements: { trigger, content, arrow, close },
  } = createPopover({
    forceVisible: true,
    positioning: {
      placement: "bottom",
    },
    disableFocusTrap: true,
    closeFocus: () => {
      // This is important
      // Override focus behaviour to not regain focus when closing on blur
      return null;
    },
    open,
    onOpenChange: ({ curr, next }) => {
      //Disable melt state management, use own instead
      return curr;
    },
  });

  $: handleValueChange(value);
  $: handleSelectionChange($selected);
  $: handleInputChange(inputValue);

  $: filteredSuggestions = searchable
    ? suggestions.filter(
        (e) =>
          e.info.toLowerCase().includes(inputValue?.toLowerCase()) ||
          e.value.toLowerCase().includes(inputValue?.toLowerCase()),
      )
    : suggestions;

  $: infoValue =
    suggestions.find((s) => String(s.value).trim() == String(inputValue).trim())
      ?.info || "";

  function handleValueChange(value: any) {
    if (inputValue === value || !value) {
      return;
    }

    inputValue = preProcessor(value);
  }

  function handleSelectionChange(option: MeltComboSuggestion | undefined) {
    if (!option) {
      return;
    }

    handleInputChange(option.value);
    handleChange();
    open.set(false);
  }

  function handleInputChange(input: string) {
    isError = !validator(input);

    if (oldValue === undefined) {
      oldValue = value;
    }

    if (input === value) {
      return;
    }

    if (availableCharacters < input.length) {
      inputValue = value;
      return;
    }

    value = input;
    inputValue = input;
    dispatch("validator", { isError });
    dispatch("input", {
      value: postProcessor(input),
      validationError: isError,
    });
  }

  function handleChange() {
    if (oldValue !== undefined && oldValue !== value) {
      oldValue = undefined;
      dispatch("change", {
        value: postProcessor(inputValue),
        validationError: isError,
      });
    }
  }

  function handleFocus() {
    filteredSuggestions = suggestions;
    if (searchable) {
      inputElement.select();
    }
    open.set(true);
  }

  function handleBlur() {
    open.set(false);
  }
</script>

<div class="container" class:flex-grow={size === "full"}>
  <div class="content">
    {#if title?.length > 0}
      <label>
        {title}
        <input
          bind:this={inputElement}
          type="text"
          {...$trigger}
          use:trigger
          bind:value={inputValue}
          on:change={handleChange}
          on:focus={handleFocus}
          on:blur={handleBlur}
          on:m-keydown={(e) => {
            e.preventDefault();
          }}
          on:click|stopPropagation={() => {
            open.set(true);
          }}
          class:error={isError && !disabled}
          class:disabled
          {placeholder}
          {disabled}
        />
      </label>
    {:else}
      <input
        bind:this={inputElement}
        type="text"
        {...$trigger}
        use:trigger
        bind:value={inputValue}
        on:change={handleChange}
        on:focus={handleFocus}
        on:blur={handleBlur}
        on:m-keydown={(e) => {
          e.preventDefault();
        }}
        on:click|stopPropagation={() => {
          open.set(true);
        }}
        class:error={isError && !disabled}
        class:disabled
        {placeholder}
        {disabled}
      />
    {/if}
  </div>

  {#if $open && !disabled && suggestions.length > 0}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      {...$content}
      use:content
      on:mousedown|preventDefault
      transition:fade={{ duration: 100 }}
      class="menu"
    >
      <div>
        {#each filteredSuggestions as suggestion}
          <option
            {...$close}
            use:close
            class="suggestion"
            on:click={() => selected.set(suggestion)}>{suggestion.info}</option
          >
        {/each}
      </div>
    </div>
  {/if}

  <div class="info-value" style:display={valueInfoEnabled ? "visible" : "none"}>
    {infoValue}
  </div>
</div>

<style>
  div.container {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  div.flex-grow {
    flex-grow: 1;
  }
  div.content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  label {
    color: white;
    font-size: 0.875rem;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-items: center;
  }
  input {
    cursor: auto;
    outline: 2px solid transparent;
    outline-offset: 2px;
    width: 100%;
    display: flex;
    flex-direction: row;
    border-width: 1px;
    padding: 0.5rem;
    border-color: rgba(0, 0, 0, 1);
    color: white;
    background-color: rgba(0, 0, 0, 0.25);
    margin: 0.25rem 0rem 0rem;
    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: 100%; /* 1 */
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
  }
  input.error {
    border-color: rgba(220, 38, 38, 1);
  }
  input.disabled {
    background-color: rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.4);
  }
  .menu {
    background-color: rgba(23, 23, 23, 1);
    color: rgba(255, 255, 255, 0.8);
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.5);
    border-radius: 0.25rem;
    z-index: 40;
    max-height: 8rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-width: 8%;
    width: fit-content;
    max-width: 13%;
  }
  option.suggestion {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  option.suggestion:hover {
    background-color: rgba(255, 255, 255, 0.4);
    color: white;
  }
  div.info-value {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
