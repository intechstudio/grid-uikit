<script lang="ts">
  import "./app.css";
  import Block from "./lib/Block.svelte";
  import MeltCheckbox from "./lib/MeltCheckbox.svelte";
  import AtomicInput from "./lib/AtomicInput.svelte";
  import AtomicSuggestions from "./lib/AtomicSuggestions.svelte";

  let t = false;
  let suggestionElement : any;
  let input1Value = "";
  let input2Value = "";
</script>

<main class="p-20 bg-black">
  <Block>
    <span class="text-white">yooo</span></Block
  >
  <MeltCheckbox target={t} title={"whatever"} />
  <AtomicInput 
    inputValue={input1Value}
    suggestionTarget={suggestionElement} 
    suggestions={[{info: "Test 12", value: "test1"}, {info: "Test 2", value: "test2"}, {info: "ASD3", value: "asd3"}]} 
    on:change={(e) => {
      input1Value = e.detail;
    }}
  />
  <AtomicInput 
    inputValue={input2Value}
    suggestionTarget={suggestionElement} 
    suggestions={[{info: "Test 2", value: "test2"}]}
    on:change={(e) => {
      input2Value = e.detail;
    }} 
  />
  <AtomicSuggestions bind:component={suggestionElement}/>
</main>
