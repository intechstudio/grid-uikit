<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Color } from "./color";

  const dispatch = createEventDispatcher();

  export let color: Color.HSL | undefined;

  let canvasElement: HTMLElement;
  let cursorElement: HTMLElement;

  let isDrag = false;

  onMount(() => {
    setCursorPosition(color);
  });

  $: setCursorPosition(color);

  function setCursorPosition(color: Color.HSL | undefined) {
    if (typeof color === "undefined") {
      return;
    }

    const rect = canvasElement?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const offsetX = (rect.width * color.h) / 360;
    const offsetY = (rect.height * (color.l - 50)) / 50;

    cursorElement.style.display =
      offsetY < 0 || offsetY > rect.height || color.s < 100 ? "none" : "flex";
    cursorElement.style.left =
      (Math.min(
        offsetX,
        canvasElement.clientWidth - cursorElement.clientWidth,
      ) /
        canvasElement.clientWidth) *
        100 +
      "%";
    cursorElement.style.top =
      (Math.min(
        offsetY,
        canvasElement.clientHeight - cursorElement.clientHeight,
      ) /
        canvasElement.clientHeight) *
        100 +
      "%";
  }

  function calculateColor(e: MouseEvent) {
    if (!(e.buttons & 1) || !isDrag) return;

    const rect = canvasElement.getBoundingClientRect();
    const hue = Math.floor(
      Math.max(Math.min((e.clientX - rect.left) / rect.width, 1), 0) * 360,
    );
    const brightness = Math.floor(
      Math.max(Math.min((e.clientY - rect.top) / rect.height, 1), 0) * 50 + 50,
    );
    color = new Color.HSL(hue, 100, brightness);
    setCursorPosition(color);
    dispatch("input", { color });
  }

  function handleMouseUp() {
    dispatch("change", { color });
  }
</script>

<svelte:window
  on:mouseup={() => {
    if (!isDrag) {
      return;
    }

    handleMouseUp();
    isDrag = false;
  }}
  on:mousemove={calculateColor}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={canvasElement}
  data-testid="rgb-color-picker-canvas"
  class="rgb-picker"
  on:mousedown={(e) => {
    isDrag = true;
    calculateColor(e);
  }}
>
  <div
    bind:this={cursorElement}
    class="rgb-cursor"
    class:hidden={typeof color === "undefined"}
  />
</div>

<style>
  .rgb-picker {
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid black;
    background:
      linear-gradient(to left, red, magenta, blue, cyan, lime, yellow, red),
      linear-gradient(to top, white, transparent);
    background-size: 100% 100%;
    background-blend-mode: overlay;
  }

  .rgb-cursor {
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    border: 1px solid black;
    background-color: white;
    pointer-events: none;
  }

  .hidden {
    display: none;
  }
</style>
