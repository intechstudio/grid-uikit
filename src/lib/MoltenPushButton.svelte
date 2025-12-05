<script lang="ts">
  import { tick } from "svelte";

  export let text: string = "";
  export let style: "normal" | "outlined" | "accept" = "normal";
  export let disabled: boolean = false;
  export let popup: { duration?: number } | undefined = undefined;
  export let ratio = "normal";
  export let snap = "auto";
  export let click: (...args: any) => void;
  export let options: any = undefined;
  export let target: any = undefined;
  export let decorations: string[] = [];
  export let grouped: boolean = false;

  let showPopup: boolean = false;
  let element: HTMLButtonElement;
  let selectedLabel = "";

  export let width = 0;

  async function updateWidth() {
    if (element) {
      await tick();
      requestAnimationFrame(() => {
        width = element.offsetWidth;
      });
    }
  }

  $: element, target, updateWidth();

  $: {
    if (typeof options === "undefined" || typeof target === "undefined") {
      selectedLabel = "";
    } else {
      const obj = options.find((e) => e.value === target);
      selectedLabel = obj?.title || "";
    }
  }

  export function focus() {
    element?.focus();
  }
</script>

<div class="button-container" class:width-full={snap === "full"}>
  <button
    bind:this={element}
    on:click={(e) => {
      if (!showPopup && popup) {
        showPopup = true;
        setTimeout(() => {
          showPopup = false;
        }, popup?.duration ?? 3000);
      }

      if (typeof click !== "undefined") {
        click();
      }
    }}
    {disabled}
    class="main style-{style}"
    class:px-4={ratio === "normal"}
    class:px-1={ratio === "box"}
    class:w-full={snap === "full"}
    class:w-fit={snap === "auto"}
    class:grouped
  >
    <span>{text}</span>
    <slot name="content" />
    {#if selectedLabel}
      {#if decorations?.length === 2}
        <span>{decorations[0] + selectedLabel + decorations[1]}</span>
      {:else}
        <span>{selectedLabel}</span>
      {/if}
    {/if}
  </button>

  {#if showPopup}
    <slot name="popup" />
  {/if}
</div>

<style>
  .button-container {
    position: relative;
    display: inline-flex;
  }

  .button-container.width-full {
    width: 100%;
  }

  button {
    cursor: pointer;
    border-radius: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.25rem;

    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    text-transform: none;
    background-color: transparent;
  }

  button:disabled {
    cursor: default;
  }

  button.w-full {
    width: 100%;
  }

  button.w-fit {
    width: fit-content;
  }

  button.px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  button.grouped {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button.style-normal {
    color: var(--foreground-muted);
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.4);
  }

  button.style-normal:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }

  button.style-normal:disabled {
    color: var(--foreground-disabled);
    background-color: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(0, 0, 0, 0.25);
  }

  button.style-outlined {
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 164, 130, 1);
    color: var(--foreground-muted);
  }

  button.style-outlined:hover {
    background-color: rgba(0, 111, 83, 1);
    border-color: rgba(27, 164, 135);
  }

  button.style-outlined:disabled {
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--foreground-disabled);
    border: 1px solid rgba(0, 163, 130, 1);
  }

  button.style-accept {
    color: var(--foreground);
    background-color: rgba(11, 164, 132, 1);
  }

  button.style-accept:hover {
    background-color: rgba(0, 111, 83, 1);
  }

  button.style-accept:disabled {
    color: var(--foreground-disabled);
    background-color: rgba(11, 164, 132, 0.5);
  }
</style>
