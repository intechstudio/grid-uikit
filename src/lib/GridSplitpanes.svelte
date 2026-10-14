<script lang="ts">
  import { Splitpanes } from "svelte-splitpanes";

  export let horizontal = false;
  export let pushOtherPanes = true;
  export let dblClickSplitter = true;
  export let firstSplitter = false;
  export let rtl: boolean | "auto" = "auto";
  export let id: string | undefined = undefined;
  export let style: string | null = null;
  let clazz = "";
  export { clazz as class };
</script>

<Splitpanes
  {id}
  {horizontal}
  {pushOtherPanes}
  {dblClickSplitter}
  {firstSplitter}
  {rtl}
  {style}
  theme="grid-uikit-theme"
  class={clazz}
  on:pane-click
  on:splitter-click
  on:pane-maximize
  on:ready
  on:resize
  on:resized
  on:pane-add
  on:pane-remove
>
  <slot />
</Splitpanes>

<style>
  :global(.splitpanes.grid-uikit-theme .splitpanes__pane) {
    position: relative;
    overflow: visible;
    background-color: transparent;
  }
  :global(.splitpanes.grid-uikit-theme .splitpanes__splitter) {
    position: relative;
    background-color: transparent;
    min-width: 0;
    min-height: 0;
  }
  :global(.splitpanes.grid-uikit-theme .splitpanes__splitter:before) {
    content: "";
    position: absolute;
    background-color: transparent;
    z-index: 1;
  }
  :global(
    .splitpanes.grid-uikit-theme
      .splitpanes__splitter.splitpanes__splitter__active
  ) {
    z-index: 2;
  }
  :global(.grid-uikit-theme.splitpanes--vertical > .splitpanes__splitter) {
    width: 0;
  }
  :global(
    .grid-uikit-theme.splitpanes--vertical > .splitpanes__splitter:before
  ) {
    top: 0;
    left: -3px;
    right: -3px;
    height: 100%;
    cursor: col-resize;
  }
  :global(.grid-uikit-theme.splitpanes--horizontal > .splitpanes__splitter) {
    height: 0;
  }
  :global(
    .grid-uikit-theme.splitpanes--horizontal > .splitpanes__splitter:before
  ) {
    left: 0;
    top: -3px;
    bottom: -3px;
    width: 100%;
    cursor: row-resize;
  }
</style>
