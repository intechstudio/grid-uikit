import type { Action } from "svelte/action";
import ContextMenu, { type ContextMenuItem } from "./ContextMenu.svelte";

interface ContextMenuOptions {
  items: ContextMenuItem[];
  data: any;
}

// Store the currently open context menu instance
let currentContextMenu: ContextMenu | null = null;

export function destroyContextMenu() {
  if (currentContextMenu) {
    currentContextMenu.$destroy();
    currentContextMenu = null;
  }
}

export const contextTarget: Action<HTMLElement, ContextMenuOptions> = (
  node: HTMLElement,
  options: ContextMenuOptions,
): any => {
  const handleMouseUp = (e: MouseEvent) => {
    if (e.button === 2) {
      createContextMenu(e.clientX, e.clientY);
    }
    e.stopPropagation();
  };

  const createContextMenu = async (x: number, y: number) => {
    // If a context menu is already open, destroy it
    destroyContextMenu();

    currentContextMenu = new ContextMenu({
      target: node,
      props: {
        target: node,
        items: options.items,
        coord: { x: x, y: y },
      },
    });
  };

  node.addEventListener("mouseup", (event) => handleMouseUp(event));

  return {
    destroy() {
      node.removeEventListener("mouseup", handleMouseUp);
      // Clean up the current context menu if the node is destroyed
      destroyContextMenu();
    },
  };
};
