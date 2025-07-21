<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value = false;
  export let title: string = "";

  function handleChange() {
    dispatch("change", {});
  }
</script>

<div class="flex items-center">
  {#if title}
    <span class="mr-2">
      {title}
    </span>
  {/if}
  <input
    type="checkbox"
    bind:checked={value}
    on:change={handleChange}
    class="{$$props.class} toggle pointer-events-auto"
  />
</div>

<style>
  input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }

  input[type="checkbox"]:focus {
    outline: 0;
  }

  .toggle {
    height: 22px;
    width: 36px;
    border-radius: 16px;
    display: inline-block;
    position: relative;
    margin: 0;
    border: 2px solid var(--foreground);
    background-color: var(--foreground);
    transition: all 0.2s ease;
  }

  .toggle::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--background);
    transition: all 0.2s cubic-bezier(0.5, 0.1, 0.75, 1.35);
  }

  /**
  pick: rgb(107, 122, 255)
  commit: rgb(11, 164, 132)
  */

  .toggle:checked {
    border-color: rgb(11, 164, 132);
  }

  .toggle:checked::after {
    transform: translatex(14px);
  }
</style>
