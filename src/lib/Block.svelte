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
    flex-direction: column;
    row-gap: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin: 0.5rem;
  }

  .transparent-block {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-width: 0px;
    margin: 0rem;
  }
</style>
