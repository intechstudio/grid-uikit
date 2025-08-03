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
  let element: HTMLButtonElement;

  export function focus() {
    element?.focus();
  }
</script>

<container class:width-full={snap === "full"}>
  <button
    bind:this={element}
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
    class={disabled ? `${style}-disabled` : `${style}-enabled`}
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

    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: 100%; /* 1 */
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
    color: inherit; /* 1 */
    margin: 0; /* 2 */
    text-transform: none;
    background-color: transparent; /* 2 */
    cursor: pointer;
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
    color: var(--foreground-muted);
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
  .normal-enabled:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  .normal-disabled {
    color: var(--foreground-disabled);
    background-color: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(0, 0, 0, 0.25);
  }

  .outlined-enabled {
    border: 1px solid rgba(0, 164, 130, 1);
    color: var(--foreground-muted);
  }
  .outlined-enabled:hover {
    background-color: rgba(0, 111, 83, 1);
    border-color: rgba(27, 164, 135);
  }
  .outlined-disabled {
    color: var(--foreground-disabled);
    border: 1px solid rgba(0, 163, 130, 1);
  }

  .accept-enabled {
    color: var(--foreground);
    background-color: rgba(11, 164, 132, 1);
  }
  .accept-enabled:hover {
    background-color: rgba(0, 111, 83, 1);
  }
  .accept-disabled {
    color: var(--foreground-disabled);
    background-color: rgba(11, 164, 132, 0.5);
  }
</style>
