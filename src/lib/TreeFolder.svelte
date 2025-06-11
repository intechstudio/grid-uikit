<script lang="ts">
  import { contextTarget } from "./context-target";
  import {
    type AbstractFolderData,
    type AbstractTreeNode,
    TreeItemType,
  } from "./TreeNode.svelte";
  import { get } from "svelte/store";

  type ContextMenuOptions = any;

  export let item: AbstractTreeNode<any>;
  export let isExpanded: boolean;
  export let ctxOptions: ContextMenuOptions;

  let data: AbstractFolderData;
  $: data = $item.data as AbstractFolderData;
</script>

<div class="header" use:contextTarget={ctxOptions}>
  <div class="title">
    {`${data.title} (${
      $item.children.filter((e) => get(e).type !== TreeItemType.FOLDER).length
    })`}
  </div>
  <svg
    width="14"
    height="11"
    class:collapsed={!isExpanded}
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
