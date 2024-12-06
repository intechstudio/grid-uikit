<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let inputValue = "";
  export let suggestions: { value: string; info: string }[] = [];
  export let customClasses = "";
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

  function filterSuggestions(){
    let searchTerm = displayText.toLowerCase();
    let filteredSuggestions = suggestions.filter((e) => e.info.toLowerCase().includes(searchTerm) || e.value.toLowerCase().includes(searchTerm));
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

  function updateInfoValue(){
    infoValue =
      suggestions.find((s) => String(s.value).trim() == String(displayText).trim())
        ?.info ?? "";
  }

  function handleSuggestionSelected(e: any) {
    const { value } = e.detail;
    displayText = value;
    sendData(displayText);
  }

  let inputComponent;
</script>

<div class="{$$props.class} w-full relative">
  <input
    bind:this={inputComponent}
    {disabled}
    bind:value={displayText}
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:suggestion-select={handleSuggestionSelected}
    type="text"
    {placeholder}
    class="{customClasses} w-full border
        focus:neumorph focus:rounded-lg
        {isError
      ? 'border-error focus:outline-error'
      : 'focus:border-select border-secondary'} bg-secondary text-white py-0.5 pl-2 rounded-none"
    class:text-opacity-50={disabled}
  />

  <div class=" py-1">
    {#if !focus && infoValue !== undefined}
      <div class="{infoValue ? 'text-gray-500' : 'text-gray-600'} text-sm">
        {infoValue}
      </div>
    {/if}
  </div>
</div>

<style>
  .neumorph {
    box-shadow:
      -2px -2px 10px #242c30,
      2px 2px 10px #303c42;
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
