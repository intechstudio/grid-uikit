<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import Popover from "svelte-easy-popover";
  import { onDestroy, onMount } from "svelte";
  import MoltenPushButton from "./MoltenPushButton.svelte";

  let {
    text = "",
    placement = "top",
    duration = 250,
    delay = 750,
    instant = false,
    nowrap = false,
    buttons = [] as any[],
    triggerEvents = ["hover"],
    referenceElement,
    component = undefined,
    class: className = "",
  } = $props();

  let showbuttons = $state(false);
  let showTooltip = $state(false);
  let tooltipKey = $state(0);

  let tooltipElement: HTMLDivElement | undefined = $state();
  let previousFocusedElement: HTMLElement | null = null;
  let closeTimeout: any;
  let openTimeout: any;
  let isRestoringFocus = false;

  function handleClick(e: any) {
    //handleReferenceElementClick(e);
    //e.stopPropagation();
  }

  function handleMouseEnter(e: any) {
    handleReferenceElementMouseEnter(e);
    //e.stopPropagation();
  }

  function handleMouseLeave(e: any) {
    handleReferenceElementMouseLeave(e);
    //e.stopPropagation();
  }

  function handleReferenceElementClick(e: any) {
    if (triggerEvents.includes("click")) {
      showTooltip = true;
      if (buttons.length > 0) {
        showbuttons = true;
      }
    }
    if (triggerEvents.includes("show-buttons")) {
      clearTimeout(openTimeout);
      tooltipKey++;
      showTooltip = true;
      if (buttons.length > 0) {
        showbuttons = true;
      }
    }
    if (triggerEvents.includes("hover") && !showbuttons) {
      showTooltip = false;
    }
    //e.stopPropagation();
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
    //e.stopPropagation();
  }

  function handleReferenceElementMouseLeave(e: any) {
    if (triggerEvents.includes("hover") && !showbuttons) {
      clearTimeout(openTimeout);
      closeTimeout = setTimeout(
        () => {
          close();
        },
        instant ? 0 : 100,
      );
    }
    if (triggerEvents.includes("click")) {
      closeTimeout = setTimeout(() => {
        close();
      }, 100);
    }
    //e.stopPropagation();
  }

  function handleReferenceElementFocus(e: any) {
    if (triggerEvents.includes("focus")) {
      if (isRestoringFocus) return;
      clearTimeout(closeTimeout);
      showTooltip = true;
    }
    //e.stopPropagation();
  }

  function handleReferenceElementBlur(e: FocusEvent) {
    if (triggerEvents.includes("focus")) {
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && tooltipElement?.contains(relatedTarget)) {
        return;
      }
      closeTimeout = setTimeout(() => {
        close();
      }, 100);
    }
    //e.stopPropagation();
  }

  function handleDocumentKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && (showbuttons || showTooltip)) {
      const active = document.activeElement;
      if (
        active === referenceElement ||
        active === tooltipElement ||
        tooltipElement?.contains(active) ||
        referenceElement.contains(active)
      ) {
        e.stopImmediatePropagation();
        close();
      }
    }
  }

  function handleDocumentMouseDown(e: MouseEvent) {
    if (!showbuttons && !showTooltip) return;
    const target = e.target as Node;
    const popover = document.querySelector(".svelte-easy-popover");
    if (
      popover &&
      !popover.contains(target) &&
      !referenceElement.contains(target)
    ) {
      close();
    }
  }

  $effect(() => {
    if (tooltipElement) {
      previousFocusedElement = document.activeElement as HTMLElement | null;
      tooltipElement.focus();
      const handleFocusOut = (e: FocusEvent) => {
        const relatedTarget = e.relatedTarget as Node | null;
        if (relatedTarget && tooltipElement?.contains(relatedTarget)) {
          return;
        }
        close();
      };
      tooltipElement.addEventListener("focusout", handleFocusOut);
      return () => {
        tooltipElement?.removeEventListener("focusout", handleFocusOut);
      };
    }
  });

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
    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);
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
    document.removeEventListener("mousedown", handleDocumentMouseDown);
    document.removeEventListener("keydown", handleDocumentKeyDown);
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
    //e.stopPropagation();
  }

  function forwardEvent(e: any) {
    const { type, data } = e.detail;
    referenceElement?.dispatchEvent(
      new CustomEvent(type, {
        detail: data,
      }),
    );
  }

  function close(restoreFocus = true) {
    clearTimeout(openTimeout);
    clearTimeout(closeTimeout);
    showTooltip = false;
    showbuttons = false;
    if (restoreFocus && previousFocusedElement) {
      isRestoringFocus = true;
      previousFocusedElement.focus();
      previousFocusedElement = null;
      requestAnimationFrame(() => {
        isRestoringFocus = false;
      });
    }
  }
</script>

{#key tooltipKey}
  <Popover
    isOpen={showTooltip}
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
      bind:this={tooltipElement}
      tabindex="-1"
      class="{className} tooltip-container"
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
{/key}

<style global>
  div.tooltip-container {
    background-color: var(--popover-background);
    cursor: default;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 0.375rem;
    z-index: 99;
    padding: 0.25rem;
    outline: 1px dashed transparent;
  }
  div.tooltip-container:focus {
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
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
    color: var(--foreground-muted);
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
