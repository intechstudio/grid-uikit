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
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px;
  }
  button:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
</style>
