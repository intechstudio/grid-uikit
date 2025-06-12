<script lang="ts">
  import Block from "./lib/Block.svelte";
  import MeltCheckbox from "./lib/MeltCheckbox.svelte";
  import AtomicInput from "./lib/AtomicInput.svelte";
  import AtomicSuggestions from "./lib/AtomicSuggestions.svelte";
  import MoltenButton from "./lib/MoltenButton.svelte";
  import MeltCombo from "./lib/MeltCombo.svelte";
  import BlockBody from "./lib/BlockBody.svelte";
  import BlockTitle from "./lib/BlockTitle.svelte";
  import { contextTarget } from "./lib";
  import SvgIcon from "./lib/SvgIcon.svelte";
  import MeltSlider from "./lib/MeltSlider.svelte";
  import MeltSelect from "./lib/MeltSelect.svelte";
  import MeltRadio from "./lib/MeltRadio.svelte";
  import Tree from "./mockup/Tree.svelte";
  import MoltenPushButton from "./lib/MoltenPushButton.svelte";

  let t = false;
  let suggestionElement: any;
  let input2Value = "";
  let input3Value = "";
  let input4Value = "";
  let suggestion1 = [
    { info: "Test 12", value: "test1" },
    { info: "Test 2", value: "test2" },
    { info: "ASD3", value: "asd3" },
  ];
  let suggestion2 = [{ info: "Test 2", value: "test2" }];
  let suggestion3 = suggestion1;
  let suggestion4 = suggestion1;

  function switchSuggestions() {
    let tmp = suggestion1;
    suggestion1 = suggestion2;
    suggestion2 = tmp;
  }

  let textColor = "rgb(255,0,0)";
  function changeTextColor() {
    textColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  }

  let sliderValue = 50;
  let meltSelectValue1 = 0;
  let meltSelectValue2 = 0;
  let meltRadioValue1 = 0;
  let meltRadioValue2 = 0;
  let meltRadioValue3 = 0;
  let meltRadioValue4 = 0;
</script>

<main on:contextmenu|preventDefault>
  <div class="main-container">
    <div class="component-container">
      <span>Block:</span>
      <Block>
        <BlockTitle>This is a BlockTitle</BlockTitle>
        <BlockBody>This is a BlockBody</BlockBody></Block
      >
    </div>
    <div class="component-container">
      <span>MeltCheckbox:</span>
      <MeltCheckbox target={t} title={"whatever"} />
    </div>

    <div class="component-container">
      <span>AtomicInput: </span>
      <AtomicInput
        inputValue={input2Value}
        suggestionTarget={suggestionElement}
        suggestions={suggestion2}
        on:change={(e) => {
          input2Value = e.detail;
        }}
      />
      <span>AtomicSuggestions: </span>
      <AtomicSuggestions bind:component={suggestionElement} />
    </div>

    <div class="component-container">
      <span>MoltenButton:</span>
      <MoltenButton title={"Press Me"} click={switchSuggestions} />
      <MoltenPushButton click={() => {}} text={"Normal"} style={"normal"} />
      <MoltenPushButton click={() => {}} text={"Accept"} style={"accept"} />
      <MoltenPushButton click={() => {}} text={"Outlined"} style={"outlined"} />
    </div>

    <div class="component-container">
      <span>Meltcombo:</span>
      <MeltCombo
        title={"Field 1"}
        bind:value={input3Value}
        suggestions={suggestion3}
      />
      <MeltCombo
        title={"Field 2"}
        bind:value={input4Value}
        suggestions={suggestion4}
      />
    </div>

    <div class="component-container">
      <span>ContextMenu and context-target:</span>
      <span
        use:contextTarget={{
          items: [
            {
              text: [`No handler`, ""],
              handler: () => {},
              isDisabled: () => false,
            },
            {
              text: [`Disabled`, ""],
              handler: () => {},
              isDisabled: () => true,
            },
            {
              text: [`Change Text Color`, ""],
              handler: () => changeTextColor(),
              isDisabled: () => false,
            },
            {
              text: [`I Have an Icon!`, ""],
              handler: () => {},
              isDisabled: () => true,
              iconPath: "clear_element",
            },
            {
              text: [`I Have Second Text`, "Ctrl + A"],
              handler: () => {},
              isDisabled: () => true,
            },
          ],
        }}
        style="color: {textColor}; font-weight: 700;">Right Click ME!</span
      >
    </div>
    <div class="component-container">
      <span>SvgIcon:</span>
      <div class="svg-row">
        <SvgIcon iconPath="edit" fill="#FFF" width={15} height={15} />
        <SvgIcon iconPath="edit" fill="#F00" width={30} height={30} />
        <SvgIcon iconPath="edit" fill="#00F" width={45} height={45} />
      </div>
    </div>
    <div class="component-container">
      <span>MeltSlider:</span>
      <span>Value: {sliderValue}</span>
      <MeltSlider bind:target={sliderValue} min={0} max={100} step={1} />
    </div>

    <div class="component-container">
      <span>MeltSelect:</span>
      <span>Enabled:</span>
      <MeltSelect
        bind:target={meltSelectValue1}
        options={[
          { title: "0", value: 0 },
          { title: "1", value: 1 },
          { title: "2", value: 2 },
          { title: "3", value: 3 },
        ]}
        disabled={false}
      />
      <span>Disabled:</span>
      <MeltSelect
        bind:target={meltSelectValue2}
        options={[
          { title: "0", value: 0 },
          { title: "1", value: 1 },
          { title: "2", value: 2 },
          { title: "3", value: 3 },
        ]}
        disabled={true}
      />
    </div>
    <div class="component-container">
      <span>MeltRadio:</span>
      <MeltRadio
        bind:target={meltRadioValue1}
        style="button"
        orientation="horizontal"
        size="full"
        options={[
          { title: "0", value: 0 },
          { title: "1", value: 1 },
          { title: "2", value: 2 },
        ]}
      />
      <MeltRadio
        bind:target={meltRadioValue2}
        style="button"
        orientation="vertical"
        size="full"
        options={[
          { title: "0", value: 0 },
          { title: "1", value: 1 },
          { title: "2", value: 2 },
        ]}
      />
      <MeltRadio
        bind:target={meltRadioValue3}
        style="radio"
        orientation="horizontal"
        size="full"
        options={[
          { title: "0", value: 0 },
          { title: "1", value: 1 },
          { title: "2", value: 2 },
        ]}
      />
      <MeltRadio
        bind:target={meltRadioValue4}
        style="radio"
        orientation="vertical"
        size="full"
        options={[
          { title: "0", value: 0 },
          { title: "1", value: 1 },
          { title: "2", value: 2 },
        ]}
      />
    </div>
    <div class="component-container">
      <span>Tree:</span>
      <Tree />
    </div>
  </div>
</main>

<style>
  main {
    padding: 5rem;
    background-color: rgba(42, 52, 57, 1);
    height: 100vh;
    overflow-y: auto;
  }
  span {
    color: white;
  }
  div.main-container {
    color: white;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 0.5rem;
  }
  div.component-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 18rem;
    border: 1px solid black;
  }
  div.svg-row {
    display: flex;
    flex-direction: row;
  }
  div.folder-container {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 0.25rem;
    border-bottom-width: 1px;
    height: 1.25rem;
    border-color: rgb(255 255 255 / 0.4);
  }
  div.folder-title {
    flex-grow: 1;
    text-align: left;
    color: rgb(255 255 255 / 0.8);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
