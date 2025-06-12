<script lang="ts">
  import { onMount } from "svelte";
  import { TreeItemType, type AbstractItemData } from "../lib";
  import ProfileCloudTreeItem, {
    type ProfileCloudCardData,
  } from "../lib/ProfileCloudTreeItem.svelte";
  import Tree from "../lib/Tree.svelte";
  import TreeFolder from "../lib/TreeFolder.svelte";
  import { TreeNodeImpl } from "./Tree";
  import { get } from "svelte/store";

  let root: TreeNodeImpl;
  let selected: string | undefined = undefined;
  let mounted = false;

  onMount(() => {
    root = buildTree();
    mounted = true;
  });

  function buildTree() {
    const root = new TreeNodeImpl(undefined, "root", TreeItemType.FOLDER, {
      title: "Root",
    });
    for (const i of [1, 2, 3]) {
      const title = `Main Folder ${i}`;
      const mainNode = new TreeNodeImpl(
        undefined,
        `${get(root).id}/${title}`,
        TreeItemType.FOLDER,
        {
          title: title,
        },
      );

      mainNode.addChild(
        ...[1, 2, 3].map(
          (i) =>
            new TreeNodeImpl(
              mainNode,
              `${get(root).id}/Generic Item ${i}`,
              TreeItemType.ITEM,
              {
                item: {
                  type: "type",
                  name: `Generic Item ${i}`,
                  syncStatus: ["synced", "local", "cloud"].at(i - 1),
                } as ProfileCloudCardData,
              },
            ),
        ),
      );

      if (i === 1) {
        const title = `Special Folder`;
        const specialNode = new TreeNodeImpl(
          mainNode,
          `${get(mainNode).id}/${title}`,
          TreeItemType.FOLDER,
          {
            title: title,
          },
        );
        specialNode.addChild(
          ...Array(15)
            .values()
            .map(
              (i) =>
                new TreeNodeImpl(
                  specialNode,
                  `${get(specialNode).id}/Special Item ${i}`,
                  TreeItemType.ITEM,
                  {
                    item: {
                      type: "type",
                      name: `Special Item ${i}`,
                      syncStatus: ["synced", "local", "cloud"].at(i - 1),
                    } as ProfileCloudCardData,
                  },
                ),
            ),
        );
        mainNode.addChild(specialNode);
      }
      root.addChild(mainNode);
    }
    return root;
  }

  function isCompatible() {
    return Math.floor(Math.random() * 100) % 2 === 0;
  }
</script>

{#if mounted}
  <Tree bind:root>
    <svelte:fragment slot="folder" let:item let:expanded let:level>
      <TreeFolder {item} {expanded} />
    </svelte:fragment>

    <svelte:fragment slot="item" let:item let:level let:expanded>
      <ProfileCloudTreeItem
        {item}
        compatible={isCompatible()}
        selected={get(item).id === selected}
        {expanded}
      />
    </svelte:fragment>
  </Tree>
{/if}
