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
    padding: 1rem;
    border-width: 1px;
  }
  .transparent-block {
    padding-left: 0rem;
    padding-right: 0rem;
  }
</style>
