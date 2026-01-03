<script lang="ts">
  import { createRadioGroup, melt } from "@melt-ui/svelte";
  import { writable } from "svelte/store";

  interface option_t {
    title: string;
    value: string | boolean | number; // melt uses string values internally
  }

  export let options: option_t[];
  export let target;
  export let orientation: "vertical" | "horizontal" = "vertical";
  export let style: "button" | "radio" = "radio";
  export let size: "auto" | "full" = "auto";
  export let disabled: boolean = false;

  const {
    elements: { root, item },
    helpers: { isChecked },
    states: { value },
  } = createRadioGroup({
    defaultValue: target,
    orientation: orientation,
    disabled: disabled,
  });

  let oldTarget;

  $: {
    if (target.toString() !== oldTarget) {
      $value = target.toString();
      oldTarget = target.toString();
    }

    if (target.toString() !== $value) {
      if (!disabled) {
        oldTarget = $value;

        if ($value === "true") {
          // Convert back to boolean automatically
          target = true;
        } else if ($value === "false") {
          // Convert back to boolean automatically
          target = false;
        } else if ($value !== "" && !isNaN(Number($value))) {
          // Convert back to number automatically
          target = Number($value);
        } else {
          target = $value;
        }
      } else {
        // Reset internal state if it changed while disabled
        $value = target.toString();
      }
    }
  }
</script>

<div
  {...$root}
  use:root
  class:container-full={size == "full" && orientation == "horizontal"}
  class:container-vertical={orientation === "vertical"}
  class:container-button={style === "button"}
  class:radio-border={style !== "button"}
  class:disabled={disabled}
  class="container"
>
  {#each options as option}
    <!-- Convert value to string in case it was originally boolean -->
    {@const value = option.value.toString()}
    {@const title = option.title}
    <label class:horizontal-padding={style !== "button"} class:disabled={disabled} class="row">
      {#if style === "radio"}
        <button {...$item(value)} use:item id={title} class:disabled={disabled}>
          <div class="style-radio" class:disabled={disabled}>
            <div
              style:display={$isChecked(value) ? "block" : "none"}
              class="style-radio-inside"
              class:disabled={disabled}
            />
          </div>
        </button>
        <span class:disabled={disabled}>{title}</span>
      {/if}
      {#if style === "button"}
        <button
          {...$item(value)}
          use:item
          id={title}
          class="style-button"
          class:selected={$isChecked(value)}
          class:disabled={disabled}
        >
          {#if typeof title !== "undefined"}
            <span class:disabled={disabled}>{title}</span>
          {:else}
            <span style:visibility="hidden">N/A</span>
          {/if}
          <slot name="item" {value} />
        </button>
      {/if}
    </label>
  {/each}
</div>

<style>
  div.container {
    color: var(--foreground-muted);
    overflow: visible;
    display: grid;
    grid-auto-flow: column;
    padding: 0.5rem 0;
  }
  div.container-full {
    width: 100%;
  }
  div.container-vertical {
    grid-auto-flow: row;
    margin: 0;
    gap: 1rem;
  }
  div.container-button {
    gap: 1rem;
  }
  .radio-border {
    background-color: var(--background-muted);
    border: 1px solid var(--background-soft);
  }
  label.row {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  label.vertical-padding {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  label.horizontal-padding {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  div.style-radio {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    border-width: 1px;
    border-color: var(--foreground);
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.75rem;
  }
  div.style-radio-inside {
    position: absolute;
    border-radius: 9999px;
    background-color: var(--foreground);
    width: 0.75rem;
    height: 0.75rem;
  }
  button {
    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: 100%; /* 1 */
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
    color: inherit; /* 1 */
    margin: 0; /* 2 */
    padding: 0; /* 3 */
    background-color: transparent; /* 2 */
    cursor: pointer;
  }
  button.style-button {
    position: relative;
    padding: 0.25rem 0.5rem;
    width: 100%;
    border-radius: 0.25rem;
    border: 1px solid var(--background-soft);
  }
  button.style-button:hover {
    background-color: var(--background-muted);
  }
  button.style-button.selected {
    background-color: var(--background-soft);
  }

  /* Disabled styles */
  label.row.disabled {
    cursor: default;
  }

  button.disabled {
    cursor: default;
  }

  div.style-radio.disabled {
    border-color: var(--foreground-disabled);
  }

  div.style-radio-inside.disabled {
    background-color: var(--foreground-disabled);
  }

  button.style-button.disabled {
    color: var(--foreground-disabled);
    background-color: var(--background-muted);
    border: 1px solid var(--background-muted);
  }

  button.style-button.selected.disabled {
    background-color: var(--background-soft);
  }

  button.style-button.disabled:hover {
    background-color: var(--background-muted);
  }

  button.style-button.selected.disabled:hover {
    background-color: var(--background-soft);
  }

  /* Prevent pointer events on disabled container */
  div.container.disabled {
    pointer-events: none;
  }

  span.disabled {
    color: var(--foreground-disabled);
  }
</style>
