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
  <div
    bind:this={menu}
    class="flex flex-col items-start bg-gray-900 text-white/80 border border-white/50 rounded absolute"
  >
    {#each items as item}
      {@const disabled = item.isDisabled ? item.isDisabled() : false}
      <button
        class="text-white text-xs flex flex-row gap-2 {disabled
          ? ''
          : 'hover:bg-white/40 hover:text-white'} items-center whitespace-nowrap w-full px-2 py-2 text-left cursor-default"
        class:opacity-75={!disabled}
        class:opacity-25={disabled}
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
        <span class="flex-1">{item.text[0]}</span>
        <!-- Spacer for alignment -->
        <span
          class="invisible"
          style="width: {maxLength - item.text[0].length}ch;"
          >{item.text[0]}</span
        >
        <span>{item.text[1]}</span>
      </button>
    {/each}
  </div>
</Popover>

<style>
  .flex-1 {
    flex: 1;
  }
</style>
