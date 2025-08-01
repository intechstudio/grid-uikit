<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Color } from "./color";

  const dispatch = createEventDispatcher();

  export let color: Color.HSL | undefined;

  let cursorElement: HTMLElement;
  let canvasElement: HTMLElement;
  let isDrag = false;

  onMount(() => {
    setCursorPosition(color);
  });

  type Point = { x: number; y: number };

  function pointToDistance(point: Point) {
    return Math.sqrt(point.x ** 2 + point.y ** 2);
  }

  function pointToAngle(p: Point) {
    const theta = (Math.atan2(p.y, p.x) * 180) / Math.PI;
    return theta < 0 ? Math.abs(theta) : 360 - theta;
  }

  function distanceToPoint(distance: number, angle: number): Point {
    const radian = ((360 - angle) * Math.PI) / 180;
    return {
      x: distance * Math.cos(radian),
      y: distance * Math.sin(radian),
    };
  }

  $: setCursorPosition(color);

  function setCursorPosition(color: Color.HSL | undefined) {
    if (typeof color === "undefined") {
      return;
    }

    const canvasRect = canvasElement?.getBoundingClientRect();
    const cursorRect = cursorElement?.getBoundingClientRect();
    if (!canvasRect || !cursorRect) {
      return;
    }

    const center = { x: canvasRect.width / 2, y: canvasRect.height / 2 };

    const normDist = 1 - (color.l - 50) / 50;
    const distance = normDist * center.x;
    const p = distanceToPoint(distance, color.h);

    cursorElement.style.display =
      normDist < 0 || normDist > 1 || color.s < 100 ? "none" : "flex";
    cursorElement.style.left = `${
      ((p.x + center.x - cursorRect.width / 2) / canvasRect.width) * 100
    }%`;
    cursorElement.style.top = `${
      ((p.y + center.y - cursorRect.height / 2) / canvasRect.height) * 100
    }%`;
  }

  function calculateColor(e: MouseEvent) {
    if (!(e.buttons & 1) || !isDrag) return;

    // Get cursor coordinates relative to the center
    const cursor: Point = {
      x: e.offsetX - canvasElement.getBoundingClientRect().width / 2,
      y: e.offsetY - canvasElement.getBoundingClientRect().height / 2,
    };

    // Normalize distance between 0 and 1
    const distance =
      1 -
      pointToDistance(cursor) /
        (canvasElement.getBoundingClientRect().width / 2);
    const angle = pointToAngle(cursor);
    const hue = Math.floor(angle);
    const brightness = Math.floor(distance * 50 + 50);

    // Update color
    color = new Color.HSL(hue, 100, brightness);
    dispatch("input", { color });
  }
</script>

<svelte:window
  on:mouseup={(e) => {
    if (isDrag) {
      isDrag = false;
      dispatch("change", { color });
    }
  }}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={canvasElement}
  on:mousedown={(e) => {
    isDrag = true;
    calculateColor(e);
  }}
  on:mousemove={calculateColor}
  class="hue-picker"
>
  <div bind:this={cursorElement} class="hue-cursor" class:hidden={!color} />
</div>

<style>
  .hue-picker {
    position: relative;
    display: flex;
    border: 1px solid black;
    border-radius: 9999px;
    height: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background:
      conic-gradient(from 90deg, red, magenta, blue, cyan, lime, yellow, red),
      radial-gradient(circle at center, white 0, transparent 75%);
    background-size: 100% 100%;
    background-blend-mode: overlay;
  }

  .hue-cursor {
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
