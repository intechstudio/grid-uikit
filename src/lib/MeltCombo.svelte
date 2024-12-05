<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { createPopover, melt, createLabel } from "@melt-ui/svelte";
  import { fade } from "svelte/transition";
  import { writable, type Writable } from "svelte/store";

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

  type MeltComboOption = { info: string; value: string };

  const dispatch = createEventDispatcher();

  let isError = false;
  let infoValue = "";

  let oldValue: string | undefined = undefined;
  let inputValue: string;
  let selected: Writable<MeltComboOption> = writable();

  const {
    elements: { trigger, content, arrow, close },
    states: { open },
  } = createPopover({
    forceVisible: true,
    positioning: {
      placement: "bottom",
    },
    disableFocusTrap: true,
  });

  const {
    elements: { root },
  } = createLabel();

  $: handleValueChange(value);
  $: handleSelectionChange($selected);
  $: handleInputChange(inputValue);

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
  }

  function handleInputChange(input: string) {
    infoValue =
      suggestions.find((s) => String(s.value).trim() == String(input).trim())
        ?.info || "";
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
</script>

<div class="flex flex-col relative" class:flex-grow={size === "full"}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label
    use:melt={$root}
    class="text-white text-sm pb-1 truncate items-center"
    class:hidden={title.length === 0}
  >
    {title}
  </label>
  <input
    type="text"
    use:melt={$trigger}
    bind:value={inputValue}
    on:change={handleChange}
    class="w-full flex flex-row border mb-1 {isError && !disabled
      ? 'border-error'
      : 'border-black'} p-2 {disabled
      ? 'bg-black/20 text-white/40'
      : 'bg-transparent text-white'}"
    {placeholder}
    {disabled}
  />
  {#if $open && !disabled && suggestions.length > 0}
    <div
      {...$content}
      use:content
      transition:fade={{ duration: 100 }}
      class="menu"
    >
      <div>
        {#each suggestions as suggestion}
          <button
            use:melt={$close}
            class="cursor-pointer truncate hover:bg-white/40 flex w-full py-1 px-2 hover:text-white"
            on:click={() => selected.set(suggestion)}>{suggestion.info}</button
          >
        {/each}
      </div>
    </div>
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
</style>
