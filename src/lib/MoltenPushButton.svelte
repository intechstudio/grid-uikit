<script lang="ts">
  export let selected: boolean = false;
  export let text: string = "";
  export let style: "normal" | "outlined" | "accept" = "normal";
  export let disabled: boolean = false;
  export let popup: { duration?: number } | undefined = undefined;
  export let ratio = "normal";
  export let snap = "auto";
  export let click: (...args: any) => void;

  let showPopup: boolean = false;
</script>

<container class="relative" class:w-full={snap === "full"}>
  <button
    class:selected
    on:click={() => {
      if (!showPopup) {
        showPopup = true;
        setTimeout(() => {
          showPopup = false;
        }, popup?.duration ?? 3000);
      }

      if (typeof click === "undefined") {
        return;
      }

      click();
    }}
    {disabled}
    class="{disabled
      ? `${style}-disabled`
      : `${style}-enabled`} rounded focus:outline-none truncate py-1"
    class:px-4={ratio === "normal"}
    class:px-1={ratio === "box"}
    class:w-full={snap === "full"}
    class:w-fit={snap === "auto"}
  >
    <span>{text}</span>
    <slot name="content" />
  </button>

  {#if showPopup}
    <slot name="popup" />
  {/if}
</container>

<style>
  .normal-enabled {
    @apply text-gray-50 bg-black bg-opacity-10 border border-black border-opacity-40 hover:bg-opacity-40;
  }
  .normal-disabled {
    @apply text-gray-50/25 bg-black/25 bg-opacity-10 border border-black/25 border-opacity-40;
  }

  .outlined-enabled {
    @apply border hover:bg-commit-saturate-20 text-white border-commit-saturate-10 hover:border-commit-desaturate-10;
  }
  .outlined-disabled {
    @apply border text-white border-commit-saturate-10 bg-opacity-50 text-opacity-50;
  }

  .accept-enabled {
    @apply text-white bg-commit hover:bg-commit-saturate-20;
  }
  .accept-disabled {
    @apply text-white bg-commit bg-opacity-50 text-opacity-50;
  }
</style>
