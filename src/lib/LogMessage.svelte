<script lang="ts">
  import { LogMessageType } from "./LogMessageType";
  import { createEventDispatcher, onMount } from "svelte";
  import { onDestroy } from "svelte";

  const dispatch = createEventDispatcher();

  export let type: LogMessageType = LogMessageType.NORMAL;
  export let count: number = 1;
  export let text: string = "";

  const iconMap: Record<LogMessageType, string | undefined> = {
    [LogMessageType.NORMAL]: undefined,
    [LogMessageType.SUCCESS]: "✔️",
    [LogMessageType.ALERT]: "⚠️",
    [LogMessageType.PROGRESS]: "⏳",
    [LogMessageType.FAIL]: "❌",
  };

  function handleClick() {
    dispatch("click");
  }

  onDestroy(() => {
    dispatch("destroy");
  });

  onMount(() => {
    dispatch("creation");
  });
</script>

<button on:click={handleClick} class="notification">
  {#if count > 1}
    <div class="notification-count">{count}x</div>
  {/if}

  <div class="notification-card">
    {#if iconMap[type]}
      <div class="notification-icon">{iconMap[type]}</div>
    {/if}

    <div class="notification-content">
      <span class="notification-message">{text}</span>
      <span class="notification-subtext">(Click to Dismiss!)</span>
    </div>
  </div>
</button>

<style>
  .notification {
    position: relative;
    display: flex;
    align-items: center;
    width: 30rem;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .notification-count {
    position: absolute;
    left: -3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2rem;
    border-radius: var(--radius-full);
    background: var(--background-muted);
    border: 1px solid var(--background-soft);
    font-size: 0.875rem;
  }

  .notification-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    margin: 0.25rem 0;
    border: solid 1px var(--border);
    border-radius: var(--radius-medium);
    background: var(--popover-background);
  }

  .notification-card:hover {
    background: var(--popover-selection);
  }

  .notification-icon {
    padding: 0.5rem;
    border-radius: var(--radius-medium);
    background: var(--background-muted);
  }

  .notification-content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .notification-message {
    font-size: 1rem;
  }

  .notification-subtext {
    font-size: 0.875rem;
    color: var(--foreground-soft);
  }
</style>
