<script lang="ts">
  import { type TreeView } from "@melt-ui/svelte";
  import { getContext } from "svelte";

  interface TreeNodeData<T> {
    id: string;
    children: TreeNodeData<T>[];
    items: T[];
  }

  export let treeItems: TreeNodeData<any>[] = [];
  export let level = 0;
  export let toggleMainLevels = true;

  const {
    elements: { item, group },
    helpers: { isExpanded },
    states: { expanded },
  } = getContext<TreeView>("tree");

  function toggleExpand(id: string, level: number, value: boolean) {
    if (!toggleMainLevels) {
      return;
    }

    if (level === 0 && value) {
      expanded.set([id]);
    }
  }
</script>

{#each treeItems as child}
  <button
    type="button"
    {...$item({ id: child.id, hasChildren: true })}
    use:item
    on:click={() => toggleExpand(child.id, level, $isExpanded(child.id))}
    class="flex items-center w-full"
  >
    <slot name="folder" {level} {child} isExpanded={$isExpanded(child.id)} />
  </button>

  {#if $isExpanded(child.id)}
    <div
      class="flex flex-col"
      class:max-h-full={level === 0}
      class:overflow-y-scroll={level === 0}
      class:pr-1={level === 0}
    >
      {#if child.children && child.children.length > 0}
        <div {...$group({ id: child.id })} use:group class="pl-4">
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
