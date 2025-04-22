<script lang="ts" context="module">
  import SvgIcon from "./SvgIcon.svelte";
  export interface ContextMenuItem {
    text: string[];
    handler: (...args: any[]) => any;
    isDisabled?: () => boolean;
    iconPath?: string;
  }
</script>

<script lang="ts">
  import Popover from "svelte-easy-popover/dist/ts/Popover.svelte";
  import { onMount } from "svelte";
  import { contextMenu } from "./context-target";
  export let target: HTMLElement;
  export let items: ContextMenuItem[] = [];
  export let coord: { x: number; y: number };

  // Compute the maximum length of the button texts
  let maxLength = Math.max(...items.map((e) => e.text[0].length));
  let menu: HTMLElement;

  function handleItemClicked(item: ContextMenuItem) {
    item.handler();
    contextMenu.close();
  }

  function handleBlur() {
    contextMenu.close();
  }

  function handleClickOutside() {
    contextMenu.close();
  }

  let offset = { x: 0, y: 0 };

  onMount(() => {
    const menuDim = menu.getBoundingClientRect();
    const targetDim = target.getBoundingClientRect();
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;

    const clipW = Math.max(coord.x + menuDim.width - maxW, 0);
    const clipH = Math.max(coord.y + menuDim.height - maxH, 0);

    offset.x = targetDim.x + targetDim.width - coord.x + clipW;
    offset.y = targetDim.y + targetDim.height - coord.y + clipH;
    return;
  });
</script>

<svelte:window on:blur={handleBlur} on:click={handleClickOutside} />

<Popover
  isOpen={true}
  referenceElement={target}
  placement={"right-end"}
  spaceAway={-offset.x}
  spaceAlong={-offset.y}
>
  <div bind:this={menu}>
    {#each items as item}
      {@const disabled = item.isDisabled ? item.isDisabled() : false}
      <button
        style:opacity={disabled ? 0.25 : 0.75}
        {disabled}
        on:click={() => handleItemClicked(item)}
      >
        {#if item.iconPath}
          <SvgIcon
            width={12}
            height={12}
            fill="#FFF"
            iconPath={item.iconPath}
          />
        {/if}
        <span>{item.text[0]}</span>
        <!-- Spacer for alignment -->
        <span
          style:width={`${maxLength - item.text[0].length}ch`}
          style:visibility="hidden">{item.text[0]}</span
        >
        <span>{item.text[1]}</span>
      </button>
    {/each}
  </div>
</Popover>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 0.25rem;
    position: absolute;
    color: rgba(255, 255, 255, 0.8);
    background-color: rgb(23, 23, 23);
  }

  button {
    color: white;
    font-size: 0.75rem;
    line-height: 1rem;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    white-space: nowrap;
    width: 100%;
    padding: 0.5rem;
    text-align: left;
    cursor: default;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
</style>
