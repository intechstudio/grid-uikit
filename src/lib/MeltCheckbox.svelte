<script lang="ts">
  import { createCheckbox, melt } from "@melt-ui/svelte";
  import { createEventDispatcher } from "svelte";

  export let target: boolean;
  export let title: string;
  export let style: "box" | "transparent" = "box";
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();

  const {
    elements: { root, input },
    states: { checked },
  } = createCheckbox({
    defaultChecked: target,
    disabled: disabled,
  });

  let oldTarget;

  $: {
    if (target !== oldTarget) {
      $checked = target;
      oldTarget = target;
    }

    if (target !== $checked) {
      if (!disabled) {
        oldTarget = target = $checked;
        dispatch("change", target);
      } else {
        // Reset internal state if it changed while disabled
        $checked = target;
      }
    }
  }
</script>

<label class="row" class:checkbox-box={style === "box"} class:disabled>
  <button
    {...$root}
    use:root
    class="checkbox-button"
    class:disabled
    on:keydown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.click();
      }
    }}
  >
    <div class="checkbox-outer" class:disabled>
      <div
        style:display={target ? "block" : "none"}
        class="checkbox-inner"
        class:disabled
      />
    </div>

    {#if title}
      <span class:disabled>{title}</span>
    {/if}

    <input {...$input} use:input />
  </button>
</label>

<style>
  label.row {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }

  label.row.disabled {
    cursor: default;
  }

  .checkbox-box {
    background-color: var(--background-muted);
    border: 1px solid var(--background-soft);
  }

  .checkbox-outer {
    position: relative;
    width: 1.5em;
    height: 1.5em;
    border-radius: var(--radius);
    margin-right: 0.75em;
    border: 1px solid var(--foreground);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-outer.disabled {
    border-color: var(--foreground-disabled);
  }

  .checkbox-inner {
    position: absolute;
    width: 0.75em;
    height: 0.75em;
    background-color: var(--foreground);
    border-radius: var(--radius);
  }

  .checkbox-inner.disabled {
    background-color: var(--foreground-disabled);
  }

  button {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0; /* 2 */
    padding: 0; /* 3 */
    background-color: transparent; /* 2 */
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  button.checkbox-button {
    color: var(--foreground-muted);
  }

  button:focus {
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
  }

  button.disabled {
    cursor: default;
  }

  span.disabled {
    color: var(--foreground-disabled);
  }
</style>
