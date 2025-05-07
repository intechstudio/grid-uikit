<script lang="ts" context="module">
  export namespace MarkdownContainerTypes {
    export type LinkClickEvent = {
      link: string;
    };
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let markdown: string;
  export let disableLinkAutoOpen: boolean = false;

  function handleLinkClick(event: MouseEvent) {
    if (disableLinkAutoOpen) {
      return;
    }

    const anchor = (event.target as HTMLElement).closest("a");
    if (anchor && anchor instanceof HTMLAnchorElement) {
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("http")) {
        event.preventDefault();
        dispatch("link-click", {
          link: href,
        } as MarkdownContainerTypes.LinkClickEvent);
      }
    }
  }

  function handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      handleLinkClick(event as unknown as MouseEvent); // Trigger click on keyboard event
    }
  }
</script>

<div
  role="button"
  tabindex="0"
  class="markdown-container flex-grow w-full h-full overflow-y-auto"
  on:click={handleLinkClick}
  on:keydown={handleKeyboardEvent}
>
  {@html markdown}
</div>

<style>
  :global(.markdown-editor img) {
    display: inline;
    vertical-align: middle;
    width: auto;
    height: auto;
  }

  :global(.markdown-container p) {
    margin-bottom: 10px;
  }

  :global(.markdown-container h1) {
    font-size: 2em;
    margin: 0.3em 0 0.5em;
  }

  :global(.markdown-container h2) {
    font-size: 1.5em;
    margin: 0.1em 0 0.5em;
  }

  :global(.markdown-container h3) {
    font-size: 1.17em;
    margin: 0.05em 0 0.5em;
  }

  :global(.markdown-container h4) {
    font-size: 1em;
    margin: 0.025 0 0.5em;
  }

  :global(.markdown-container h5) {
    font-size: 0.83em;
    margin: 0.0125em 0 0.5em;
  }

  :global(.markdown-container h6) {
    font-size: 0.67em;
    margin: 0 0 0.5em;
  }

  :global(.markdown-container ul),
  :global(.markdown-container ol) {
    margin: 50 0;
    padding-left: 2em;
  }

  :global(.markdown-container ul) {
    margin: 1em 0;
    padding-left: 2em;
    list-style-type: disc;
  }

  :global(.markdown-container ol) {
    margin: 1em 0;
    padding-left: 2em;
    list-style-type: decimal;
  }

  /* Styling for inline elements */
  :global(.markdown-container strong) {
    font-weight: bold;
  }

  :global(.markdown-container em) {
    font-style: italic;
  }

  :global(.markdown-container code) {
    font-family: monospace;
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }

  :global(.markdown-container pre) {
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
  }

  :global(.markdown-container a) {
    color: #0366d6;
    text-decoration: none;
  }

  :global(.markdown-container a:hover) {
    text-decoration: underline;
  }

  /* Styling for block elements */
  :global(.markdown-container blockquote) {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid #ccc;
  }

  :global(.markdown-container pre) {
    margin: 1em 0;
  }
</style>
