<script lang="ts" context="module">
  export type MeltComboOption = { info: string; value: string };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { createPopover, melt } from "@melt-ui/svelte";
  import { fade } from "svelte/transition";
  import { get, writable, type Writable } from "svelte/store";

  export let value: string;
  export let size: "auto" | "full" = "auto";
  export let suggestions: Array<MeltComboOption> = [];
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

  const dispatch = createEventDispatcher();

  let isError = false;

  let oldValue: string | undefined = undefined;
  let inputValue: string = "";
  let selected: Writable<MeltComboOption> = writable();

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

  function handleSelectionChange(option: MeltComboOption | undefined) {
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

    value = input;
    inputValue = input;
    dispatch("validator", { isError });
    dispatch("input", postProcessor(input));
  }

  function handleChange() {
    if (oldValue !== undefined && oldValue !== value) {
      oldValue = undefined;
      dispatch("change", postProcessor(inputValue));
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

<div class="flex flex-col relative" class:flex-grow={size === "full"}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label
    class="text-white text-sm pb-1 truncate items-center"
    class:hidden={title.length === 0}
  >
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
      class="trigger w-full flex flex-row border mb-1 {isError && !disabled
        ? 'border-error'
        : 'border-black'} p-2 {disabled
        ? 'bg-black/20 text-white/40'
        : 'bg-transparent text-white'}"
      {placeholder}
      {disabled}
    />
  </label>
  {#if $open && !disabled && suggestions.length > 0}
    <datalist
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
            class="cursor-pointer truncate hover:bg-white/40 flex w-full px-2 py-1 hover:text-white"
            on:click={() => selected.set(suggestion)}>{suggestion.info}</option
          >
        {/each}
      </div>
    </datalist>
  {/if}

  <div class="text-white/60 text-sm truncate">
    {infoValue}
  </div>
</div>

<style lang="postcss">
  .menu {
    @apply bg-gray-900 text-white/80 border border-white/50 rounded z-40 max-h-32 flex flex-col overflow-y-auto;
    @apply min-w-[8%] w-fit max-w-[13%] !important;
  }

  .trigger {
    @apply cursor-auto outline-none !important;
  }
</style>
