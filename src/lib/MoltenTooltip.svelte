<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import Popover from "svelte-easy-popover";
  import { SvelteComponent, onDestroy, onMount } from "svelte";
  import MoltenPushButton from "./MoltenPushButton.svelte";

  export let text = "";
  export let placement = "top";
  export let duration = 250;
  export let delay = 750;
  export let instant = false;
  export let nowrap = false;
  export let buttons: any[] = [];
  export let triggerEvents = ["hover"];
  export let referenceElement: HTMLElement;
  export let component: SvelteComponent | undefined = undefined;

  let showbuttons = false;
  let showTooltip: boolean;

  let closeTimeout: any;
  let openTimeout: any;

  function handleClick(e: any) {
    //handleReferenceElementClick(e);
    e.stopPropagation();
  }

  function handleMouseEnter(e: any) {
    handleReferenceElementMouseEnter(e);
    e.stopPropagation();
  }

  function handleMouseLeave(e: any) {
    handleReferenceElementMouseLeave(e);
    e.stopPropagation();
  }

  function handleReferenceElementClick(e: any) {
    if (triggerEvents.includes("click")) {
      showTooltip = true;
      showbuttons = true;
    }
    if (triggerEvents.includes("show-buttons")) {
      if (!showbuttons) {
        clearTimeout(openTimeout);
        showTooltip = true;
        showbuttons = true;
      }
    }
    if (triggerEvents.includes("hover") && !showbuttons) {
      showTooltip = false;
    }
    e.stopPropagation();
  }

  function handleReferenceElementMouseEnter(e: any) {
    if (triggerEvents.includes("hover")) {
      clearTimeout(closeTimeout);
      if (instant) {
        showTooltip = true;
      } else {
        openTimeout = setTimeout(() => {
          showTooltip = true;
        }, delay);
      }
    }
    if (triggerEvents.includes("click")) {
      clearTimeout(closeTimeout);
    }
    e.stopPropagation();
  }

  function handleReferenceElementMouseLeave(e: any) {
    if (triggerEvents.includes("hover") && !showbuttons) {
      clearTimeout(openTimeout);
      closeTimeout = setTimeout(
        () => {
          showTooltip = false;
        },
        instant ? 0 : 100,
      );
    }
    if (triggerEvents.includes("click")) {
      closeTimeout = setTimeout(() => {
        showTooltip = false;
      }, 100);
    }
    e.stopPropagation();
  }

  function handleReferenceElementFocus(e: any) {
    if (triggerEvents.includes("focus")) {
      clearTimeout(closeTimeout);
      showTooltip = true;
    }
    e.stopPropagation();
  }

  function handleReferenceElementBlur(e: any) {
    if (triggerEvents.includes("focus")) {
      closeTimeout = setTimeout(() => {
        showTooltip = false;
      }, 100);
    }
    e.stopPropagation();
  }

  onMount(() => {
    referenceElement.addEventListener(
      "mouseenter",
      handleReferenceElementMouseEnter,
    );
    referenceElement.addEventListener(
      "mouseleave",
      handleReferenceElementMouseLeave,
    );
    referenceElement.addEventListener("click", handleReferenceElementClick);
    referenceElement.addEventListener("focus", handleReferenceElementFocus);
    referenceElement.addEventListener("blur", handleReferenceElementBlur);
  });

  onDestroy(() => {
    referenceElement.removeEventListener(
      "mouseenter",
      handleReferenceElementMouseEnter,
    );
    referenceElement.removeEventListener(
      "mouseleave",
      handleReferenceElementMouseLeave,
    );
    referenceElement.removeEventListener("click", handleReferenceElementClick);
    referenceElement.removeEventListener("focus", handleReferenceElementFocus);
    referenceElement.removeEventListener("blur", handleReferenceElementBlur);
  });

  function interceptEvent(e: any) {
    const { type, data } = e.detail;
    switch (type) {
      case "close": {
        close();
        break;
      }
      default:
        forwardEvent(e);
    }
    e.stopPropagation();
  }

  function forwardEvent(e: any) {
    const { type, data } = e.detail;
    referenceElement?.dispatchEvent(
      new CustomEvent(type, {
        detail: data,
      }),
    );
  }

  function close() {
    clearTimeout(openTimeout);
    clearTimeout(closeTimeout);
    showTooltip = false;
    showbuttons = false;
  }
