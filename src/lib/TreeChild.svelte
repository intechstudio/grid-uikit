<script lang="ts" context="module">
  export interface FolderSlotProps {
    level: number;
    item: AbstractTreeNode<any>;
    isExpanded: boolean;
  }
  export interface ItemSlotProps {
    level: number;
    item: AbstractTreeNode<any>;
    isExpanded: boolean;
  }
</script>

<script lang="ts">
  import { type AbstractTreeNode, TreeItemType } from "./TreeNode.svelte";
  import { type TreeView } from "@melt-ui/svelte";
  import { getContext } from "svelte";

  const {
    elements: { item },
    helpers: { isExpanded },
  } = getContext<TreeView>("tree");

  type T = unknown;
  export let child: AbstractTreeNode<T>;
  export let level: number;
</script>

<button
  type="button"
  {...$item({ id: $child.id, hasChildren: $child.children.length > 0 })}
  use:item
  class:folder={$child.type === TreeItemType.FOLDER}
  class:item={$child.type === TreeItemType.ITEM}
>
  {#if $child.type === TreeItemType.FOLDER}
    <slot
      name="folder"
      {level}
      item={child}
      isExpanded={$isExpanded($child.id)}
    />
  {:else if $child.type === TreeItemType.ITEM}
    <slot
      name="item"
      {level}
      item={child}
      isExpanded={$isExpanded($child.id)}
    />
  {/if}
</button>

<style>
  button {
    display: flex;
    align-items: center;
    width: 100%;
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }

  .folder {
    margin-bottom: 2px;
  }

  .item {
    display: flex;
    width: 100%;
    margin-bottom: 4px;
  }
</style>
