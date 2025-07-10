<script lang="ts">
  import { contextTarget, type ContextMenuOptions } from "./context-target";
  import {
    type AbstractFolderData,
    type AbstractTreeNode,
    TreeItemType,
  } from "./TreeNode.svelte";
  import { get } from "svelte/store";

  export let item: AbstractTreeNode<any>;
  export let expanded: boolean;
  export let ctxOptions: ContextMenuOptions = { items: [] };

  let data: AbstractFolderData;
  $: data = $item.data as AbstractFolderData;
</script>

<div class="header" use:contextTarget={ctxOptions}>
  <div class="title">
    <slot name="title-label">
      {`${data.title} (${
        $item.children.filter((e) => get(e).type !== TreeItemType.FOLDER).length
      })`}</slot
    >
  </div>
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

<style>
  .header {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 0.25rem;
    height: 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }

  .title {
    flex-grow: 1;
    text-align: left;
    color: rgba(255, 255, 255, 0.8);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .collapsed {
    transform: rotate(-90deg);
  }
</style>
