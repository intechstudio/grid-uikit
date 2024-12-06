<script lang="ts">
  import "./app.css";
  import Block from "./lib/Block.svelte";
  import MeltCheckbox from "./lib/MeltCheckbox.svelte";
  import AtomicInput from "./lib/AtomicInput.svelte";
  import AtomicSuggestions from "./lib/AtomicSuggestions.svelte";
    import MoltenButton from "./lib/MoltenButton.svelte";

  let t = false;
  let suggestionElement : any;
  let input1Value = "test1";
  let input2Value = "";
  let suggestion1 = [{info: "Test 12", value: "test1"}, {info: "Test 2", value: "test2"}, {info: "ASD3", value: "asd3"}];
  let suggestion2 = [{info: "Test 2", value: "test2"}];

  function switchSuggestions(){
    let tmp = suggestion1;
    suggestion1 = suggestion2;
    suggestion2 = tmp;
  }
</script>

<main class="p-20 bg-black text-white">
  <Block>
    <span class="text-white">yooo</span></Block
  >
  <MeltCheckbox target={t} title={"whatever"} />
  <AtomicInput 
    inputValue={input1Value}
    suggestionTarget={suggestionElement} 
    suggestions={suggestion1} 
    on:change={(e) => {
      input1Value = e.detail;
    }}
  />
  <AtomicInput 
    inputValue={input2Value}
    suggestionTarget={suggestionElement} 
    suggestions={suggestion2}
    on:change={(e) => {
      input2Value = e.detail;
    }} 
  />
  <AtomicSuggestions bind:component={suggestionElement}/>

  <MoltenButton
    title={"Press Me"}
    click={switchSuggestions} />
</main>
