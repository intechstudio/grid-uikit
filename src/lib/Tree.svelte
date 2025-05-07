<script lang="ts" context="module">
  export interface TreeNodeData<T> {
    id: string;
    children: TreeNodeData<T>[];
    items: T[];
    expanded: boolean;
  }
</script>

<script lang="ts">
  import { createTreeView } from "@melt-ui/svelte";
  import { createEventDispatcher, onMount } from "svelte";

  export let treeItems: TreeNodeData<any>[] = [];
  export let level = 0;
  export let toggleMainLevels = true;

  const treeView = createTreeView();

  const {
    elements: { item, group },
    states: { expanded },
  } = treeView;

  const dispatch = createEventDispatcher();

  onMount(() => {
    dispatch("tree-view", treeView);
  });

  function toggleExpand(id: string, level: number, value: boolean) {
    if (!toggleMainLevels) {
      return;
    }

    if (level === 0) {
      expanded.set(value ? [id] : []);
    } else {
      expanded.update((s) => {
        return value ? [...s, id] : s.filter((e) => e !== id);
      });
    }
  }
</script>

{#each treeItems as child}
  <button
    type="button"
    {...$item({ id: child.id, hasChildren: true })}
    use:item
    on:click={() => toggleExpand(child.id, level, child.expanded)}
  >
    <slot name="folder" {level} {child} isExpanded={child.expanded} />
  </button>

  {#if child.expanded}
    <div class="subtree" class:root-subtree={level === 0}>
      {#if child.children && child.children.length > 0}
        <div {...$group({ id: child.id })} use:group class="subtree-child">
          <svelte:self treeItems={child.children} level={level + 1}>
            <svelte:fragment slot="folder" let:level let:child let:isExpanded>
              <slot name="folder" {level} {child} {isExpanded} />
            </svelte:fragment>

            <svelte:fragment slot="file" let:item>
              <slot name="file" {item} />
            </svelte:fragment>
          </svelte:self>
        </div>
      {/if}

      {#each child.items as item (item.id)}
        <slot name="file" {item} />
      {/each}
    </div>
  {/if}
{/each}

<style>
  button {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
  div.subtree {
    display: flex;
    flex-direction: column;
  }
  div.root-subtree {
    max-height: 100%;
    overflow-y: scroll;
    padding-right: 0.25rem;
  }
  div.subtree-child {
    padding-left: 1rem;
  }
</style>
