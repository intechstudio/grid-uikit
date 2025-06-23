<script lang="ts">
  export let click;
  export let border: string = "#0006";
  export let title: string;
</script>

<button
  on:click={() => {
    if (typeof click === "undefined") {
      return;
    }
    click();
  }}
  style:border-color={border}
>
  {title}
</button>

<style>
  button {
    padding: 0.25rem 2rem;
    border-radius: 0.25rem;
    background-color: var(--background);
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-family: inherit; /* 1 */
    font-feature-settings: inherit; /* 1 */
    font-variation-settings: inherit; /* 1 */
    font-size: 100%; /* 1 */
    font-weight: inherit; /* 1 */
    line-height: inherit; /* 1 */
    letter-spacing: inherit; /* 1 */
    color: var(--foreground-muted);
    margin: 0; /* 2 */
    text-transform: none;
    cursor: pointer;
  }
  button:hover {
    background-color: var(--background-muted);
  }
  button:active {
    background-color: var(--background-soft);
  }
</style>
