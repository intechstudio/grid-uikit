<script lang="ts">
  import { createCheckbox, melt } from "@melt-ui/svelte";
  import { createEventDispatcher } from "svelte";

  export let target: boolean;
  export let title: string;
  export let style: "box" | "transparent" = "box";

  const dispatch = createEventDispatcher();

  const {
    elements: { root, input },
    helpers: { isChecked, isIndeterminate },
    states: { checked },
  } = createCheckbox({
    defaultChecked: target,
  });

  let oldTarget;

  $: {
    if (target !== oldTarget) {
      $checked = target;
      oldTarget = target;
    }

    if (target !== $checked) {
      oldTarget = target = $checked;
      dispatch("change", target);
    }
  }
</script>

<label class:checkbox-box={style === "box"}>
  <button {...$root} use:root>
    <div class="checkbox-outer">
      <div style:display={target ? "block" : "none"} class="checkbox-inner" />
    </div>

    <input {...$input} use:input />
  </button>

  {#if title}
    <div class:checkbox-title-selected={target} class="checkbox-title">
      {title}
    </div>
  {/if}
</label>

<style>
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
  }

  .checkbox-box {
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .checkbox-outer {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    margin: auto;
    border: 1px solid var(--foreground);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-inner {
    width: 0.75rem;
    height: 0.75rem;
    background-color: var(--foreground);
    border-radius: 0.125rem;
  }
  .checkbox-title {
    padding-left: 0.5rem;
    color: var(--foreground-muted);
  }
  button {
    margin: 0; /* 2 */
    padding: 0; /* 3 */
    background-color: transparent; /* 2 */
    cursor: pointer;
  }
</style>
