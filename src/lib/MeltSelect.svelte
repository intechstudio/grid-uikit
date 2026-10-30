<script lang="ts">
  import { createSelect, melt } from "@melt-ui/svelte";
  export let options: SelectOption[];
  export let target: any;
  export let size: "auto" | "full" = "auto";
  export let disabled = false;
  export let title = "";
  export let valueInfoEnabled = false;
  // "chip": a compact select with its title in front of it ("Layout: En ▼"),
  // for a setting that sits beside other content.
  export let style: "default" | "chip" = "default";

  type SelectOption = { title: string; value: any; info?: string };

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

  $: infoValue = options.find((e) => e.value === $selected?.value)?.info ?? "";

  $: if ($selected) {
    handleSelectionChange();
  }

  $: if (target != null) {
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

<div
  class="container"
  class:container-grow={size === "full"}
  class:container-chip={style === "chip"}
>
  {#if title?.length > 0}
    <label class:chip-label={style === "chip"}
      >{title}{style === "chip" ? ":" : ""}</label
    >
  {/if}
  <button
    {...$trigger}
    use:trigger
    class="select"
    class:chip={style === "chip"}
    class:disabled
  >
    <span>{$selectedLabel || " "}</span>
    <span>&#9660;</span>
  </button>
  {#if $open}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div {...$menu} use:menu on:mousedown|preventDefault class="menu">
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
  {#if valueInfoEnabled && style !== "chip"}
    <div class="info-value">{infoValue}&nbsp;</div>
  {/if}
</div>

<style>
  label {
    color: var(--foreground);
    font-size: 0.875em;
    line-height: 1.25em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div.container {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }
  div.container-grow {
    flex-grow: 1;
  }
  div.container-chip {
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
  }
  label.chip-label {
    color: var(--foreground-muted);
  }
  button.select {
    color: var(--foreground);
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid var(--background-soft);
    padding: 0.5em;

    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: inherit;
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
    margin: 0; /* 2 */
    background-color: var(--background-muted);
    cursor: pointer;
  }
  button.select.chip {
    width: auto;
    gap: 0.5em;
    align-items: center;
    padding: 0.125em 0.5em;
    border-color: var(--border);
    border-radius: var(--radius);
  }
  button.select:focus {
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
  }
  button.disabled {
    color: var(--foreground-disabled);
    cursor: default;
  }
  .menu {
    background-color: var(--popover-background);
    color: var(--foreground-muted);
    border: 1px solid var(--foreground-muted);
    border-radius: var(--radius-medium);
    z-index: 40;
    overflow: hidden;
  }
  div.option {
    cursor: pointer;
    padding: 0.5rem;
  }
  div.option:hover,
  div.option[data-highlighted] {
    background-color: var(--popover-selection);
    color: var(--foreground);
  }
  div.option-selected {
    background-color: var(--popover-reference);
  }
  div.info-value {
    color: var(--foreground-soft);
    font-size: 0.875em;
    line-height: 1.25em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
