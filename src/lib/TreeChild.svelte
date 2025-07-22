<script lang="ts" context="module">
  export interface FolderSlotProps {
    level: number;
    item: AbstractTreeNode<any>;
    expanded: boolean;
  }
  export interface ItemSlotProps {
    level: number;
    item: AbstractTreeNode<any>;
    expanded: boolean;
    itemProps: any;
    itemFunction: any;
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
  class:folder={$child.type === TreeItemType.FOLDER}
  class:item={$child.type === TreeItemType.ITEM}
>
  {#if $child.type === TreeItemType.FOLDER}
    <div {...$item({ id: $child.id, hasChildren: true })} use:item>
      <slot
        name="folder"
        {level}
        item={child}
        expanded={$isExpanded($child.id)}
      />
    </div>
  {:else if $child.type === TreeItemType.ITEM}
    <slot
      name="item"
      {level}
      item={child}
      expanded={$isExpanded($child.id)}
      itemProps={$item({ id: $child.id, hasChildren: true })}
      itemFunction={item}
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
