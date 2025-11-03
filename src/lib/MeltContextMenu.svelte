<script lang="ts">
  import { createContextMenu, melt } from "@melt-ui/svelte";
  import { get, writable } from "svelte/store";

  ///////// USER CODE: Business logic of the actual context menu instance /////////////

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

  let menuRender = [
    {
      fn: menuItem,
      descr: item,
      label: "About Melt UI",
      diabled: false,
      hotkey: "⇧⌘N",
    },
    {
      fn: menuItem,
      descr: item,
      label: "Check for Updates...",
      diabled: false,
      hotkey: "⇧U",
    },
    {
      fn: menuSeparator,
      descr: separator,
    },
    {
      fn: menuCheckbox,
      descr: checkboxItem,
      label: "Settings Sync is On",
      diabled: false,
      hotkey: "",
      ischecked: settingsSync
    },
  ];



</script>

{$settingsSync}

{$hideMeltUI}




<span class="trigger" {...$trigger} use:trigger aria-label="Update dimensions">
  Right click me.
</span>

<div class="menu" {...$menu} use:menu>
  {#each menuRender as element}
    {@render element.fn(
      element.descr,
      element.label,
      element.disabled,
      element.hotkey,
      element.ischecked,
    )}
  {/each}
  {@render menuCheckbox(
    checkboxItem,
    "Settings Sync is On",
    false,
    "",
    settingsSync,
  )}

  {@render menuItem(subTriggerA, "Profiles disabled", true, "arrow")}
  {@render menuItem(subTriggerA, "Profiles enabled", false, "arrow")}

  <div class="menu subMenu" {...$subMenuA} use:subMenuA>
    <div {...$radioGroup} use:radioGroup>
      {#each personsArr as person}
        {@render menuRadio(radioItem, person, false, "", isChecked)}
      {/each}
    </div>
  </div>
  <div {...$separator} use:separator class="separator" />

  {@render menuCheckbox(
    checkboxItemA,
    "Hide Melt UI",
    false,
    "⇧⌘N",
    hideMeltUI,
  )}
  {@render menuItem(item, "Show All Components", true, "⇧⌘N")}
  {@render menuItem(item, "Show All Components", false, "⇧⌘N")}
  {@render menuSeparator(separator)}
  {@render menuItem(item, "Quit Melt UI", false, "⌘Q")}
</div>

{#snippet menuSeparator(descriptor)}
  <div {...get(descriptor)} use:descriptor class="separator" />
{/snippet}

{#snippet menuRadio(descriptor, label, isdisabled, hotkey, helper)}
  <div
    class="item"
    {...get(descriptor)({ value: label })}
    use:descriptor
    data-disabled={isdisabled ? "" : undefined}
  >
    <div class="check">
      {#if get(helper)(label) === true}
        [x]
      {:else if get(helper)(label) === false}
        [ ]
      {/if}
    </div>
    {label}
    <div class="rightSlot">{hotkey}</div>
  </div>
{/snippet}

{#snippet menuCheckbox(descriptor, label, isdisabled, hotkey, ischecked )}

  <div
    class="item"
    {...get(descriptor)}
    use:descriptor
    data-disabled={isdisabled ? "" : undefined}
  >
    <div class="check">
      {#if isChecked == true}
        [x]
      {:else}
        [ ]
      {/if}
    </div>
    {label}
    <div class="rightSlot">{hotkey}</div>
  </div>
{/snippet}

{#snippet menuItem(descriptor, label, isdisabled, hotkey)}
  <div
    class="item"
    {...get(descriptor)}
    use:descriptor
    data-disabled={isdisabled ? "" : undefined}
  >
    {label}
    <div class="rightSlot">{hotkey}</div>
  </div>
{/snippet}

<style>
  .menu {
    outline: none;
    display: flex;
    flex-direction: column;

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

  .item:hover:not([data-disabled]) {
    background-color: var(--popover-selection);
    color: var(--foreground);
  }

  .item[data-disabled] {
    cursor: default;
    color: var(--foreground-disabled);
  }

  .trigger {
    display: block;
    width: 100%;
    height: 25%;
    border: 2px dashed white;
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
