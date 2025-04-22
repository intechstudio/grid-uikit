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

  const {
    elements: { root, item },
    helpers: { isChecked },
    states: { value },
  } = createRadioGroup({
    defaultValue: target,
    orientation: orientation,
  });

  let oldTarget;

  $: {
    if (target.toString() !== oldTarget) {
      $value = target.toString();
      oldTarget = target.toString();
    }

    if (target.toString() !== $value) {
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
    }
  }
</script>

<div
  {...$root}
  use:root
  class:container-full={size == "full" && orientation == "horizontal"}
  class:container-vertical={orientation === "vertical"}
  class:container-button={style === "button"}
  class:radio-border={style !== "button" && orientation !== "vertical"}
  class="container"
>
  {#each options as option}
    <!-- Convert value to string in case it was originally boolean -->
    {@const value = option.value.toString()}
    {@const title = option.title}
    <label
      class:radio-border={orientation === "vertical"}
      class:vertical-padding={orientation === "vertical"}
      class:horizontal-padding={style !== "button"}
      class="row"
    >
      {#if style === "radio"}
        <button {...$item(value)} use:item id={title}>
          <div class="style-radio">
            <div
              style:display={$isChecked(value) ? "block" : "none"}
              class="style-radio-inside"
            />
          </div>
        </button>
        <span>{title}</span>
      {/if}
      {#if style === "button"}
        <button
          {...$item(value)}
          use:item
          id={title}
          class="style-button"
          class:selected={$isChecked(value)}
        >
          {#if typeof title !== "undefined"}
            <span>{title}</span>
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
    color: white;
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
    margin: 0.5rem 0;
    gap: 1rem;
  }
  div.container-button {
    gap: 1rem;
  }
  .radio-border {
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
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
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.75rem;
  }
  div.style-radio-inside {
    position: absolute;
    border-radius: 9999px;
    background-color: white;
    width: 0.75rem;
    height: 0.75rem;
  }
  button.style-button {
    position: relative;
    padding: 0.25rem 0.5rem;
    width: 100%;
    border-radius: 0.25rem;
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
  button.style-button:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  button.style-button.selected {
    background-color: rgba(0, 0, 0, 0.6);
  }
</style>
