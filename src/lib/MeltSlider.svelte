<script lang="ts">
  import { createSlider, melt } from "@melt-ui/svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let target: number;

  export let min: number;
  export let max: number;
  export let step: number;
  export let disabled = false;
  // "vertical": the slider stands up, its minimum at the bottom, and takes
  // the height of its container (up to 200px, all of it with `fill`).
  export let orientation: "horizontal" | "vertical" = "horizontal";
  // Stretch the slider to fill its container instead of capping it at 200px.
  export let fill = false;
  // Optional custom track background (e.g. a color gradient). When set, the
  // track shows this background and the selected-range fill is hidden so the
  // full background stays visible.
  export let trackBackground: string | undefined = undefined;
  // Optional custom thumb background (e.g. the color at the thumb's value on a
  // color slider). When unset the thumb uses the default theme color.
  export let thumbBackground: string | undefined = undefined;

  const {
    elements: { root, range, thumbs },
    states: { value },
  } = createSlider({
    min: min,
    max: max,
    step: step,
    disabled: disabled,
    orientation: orientation,
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

<span
  {...$root}
  use:root
  class="container"
  class:disabled
  class:fill
  class:vertical={orientation === "vertical"}
>
  <span
    class="range-full"
    class:disabled
    class:has-background={trackBackground}
    style:background={trackBackground}
  >
    <span
      {...$range}
      use:range
      class="range-selected"
      class:disabled
      class:hidden={trackBackground}
    />
  </span>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <span
    {...$thumbs[0]}
    use:thumbs
    class="thumb"
    class:disabled
    class:has-color={thumbBackground}
    style:background={disabled ? undefined : thumbBackground}
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
  span.container.fill {
    max-width: none;
  }
  span.container.vertical {
    flex-direction: column;
    justify-content: center;
    width: 26px;
    max-width: none;
    height: 100%;
    max-height: 200px;
    margin-left: 0;
    margin-right: 0;
    margin-top: calc(var(--thumb-size) / 2);
    margin-bottom: calc(var(--thumb-size) / 2);
  }
  span.container.vertical.fill {
    max-height: none;
  }
  span.range-full {
    display: block;
    width: 100%;
    background-color: var(--background-muted);
    border: 1px solid var(--background-soft);
    height: 8px;
    border-radius: var(--radius);
  }
  span.range-full.has-background {
    background-color: transparent;
  }
  span.container.vertical span.range-full {
    width: 8px;
    height: 100%;
  }
  span.container.vertical span.range-selected {
    width: 8px;
    height: auto;
  }
  span.range-selected {
    height: 8px;
    background-color: var(--foreground-disabled);
    border-radius: var(--radius);
  }
  span.range-selected.hidden {
    background-color: transparent;
  }
  span.thumb {
    display: block;
    height: var(--thumb-size);
    width: calc(var(--thumb-size) / 2);
    background-color: var(--foreground-muted);
    border-radius: var(--radius);
  }
  span.container.vertical span.thumb {
    width: var(--thumb-size);
    height: calc(var(--thumb-size) / 2);
  }
  span.thumb.has-color {
    width: var(--thumb-size);
    border-radius: var(--radius-full);
  }
  span.thumb:focus {
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
  }

  span.container.disabled {
    pointer-events: none;
  }

  span.thumb.disabled {
    background-color: var(--foreground-disabled);
    cursor: default;
  }
</style>
