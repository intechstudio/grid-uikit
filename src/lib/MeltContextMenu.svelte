<script lang="ts">
  import { createContextMenu, melt } from "@melt-ui/svelte";
  import { writable } from "svelte/store";

  const settingsSync = writable(true);
  const hideMeltUI = writable(false);

  const {
    elements: { trigger, menu, item, separator },
    builders: { createSubmenu, createMenuRadioGroup, createCheckboxItem },
  } = createContextMenu();

  const {
    elements: { subMenu: subMenuA, subTrigger: subTriggerA },
  } = createSubmenu();

  const {
    elements: { radioGroup, radioItem },
    helpers: { isChecked },
  } = createMenuRadioGroup({
    defaultValue: "Hunter Johnston",
  });

  const {
    elements: { checkboxItem },
  } = createCheckboxItem({
    checked: settingsSync,
  });

  const {
    elements: { checkboxItem: checkboxItemA },
  } = createCheckboxItem({
    checked: hideMeltUI,
  });

  const personsArr = [
    "Hunter Johnston",
    "Thomas G. Lopes",
    "Adrian Gonz",
    "Franck Poingt",
  ];
</script>

<span class="trigger" {...$trigger} use:trigger aria-label="Update dimensions">
  Right click me.
</span>

<div class="menu" {...$menu} use:menu>
  <div class="item" {...$item} use:item>About Melt UI</div>
  <div class="item" {...$item} use:item>Check for Updates...</div>
  <div class="separator" {...$separator} use:separator />
  <div class="item" {...$checkboxItem} use:checkboxItem>
    <div class="check">
      {#if $settingsSync}
        [x]
      {/if}
    </div>
    Settings Sync is On
  </div>
  <div class="item" {...$subTriggerA} use:subTriggerA>
    Profiles
    <div class="rightSlot">-></div>
  </div>
  <div class="menu subMenu" {...$subMenuA} use:subMenuA>
    <div {...$radioGroup} use:radioGroup>
      {#each personsArr as person}
        <div class="item" {...$radioItem({ value: person })} use:radioItem>
          <div class="check">
            {#if $isChecked(person)}
              [Tick]
            {/if}
          </div>
          {person}
        </div>
      {/each}
    </div>
  </div>
  <div {...$separator} use:separator class="separator" />

  <div class="item" {...$checkboxItemA} use:checkboxItemA>
    <div class="check">
      {#if $hideMeltUI}
        [x]
      {:else}
        [ ]
      {/if}
    </div>
    Hide Melt UI
    <div class="rightSlot">⌘H</div>
  </div>
  <div class="item" {...$item} use:item data-disabled>
    Show All Components
    <div class="rightSlot">⇧⌘N</div>
  </div>
  <div {...$separator} use:separator class="separator" />
  <div class="item" {...$item} use:item>
    Quit Melt UI
    <div class="rightSlot">⌘Q</div>
  </div>
</div>

<style>
  .menu {
    outline: none;
    display: flex;
    flex-direction: column;

    max-height: 300px;
    min-width: 220px;

    z-index: 10;
    background-color: var(--popover-background);
    color: var(--foreground-muted);
    border: 1px solid var(--foreground-muted);
    border-radius: 0.25rem;
  }

  @media screen and (min-width: 1024px) {
    .menu {
      max-height: none;
    }
  }

  .subMenu {
    min-width: 220px;
  }

  .item {
    outline: none;
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 20;
  }

  .item:hover {
    background-color: var(--popover-selection);
    color: var(--foreground);
  }

  .item[data-disabled] {
    color: var(--foreground-disabled);
  }

  .trigger {
    display: block;
    width: 300px;
    padding: 3rem 0;

    border-color: rgb(var(--color-neutral-50) / 1);
    border-width: 2px;
    border-style: dashed;
    border-radius: 0.375rem;

    text-align: center;
  }

  .separator {
    display: block;
    padding-bottom: 1px;
    width: 100%;
    background-color: var(--foreground-disabled);
  }

  .rightSlot {
    margin-left: auto;
    padding-left: 1.25rem;
  }
</style>
