<script lang="ts" context="module">
  export interface ProfileCloudCardData {
    type: string;
    name: string;
    syncStatus: "synced" | "local" | "cloud";
  }
</script>

<script lang="ts">
  import {
    type AbstractItemData,
    type AbstractTreeNode,
  } from "./TreeNode.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let selected: boolean;
  export let compatible: boolean;
  export let expanded: boolean;
  export let item: AbstractTreeNode<WithProfileCloudData>;
  export let itemProps: any;
  export let itemFunction: any;

  type WithProfileCloudData<T = unknown> = T & ProfileCloudCardData;

  let data: ProfileCloudCardData;
  $: data = ($item.data as AbstractItemData<WithProfileCloudData>).item;

  function handleDragStart(e: DragEvent) {
    dispatch("drag-start");
  }

  function handleDragEnd(e: DragEvent) {
    dispatch("drag-end");
  }

  function handleClick(e: MouseEvent) {
    dispatch("click");
  }
</script>

<button
  id={$item.id}
  class="{selected ? 'border-selected' : 'border-unselected'} button"
  draggable="true"
  on:click={handleClick}
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
>
  <div class="status-indicator">
    <div
      class={data.syncStatus === "cloud" || data.syncStatus === "synced"
        ? "status-cloud"
        : "status-inactive"}
    />
    <div
      class={data.syncStatus === "local" || data.syncStatus === "synced"
        ? "status-local"
        : "status-inactive"}
    />
  </div>
  <div class="button-content">
    <span class="button-label" class:label-incompatible={compatible}>
      <slot name="button-label">
        {data.name}
      </slot>
    </span>
    <div
      class="type-label
        {compatible ? 'type-compatible' : 'type-incompatible'}"
    >
      <slot name="type-label">{data.type}</slot>
    </div>
    {#if $item.children.length > 0}
      <div class="trigger-container" use:itemFunction {...itemProps}>
        <svg
          width="14"
          height="11"
          class:collapsed={!expanded}
          viewBox="0 0 14 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.99968 11L0.9375 0.5L13.0619 0.500001L6.99968 11Z"
            fill="#D9D9D9"
          />
        </svg>
      </div>
    {/if}
  </div>
</button>

<style>
  .button {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    border-width: 1px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    background-color: #2a3439;
    height: 33px;
    padding: 0;
  }

  .border-selected {
    border-color: #10b981;
  }

  .border-unselected {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .status-indicator {
    width: 0.25rem;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(2, 1fr);
  }

  .status-cloud {
    background-color: #6ee7b7;
    width: 100%;
    height: 100%;
  }

  .status-local {
    background-color: #10b981;
    width: 100%;
    height: 100%;
  }

  .status-inactive {
    background-color: rgba(16, 185, 129, 0.1);
    width: 100%;
    height: 100%;
  }

  .button-content {
    padding-left: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.25rem;
    width: 100%;
    align-items: center;
  }

  .button-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    color: white;
  }

  .label-incompatible {
    opacity: 0.75;
  }

  .type-label {
    color: white;
    font-size: inherit;
    padding: 0.125rem 0.5rem;
    border-width: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type-compatible {
    opacity: 1;
    border-color: rgba(255, 255, 255, 0.1);
    background-color: rgba(255, 255, 255, 0.1);
  }

  .type-incompatible {
    opacity: 0.75;
    border-color: transparent;
    text-decoration: line-through;
  }

  .trigger-container {
    margin-right: 0.5rem;
  }

  .collapsed {
    transform: rotate(-90deg);
  }
</style>
