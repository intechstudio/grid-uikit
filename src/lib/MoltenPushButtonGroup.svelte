<script lang="ts">
  import { writable } from "svelte/store";
  import { createSelect, melt } from "@melt-ui/svelte";

  export let options: {
    title: string;
    value: any;
    onclick?: (value: any) => void;
  }[] = [];
  export let style: "normal" | "outlined" | "accept" = "normal";
  export let disabled: boolean = false;
  export let target: any = undefined;

  const customOpen = writable(false);

  function getDefaultSelected() {
    if (!options?.length) return undefined;
    const obj = options.find((e) => e.value === target);
    return obj ? { label: obj.title, value: obj.value } : undefined;
  }

  const {
    elements: { menu, option, trigger },
    states: { selected, selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
    open: customOpen,
    disabled: disabled,
    forceVisible: true,
    positioning: {
      placement: "bottom-start",
      fitViewport: true,
    },
    defaultSelected: getDefaultSelected(),
  });

  $: if ($selected) {
    handleSelectionChange();
  }

  $: if (target) {
    handleTargetChange();
  }

  function handleTargetChange() {
    if (!selected || !$selected || $selected.value === target) return;
    const obj = options.find((e) => e.value === target);
    selected.set({ label: obj?.title ?? "", value: obj?.value });
  }

  function handleSelectionChange() {
    if (!selected || !$selected || $selected.value === target) return;
    target = $selected.value;
  }

  function toggleDropdown() {
    $customOpen = !$customOpen;
  }

  function closeDropdown() {
    $customOpen = false;
  }

  function handleAction() {
    if (!options || !$selected) return;
    const item = options.find((e) => e.value === $selected.value);
    if (item?.onclick) {
      item.onclick($selected.value);
    }
  }
</script>

<div class="split-button-group">
  <div class="main-button-wrapper">
    <slot
      name="button"
      {closeDropdown}
      {handleAction}
      selectedLabel={$selectedLabel}
    />
  </div>

  <div class="trigger-wrapper" {...$trigger} use:trigger>
    <button
      class="trigger style-{style}"
      {disabled}
      on:click|stopPropagation={toggleDropdown}
      on:keydown={(e) => {
        if (e.key === "Escape") closeDropdown();
      }}
      aria-label="Open dropdown"
    >
      &#9660;
    </button>

    {#if $open}
      <div {...$menu} use:menu class="menu" role="listbox">
        {#each options as item}
          <div
            {...$option({ value: item.value, label: item.title })}
            use:option
            class="option"
            class:option-selected={$isSelected(item.value)}
            role="option"
            aria-selected={$isSelected(item.value)}
          >
            {item.title}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .split-button-group {
    display: inline-flex;
    position: relative;
  }

  .main-button-wrapper {
    display: inline-flex;
  }

  .trigger-wrapper {
    display: inline-flex;
    position: relative;
  }

  .trigger {
    cursor: pointer;
    border-top-right-radius: var(--radius, 0.25rem);
    border-bottom-right-radius: var(--radius, 0.25rem);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    overflow: hidden;
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5em;

    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    text-transform: none;
    background-color: transparent;
    border: 1px solid transparent;
  }

  .trigger:disabled {
    cursor: default;
  }

  .trigger:focus {
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
  }

  .trigger.style-normal {
    color: var(--foreground-muted);
    background-color: var(--background-muted);
    border: 1px solid var(--background-soft);
    border-left: none;
  }

  .trigger.style-normal:hover:not(:disabled) {
    background-color: var(--background-soft);
  }

  .trigger.style-normal:disabled {
    color: var(--foreground-disabled);
    background-color: var(--background-soft);
    border: 1px solid var(--background-soft);
    border-left: none;
  }

  .trigger.style-outlined {
    background-color: var(--background-muted);
    border: 1px solid var(--accent);
    border-left: none;
    color: var(--foreground-muted);
  }

  .trigger.style-outlined:hover:not(:disabled) {
    background-color: var(--accent-soft);
    border-color: var(--accent-muted);
  }

  .trigger.style-outlined:disabled {
    background-color: var(--background-muted);
    color: var(--foreground-disabled);
    border: 1px solid var(--accent-soft);
    border-left: none;
  }

  .trigger.style-accept {
    color: var(--foreground);
    background-color: var(--accent);
    border-left: none;
  }

  .trigger.style-accept:hover:not(:disabled) {
    background-color: var(--accent-soft);
  }

  .trigger.style-accept:disabled {
    color: var(--foreground-disabled);
    background-color: var(--accent-soft);
    border-left: none;
  }

  .menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 40;
    width: 10em;
    background-color: var(--popover-background);
    color: var(--foreground-muted);
    border: 1px solid var(--foreground-muted);
    border-radius: var(--radius, 0.25rem);
    margin-top: 2px;
  }

  .option {
    cursor: pointer;
    padding: 0.5rem;
    white-space: nowrap;
  }

  .option:hover {
    background-color: var(--popover-selection);
    color: var(--foreground);
  }

  .option-selected {
    background-color: var(--popover-reference);
  }
</style>
