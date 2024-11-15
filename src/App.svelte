<script lang="ts">
  import "./app.css";
  import Block from "./lib/Block.svelte";
  import MeltCheckbox from "./lib/MeltCheckbox.svelte";
  import AtomicInput from "./lib/AtomicInput.svelte";
  import AtomicSuggestions from "./lib/AtomicSuggestions.svelte";

  let t = false;
  let suggestionElement;
  let inputValue;
</script>

<main class="p-20 bg-black">
  <Block>
    <span class="text-white">yooo</span></Block
  >
  <MeltCheckbox target={t} title={"whatever"} />
  <AtomicInput suggestionTarget={suggestionElement} suggestions={[{info: "Test 1", value: "test1"}, {info: "Test 2", value: "test2"}, {info: "ASD3", value: "asd3"}]} />
  <AtomicInput suggestionTarget={suggestionElement} suggestions={[{info: "Test 2", value: "test2"}]} />
  <AtomicSuggestions bind:component={suggestionElement}/>
</main>
