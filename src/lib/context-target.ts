import type { Action } from "svelte/action";
import ContextMenu, { type ContextMenuItem } from "./ContextMenu.svelte";
import { get, writable, type Writable } from "svelte/store";

export interface ContextMenuOptions {
  items: ContextMenuItem[];
}

interface ContextMenuWritable extends Writable<ContextMenu | undefined> {
  close: () => void;
}

export let contextMenu: ContextMenuWritable = createContextMenuStore();

function createContextMenuStore(): ContextMenuWritable {
  const store: Writable<ContextMenu | undefined> = writable(undefined);

  const close = () => {
    const cm = get(store);
    if (cm) {
      cm.$destroy(); // Ensure that the context menu has a $destroy method
      store.set(undefined);
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
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    if (options.items.length > 0) {
      createContextMenu(e.clientX, e.clientY);
    }
  };

  const createContextMenu = async (x: number, y: number) => {
    // If a context menu is already open, destroy it
    contextMenu.close();

    contextMenu.set(
      new ContextMenu({
        target: document.body,
        props: {
          target: node,
          items: options.items,
          coord: { x: x, y: y },
        },
      }),
    );
  };

  node.addEventListener("contextmenu", (event) => handleContextMenu(event));

  return {
    destroy() {
      node.removeEventListener("contextmenu", handleContextMenu);
      // Clean up the current context menu if the node is destroyed
      contextMenu.close();
    },
  };
};
