<script lang="ts">
  import { createCheckbox, melt } from "@melt-ui/svelte";
  import { createEventDispatcher } from "svelte";

  export let target;
  export let title;
  export let style = "box";

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

<label
  class="my-4 {style == 'box'
    ? 'bg-black bg-opacity-10 border border-black border-opacity-20'
    : ''} group flex text-white items-center cursor-pointer p-2"
>
  <button {...$root} use:root class="">
    <div
      class="relative flex items-center justify-center rounded border w-6 h-6"
    >
      <div
        class="{target
          ? 'block'
          : 'hidden'} absolute rounded-sm bg-white h-3 w-3"
      />
    </div>

    <input {...$input} use:input />
  </button>

  {#if title}
    <div
      class="pl-2 text-white group-hover:text-opacity-100 {target
        ? 'text-opacity-100'
        : 'text-opacity-80'}"
    >
      {title}
    </div>
  {/if}
</label>
