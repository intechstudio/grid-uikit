<script lang="ts">
  import Block from "./lib/Block.svelte";
  import BlockRow from "./lib/BlockRow.svelte";
  import MeltCheckbox from "./lib/MeltCheckbox.svelte";
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
  import MoltenInput from "./lib/MoltenInput.svelte";

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

  let moltenInputText = "hello";
</script>

<main on:contextmenu|preventDefault>
  <div class="main-container">
    <div class="mock-panel">
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--background);"
        ></div>
        --background</span
      >
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--foreground);"
        ></div>
        --foreground</span
      >
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--foreground-muted);"
        ></div>
        --foreground-muted</span
      >
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--foreground-soft);"
        ></div>
        --foreground-soft</span
      >
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--foreground-disabled);"
        ></div>
        --foreground-disabled</span
      >
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--popover-background);"
        ></div>
        --popover-background</span
      >
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--popover-selection);"
        ></div>
        --popover-selection</span
      >
      <span class="color-preview-label"
        ><div
          class="color-preview-box"
          style="background-color: var(--popover-reference);"
        ></div>
        --popover-reference</span
      >
    </div>

    <div class="mock-panel">
      <Block>
        <BlockTitle>MeltCheckbox</BlockTitle>
        <BlockBody>Comes in two wariants:</BlockBody>
        <MeltCheckbox target={t} title={"Block style (Default)"} />
        <MeltCheckbox target={t} title={"Block style (Default)"} />
        <MeltCheckbox
          target={t}
          style={"transparent"}
          title={"Transparent style"}
        />
        <MeltCheckbox
          target={t}
          style={"transparent"}
          title={"Transparent style"}
        />
      </Block>
      <Block border="red">
        <BlockTitle>Important border added</BlockTitle>
        <BlockBody>This is dangerous setting:</BlockBody>
        <MeltCheckbox target={t} title={"Destory enabled"} />
      </Block>
    </div>

    <div class="mock-panel">
      <Block>
        <BlockTitle>MoltenButton</BlockTitle>
        <BlockBody>This has no variants:</BlockBody>
        <MoltenButton title={"Press Me"} click={switchSuggestions} />

        <BlockTitle>MoltenPushButton</BlockTitle>
        <BlockBody>This has three variants:</BlockBody>
        <MoltenPushButton click={() => {}} text={"Normal"} style={"normal"} />
        <MoltenPushButton click={() => {}} text={"Accept"} style={"accept"} />
        <MoltenPushButton
          click={() => {}}
          text={"Outlined"}
          style={"outlined"}
        />
        <BlockBody>Now in a row layout:</BlockBody>
        <BlockRow>
          <MoltenPushButton click={() => {}} text={"Normal"} style={"normal"} />
          <MoltenPushButton click={() => {}} text={"Accept"} style={"accept"} />
          <MoltenPushButton
            click={() => {}}
            text={"Outlined"}
            style={"outlined"}
          /></BlockRow
        >
      </Block>
    </div>

    <div class="mock-panel">
      <Block>
        <BlockTitle>MeltCombo</BlockTitle>
        <BlockBody>This has no variants:</BlockBody>
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
        <BlockTitle>MeltCombo</BlockTitle>
        <BlockBody>Now in a row:</BlockBody>
        <BlockRow>
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
        </BlockRow>
      </Block>
      <Block border="red">
        <BlockTitle>Important border added</BlockTitle>
        <BlockBody>This is dangerous setting:</BlockBody>
        <BlockRow>
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
        </BlockRow>
      </Block>
    </div>

    <div class="mock-panel">
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
    <div class="mock-panel">
      <span>SvgIcon:</span>
      <div class="svg-row">
        <SvgIcon iconPath="edit" fill="#FFF" width={15} height={15} />
        <SvgIcon iconPath="edit" fill="#F00" width={30} height={30} />
        <SvgIcon iconPath="edit" fill="#00F" width={45} height={45} />
      </div>
    </div>
    <div class="mock-panel">
      <span>MeltSlider:</span>
      <span>Value: {sliderValue}</span>
      <MeltSlider bind:target={sliderValue} min={0} max={100} step={1} />
    </div>

    <div class="mock-panel">
      <Block>
        <BlockTitle>MeltSelect</BlockTitle>
        <BlockBody>Enabled:</BlockBody>
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
        <BlockBody>Disabled:</BlockBody>
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

        <MoltenInput bind:target={moltenInputText} />
        <MoltenInput bind:target={moltenInputText} disabled={true} />
      </Block>
    </div>
    <div class="mock-panel">
      <Block>
        <BlockTitle>MeltRadio</BlockTitle>
        <BlockBody>Button horizontal</BlockBody>
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
        <BlockBody>Button vertical</BlockBody>
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
        <BlockBody>Radio horizontal</BlockBody>
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
        <BlockBody>Radio vertical</BlockBody>
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
        /></Block
      >
    </div>
    <div class="mock-panel">
      <span>Tree:</span>
      <Tree />
    </div>
  </div>
</main>

<style>
  .color-preview-box {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 1px solid black;
    margin: 0 5px 0 0;
    position: relative;
    top: 0.25rem;
  }
  .color-preview-label {
    display: block;
    font-size: 0.75rem;
    margin-left: 5px;
  }

  main {
    padding: 5rem;
    background-color: var(--background);
    height: 100vh;
    overflow-y: auto;
  }
  span {
  }
  div.main-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 0.5rem;
  }
  div.mock-panel {
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
    border-color: var(--foreground-soft);
  }
  div.folder-title {
    flex-grow: 1;
    text-align: left;
    color: var(--foreground-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div.file-title {
    flex-grow: 1;
    text-align: left;
    color: var(--foreground-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
