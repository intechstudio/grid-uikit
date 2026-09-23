<script lang="ts">
  import Block from "./lib/Block.svelte";
  import BlockRow from "./lib/BlockRow.svelte";
  import MeltCheckbox from "./lib/MeltCheckbox.svelte";
  import MeltCombo from "./lib/MeltCombo.svelte";
  import BlockBody from "./lib/BlockBody.svelte";
  import BlockTitle from "./lib/BlockTitle.svelte";
  import { contextTarget } from "./lib";
  import SvgIcon from "./lib/SvgIcon.svelte";
  import IconButton from "./lib/IconButton.svelte";
  import MeltSlider from "./lib/MeltSlider.svelte";
  import MeltSelect from "./lib/MeltSelect.svelte";
  import MeltRadio from "./lib/MeltRadio.svelte";
  import Toggle from "./lib/Toggle.svelte";
  import MoltenPushButton from "./lib/MoltenPushButton.svelte";
  import MoltenPushButtonGroup from "./lib/MoltenPushButtonGroup.svelte";
  import MoltenInput from "./lib/MoltenInput.svelte";
  import { tick } from "svelte";
  import { LogMessageType } from "./lib/LogMessageType.ts";
  import LogStream from "./lib/LogStream.svelte";
  import { createLogStream } from "./lib/logStream.ts";
  import MarkdownContainer from "./lib/MarkdownContainer.svelte";
  import { writable } from "svelte/store";

  import { Color } from "./lib/color";
  import CircleColorPicker from "./lib/CircleColorPicker.svelte";
  import SliderColorPicker from "./lib/SliderColorPicker.svelte";
  import SquareColorPicker from "./lib/SquareColorPicker.svelte";
  import ColorLayerSelector from "./lib/ColorLayerSelector.svelte";

  import { tooltip } from "./lib/tooltip.ts";

  import GridSplitpanes from "./lib/GridSplitpanes.svelte";
  import GridPane from "./lib/GridPane.svelte";

  let t = false;

  // Expose buttonsDisabled to window for external control
  let buttonsDisabled = $state(false);
  if (typeof window !== "undefined") {
    (window as any).setButtonsDisabled = (value: boolean) => {
      buttonsDisabled = value;
    };
  }

  // MarkdownContainer renders its prop as raw HTML ({@html}); it does not
  // parse markdown. Consumers pass already-rendered HTML.
  const markdownSample = `<h1>Markdown heading</h1>
<p>Some <strong>bold</strong> and <em>italic</em> text with
<code>inline code</code> and a <a href="https://intech.studio">link</a>.</p>
<ul>
  <li>first item</li>
  <li>second item</li>
  <li>third item</li>
</ul>
<pre><code>const answer = 42;
console.log(answer);</code></pre>
<blockquote>A blockquote for good measure.</blockquote>`;
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
  let suggestionEvenTest = [
    { info: "This is a very long suggestion name", value: "test1" },
    { info: "Another extremely long suggestion label", value: "test2" },
    { info: "Short", value: "short" },
  ];

  function switchSuggestions() {
    let tmp = suggestion1;
    suggestion1 = suggestion2;
    suggestion2 = tmp;
  }

  let textColor = $state("rgb(255,0,0)");
  function changeTextColor() {
    textColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  }

  let sliderValue = $state(50);
  let sliderGradientValue = $state(50);
  let sliderChangeValue: number | undefined = $state();
  let sliderCommitValue: number | undefined = $state();
  let sliderBlurCount = $state(0);
  let moltenInputText = $state("Editable text");
  let moltenInputPassword = $state("secret");
  let moltenInputLimited = $state("max 10");
  let meltSelectValue1 = 0;
  let meltSelectValue2 = 0;
  let meltRadioValue1 = 0;
  let meltRadioValue2 = 0;
  let meltRadioValue3 = 0;
  let meltRadioValue4 = 0;
  let meltRadioValue5 = 0;
  let meltRadioValue6 = 0;

  let clearButtonTarget = $state("default");
  let clearButtonWidth = $state(0);

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
      title: "Clear Everything",
      value: "long",
      onclick: (e) => {
        alert(e);
      },
    },
    {
      title: "Pressure Sensitive Defaults With An Absurdly Long Name",
      value: "superlong",
      onclick: (e) => {
        alert(e);
      },
    },
  ];

  // Color editing components
  let pickerColor = $state(new Color.HSL(200, 100, 50));
  let layerColors = $state([
    { red: "255", green: "0", blue: "0", alpha: "1" },
    { red: "0", green: "128", blue: "255", alpha: "1" },
  ]);
  let layerSelected = $state(0);

  function handleAddLayer() {
    if (layerColors.length >= 3) return;
    layerColors = [
      ...layerColors,
      { red: "0", green: "255", blue: "0", alpha: "1" },
    ];
  }
  function handleRemoveLayer() {
    if (layerColors.length <= 1) return;
    layerColors = layerColors.slice(0, -1);
    if (layerSelected >= layerColors.length)
      layerSelected = layerColors.length - 1;
  }

  // LogStream demo: an isolated stream instance (max 3 visible, 5s
  // auto-dismiss) so this panel doesn't share state with any other consumer.
  const demoLogStream = createLogStream();
  let demoLogStreamContentCount = $state(0);

  function pushDemoLog(type: LogMessageType, message: string) {
    demoLogStream.push({ type, message });
  }

  function pushDemoBurst() {
    pushDemoLog(LogMessageType.NORMAL, `Burst message ${Date.now()}`);
  }
