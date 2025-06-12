import {
  AbstractTreeNode,
  TreeItemType,
  type AbstractFolderData,
  type AbstractItemData,
} from "../lib";
import type { ProfileCloudCardData } from "../lib/ProfileCloudTreeItem.svelte";

export class TreeNodeImpl extends AbstractTreeNode<ProfileCloudCardData> {
  public constructor(
    parent: TreeNodeImpl | undefined,
    id: string,
    type: TreeItemType,
    data: AbstractFolderData | AbstractItemData<ProfileCloudCardData>,
  ) {
    super(parent, id, type, data);
  }
}
