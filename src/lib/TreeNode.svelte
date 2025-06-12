<script context="module" lang="ts">
  import {
    writable,
    type Writable,
    type Subscriber,
    type Unsubscriber,
    type Updater,
    type Readable,
    get,
  } from "svelte/store";
  import { type TreeView } from "@melt-ui/svelte";

  export enum TreeItemType {
    FOLDER = "folder",
    ITEM = "item",
  }

  type UUID = string;

  export interface AbstractFolderData {
    title: string;
  }

  export interface AbstractItemData<T> {
    item: T;
  }

  export interface AbstractTreeNodeData<T> {
    readonly id: UUID;
    parent: AbstractTreeNode<T> | undefined;
    children: AbstractTreeNode<T>[];
    readonly type: TreeItemType;
    data: AbstractFolderData | AbstractItemData<T>;
  }

  export abstract class AbstractTreeNode<T>
    implements Readable<AbstractTreeNodeData<T>>
  {
    protected internal: Writable<AbstractTreeNodeData<T>>;

    constructor(
      parent: AbstractTreeNode<T> | undefined,
      id: UUID,
      type: TreeItemType,
      data: AbstractFolderData | AbstractItemData<T>,
    ) {
      this.internal = writable({
        id,
        parent,
        type,
        data,
        children: [],
      });
    }

    public find(
      callback: (e: AbstractTreeNode<T>) => boolean,
    ): AbstractTreeNode<T> | undefined {
      const { children } = get(this.internal);
      const found = children.find(callback);
      if (typeof found !== "undefined") {
        return found;
      }

      for (const child of children) {
        const found = child.find(callback);
        if (typeof found !== "undefined") {
          return found;
        }
      }
      return undefined;
    }

    public subscribe(
      run: Subscriber<AbstractTreeNodeData<T>>,
      invalidate?: (value?: AbstractTreeNodeData<T>) => void,
    ): Unsubscriber {
      return this.internal.subscribe(run, invalidate);
    }

    public set(value: AbstractTreeNodeData<T>) {
      this.internal.set(value);
    }

    public update(updater: Updater<AbstractTreeNodeData<T>>) {
      this.internal.update(updater);
    }

    public addChild(...children: AbstractTreeNode<T>[]) {
      this.update((s) => {
        for (const child of children) {
          child.update((s) => Object({ ...s, parent: this }));
          s.children.push(child);
        }

        return s;
      });
    }

    public findChild(uuid: UUID): AbstractTreeNode<T> | undefined {
      const { children } = get(this.internal);
      for (const child of children) {
        const { id, children } = get(child);
        if (id === uuid) {
          return child;
        }

        if (children.length > 0 && get(child).type === TreeItemType.FOLDER) {
          const found = child.findChild(uuid);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    }
  }
</script>

<script lang="ts">
  import { getContext } from "svelte";
  import TreeChild, {
    type FolderSlotProps,
    type ItemSlotProps,
  } from "./TreeChild.svelte";

  interface $$Slots {
    folder: FolderSlotProps;
    item: ItemSlotProps;
  }

  const {
    elements: { group },
    helpers: { isExpanded },
  } = getContext<TreeView>("tree");

  export let node: AbstractTreeNode<any>;
  export let level: number;
  export let rootElement: HTMLElement;
  export let rootHeight: number;

  const listItems: HTMLLIElement[] = [];

  function setMaxHeight(value: number, items: HTMLLIElement[]) {
    const index = get(node).children.findIndex((e) => !$isExpanded(get(e).id));

    const closedHeight = items[index]?.clientHeight ?? 0;

    const maxHeight = Math.max(value - closedHeight * (items.length - 1), 100);
    const next = `${maxHeight}px`;

    for (const node of items) {
      if (node.style.maxHeight !== next) {
        node.style.maxHeight = next;
      }
    }
  }

  $: {
    const items = Array.from(listItems.values());
    if (items.length > 0 && level === 0) {
      setMaxHeight(rootHeight, items);
    }
  }
</script>

{#each $node.children as child, i}
  <li id={get(child).id} bind:this={listItems[i]}>
    <TreeChild {child} {level}>
      <svelte:fragment slot="folder" let:level let:item let:expanded>
        <slot name="folder" {level} {item} {expanded} />
      </svelte:fragment>

      <svelte:fragment slot="item" let:item let:level let:expanded>
        <slot name="item" {level} {item} {expanded} />
      </svelte:fragment>
    </TreeChild>

    {#if $isExpanded(get(child).id)}
      <ul
        {...$group({ id: get(child).id })}
        use:group
        class="subtree"
        class:root-subtree={level === 0}
      >
        <svelte:self
          node={child}
          level={level + 1}
          {parent}
          {rootElement}
          {rootHeight}
        >
          <svelte:fragment slot="folder" let:level let:item let:expanded>
            <slot name="folder" {level} {item} {expanded} />
          </svelte:fragment>

          <svelte:fragment slot="item" let:level let:item let:expanded>
            <slot name="item" {level} {item} {expanded} />
          </svelte:fragment>
        </svelte:self>
      </ul>
    {/if}
  </li>
{/each}

<style>
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  li {
    all: unset;
    display: flex;
    flex-direction: column;
  }

  .subtree {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .root-subtree {
    overflow-y: scroll;
    padding-right: 4px;
  }
</style>
