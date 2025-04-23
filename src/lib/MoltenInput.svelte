<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let disabled = false;
  export let target: string;
  export let availableCharacters: number | undefined = undefined;
  export function focus() {
    input.focus();
  }

  let input: HTMLElement;
  let oldValue: string | undefined = undefined;

  onMount(() => {
    oldValue = target;
  });

  function handleChange(e: any) {
    dispatch("change", {
      value: target,
    });
  }

  $: handleInput(target);

  function handleInput(value: string) {
    const diff =
      typeof availableCharacters === "undefined"
        ? Infinity
        : availableCharacters - value.length;

    if (diff >= 0) {
      oldValue = value;
      dispatch("input", {
        value: value,
      });
    } else {
      oldValue = value;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    dispatch("keydown", e);
  }
</script>

<input
  bind:this={input}
  {disabled}
  bind:value={target}
  on:change={handleChange}
  on:click|stopPropagation
  on:keydown={handleKeydown}
/>

<style>
  input {
    width: 100%;
    display: flex;
    padding: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    flex-grow: 1;
    background-color: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  input:focus {
    border-color: rgba(34, 197, 94, 1);
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
</style>
