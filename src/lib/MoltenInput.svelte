<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  export let disabled = false;
  export let target: string;
  export let availableCharacters: number | undefined = undefined;
  export function focus() {
    input.focus();
  }
  export let password: boolean = false;

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

{#if password}
  <input
    bind:this={input}
    {disabled}
    bind:value={target}
    type="password"
    on:change={handleChange}
    on:click|stopPropagation
    on:keydown={handleKeydown}
  />
{:else}
  <input
    bind:this={input}
    {disabled}
    bind:value={target}
    type="text"
    on:change={handleChange}
    on:click|stopPropagation
    on:keydown={handleKeydown}
  />
{/if}

<style>
  input {
    width: 100%;
    display: flex;
    padding: 0.5rem;
    background-color: var(--background-muted);
    color: var(--foreground);
    border: 1px solid var(--background-soft);
  }
  input:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  input:disabled {
    cursor: not-allowed;
    color: var(--foreground-disabled);
    border: 1px solid var(--foreground-disabled);
  }
</style>
