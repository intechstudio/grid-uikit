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

<label class="toggle-container" class:disabled>
  <input
    data-testid={testid}
    type="checkbox"
    bind:checked={value}
    on:change={handleChange}
    class="{$$props.class} toggle"
    {disabled}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        value = !value;
        handleChange();
      }
    }}
  />
  {#if title}
    <span class="toggle-label" class:disabled>
      {title}
    </span>
  {/if}
</label>

<style>
  .toggle-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--foreground-muted);
  }

  .toggle-container.disabled {
    cursor: default;
  }

  .toggle-label {
    margin-left: 0.75em;
  }

  .toggle-label.disabled {
    color: var(--foreground-disabled);
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
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
  }

  .toggle {
    --toggle-height: 1.5em;
    --toggle-padding: 0.25em;
    --toggle-border: 1px;
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
    border-radius: var(--radius);
    display: inline-block;
    position: relative;
    margin: 0;
    border: var(--toggle-border) solid var(--border);
    background-color: var(--background-muted);
    transition: background-color 0.2s ease;
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
    border-radius: var(--radius);
    background-color: var(--foreground-muted);
    transition:
      transform 0.15s ease-out,
      background-color 0.15s ease;
  }

  .toggle:checked {
    background-color: var(--accent-soft);
  }

  .toggle:checked::after {
    transform: translateX(var(--toggle-translate));
    background-color: var(--foreground-muted);
  }

  .toggle:disabled {
    cursor: default;
  }

  .toggle:disabled::after {
    background-color: var(--foreground-disabled);
  }

  .toggle:checked:disabled {
    background-color: var(--background-muted);
  }
</style>
