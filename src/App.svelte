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
  import Toggle from "./lib/Toggle.svelte";
  import MoltenPushButton from "./lib/MoltenPushButton.svelte";
  import MoltenPushButtonDropdown from "./lib/MoltenPushButtonDropdown.svelte";
  import MoltenInput from "./lib/MoltenInput.svelte";
  import { fly } from "svelte/transition";
  import { tick } from "svelte";
  import LogMessage from "./lib/LogMessage.svelte";
  import { LogMessageType } from "./lib/LogMessageType.ts";
  import { writable } from "svelte/store";

  import { tooltip } from "./lib/tooltip.ts";

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

  let logMessageCount = 0;
  let logMessageType = LogMessageType.NORMAL;
  let logMessageTimeout: number;

  let clearButtonTarget = "default";
  let clearButtonWidth = 0;

  let clearButtonOptions = [
    {
      title: "Default",
      value: "default",
      onclick: (e) => {
        alert(e);
      },
    },
    {
      title: "PS Config",
      value: "other",
      onclick: (e) => {
        alert(e);
      },
    },
    {
      title: "Clear Everything Including All User Data",
      value: "long",
      onclick: (e) => {
        alert(e);
      },
    },
  ];

  function handleShowLogMessage() {
    ++logMessageCount;
    clearTimeout(logMessageTimeout);
    logMessageTimeout = setTimeout(() => {
      logMessageCount = 0;
    }, 3000);
  }

  let buttonsDisabled = false;
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
        <div
          use:tooltip={{
            nowrap: true,
            placement: "bottom",
            duration: 75,
            instant: true,
            class: "px-2 py-1",
            text: "Delete",
          }}
        >
          Tooltip test
        </div>
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
      <Block>
        <BlockTitle>Toggle</BlockTitle>
        <Toggle title={"Test toggle"} />
      </Block>
    </div>

    <div class="mock-panel">
      <Block>
        <MeltCheckbox
          bind:target={buttonsDisabled}
          title={"Disable Buttons"}
        />{buttonsDisabled}
        <BlockTitle>MoltenButton</BlockTitle>
        <BlockBody>This has no variants:</BlockBody>
        <MoltenButton title={"Press Me"} click={switchSuggestions} />

        <div
          use:tooltip={{
            text: "Confirm text",
            placement: "top",
            buttons: [
              {
                label: "Cancel",
                handler: undefined,
              },
              {
                label: "Confirm",
                handler: () => {
                  alert(1);
                },
              },
            ],
            triggerEvents: ["show-buttons", "hover"],
          }}
        >
          <MoltenPushButton
            disabled={buttonsDisabled}
            click={() => {}}
            text={"Outlined confirm"}
            style={"outlined"}
          />
        </div>
        <BlockTitle>MoltenPushButton</BlockTitle>

        <BlockBody>This has dropdown</BlockBody>
        <BlockBody>Button width: {clearButtonWidth}px</BlockBody>
        <div style="display: flex; gap: 0;">
          <div
            use:tooltip={{
              text: "Clear the current selection",
              placement: "top",
            }}
          >
            <MoltenPushButton
              disabled={buttonsDisabled}
              click={() => {}}
              text={"Clear"}
              style={"normal"}
              options={clearButtonOptions}
              bind:target={clearButtonTarget}
              bind:width={clearButtonWidth}
              decorations={["(", ")"]}
              grouped={true}
            />
          </div>
          <div
            use:tooltip={{
              text: "More options",
              placement: "top",
            }}
          >
            <MoltenPushButtonDropdown
              disabled={buttonsDisabled}
              style={"normal"}
              options={clearButtonOptions}
              bind:target={clearButtonTarget}
              grouped={true}
              menuWidth={clearButtonWidth}
              placement="magic"
            />
          </div>
        </div>

        <BlockBody>This has three variants:</BlockBody>
        <MoltenPushButton
          disabled={buttonsDisabled}
          click={() => {}}
          text={"Normal w/ popup"}
          style={"normal"}
        >
          <span slot="popup">Popup</span>
        </MoltenPushButton>
        <MoltenPushButton
          disabled={buttonsDisabled}
          click={() => {}}
          text={"Accept"}
          style={"accept"}
        />
        <MoltenPushButton
          disabled={buttonsDisabled}
          click={() => {}}
          text={"Outlined"}
          style={"outlined"}
        />
        <BlockBody>Now in a row layout:</BlockBody>
        <BlockRow>
          <MoltenPushButton
            disabled={buttonsDisabled}
            click={() => {}}
            text={"Normal"}
            style={"normal"}
          />
          <MoltenPushButton
            disabled={buttonsDisabled}
            click={() => {}}
            text={"Accept"}
            style={"accept"}
          />
          <MoltenPushButton
            disabled={buttonsDisabled}
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
        <SvgIcon
          iconPath="folder_closed"
          fill="#FFF"
          width={150}
          height={150}
        />
        <SvgIcon iconPath="folder_open" fill="#FFF" width={150} height={150} />
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
      <MoltenPushButton
        text="Show me a LogMessage"
        click={handleShowLogMessage}
      />
      <MeltSelect
        bind:target={logMessageType}
        options={[
          { title: "Normal", value: LogMessageType.NORMAL },
          { title: "Success", value: LogMessageType.SUCCESS },
          { title: "Alert", value: LogMessageType.ALERT },
          { title: "Fail", value: LogMessageType.FAIL },
          { title: "Progress", value: LogMessageType.PROGRESS },
        ]}
      />

      <LogMessage
        count={0}
        type={logMessageType}
        text={"I am a static one. Push the button to show another. Push it again to make it count up! Click the dynamic one to make it dismiss!"}
      />
      {#if logMessageCount > 0}
        <div
          in:fly|global={{ x: -10, duration: 500 }}
          out:fly|global={{ x: 10, duration: 500 }}
        >
          <LogMessage
            count={logMessageCount}
            type={logMessageType}
            text={"Hey, I am a little log message here! What else should this say? Well, maybe it would be probable good to tell a story as long, as this would wrap around to show that what is my width."}
            on:click={() => {
              console.log("yay");
              logMessageCount = 0;
            }}
          />
        </div>
      {/if}
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
    position: relative;
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
