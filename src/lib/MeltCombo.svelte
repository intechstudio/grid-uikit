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
    disabled?: boolean;
    valueInfoEnabled?: boolean;
  };
</script>

<script lang="ts">
  import { createEventDispatcher, tick } from "svelte";
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
  let highlightedIndex = -1;

  $: if (!$open) {
    highlightedIndex = -1;
  } else if ($open && filteredSuggestions.length > 0) {
    const match = filteredSuggestions.findIndex(
      (s) => String(s.value).trim() === String(inputValue).trim(),
    );
    highlightedIndex = match >= 0 ? match : 0;
  }

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

  $: baseList = searchable
    ? suggestions.filter(
        (e) =>
          e.info.toLowerCase().includes(inputValue?.toLowerCase()) ||
          e.value.toLowerCase().includes(inputValue?.toLowerCase()),
      )
    : suggestions;

  $: filteredSuggestions =
    inputValue.trim() &&
    !suggestions.some(
      (s) => String(s.value).trim() === String(inputValue).trim(),
    )
      ? [
          { info: "Manual entry: " + inputValue, value: inputValue },
          ...baseList,
        ]
      : baseList;

  $: infoValue =
    suggestions.find((s) => String(s.value).trim() == String(inputValue).trim())
      ?.info || "";

  function handleValueChange(value: any) {
    const left = postProcessor(preProcessor(value));
    const right = postProcessor(preProcessor(inputValue));
    if (left === right || !value) {
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

  function handleBlur() {
    open.set(false);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredSuggestions.length === 0) return;
      if (!$open) {
        open.set(true);
      } else {
        highlightedIndex =
          highlightedIndex < filteredSuggestions.length - 1
            ? highlightedIndex + 1
            : 0;
        scrollIntoView();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredSuggestions.length === 0) return;
      if (!$open) {
        open.set(true);
      } else {
        highlightedIndex =
          highlightedIndex > 0
            ? highlightedIndex - 1
            : filteredSuggestions.length - 1;
        scrollIntoView();
      }
    } else if (e.key === "Enter") {
      if (
        highlightedIndex >= 0 &&
        highlightedIndex < filteredSuggestions.length
      ) {
        e.preventDefault();
        selected.set(filteredSuggestions[highlightedIndex]);
        highlightedIndex = -1;
      } else if (!$open) {
        e.preventDefault();
        open.set(true);
      }
    } else if (e.key === "Escape") {
      highlightedIndex = -1;
      open.set(false);
    }
  }

  function scrollIntoView() {
    tick().then(() => {
      const el = document.querySelector(
        `[data-combo-index="${highlightedIndex}"]`,
      );
      el?.scrollIntoView({ block: "nearest" });
    });
  }

  let menuWidth;
</script>

<div class="container" class:flex-grow={size === "full"}>
  <div class="content">
    {#if title?.length > 0}
      <label>
        <span class="label-text">{title}</span>
        <div bind:clientWidth={menuWidth}>
          <input
            bind:this={inputElement}
            type="text"
            {...$trigger}
            use:trigger
            bind:value={inputValue}
            on:change={handleChange}
            on:blur={handleBlur}
            on:m-keydown={(e) => {
              e.preventDefault();
            }}
            on:keydown={handleKeydown}
            on:click={() => {
              open.set(true);
            }}
            class:error={isError && !disabled}
            class:disabled
            {placeholder}
            {disabled}
          />
        </div>
      </label>
    {:else}
      <div bind:clientWidth={menuWidth}>
        <input
          bind:this={inputElement}
          type="text"
          {...$trigger}
          use:trigger
          bind:value={inputValue}
          on:change={handleChange}
          on:blur={handleBlur}
          on:m-keydown={(e) => {
            e.preventDefault();
          }}
          on:keydown={handleKeydown}
          on:click={() => {
            open.set(true);
          }}
          class:error={isError && !disabled}
          class:disabled
          {placeholder}
          {disabled}
        />
      </div>
    {/if}
  </div>

  {#if $open && !disabled && filteredSuggestions.length > 0}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      {...$content}
      use:content
      on:mousedown|preventDefault
      transition:fade={{ duration: 100 }}
      class="menu"
      style="min-width: {menuWidth}px;"
    >
      <div>
        {#each filteredSuggestions as suggestion, i}
          <option
            {...$close}
            use:close
            class="suggestion"
            data-combo-index={i}
            on:click={() => selected.set(suggestion)}
            on:mouseenter={() => (highlightedIndex = i)}
            style={highlightedIndex === i
              ? "background-color: var(--popover-selection); color: var(--foreground);"
              : ""}>{suggestion.info}</option
          >
        {/each}
      </div>
    </div>
  {/if}

  {#if valueInfoEnabled}
    <div class="info-value">
      {infoValue}&nbsp;
    </div>
  {/if}
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
    gap: 0.25em;
  }
  label {
    color: var(--foreground);
    font-size: 0.875em;
    line-height: 1.25em;
    align-items: center;
  }
  .label-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  input {
    cursor: auto;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--background-soft);
    padding: 0.5em;
    color: var(--foreground);
    background-color: var(--background-muted);
    margin: 0.25em 0em 0em;
    font-size: inherit;
  }
  input:focus {
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
  }
  input.error {
    border-color: var(--error);
  }
  input.disabled {
    background-color: var(--background-muted);
    color: var(--foreground-disabled);
    cursor: default;
  }
  .menu {
    background-color: var(--popover-background);
    color: var(--foreground-muted);
    border-width: 1px;
    border-color: var(--foreground-muted);
    border-radius: 0.25em;
    z-index: 40;
    max-height: 8em;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    width: fit-content;
  }
  option.suggestion {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    width: 100%;
    padding-left: 0.5em;
    padding-right: 0.5em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
  }
  option.suggestion:hover {
    background-color: var(--popover-selection);
    color: var(--foreground);
  }
  div.info-value {
    color: var(--foreground-soft);
    font-size: 0.875em;
    line-height: 1.25em;
    margin-top: 0.25em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
