<script lang="ts">
  export let options;
  export let style: "normal" | "outlined" | "accept" = "normal";
  export let disabled: boolean = false;
  export let target: any;
  export let grouped: boolean = false;

  import { writable } from "svelte/store";
  import { createSelect, melt } from "@melt-ui/svelte";

  const customOpen = writable(false);

  function getDefaultSelected() {
    if (typeof options === "undefined") {
      return;
    }

    const obj = options.find((e) => e.value === target);
    return { label: obj?.title, value: obj?.value };
  }

  const {
    elements: { trigger, menu, option },
    states: { selected, selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
    open: customOpen,
    disabled: disabled,
    forceVisible: true,
    positioning: {
      placement: "bottom-end",
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
    if ($selected.value === target) {
      return;
    }

    const obj = options.find((e) => e.value === target);
    selected.set({ label: obj?.title, value: obj?.value });
  }

  function handleSelectionChange() {
    if ($selected.value === target) {
      return;
    }
    target = $selected.value;
  }

  let element: HTMLButtonElement;

  export function focus() {
    element?.focus();
  }
</script>

<div class="dropdown-container">
  <div {...$trigger} use:trigger style="display: inline-flex;">
    <button
      bind:this={element}
      on:click={(e) => {
        e.stopPropagation();
        $customOpen = !$customOpen;
      }}
      {disabled}
      class="dropdown-button style-{style}"
      class:grouped
    >
      &#9660;
    </button>

    {#if $open}
      <div {...$menu} use:menu class="menu">
        {#each options as item}
          <div
            {...$option({ value: item.value, label: item.title })}
            use:option
            class="option"
            class:option-selected={$isSelected(item.value)}
          >
            {item.title}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .dropdown-container {
    position: relative;
    display: inline-flex;
  }

  .menu {
    background-color: var(--popover-background);
    color: var(--foreground-muted);
    border: 1px solid var(--foreground-muted);
    border-radius: 0.25rem;
    z-index: 40;
  }

  div.option {
    cursor: pointer;
    padding: 0.5rem;
  }

  div.option:hover {
    background-color: var(--popover-selection);
    color: var(--foreground);
  }

  div.option-selected {
    background-color: var(--popover-reference);
  }

  .dropdown-button {
    cursor: pointer;
    border-radius: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;

    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 0.75rem;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    text-transform: none;
    background-color: transparent;
    border: 1px solid transparent;
  }

  .dropdown-button:disabled {
    cursor: default;
  }

  .dropdown-button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  .dropdown-button.grouped {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  /* Style variants */
  .dropdown-button.style-normal {
    color: var(--foreground-muted);
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.4);
  }

  .dropdown-button.style-normal:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }

  .dropdown-button.style-normal:disabled {
    color: var(--foreground-disabled);
    background-color: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(0, 0, 0, 0.25);
  }

  .dropdown-button.style-outlined {
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 164, 130, 1);
    color: var(--foreground-muted);
  }

  .dropdown-button.style-outlined:hover {
    background-color: rgba(0, 111, 83, 1);
    border-color: rgba(27, 164, 135);
  }

  .dropdown-button.style-outlined:disabled {
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--foreground-disabled);
    border: 1px solid rgba(0, 163, 130, 1);
  }

  .dropdown-button.style-accept {
    color: var(--foreground);
    background-color: rgba(11, 164, 132, 1);
  }

  .dropdown-button.style-accept:hover {
    background-color: rgba(0, 111, 83, 1);
  }

  .dropdown-button.style-accept:disabled {
    color: var(--foreground-disabled);
    background-color: rgba(11, 164, 132, 0.5);
  }
</style>
