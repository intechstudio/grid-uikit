<script lang="ts">
  import { Pane } from "svelte-splitpanes";

  export let size: number | null = null;
  export let minSize = 0;
  export let maxSize = 100;
  export let snapSize = 0;
  let clazz = "";
  export { clazz as class };
</script>

<Pane bind:size {minSize} {maxSize} {snapSize} class={clazz}>
  <slot />
</Pane>
