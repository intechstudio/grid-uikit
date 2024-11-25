<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    createCombobox,
    melt,
    type ComboboxOptionProps,
  } from "@melt-ui/svelte";

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

  const toOption = (
    option: MeltComboOption,
  ): ComboboxOptionProps<MeltComboOption> => ({
    value: option,
    label: option.info,
  });

  const dispatch = createEventDispatcher();

  let isError = false;
  let infoValue = "";

  let oldValue: string | undefined = undefined;

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, selected },
    helpers: { isSelected },
  } = createCombobox<MeltComboOption>({
    forceVisible: true,
  });

  $: handleValueChange(value);
  $: handleSelectionChange($selected?.value);
  $: handleInputChange($inputValue.value);

  function handleValueChange(value: any) {
    if ($inputValue === value || !value) {
      return;
    }

    inputValue.set(preProcessor(value));
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
    isError = !validator($inputValue.value);

    if (oldValue === undefined) {
      oldValue = value;
    }

    if (input === value) {
      return;
    }

    value = input;
    inputValue.set(value);
    dispatch("validator", { isError });
    dispatch("input", postProcessor(input));
  }

  function handleChange() {
    if (oldValue !== undefined && oldValue !== value) {
      oldValue = undefined;
      dispatch("change", postProcessor($inputValue.value));
    }
  }
</script>

<div class="flex flex-col relative" class:flex-grow={size === "full"}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label
    use:melt={$label}
    class="text-white text-sm pb-1 truncate items-center"
    class:hidden={label.length === 0}
  >
    {title}
  </label>
  <input
    type="text"
    use:melt={$input}
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
    <div {...$menu} use:menu class="menu">
      {#each suggestions as suggestion}
        <div
          {...$option(toOption(suggestion))}
          use:option
          class="cursor-pointer truncate hover:bg-white/40 p-2 hover:text-white {$isSelected(
            suggestion,
          )
            ? 'bg-white/10'
            : ' '}"
        >
          {suggestion.info}
        </div>
      {/each}
    </div>
  {/if}

  <div class="text-white/60 text-sm truncate">
    {infoValue}
  </div>
</div>

<style lang="postcss">
  .menu {
    @apply bg-gray-900 text-white/80 border border-white/50 rounded z-40 max-h-32 overflow-y-auto;
    @apply min-w-[8%] w-fit max-w-[13%] !important;
  }
</style>
