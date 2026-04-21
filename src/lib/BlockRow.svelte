<script lang="ts">
  export let border: string = "transparent";
  export let even: boolean = false;
</script>

<div
  class:transparent-block={border === "transparent"}
  class:even-block={even}
  style:border-color={border}
>
  <slot />
</div>

<style>
  div {
    border-width: 1px;
    display: flex;
    flex-direction: row;
    column-gap: 0.5rem;
    padding: 0.5rem;
    align-items: center;
  }

  .transparent-block {
    padding: 0rem;
    border-width: 0px;
    margin: 0rem;
  }

  .even-block > :global(*) {
    flex: 1;
    min-width: 0;
  }
</style>
