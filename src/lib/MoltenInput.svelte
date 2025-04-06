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
</script>

<input
  bind:this={input}
  {disabled}
  class="w-full flex px-2 py-2 text-white text-opacity-80 flex-grow bg-black/25 border border-black border-opacity-20 focus:border-green-500 focus:outline-none"
  bind:value={target}
  on:change={handleChange}
  on:click|stopPropagation
/>