</script>

<Popover
  bind:isOpen={showTooltip}
  triggerEvents={["manual"]}
  {referenceElement}
  bind:placement
  spaceAway={10}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:click={handleClick}
    class="{$$props.class} tooltip-container"
    transition:fade|global={{
      duration: instant ? 0 : duration, //Make it instant when explicitly clicked
    }}
  >
    <div
      class="tooltip-container-content"
      class:tooltip-gap-2={buttons.length > 0}
    >
      {#if typeof component === "undefined"}
        <div
          class="tooltip-container-text"
          class:tooltip-whitespace-nowrap={nowrap}
        >
          {text}
        </div>
      {:else}
        <svelte:component
          this={component.object}
          {...component.props}
          class="tooltip-container-component"
          on:event={interceptEvent}
        />
      {/if}

      {#if showbuttons}
        <div
          transition:slide|global={{ duration: instant ? 0 : 100 }}
          class="tooltip-container-buttons"
        >
          {#each buttons as button}
            <MoltenPushButton
              text={button.label}
              snap={"full"}
              click={() => {
                if (typeof button.handler !== "undefined") {
                  button.handler();
                }
                close();
              }}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <div
    transition:fade|global={{
      duration: instant ? 0 : duration,
    }}
    class="tooltip-absolute"
    id="arrow"
    data-popper-arrow
  >
    <div class="tooltip-absolute" id="arrow_face" />
  </div>
</Popover>

<style global>
  div.tooltip-container {
    --tooltip-bg-color: rgba(14, 20, 24, 0.8);
    background-color: var(--tooltip-bg-color);
    cursor: default;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 0.375rem;
    z-index: 99;
  }

  div.tooltip-container-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  div.tooltip-gap-2 {
    gap: 0.5rem;
  }

  div.tooltip-container-text {
    color: white;
    text-align: left;
    font-weight: 400;
  }
  div.tooltip-whitespace-nowrap {
    white-space: nowrap;
  }

  .tooltip-container-component {
    z-index: 10;
  }

  div.tooltip-container-buttons {
    gap: 0.5rem;
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  div.tooltip-absolute {
    position: absolute;
  }

  .svelte-easy-popover[data-popper-placement^="top"] > #arrow {
    bottom: 0px;
  }

  .svelte-easy-popover[data-popper-placement^="top"] > #arrow > #arrow_face {
    transform: translateX(-10px);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-top: 10px solid var(--tooltip-bg-color);
  }

  .svelte-easy-popover[data-popper-placement^="bottom"] > #arrow {
    top: -10px;
  }

  .svelte-easy-popover[data-popper-placement^="bottom"] > #arrow > #arrow_face {
    transform: translateX(-10px);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-bottom: 10px solid var(--tooltip-bg-color);
  }

  .svelte-easy-popover[data-popper-placement^="left"] > #arrow {
    right: 0px;
  }

  .svelte-easy-popover[data-popper-placement^="left"] > #arrow > #arrow_face {
    transform: translateY(-10px);
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;

    border-left: 10px solid var(--tooltip-bg-color);
  }

  .svelte-easy-popover[data-popper-placement^="right"] > #arrow {
    left: -9px;
  }

  .svelte-easy-popover[data-popper-placement^="right"] > #arrow > #arrow_face {
    transform: translateY(-10px);
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;

    border-right: 10px solid var(--tooltip-bg-color);
  }
</style>
