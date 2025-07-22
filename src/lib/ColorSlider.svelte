<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let max: number = 100;
  export let direction: "horizontal" | "vertical";
  export let round = false;
  export let value: any;

  let scaleElement: HTMLElement;
  let cursorElement: HTMLElement;
  let isDrag = false;

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      setCursorPosition(value);
    });

    setCursorPosition(value);
    resizeObserver.observe(scaleElement);
  });

  $: setCursorPosition(value);

  function handleCursorDrag(e: MouseEvent) {
    const rect = scaleElement?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    let normalized: number;
    switch (direction) {
      case "vertical": {
        normalized =
          1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        break;
      }
      case "horizontal": {
        normalized = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width),
        );
        break;
      }
    }

    value =
      Math.round(max * normalized * (round ? 1 : 100)) / (round ? 1 : 100);
    setCursorPosition(value);
    dispatch("input", { value: value });
  }

  function setCursorPosition(value: number | undefined) {
    if (value == null || Number.isNaN(value)) {
      return;
    }

    const scaleRect = scaleElement?.getBoundingClientRect();
    const cursorRect = cursorElement?.getBoundingClientRect();

    if (!scaleRect || !cursorRect) {
      return;
    }

    const normValue = Math.max(0, Math.min(value / max, 1));

    switch (direction) {
      case "vertical": {
        const position = (1 - normValue) * 100;
        const maxPosition =
          ((scaleRect.height - cursorRect.height) / scaleRect.height) * 100;
        cursorElement.style.top = `${Math.min(position, maxPosition)}%`;
        break;
      }
      case "horizontal": {
        const position = normValue * 100;
        const maxPosition =
          ((scaleRect.width - cursorRect.width) / scaleRect.width) * 100;
        cursorElement.style.left = `${Math.min(position, maxPosition)}%`;
        break;
      }
    }
  }
</script>

<svelte:window
  on:mouseup={(e) => {
    if (!isDrag) {
      return;
    }

    isDrag = false;
    document.removeEventListener("mousemove", handleCursorDrag);
    dispatch("change", { value: value });
  }}
/>

<div class="container {direction === 'vertical' ? 'vertical' : 'horizontal'}">
  <canvas
    bind:this={scaleElement}
    class="scale-canvas"
    on:mousedown={(e) => {
      if (!(e.buttons & 1)) return;
      isDrag = true;
      document.addEventListener("mousemove", handleCursorDrag);
      handleCursorDrag(e);
    }}
  />
  <div class="overlay">
    <slot />
  </div>
  <div
    bind:this={cursorElement}
    class="cursor {direction === 'vertical'
      ? 'cursor-vertical'
      : 'cursor-horizontal'}"
    class:invisible={typeof value === "undefined" || isNaN(+value)}
  />
</div>

<style>
  .container {
    position: relative;
    display: flex;
  }

  .container.vertical {
    height: 100%;
    width: 1.25rem;
  }

  .container.horizontal {
    width: 100%;
    height: 1.25rem;
  }

  .scale-canvas {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid black;
    pointer-events: none;
    background-color: white;
  }

  .cursor {
    position: absolute;
    border: 1px solid black;
    pointer-events: none;
    background-color: rgba(255, 255, 255, 0.25);
  }

  .cursor-vertical {
    height: 0.5rem;
    width: 100%;
  }

  .cursor-horizontal {
    width: 0.5rem;
    height: 100%;
  }

  .invisible {
    visibility: hidden;
  }
</style>
