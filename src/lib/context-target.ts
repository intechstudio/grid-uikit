import type { Action } from "svelte/action";
import ContextMenu, { type ContextMenuItem } from "./ContextMenu.svelte";
import { get, writable, type Writable } from "svelte/store";

interface ContextMenuOptions {
  items: ContextMenuItem[];
  data: any;
}

interface ContextMenuWritable extends Writable<ContextMenu | null> {
  close: () => void;
}

export let contextMenu: ContextMenuWritable = createContextMenuStore();

function createContextMenuStore(): ContextMenuWritable {
  const store: Writable<ContextMenu | null> = writable(null);

  const close = () => {
    const cm = get(store);
    if (cm) {
      cm.$destroy(); // Ensure that the context menu has a $destroy method
      store.set(null);
    }
  };

  return {
    ...store,
    close,
  };
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
    contextMenu.close();

    contextMenu.set(
      new ContextMenu({
        target: node,
        props: {
          target: node,
          items: options.items,
          coord: { x: x, y: y },
        },
      }),
    );
  };

  node.addEventListener("mouseup", (event) => handleMouseUp(event));

  return {
    destroy() {
      node.removeEventListener("mouseup", handleMouseUp);
      // Clean up the current context menu if the node is destroyed
      contextMenu.close();
    },
  };
};
