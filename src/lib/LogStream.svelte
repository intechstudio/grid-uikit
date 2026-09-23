<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import LogMessage from "./LogMessage.svelte";
  import { logStreamStore as defaultLogStreamStore } from "./logStream";
  import type { LogStream } from "./logStream";

  const dispatch = createEventDispatcher();

  export let store: LogStream = defaultLogStreamStore;
  export let bottom: string = "5rem";

  function handleClick(index: number) {
    store.dismissLog({ index });
  }

  function handleMouseEnter() {
    store.enableTimeout(false);
  }

  function handleMouseLeave() {
    store.enableTimeout(true);
  }

  function handleCreation() {
    dispatch("content-change", { count: $store.length });
  }

  function handleDestroy() {
    store.enableTimeout(true);
    dispatch("content-change", { count: $store.length });
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="log-stream" style="bottom: {bottom};">
  {#each $store as log, i (log)}
    <div
      class="log-stream-item"
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
      in:fly|global={{ x: -10, delay: 100 + 400 * i, duration: 500 }}
      out:fly|global={{ x: 10, delay: 400 * i, duration: 500 }}
    >
      <LogMessage
        count={log.count}
        type={log.data.type}
        text={log.data.message}
        on:destroy={handleDestroy}
        on:creation={handleCreation}
        on:click={() => handleClick(i)}
      />
    </div>
  {/each}
</div>

<style>
  .log-stream {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    pointer-events: none;
  }

  .log-stream-item {
    pointer-events: auto;
  }
</style>
