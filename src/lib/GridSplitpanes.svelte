<script lang="ts">
  import { Splitpanes } from "svelte-splitpanes";
  import "./grid-splitpanes-theme.css";

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
