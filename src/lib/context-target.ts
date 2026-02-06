import type { Action } from "svelte/action";
import ContextMenu, { type ContextMenuItem } from "./ContextMenu.svelte";
import { mount, unmount } from "svelte";
import { get, writable, type Writable } from "svelte/store";

export interface ContextMenuOptions {
  items: ContextMenuItem[];
}

interface ContextMenuStore extends Writable<Record<string, any> | undefined> {
  close: () => void;
}

function createContextMenuStore(): ContextMenuStore {
  const store: Writable<Record<string, any> | undefined> = writable(undefined);

  const close = () => {
    const cm = get(store);
    if (cm) {
      unmount(cm);
      store.set(undefined);
    }
  };

  return {
    ...store,
    close,
  };
}

export const contextMenu: ContextMenuStore = createContextMenuStore();

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
      mount(ContextMenu, {
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
