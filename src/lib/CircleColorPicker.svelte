<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Color } from "./color";

  const dispatch = createEventDispatcher();

  export let color: Color.HSL | undefined;

  let cursorEl: HTMLElement;
  let canvasEl: HTMLElement;
  let isDragging = false;

  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;

  onMount(() => {
    setCursorPosition(color);
  });

  $: setCursorPosition(color);

  function setCursorPosition(color: Color.HSL | undefined) {
    if (!color || !cursorEl || !canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const r = rect.width / 2;

    const angleRad = degToRad(color.h);
    const distance = Math.min(r - ((color.l - 50) / 50) * r, r);

    const x = distance * Math.cos(angleRad) + r;
    const y = distance * Math.sin(angleRad) + r;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    cursorEl.style.display = color.s < 100 ? "none" : "flex";
    cursorEl.style.left = `${xPercent}%`;
    cursorEl.style.top = `${yPercent}%`;
  }

  function calculateColor(e: MouseEvent) {
    if (!(e.buttons & 1) || !isDragging || !canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const r = rect.width / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    const angleRad = Math.atan2(dy, dx);

    const angleDeg = (radToDeg(angleRad) + 360) % 360;
    const normDist = Math.min(distance, r) / r;

    const hue = Math.floor(angleDeg);
    const brightness = Math.floor(100 - normDist * 50);

    color = new Color.HSL(hue, 100, brightness);
    dispatch("input", { color });
  }

  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    calculateColor(e);
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
      dispatch("change", { color });
    }
  }
</script>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={calculateColor} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={canvasEl} class="hue-picker" on:mousedown={handleMouseDown}>
  <div bind:this={cursorEl} class="cursor" class:hidden={!color}>
    <div class="cursor-face" />
  </div>
</div>

<style>
  .hue-picker {
    position: relative;
    display: flex;
    height: 100%;
    aspect-ratio: 1 / 1;
    border: 1px solid black;
    border-radius: 50%;
    background:
      conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red),
      radial-gradient(circle at center, white 0, transparent 75%);
    background-size: 100% 100%;
    background-blend-mode: overlay;
  }

  .cursor {
    position: absolute;
    width: 1px;
    height: 1px;
    background-color: red;
  }

  .cursor-face {
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    border: 1px solid black;
    background-color: white;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  .hidden {
    display: none;
  }
</style>
