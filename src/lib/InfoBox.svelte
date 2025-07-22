<script lang="ts">
  export let value: string;
</script>

<div class="value-container">
  <span class="value-text">
    {value}
  </span>
</div>

<style>
  .value-container {
    background-color: var(--background);
    padding: 0.25rem;
    margin-top: auto;
    margin-bottom: auto;
    border-radius: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value-text {
    white-space: nowrap;
  }
</style>
