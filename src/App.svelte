<script lang="ts">
  import "./app.css";
  import Block from "./lib/Block.svelte";
  import MeltCheckbox from "./lib/MeltCheckbox.svelte";

  let t = false;
</script>

<main class="p-20 bg-black">
  <Block>
    <span class="text-white">yooo</span></Block
  >
  <MeltCheckbox target={t} title={"whatever"} />
</main>
