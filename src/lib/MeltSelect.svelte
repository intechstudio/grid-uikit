<script lang="ts">
  import { createSelect, melt } from "@melt-ui/svelte";
  export let options: SelectOption[];
  export let target: any;
  export let size: "auto" | "full" = "auto";
  export let disabled: any;

  type SelectOption = { title: string; value: any };

  function getDefaultSelected() {
    const obj = options.find((e: SelectOption) => e.value === target);
    return { label: obj?.title, value: obj?.value };
  }

  const {
    elements: { trigger, menu, option },
    states: { selected, selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
    disabled: disabled,
    forceVisible: true,
    positioning: {
      placement: "bottom",
      fitViewport: true,
      sameWidth: true,
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

    const obj = options.find((e: SelectOption) => e.value === target);
    selected.set({ label: obj?.title, value: obj?.value });
  }

  function handleSelectionChange() {
    if ($selected.value === target) {
      return;
    }
    target = $selected.value;
  }
</script>

<div class="container" class:container-grow={size === "full"}>
  <button {...$trigger} use:trigger class="select">
    <span>{$selectedLabel || " "}</span>
    <span>&#9660;</span>
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

<style>
  div.container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  div.container-grow {
    flex-grow: 1;
  }
  button.select {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid black;
    padding: 0.5rem;

    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: 100%; /* 1 */
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
    color: inherit; /* 1 */
    margin: 0; /* 2 */
    background-color: transparent; /* 2 */
    cursor: pointer;
  }
  .menu {
    background-color: rgba(23, 23, 23, 1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 0.25rem;
    z-index: 40;
  }
  div.option {
    cursor: pointer;
    padding: 0.5rem;
  }
  div.option:hover {
    background-color: rgba(255, 255, 255, 0.4);
    color: rgba(255, 255, 255, 1);
  }
  div.option-selected {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>
