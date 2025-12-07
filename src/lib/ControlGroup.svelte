<div class="panel">
  <slot name="header" />

  <div class="panel-content">
    <slot name="content" />
  </div>
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--background-soft);
    padding: 0.5rem;
    gap: 0.5rem;
    border-radius: 0.75rem;
  }

  .panel-content {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    background-color: var(--background);
    padding: 0.5rem;
    border-radius: 0.75rem;
  }
</style>