</script>

<main on:contextmenu|preventDefault>
  <GridSplitpanes class="app-frame">
    <GridPane size={20} minSize={10} maxSize={45} class="pane-left">
      <div class="frame-scroll">
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
            style="background-color: var(--background-muted);"
          ></div>
          --background-muted</span
        >
        <span class="color-preview-label"
          ><div
            class="color-preview-box"
            style="background-color: var(--background-soft);"
          ></div>
          --background-soft</span
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
            style="background-color: var(--shadow);"
          ></div>
          --shadow</span
        >
        <span class="color-preview-label"
          ><div
            class="color-preview-box"
            style="background-color: var(--border);"
          ></div>
          --border</span
        >
        <span class="color-preview-label"
          ><div
            class="color-preview-box"
            style="background-color: var(--accent);"
          ></div>
          --accent</span
        >
        <span class="color-preview-label"
          ><div
            class="color-preview-box"
            style="background-color: var(--accent-muted);"
          ></div>
          --accent-muted</span
        >
        <span class="color-preview-label"
          ><div
            class="color-preview-box"
            style="background-color: var(--accent-soft);"
          ></div>
          --accent-soft</span
        >
        <span class="color-preview-label"
          ><div
            class="color-preview-box"
            style="background-color: var(--focus);"
          ></div>
          --focus</span
        >
        <span class="color-preview-label"
          ><div
            class="color-preview-box"
            style="background-color: var(--error);"
          ></div>
          --error</span
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
        <span class="color-preview-label"
          ><div
            class="radius-preview-box"
            style="border-radius: var(--radius);"
          ></div>
          --radius</span
        >
        <span class="color-preview-label"
          ><div
            class="radius-preview-box"
            style="border-radius: var(--radius-small);"
          ></div>
          --radius-small</span
        >
        <span class="color-preview-label"
          ><div
            class="radius-preview-box"
            style="border-radius: var(--radius-medium);"
          ></div>
          --radius-medium</span
        >
        <span class="color-preview-label"
          ><div
            class="radius-preview-box"
            style="border-radius: var(--radius-large);"
          ></div>
          --radius-large</span
        >
        <span class="color-preview-label"
          ><div
            class="radius-preview-box"
            style="border-radius: var(--radius-full);"
          ></div>
          --radius-full</span
        >
      </div>
    </GridPane>

    <GridPane class="pane-middle">
      <div class="main-scroll">
        <div class="main-container">
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
              <MeltCheckbox
                target={t}
                title={"Block style (Default)"}
                disabled={buttonsDisabled}
              />
              <MeltCheckbox
                target={t}
                title={"Block style (Default)"}
                disabled={buttonsDisabled}
              />
              <MeltCheckbox
                target={t}
                style={"transparent"}
                title={"Transparent style"}
                disabled={buttonsDisabled}
              />
              <MeltCheckbox
                target={t}
                style={"transparent"}
                title={"Transparent style"}
                disabled={buttonsDisabled}
              />
            </Block>
            <Block border="red">
              <BlockTitle>Important border added</BlockTitle>
              <BlockBody>This is dangerous setting:</BlockBody>
              <MeltCheckbox
                target={t}
                title={"Destory enabled"}
                disabled={buttonsDisabled}
              />
            </Block>
            <Block>
              <BlockTitle>Toggle</BlockTitle>
              <Toggle title={"Test toggle"} disabled={buttonsDisabled} />
            </Block>
          </div>

          <div class="mock-panel">
            <Block>
              <div
                style="width: fit-content;"
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

              <BlockBody>This has dropdown value {clearButtonTarget}</BlockBody>
              <BlockBody>Button width: {clearButtonWidth}px</BlockBody>
              <MoltenPushButtonGroup
                options={clearButtonOptions}
                bind:target={clearButtonTarget}
                style="normal"
                disabled={buttonsDisabled}
              >
                <div
                  use:tooltip={{
                    text: "Clear the current selection",
                    placement: "top",
                    buttons: [
                      {
                        label: "Cancel",
                        handler: undefined,
                      },
                      {
                        label: "Confirm",
                        handler: () => {
                          handleAction();
                          closeDropdown();
                        },
                      },
                    ],
                    triggerEvents: ["show-buttons", "hover"],
                  }}
                  slot="button"
                  let:closeDropdown
                  let:handleAction
                  let:selectedLabel
                >
                  <MoltenPushButton
                    disabled={buttonsDisabled}
                    click={() => {}}
                    text={selectedLabel || "Clear"}
                    style={"normal"}
                    options={clearButtonOptions}
                    bind:target={clearButtonTarget}
                    bind:width={clearButtonWidth}
                    decorations={["(", ")"]}
                    grouped={true}
                  />
                </div>
              </MoltenPushButtonGroup>

              <BlockBody>This has three variants:</BlockBody>
              <MoltenPushButton
                disabled={buttonsDisabled}
                click={() => {}}
                text={"Accept"}
                style={"accept"}
              />
              <MoltenPushButton
                disabled={buttonsDisabled}
                click={() => {}}
                text={"Store"}
                snap={"wide"}
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
                disabled={buttonsDisabled}
              />
              <MeltCombo
                title={"Field 2"}
                bind:value={input4Value}
                suggestions={suggestion4}
                disabled={buttonsDisabled}
              />
              <BlockTitle>MeltCombo</BlockTitle>
              <BlockBody>Now in a row:</BlockBody>
              <BlockRow>
                <MeltCombo
                  title={"Ch"}
                  bind:value={input3Value}
                  suggestions={suggestionEvenTest}
                  disabled={buttonsDisabled}
                />
                <MeltCombo
                  title={"A Very Long Field Name"}
                  bind:value={input4Value}
                  suggestions={suggestionEvenTest}
                  disabled={buttonsDisabled}
                />
              </BlockRow>
              <BlockBody>Row with even spacing:</BlockBody>
              <BlockRow even>
                <MeltCombo
                  title={"Ch"}
                  bind:value={input3Value}
                  suggestions={suggestionEvenTest}
                  disabled={buttonsDisabled}
                />
                <MeltCombo
                  title={"A Very Long Field Name"}
                  bind:value={input4Value}
                  suggestions={suggestionEvenTest}
                  disabled={buttonsDisabled}
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
                  disabled={buttonsDisabled}
                />
                <MeltCombo
                  title={"Field 2"}
                  bind:value={input4Value}
                  suggestions={suggestion4}
                  disabled={buttonsDisabled}
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
              style="color: {textColor}; font-weight: 700;"
              >Right Click ME!</span
            >
          </div>
          <div class="mock-panel">
            <span>SvgIcon:</span>
            <div class="svg-row">
              <SvgIcon iconPath="folder_closed" fill="#FFF" />
              <SvgIcon iconPath="file" fill="#FFF" />
              <SvgIcon iconPath="folder_open" fill="#FFF" />
              <SvgIcon iconPath="edit" fill="#FFF" />
              <SvgIcon iconPath="edit" fill="#F00" />
              <SvgIcon iconPath="edit" fill="#00F" />
            </div>
          </div>
          <div class="mock-panel">
            <Block>
              <BlockTitle>IconButton</BlockTitle>
              <BlockBody>Default and compact:</BlockBody>
              <BlockRow>
                <IconButton iconPath="edit" tooltipText="Edit" />
                <IconButton
                  iconPath="deleteIcon"
                  compact
                  tooltipText="Delete (compact)"
                />
              </BlockRow>
              <BlockBody>Disabled:</BlockBody>
              <IconButton iconPath="deleteIcon" disabled tooltipText="Delete" />
              <BlockBody>As a link:</BlockBody>
              <IconButton
                iconPath="folder_open"
                href="https://intech.studio/"
                target="_blank"
                rel="noreferrer"
                tooltipText="Open in new tab"
              />
            </Block>
          </div>
          <div class="mock-panel">
            <span>MeltSlider:</span>
            <span>Value: {sliderValue}</span>
            <MeltSlider
              target={sliderValue}
              min={0}
              max={100}
              step={1}
              disabled={buttonsDisabled}
              on:change={(e) => {
                sliderValue = e.detail.value;
                sliderChangeValue = e.detail.value;
              }}
              on:commit={(e) => (sliderCommitValue = e.detail.value)}
              on:blur={() => (sliderBlurCount += 1)}
            />
            <div>change (live): {sliderChangeValue ?? "—"}</div>
            <div>commit (release): {sliderCommitValue ?? "—"}</div>
            <div>blur count: {sliderBlurCount}</div>
            <span>With gradient track: {sliderGradientValue}</span>
            <MeltSlider
              bind:target={sliderGradientValue}
              min={0}
              max={360}
              step={1}
              trackBackground="linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))"
              thumbBackground={`hsl(${sliderGradientValue}, 100%, 50%)`}
              disabled={buttonsDisabled}
            />
          </div>

          <div class="mock-panel">
            <Block>
              <BlockTitle>MoltenInput</BlockTitle>
              <BlockBody>Text: {moltenInputText}</BlockBody>
              <MoltenInput
                bind:target={moltenInputText}
                placeholder="Type something…"
                disabled={buttonsDisabled}
              />
              <BlockBody>Password:</BlockBody>
              <MoltenInput
                bind:target={moltenInputPassword}
                password
                placeholder="Password"
                disabled={buttonsDisabled}
              />
              <BlockBody>
                Char limit (10): {moltenInputLimited.length}/10
              </BlockBody>
              <MoltenInput
                bind:target={moltenInputLimited}
                availableCharacters={10}
                placeholder="Max 10 chars"
                disabled={buttonsDisabled}
              />
              <BlockBody>Disabled:</BlockBody>
              <MoltenInput target={"Can't edit this"} disabled />
            </Block>
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
                disabled={buttonsDisabled}
              />
              <BlockBody>With label:</BlockBody>
              <MeltSelect
                bind:target={meltSelectValue1}
                title="My Label"
                options={[
                  { title: "0", value: 0 },
                  { title: "1", value: 1 },
                  { title: "2", value: 2 },
                  { title: "3", value: 3 },
                ]}
                disabled={buttonsDisabled}
              />
              <BlockBody>With label and info:</BlockBody>
              <MeltSelect
                bind:target={meltSelectValue1}
                title="My Label"
                options={[
                  { title: "0", value: 0, info: "Description for option 0" },
                  { title: "1", value: 1, info: "Description for option 1" },
                  { title: "2", value: 2, info: "Description for option 2" },
                  { title: "3", value: 3, info: "Description for option 3" },
                ]}
                disabled={buttonsDisabled}
              />
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
                disabled={buttonsDisabled}
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
                disabled={buttonsDisabled}
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
                disabled={buttonsDisabled}
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
                disabled={buttonsDisabled}
              />
              <BlockBody>Button with individual options disabled</BlockBody>
              <MeltRadio
                bind:target={meltRadioValue5}
                style="button"
                orientation="horizontal"
                size="full"
                options={[
                  { title: "0", value: 0 },
                  { title: "1", value: 1, disabled: true },
                  { title: "2", value: 2 },
                  { title: "3", value: 3, disabled: true },
                ]}
                disabled={buttonsDisabled}
              />
              <BlockBody>Radio with individual options disabled</BlockBody>
              <MeltRadio
                bind:target={meltRadioValue6}
                style="radio"
                orientation="vertical"
                size="full"
                options={[
                  { title: "Enabled", value: 0 },
                  { title: "Disabled", value: 1, disabled: true },
                  { title: "Also enabled", value: 2 },
                ]}
                disabled={buttonsDisabled}
              /></Block
            >
          </div>
          <div class="mock-panel">
            <Block>
              <BlockTitle>LogStream</BlockTitle>
              <BlockBody>
                Push messages into an isolated stream; watch it stack, aggregate
                repeats into a count, cap at 3 visible, and auto-dismiss after
                5s.
              </BlockBody>
              <BlockBody
                >Visible messages: {demoLogStreamContentCount}</BlockBody
              >
              <BlockRow>
                <MoltenPushButton
                  text="Normal"
                  click={() =>
                    pushDemoLog(LogMessageType.NORMAL, "Normal log message")}
                  disabled={buttonsDisabled}
                />
                <MoltenPushButton
                  text="Success"
                  click={() =>
                    pushDemoLog(LogMessageType.SUCCESS, "Operation succeeded")}
                  disabled={buttonsDisabled}
                />
                <MoltenPushButton
                  text="Alert"
                  click={() =>
                    pushDemoLog(
                      LogMessageType.ALERT,
                      "Careful, alert triggered",
                    )}
                  disabled={buttonsDisabled}
                />
              </BlockRow>
              <BlockRow>
                <MoltenPushButton
                  text="Fail"
                  click={() =>
                    pushDemoLog(LogMessageType.FAIL, "Something failed")}
                  disabled={buttonsDisabled}
                />
                <MoltenPushButton
                  text="Progress"
                  click={() =>
                    pushDemoLog(LogMessageType.PROGRESS, "Working on it…")}
                  disabled={buttonsDisabled}
                />
              </BlockRow>
              <BlockBody
                >Push the same message twice to see it count up:</BlockBody
              >
              <MoltenPushButton
                text="Push repeated message"
                click={() =>
                  pushDemoLog(LogMessageType.NORMAL, "Repeated message")}
                disabled={buttonsDisabled}
              />
              <BlockBody
                >Push distinct messages fast to see the 3-message cap:</BlockBody
              >
              <MoltenPushButton
                text="Push burst"
                click={pushDemoBurst}
                disabled={buttonsDisabled}
              />
              <BlockBody>Reset the stream:</BlockBody>
              <MoltenPushButton
                text="Reset"
                style="outlined"
                click={() => demoLogStream.reset()}
                disabled={buttonsDisabled}
              />
            </Block>
          </div>

          <div class="mock-panel">
            <Block>
              <BlockTitle>ColorLayerSelector</BlockTitle>
              <BlockBody>Selected layer: {layerSelected}</BlockBody>
              <ColorLayerSelector
                colors={layerColors}
                selected={layerSelected}
                on:add-layer={handleAddLayer}
                on:remove-layer={handleRemoveLayer}
                on:layer-click={(e) => (layerSelected = e.detail.index)}
              />
            </Block>
          </div>

          <div class="mock-panel">
            <Block>
              <BlockTitle>MarkdownContainer</BlockTitle>
              <BlockBody>
                <MarkdownContainer markdown={markdownSample} />
              </BlockBody>
            </Block>
          </div>
        </div>
      </div>
    </GridPane>

    <GridPane size={20} minSize={10} maxSize={45} class="pane-right">
      <div class="frame-scroll">
        <Block>
          <BlockTitle>Color Pickers</BlockTitle>
          <BlockBody>
            HSL: h={Math.round(pickerColor.h)} s={Math.round(pickerColor.s)}
            l={Math.round(pickerColor.l)}
          </BlockBody>
          <BlockBody>SquareColorPicker:</BlockBody>
          <div class="picker-box">
            <SquareColorPicker
              color={pickerColor}
              on:input={(e) => (pickerColor = e.detail.color)}
            />
          </div>
          <BlockBody>CircleColorPicker:</BlockBody>
          <div class="picker-box">
            <CircleColorPicker
              color={pickerColor}
              on:input={(e) => (pickerColor = e.detail.color)}
            />
          </div>
          <BlockBody>SliderColorPicker:</BlockBody>
          <SliderColorPicker
            color={pickerColor}
            on:input={(e) => (pickerColor = e.detail.color)}
          />
        </Block>
      </div>
    </GridPane>
  </GridSplitpanes>

  <LogStream
    store={demoLogStream}
    bottom="2rem"
    on:content-change={(e) => (demoLogStreamContentCount = e.detail.count)}
  />
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
  .radius-preview-box {
    display: inline-block;
    width: 4rem;
    height: 4rem;
    border: 1px solid var(--foreground-muted);
    background-color: var(--background-muted);
    margin: 0 5px 0 0;
    position: relative;
    top: 1rem;
  }

  main {
    background-color: var(--background);
    height: 100vh;
    overflow: hidden;
    position: relative;
  }

  div.main-scroll {
    height: 100%;
    padding: 5rem;
    overflow-y: auto;
  }

  div.frame-scroll {
    height: 100%;
    padding: 1rem;
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
  div.picker-box {
    width: 10rem;
    height: 10rem;
  }
  :global(.app-frame) {
    height: 100%;
  }
  :global(.splitpanes.grid-uikit-theme .splitpanes__pane.pane-left) {
    background-color: var(--background);
  }
  :global(.splitpanes.grid-uikit-theme .splitpanes__pane.pane-middle) {
    background-color: var(--background-muted);
  }
  :global(.splitpanes.grid-uikit-theme .splitpanes__pane.pane-right) {
    background-color: var(--background);
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
