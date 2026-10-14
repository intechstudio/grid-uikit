import type { Action } from "svelte/action";
import MoltenTooltip from "./MoltenTooltip.svelte";
import { mount, unmount } from "svelte";

export const tooltip: Action<HTMLElement, any> = (
  node: HTMLElement,
  options: any,
): any => {
  if (typeof options === "undefined") {
    return;
  }

  const sibling = document.createElement("div");
  node.parentNode?.insertBefore(sibling, node.nextSibling);

  let instance: Record<string, any> | undefined;
  let mountTimeout: ReturnType<typeof setTimeout> | undefined;

  const mountTooltip = (opts: any) => {
    opts.referenceElement = node;
    instance = mount(MoltenTooltip, { target: sibling, props: opts });
  };

  mountTimeout = setTimeout(() => mountTooltip(options));

  return {
    // `options` has no identity stable enough to update MoltenTooltip's props
    // in place, so a param change (e.g. a different tooltipExtendedText for
    // a newly selected row) remounts it fresh instead of leaving the old
    // mount showing stale text/handlers indefinitely.
    update(newOptions: any) {
      clearTimeout(mountTimeout);
      if (instance) {
        unmount(instance);
        instance = undefined;
      }
      mountTooltip(newOptions);
    },
    destroy() {
      clearTimeout(mountTimeout);
      if (instance) {
        unmount(instance);
      }
      sibling.remove();
    },
  };
};
