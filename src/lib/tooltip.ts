import type { Action } from "svelte/action";
import MoltenTooltip from "./MoltenTooltip.svelte";
import { mount } from "svelte";

export const tooltip: Action<HTMLElement, any> = (
  node: HTMLElement,
  options: any,
): any => {
  if (typeof options === "undefined") {
    return;
  }

  const sibling = document.createElement("div");
  node.parentNode?.insertBefore(sibling, node.nextSibling);

  options.referenceElement = node;

  setTimeout(() => {
    mount(MoltenTooltip, { target: sibling, props: options });
  });

  return {
    destroy() {
      sibling.remove();
    },
  };
};
