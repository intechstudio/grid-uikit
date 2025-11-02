<script lang="ts">
  export let text: string = "";
  export let style: "normal" | "outlined" | "accept" = "normal";
  export let disabled: boolean = false;
  export let popup: { duration?: number } | undefined = undefined;
  export let ratio = "normal";
  export let snap = "auto";
  export let click: (...args: any) => void;
  export let options: SelectOption[] | undefined = undefined;

  ///////// START OF MELT SELECT ///////////
  export let size: "auto" | "full" = "auto";
  import { writable } from "svelte/store";
  import { createSelect, melt } from "@melt-ui/svelte";

  const customOpen = writable(false);

  export let target: any;
  export let decorations: string[];
  type SelectOption = { title: string; value: any };

  import MeltSelect from "./MeltSelect.svelte";

  function getDefaultSelected() {
    if (typeof options === "undefined") {
      return;
    }

    const obj = options.find((e: SelectOption) => e.value === target);
    return { label: obj?.title, value: obj?.value };
  }

  const {
    elements: { trigger, menu, option },
    states: { selected, selectedLabel, open },
    helpers: { isSelected },
  } = createSelect({
    open: customOpen,
    disabled: disabled,
    forceVisible: true,
    positioning: {
      placement: "bottom",
      fitViewport: true,
      sameWidth: true,
    },
    defaultSelected: getDefaultSelected(),
  });

  $: if ($selected) {
    handleSelectionChange();
  }

  $: if (target) {
    handleTargetChange();
  }

  function handleTargetChange() {
    if ($selected.value === target) {
      return;
    }

    const obj = options.find((e: SelectOption) => e.value === target);
    selected.set({ label: obj?.title, value: obj?.value });
  }

  function handleSelectionChange() {
    if ($selected.value === target) {
      return;
    }
    target = $selected.value;
  }

  let meltSelectValue1;
  let meltContainerElement;

  /////// END OF MELT SELECT /////////////

  let showPopup: boolean = false;
  let element: HTMLButtonElement;

  export function focus() {
    element?.focus();
  }
</script>

<container bind:this={meltContainerElement} class:width-full={snap === "full"}>
  <div class="opener" {...$trigger} use:trigger style="display: flex; gap: 0;">
    <div
      class="clickblocker"
      on:click={(e) => {
        e.stopPropagation();
        const newEvent = new event.constructor(e.type, e);
        meltContainerElement.dispatchEvent(newEvent);
      }}
      style="display: flex; gap: 0;"
    >
      <button
        bind:this={element}
        class:selected
        on:click={(e) => {
          if (!showPopup) {
            showPopup = true;
            setTimeout(() => {
              showPopup = false;
            }, popup?.duration ?? 3000);
          }

          if ($customOpen === true) {
            $customOpen = false;
            return;
          }

          if (typeof click === "undefined") {
            return;
          }
          click();
          e.stopPropagation();
        }}
        {disabled}
        class="main style-{style}"
        class:px-4={ratio === "normal"}
        class:px-1={ratio === "box"}
        class:w-full={snap === "full"}
        class:w-fit={snap === "auto"}
        class:hasoptions={typeof options !== "undefined"}
      >
        <span>{text}</span>
        <slot name="content" />
        {#if typeof options !== "undefined"}
          {#if decorations?.length === 2}
            {decorations[0]+$selectedLabel+decorations[1]}
          {:else}
            {$selectedLabel}
          {/if}
        {/if}
      </button>
      {#if typeof options !== "undefined"}
        <button
          on:click={(e) => {
            $customOpen = !$customOpen;
          }}
          class="select style-{style}">&#9660;</button
        >

        {#if $open}
          <div {...$menu} use:menu class="menu">
            {#each options as item}
              <div
                {...$option({ value: item.value, label: item.title })}
                use:option
                class="option"
                class:option-selected={$isSelected(item.value)}
              >
                {item.title}
              </div>
            {/each}
          </div>
        {/if}
      {/if}

      {#if showPopup}
        <slot name="popup" />
      {/if}
    </div>
  </div>
</container>

<style>
  .menu {
    background-color: var(--popover-background);
    color: var(--foreground-muted);
    border: 1px solid var(--foreground-muted);
    border-radius: 0.25rem;
    z-index: 40;
  }
  div.option {
    cursor: pointer;
    padding: 0.5rem;
  }
  div.option:hover {
    background-color: var(--popover-selection);
    color: var(--foreground);
  }
  div.option-selected {
    background-color: var(--popover-reference);
  }

  button {
    cursor: pointer;
  }
  button:disabled {
    cursor: default;
  }

  button.main.hasoptions {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button.select {
    border-left: 0px !important;

    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  container {
    position: relative;
    display: flex;
    gap: 0;
  }
  container.width-full {
    width: 100%;
  }

  button {
    border-radius: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.25rem;

    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: 100%; /* 1 */
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
    color: inherit; /* 1 */
    margin: 0; /* 2 */
    text-transform: none;
    background-color: transparent; /* 2 */
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
