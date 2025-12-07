<script lang="ts">
  import { createSlider, melt } from "@melt-ui/svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let target: number;

  export let min: number;
  export let max: number;
  export let step: number;

  const {
    elements: { root, range, thumbs },
    states: { value },
  } = createSlider({
    min: min,
    max: max,
    step: step,
    onValueCommitted: handleValueCommited,
  });

  let oldTarget: number;

  function syncExternalToInternal(external: number) {
    if (external !== oldTarget) {
      $value[0] = oldTarget = external;
    }
  }

  function syncInternalToExternal(internal: number) {
    if (target !== internal) {
      oldTarget = target = internal;
      dispatch("change", { value: target });
    }
  }

  function handleThumbBlur() {
    dispatch("blur");
  }

  function handleValueCommited() {
    dispatch("commit", { value: target });
  }

  $: syncExternalToInternal(target);
  $: syncInternalToExternal($value[0]);
</script>

<span {...$root} use:root class="container">
  <span class="range-full">
    <span {...$range} use:range class="range-selected" />
  </span>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <span {...$thumbs[0]} use:thumbs class="thumb" on:blur={handleThumbBlur} />
</span>

<style>
  :root {
    --thumb-size: 1.125rem;
  }

  span.container {
    position: relative;
    display: flex;
    max-width: 200px;
    width: 100%;
    align-items: center;
    height: 26px;
    margin-left: calc(var(--thumb-size) / 2);
    margin-right: calc(var(--thumb-size) / 2);
  }
  span.range-full {
    display: block;
    width: 100%;
    background-color: var(--background-muted);
    border-radius: 9999px;
    height: 8px;
  }
  span.range-selected {
    height: 8px;
    background-color: var(--foreground-soft);
    border-radius: 9999px;
  }
  span.thumb {
    display: block;
    height: var(--thumb-size);
    width: var(--thumb-size);
    border-radius: 9999px;
    background-color: var(--foreground-muted);
  }
</style>
