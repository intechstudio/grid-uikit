<script lang="ts">
  export let border: string = "transparent";
</script>

<div
  class:transparent-block={border === "transparent"}
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
</style>
