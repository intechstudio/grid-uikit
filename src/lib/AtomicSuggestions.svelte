<script lang="ts">
  import { clickOutside } from "./click-outside.action";

  export let component = undefined;

  let suggestions: { value: string; info: string }[] = [];

  let target: Element | undefined = undefined;

  function handleDisplay(e: any) {
    const { data, sender } = e.detail;
    target = sender;
    suggestions = data;
  }

  function handleSuggestionSelected(value: any) {
    const event = new CustomEvent("suggestion-select", {
      detail: {
        value: value,
      },
    });
    target!.dispatchEvent(event);
    suggestions = [];
  }
</script>

<suggestions
  class="container"
  class:hidden={suggestions.length === 0}
  bind:this={component}
  on:display={handleDisplay}
>
  <div class="suggestion-list-container">
    <ul
      class="scrollbar suggestion-list"
    >
      {#each suggestions as suggestion}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          on:mousedown={() => handleSuggestionSelected(suggestion.value)}
          class="suggestion"
        >
          {suggestion.info}
        </li>
      {/each}
    </ul>
  </div>
</suggestions>

<style>
  suggestions.container {
    display: flex;
    width: 100%;
    padding: 0.5rem;
  }
  suggestions.hidden {
    display: none;
  }
  div.suggestion-list-container {
    width: 100%;
    padding: 0.25rem;
    box-shadow:
      -2px -2px 10px #242c30,
      2px 2px 10px #303c42;
    border-radius: 0.5rem;
    border: 1px solid rgba(71, 87, 95, 1.0);
    background-color: rgba(42, 52, 57, 1.0);
  }
  ul.suggestion-list {
    max-height: 10rem;
    overflow-y: scroll;
    padding-right: 0.25rem;
    color: white;
    cursor: pointer;
  }
  li.suggestion {
    padding: 0.25rem;
    padding-left: 0.5rem;
  }
  li.suggestion:hover {
    background-color: black;
  }
</style>
