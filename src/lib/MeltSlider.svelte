<script lang="ts">
  import { createSlider, melt } from "@melt-ui/svelte";

  export let target;

  export let min;
  export let max;
  export let step;

  const {
    elements: { root, range, thumbs },
    states: { value },
  } = createSlider({
    min: min,
    max: max,
    step: step,
  });

  let oldTarget;

  $: {
    //console.log("Target", target);
    if (target !== oldTarget) {
      $value[0] = target;
      oldTarget = target;
    }

    if (target !== $value[0]) {
      oldTarget = target = $value[0];
    }
  }

  // }
</script>

<span {...$root} use:root class="container">
  <span class="range-full">
    <span {...$range} use:range class="range-selected" />
  </span>
  <span {...$thumbs[0]} use:thumbs class="thumb" />
</span>

<style>
  span.container {
    position: relative;
    display: flex;
    width: 200px;
    align-items: center;
    height: 26px;
  }
  span.range-full {
    display: block;
    width: 100%;
    background-color: white;
    border-radius: 9999px;
    height: 8px;
  }
  span.range-selected {
    height: 8px;
    background-color: rgba(115, 115, 115, 1);
    border-radius: 9999px;
  }
  span.thumb {
    display: block;
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 9999px;
    background-color: rgba(115, 115, 115, 1);
  }
  span.thumb:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 1);
  }
</style>
