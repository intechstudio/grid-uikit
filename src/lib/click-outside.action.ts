/** Dispatch event on click outside of node */
export function clickOutside(node: Element, { useCapture = false }) {
  const handleClick = (event: MouseEvent) => {
    if (
      node &&
      !node.contains(event.target as Node) &&
      !event.defaultPrevented
    ) {
      node.dispatchEvent(new CustomEvent("click-outside"));
    }
  };

  document.addEventListener("mousedown", handleClick, useCapture);

  return {
    destroy() {
      document.removeEventListener("mousedown", handleClick, useCapture);
    },
  };
}
