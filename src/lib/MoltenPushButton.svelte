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

<container class:width-full={snap === "full"}>
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
      : `${style}-enabled`}"
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
  container {
    position: relative;
  }
  container.width-full {
    width: 100%;
  }

  button {
    border-radius: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.25rem;
  }
  button.w-full {
    width: 100%;
  }
  button.w-fit {
    width: fit-content;
  }
  button.px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  .normal-enabled {
    color: rgba(250, 250, 250, 0.5);
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
  .normal-enabled:hover {
    background-color: rgba(0, 0, 0, 0.4)
  }
  .normal-disabled {
    color: rgba(250, 250, 250, 0.25);
    background-color: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(0, 0, 0, 0.25);
  }

  .outlined-enabled {
    border: 1px solid rgba(0, 164, 130, 1);
    color: white;
  }
  .outlined-enabled:hover {
    background-color: rgba(0, 111, 83, 1.0);
    border-color: rgba(27, 164, 135)
  }
  .outlined-disabled {
    border: 1px solid rgba(0, 163, 130, 1.0);
    color: rgba(255, 255, 255, 0.5);
  }

  .accept-enabled {
    color: white;
    background-color: rgba(11, 164, 132, 1.0)
  }
  .accept-enabled:hover {
    background-color: rgba(0, 111, 83, 1.0)
  }
  .accept-disabled {
    color: rgba(255, 255, 255, 0.5);
    background-color: rgba(11, 164, 132, 0.5);
  }
</style>
