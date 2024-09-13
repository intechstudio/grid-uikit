<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value = "";
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

  $: handleValueChange(value);

  function handleValueChange(value: string) {
    infoValue =
      suggestions.find((s) => String(s.value).trim() == String(value).trim())
        ?.info ?? "";

    isError = !validator(displayText);
    dispatch("validator", { isError: isError });
    dispatch("change", value);
  }

  function handleBlur() {
    dispatch("blur");
  }

  function handleFocus() {
    dispatch("focus");
    updateSuggestions();
  }

  function updateSuggestions() {
    if (typeof suggestionTarget !== "undefined") {
      const event = new CustomEvent("display", {
        detail: {
          data: suggestions,
          sender: inputComponent!,
        },
      });

      suggestionTarget.dispatchEvent(event);
    }
  }

  function handleSuggestionSelected(e: any) {
    value = e.detail.value;
  }

  let inputComponent;
</script>

<div class="{$$props.class} w-full relative">
  <input
    bind:this={inputComponent}
    {disabled}
    bind:value
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:suggestion-select={handleSuggestionSelected}
    type="text"
    {placeholder}
    class="w-full border
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
