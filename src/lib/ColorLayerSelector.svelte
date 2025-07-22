<script lang="ts" context="module">
  export type Color = {
    red: string;
    green: string;
    blue: string;
    alpha: string;
  };

  export function colorToCSS(color: Color) {
    if (Object.values(color).some((e) => isNaN(Number(e)))) {
      return "white";
    } else {
      return `rgba(${Object.values(color).join(",")})`;
    }
  }

  export interface LayerClickDetail {
    color: Color;
    index: number;
  }
</script>

<script lang="ts">
  import { Color } from "./color";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let colors: Color[];
  export let selected: number;

  function getGradient(colors: Color[]) {
    const array = [
      ...(colors.length === 1
        ? [{ red: "0", green: "0", blue: "0", alpha: "0" }]
        : []),
      ...colors,
    ];
    const cssValue = array.map((e) => colorToCSS(e)).join(",");
    return cssValue;
  }

  function handleAddClicked() {
    dispatch("add-layer");
  }

  function handleRemoveClicked() {
    dispatch("remove-layer");
  }

  function handleColorClicked(color: Color, index: number) {
    const detail: LayerClickDetail = { color: color, index: index };
    dispatch("layer-click", detail);
  }
</script>

<div class="container">
  <button on:click={handleRemoveClicked} disabled={colors.length === 1}>
    <span class="button-text">-</span>
  </button>

  <div
    class="color-bar {colors.length === 1 ? 'align-end' : 'align-between'}"
    style="
      background-image: linear-gradient(to right, {getGradient(colors)});
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-blend-mode: normal;
      will-change: transform;
      transform: translateZ(0);
    "
  >
    {#each colors as color, i}
      <button
        on:click={() => handleColorClicked(color, i)}
        class="color-button {i === selected ? 'selected' : 'not-selected'}"
      />
    {/each}
  </div>

  <button on:click={handleAddClicked} disabled={colors.length === 3}>
    <span class="button-text">+</span>
  </button>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 9999px;
    padding: 0.25rem;
  }

  .button-text {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    font-size: 1.125rem;
  }

  .color-bar {
    width: 100%;
    height: 2rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    background-color: var(--background-muted);
    border-radius: 9999px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .align-end {
    justify-content: flex-end;
  }

  .align-between {
    justify-content: space-between;
  }

  .color-button {
    aspect-ratio: 1 / 1;
    border-radius: 9999px;
    cursor: pointer;
    height: 75%;
  }

  .color-button.selected {
    background-color: transparent;
    border: 2px solid black;
  }

  .color-button.not-selected {
    background-color: black;
    transform: scale(0.5);
  }

  .color-button.not-selected:hover {
    background-color: transparent;
    border: 2px solid black;
  }
</style>
