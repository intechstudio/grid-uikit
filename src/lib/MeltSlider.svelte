<script lang="ts">
  import { createSlider, melt } from "@melt-ui/svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let target: number;

  export let min: number;
  export let max: number;
  export let step: number;
  export let disabled = false;

  const {
    elements: { root, range, thumbs },
    states: { value },
  } = createSlider({
    min: min,
    max: max,
    step: step,
    disabled: disabled,
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
      if (!disabled) {
        oldTarget = target = internal;
        dispatch("change", { value: target });
      } else {
        // Reset internal state if it changed while disabled
        $value[0] = target;
      }
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

<span {...$root} use:root class="container" class:disabled>
  <span class="range-full" class:disabled>
    <span {...$range} use:range class="range-selected" class:disabled />
  </span>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <span
    {...$thumbs[0]}
    use:thumbs
    class="thumb"
    class:disabled
    on:blur={handleThumbBlur}
  />
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
    border: 1px solid var(--background-soft);
    border-radius: 9999px;
    height: 8px;
  }
  span.range-selected {
    height: 8px;
    background-color: var(--foreground-disabled);
    border-radius: 9999px;
  }
  span.thumb {
    display: block;
    height: var(--thumb-size);
    width: var(--thumb-size);
    border-radius: 9999px;
    background-color: var(--foreground-muted);
  }

  span.container.disabled {
    pointer-events: none;
  }

  span.thumb.disabled {
    background-color: var(--foreground-disabled);
    cursor: default;
  }
</style>
