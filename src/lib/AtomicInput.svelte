<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let inputValue = "";
  export let suggestions: { value: string; info: string }[] = [];
  export let placeholder = "";
  export let suggestionTarget: Element | undefined = undefined;
  export let validator = (text: string) => {
    return true;
  };
  export let disabled = false;

  let isError = false;
  let infoValue = "";
  let displayText: any;

  let focus: any;

  function handleValueChange(value: any) {
    //const newValue = GridScript.humanize(String(value));
    if (value !== displayText) {
      displayText = value;
    }
    updateInfoValue();

    isError = !validator(displayText);
    dispatch("validator", { isError: isError });
  }

  $: {
    handleValueChange(inputValue);
  }

  $: displayText, suggestions, filterSuggestions();

  function filterSuggestions() {
    let searchTerm = displayText.toLowerCase();
    let filteredSuggestions = suggestions.filter(
      (e) =>
        e.info.toLowerCase().includes(searchTerm) ||
        e.value.toLowerCase().includes(searchTerm),
    );
    updateSuggestions(filteredSuggestions);
  }

  function handleBlur(e) {
    if (inputValue !== displayText) {
      sendData(displayText);
    }
    updateSuggestions([]);
  }

  function sendData(value: any) {
    dispatch("change", value);
  }

  function handleFocus(e: any) {
    dispatch("focus");
    updateSuggestions(suggestions);
  }

  function updateSuggestions(suggestions) {
    if (typeof suggestionTarget !== "undefined") {
      const event = new CustomEvent("display", {
        detail: {
          data: suggestions,
          sender: inputComponent!,
        },
      });

      suggestionTarget.dispatchEvent(event);
    }
    updateInfoValue();
  }

  function updateInfoValue() {
    infoValue =
      suggestions.find(
        (s) => String(s.value).trim() == String(displayText).trim(),
      )?.info ?? "";
  }

  function handleSuggestionSelected(e: any) {
    const { value } = e.detail;
    displayText = value;
    sendData(displayText);
  }

  let inputComponent;
</script>

<div class="{$$props.class} container">
  <input
    bind:this={inputComponent}
    {disabled}
    bind:value={displayText}
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:suggestion-select={handleSuggestionSelected}
    {placeholder}
    class:error={isError}
    class:disabled
  />

  <div class="info-value">
    {#if !focus && infoValue !== undefined}
      <div class="info-text">
        {infoValue}
      </div>
    {/if}
  </div>
</div>

<style>
  div.container {
    width: 100%;
    position: relative;
  }

  input {
    width: 100%;
    border-width: 1px;
    border-color: rgba(42, 52, 57, 1);
    background-color: rgba(42, 52, 57, 1);
    color: white;
    padding: 0.125rem 0rem 0.125rem 0.5rem;
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
    padding-left: 0.5rem;
    border-radius: 0px;

    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: 100%; /* 1 */
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
    margin: 0; /* 2 */
  }
  input:focus {
    box-shadow:
      -2px -2px 10px #242c30,
      2px 2px 10px #303c42;
    border-radius: 0.5rem;
    border-color: rgba(71, 87, 95, 1);
  }
  input.error {
    border-color: rgba(220, 38, 38, 1);
  }
  input.error:focus {
    outline-color: #dc2626;
  }
  input.disabled {
    color: rgba(255, 255, 255, 0.5);
  }

  div.info-value {
    padding: 0.25rem 0;
  }
  div.info-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(82, 82, 82, 1);
  }

  ::-webkit-scrollbar {
    border-radius: 8px;
    height: 6px;
    width: 6px;
    background: #1e2628;
  }

  ::-webkit-scrollbar-thumb {
    background: #286787;
    border-radius: 8px;
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
  }

  ::-webkit-scrollbar-corner {
    border-radius: 8px;
    background: #1e2628;
  }
</style>
