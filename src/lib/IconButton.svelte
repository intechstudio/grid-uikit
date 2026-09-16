<script lang="ts">
  import SvgIcon from "./SvgIcon.svelte";
  import { tooltip } from "./tooltip";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let iconPath: string = "";
  export let iconData: string | undefined = undefined;
  export let disabled: boolean = false;
  export let compact: boolean = false;
  export let tooltipText: string | undefined = undefined;
  export let onClick: (() => void) | undefined = undefined;
  export let onMouseDown: ((e: MouseEvent) => void) | undefined = undefined;
  export let id: string | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;
  export let stopPropagation: boolean = false;
  export let href: string | undefined = undefined;
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let tooltipDelay: number | undefined = undefined;
  export let tooltipDuration: number | undefined = undefined;
  export let tooltipExtendedText: string | undefined = undefined;
  export let tooltipButtons: any[] | undefined = undefined;
  export let tooltipTriggerEvents: string[] | undefined = undefined;

  // `pressed` shows the squish instantly (no transition) for as long as the
  // button is physically held down. `clicking` takes over on release to ease
  // it back out over the full duration, even if the press was very brief -
  // its 0% keyframe matches `.pressed` exactly so the swap is invisible.
  let pressed = false;
  let clicking = false;

  function restartClickAnimation() {
    if (clicking) {
      // Already mid-animation (rapid repeated clicks): force a restart by
      // clearing the class and re-adding it next frame.
      clicking = false;
      requestAnimationFrame(() => (clicking = true));
    } else {
      clicking = true;
    }
  }

  function handleMouseDown(e: MouseEvent) {
    pressed = true;
    clicking = false;
    onMouseDown?.(e);
  }

  function handleMouseUp() {
    if (pressed) {
      pressed = false;
      restartClickAnimation();
    }
  }

  function handleMouseLeaveInternal(e: MouseEvent) {
    // Dragging off the button while held cancels the press without playing
    // the release animation.
    pressed = false;
    dispatch("mouseleave", e);
  }

  function handleClick(e: MouseEvent) {
    if (stopPropagation) e.stopPropagation();
    if (e.detail === 0) {
      // Keyboard/programmatic activation: no mousedown/mouseup pair fired.
      restartClickAnimation();
    }
    dispatch("click");
    onClick?.();
  }
</script>

<svelte:element
  this={href ? "a" : "button"}
  {id}
  {href}
  target={href ? target : undefined}
  rel={href ? rel : undefined}
  aria-label={ariaLabel}
  on:click={handleClick}
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  on:mouseenter
  on:mouseleave={handleMouseLeaveInternal}
  on:animationend={() => (clicking = false)}
  disabled={href ? undefined : disabled}
  use:tooltip={tooltipText
    ? {
        text: tooltipText,
        extendedText: tooltipExtendedText,
        delay: tooltipDelay,
        duration: tooltipDuration,
        buttons: tooltipButtons,
        triggerEvents:
          tooltipTriggerEvents ?? (tooltipButtons ? ["show-buttons", "hover"] : undefined),
      }
    : undefined}
  class="icon-button"
  class:compact
>
  <div class="icon-button-inner" class:pressed class:clicking>
    <SvgIcon {iconPath} {iconData} fill="var(--foreground)" />
  </div>
</svelte:element>

<style>
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius);
    cursor: pointer;
    pointer-events: auto;
    padding: 0.5rem;
    border: none;
    background-color: transparent;
    color: inherit;
    text-decoration: none;
  }

  .icon-button.compact {
    padding: 0.375rem;
  }

  .icon-button:hover {
    background-color: var(--background-muted);
  }

  .icon-button:focus {
    outline: var(--focus-outline);
    outline-offset: var(--focus-offset);
  }

  .icon-button:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .icon-button:disabled:hover {
    background-color: transparent;
  }

  .icon-button-inner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button-inner.pressed {
    transform: scale(0.8);
    opacity: 0.5;
  }

  .icon-button-inner.clicking {
    animation: click-squish 250ms ease-out;
  }

  @keyframes click-squish {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
