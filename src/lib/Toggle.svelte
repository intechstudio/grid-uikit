<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let value = false;
  export let title: string = "";
  export let testid;
  export let disabled = false;

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
    data-testid={testid}
    type="checkbox"
    bind:checked={value}
    on:change={handleChange}
    class="{$$props.class} toggle"
    {disabled}
  />
</div>

<style>
  .toggle-container {
    display: flex;
    align-items: center;
  }

  .toggle-label {
    margin-right: 0.5em;
  }

  input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    font-size: inherit;
  }

  input[type="checkbox"]:focus {
    outline: 0;
  }

  .toggle {
    --toggle-height: 1.75em;
    --toggle-padding: 0.25em;
    --toggle-border: 0.0625em; /* 1px at 16px base = 0.0625em */
    --toggle-knob-size: calc(
      var(--toggle-height) - 2 * var(--toggle-padding) - 2 *
        var(--toggle-border)
    );
    --toggle-width: calc(var(--toggle-height) * 1.6);
    --toggle-translate: calc(
      var(--toggle-width) - 2 * var(--toggle-padding) -
        var(--toggle-knob-size) - 2 * var(--toggle-border)
    );

    height: var(--toggle-height);
    width: var(--toggle-width);
    border-radius: calc(var(--toggle-height) / 2);
    display: inline-block;
    position: relative;
    margin: 0;
    border: var(--toggle-border) solid var(--background-soft);
    background-color: var(--background-muted);
    transition: border-color 0.2s ease;
    pointer-events: auto;
    box-sizing: border-box;
  }

  .toggle::after {
    content: "";
    position: absolute;
    top: var(--toggle-padding);
    left: var(--toggle-padding);
    width: var(--toggle-knob-size);
    height: var(--toggle-knob-size);
    border-radius: 50%;
    background-color: var(--foreground-muted);
    transition:
      transform 0.15s ease-out,
      background-color 0.15s ease;
  }

  .toggle:checked {
    border-color: var(--accent);
  }

  .toggle:checked::after {
    transform: translateX(var(--toggle-translate));
  }

  .toggle:disabled {
    cursor: default;
  }

  .toggle:disabled::after {
    background-color: var(--foreground-disabled);
  }

  .toggle:checked:disabled {
    border-color: var(--accent-soft);
  }
</style>
