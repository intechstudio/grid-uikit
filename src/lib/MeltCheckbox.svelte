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
    helpers: { isChecked, isIndeterminate },
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

<label class:checkbox-box={style === "box"} class:disabled>
  <button {...$root} use:root class:disabled>
    <div class="checkbox-outer" class:disabled>
      <div
        style:display={target ? "block" : "none"}
        class="checkbox-inner"
        class:disabled
      />
    </div>

    <input {...$input} use:input />
  </button>

  {#if title}
    <div
      class:checkbox-title-selected={target}
      class="checkbox-title"
      class:disabled
    >
      {title}
    </div>
  {/if}
</label>

<style>
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5em;
  }

  label.disabled {
    cursor: default;
  }

  .checkbox-box {
    background-color: var(--background-muted);
    border: 1px solid var(--background-soft);
  }

  .checkbox-outer {
    width: 1.5em;
    height: 1.5em;
    border-radius: 0.25em;
    margin: auto;
    border: 1px solid var(--foreground);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-outer.disabled {
    border-color: var(--foreground-disabled);
  }

  .checkbox-inner {
    width: 0.75em;
    height: 0.75em;
    background-color: var(--foreground);
    border-radius: 0.125em;
  }

  .checkbox-inner.disabled {
    background-color: var(--foreground-disabled);
  }

  .checkbox-title {
    padding-left: 0.5em;
    color: var(--foreground-muted);
  }

  .checkbox-title.disabled {
    color: var(--foreground-disabled);
  }

  button {
    margin: 0; /* 2 */
    padding: 0; /* 3 */
    background-color: transparent; /* 2 */
    cursor: pointer;
    font-size: inherit;
  }

  button.disabled {
    cursor: default;
  }
</style>
