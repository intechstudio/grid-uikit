<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value = false;
  export let title: string = "";

  function handleChange() {
    dispatch("change", {});
  }
</script>

<div class="toggle-container">
  {#if title}
    <span class="toggle-label">
      {title}
    </span>
  {/if}
  <input
    type="checkbox"
    bind:checked={value}
    on:change={handleChange}
    class="{$$props.class} toggle"
  />
</div>

<style>
  .toggle-container {
    display: flex;
    align-items: center;
  }

  .toggle-label {
    margin-right: 0.5rem;
  }

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
    border: 1px solid var(--background-soft);
    background-color: var(--background-muted);
    transition: all 0.2s ease;
    pointer-events: auto;
  }

  .toggle::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--foreground-muted);
    transition: all 0.2s cubic-bezier(0.5, 0.1, 0.75, 1.35);
  }

  .toggle:checked {
    border-color: rgb(11, 164, 132);
  }

  .toggle:checked::after {
    transform: translateX(14px);
  }
</style>
