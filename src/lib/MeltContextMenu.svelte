<script lang="ts">
  import { createContextMenu, melt } from "@melt-ui/svelte";
  import { get, writable } from "svelte/store";

  ///////// USER CODE: Business logic of the actual context menu instance /////////////

  const settingsSync = writable(true);
  const hideMeltUI = writable(false);

  let settingsSyncState = $state($settingsSync);
  settingsSync.subscribe((s) => {
    console.log(s);
    settingsSyncState = s;
  });

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
      fields: {
        label: "About Melt UI",
        diabled: false,
        hotkey: "⇧⌘N",
      },
    },
    {
      fn: menuItem,
      descr: item,
      fields: {
        label: "Check for Updates...",
        diabled: true,
        hotkey: "⇧U",
      },
    },
    {
      fn: menuSeparator,
      descr: separator,
    },
    {
      fn: menuCheckbox,
      descr: checkboxItem,
      fields: {
        label: "Settings Sync is On",
        disabled: false,
        hotkey: "ABC",
        ischecked: () => settingsSyncState,
      },
    },
    {
      fn: menuItem,
      descr: subTriggerA,
      fields: {
        label: "Select profile",
        diabled: false,
        hotkey: "⇧P",
      },
    },
    {
      fn: menuSeparator,
      descr: separator,
    },
    {
      fn: menuSubmenu,
      fields: {
        subtree: [
          {
            fn: menuCheckbox,
            descr: checkboxItem,
            fields: {
              label: "Settings Sync is On",
              disabled: false,
              hotkey: "ABC",
              ischecked: () => settingsSyncState,
            },
          },
        ],
      },
      descr: subMenuA,
    },
  ];

  let menuMain = {
    fn: menuSubmenu,
    descr: menu,
    subtree: menuRender,
  };

  let menuRef1 = () => {
    return $menu;
  };
  let menuRef2 = () => menu;
</script>





<span class="trigger" {...$trigger} use:trigger aria-label="Update dimensions">
  Right click me.
</span>

{@render menuMenu(()=> {return $menu}, () => menu, {subtree: menuRender})}



<!--
  <div class="menu subMenu" {...$subMenuA} use:subMenuA>
    <div {...$radioGroup} use:radioGroup>
      {#each personsArr as person}
         {@render menuRadio(radioItem, person, false, "", isChecked)} 
      {/each}
    </div>
  </div>
  <div {...$separator} use:separator class="separator" />
  -->


{#snippet content(arr)}
  {#each arr as element, i}
    {@render element.fn(element.descr, element.fields)}
  {/each}
{/snippet}

{#snippet menuSubmenu(descriptor, fields)}
  <div class="menu" {...$subMenuA} use:descriptor>
    hello1
    {@render content(fields.subtree)}
  </div>
{/snippet}

{#snippet menuMenu(descriptor1, descriptor2, fields)}
  <div class="menu" {...menuRef1()} use:descriptor2()>
    hello
    {@render content(fields.subtree)}
  </div>
{/snippet}

{#snippet menuSeparator(descriptor)}
  <div {...get(descriptor)} use:descriptor class="separator" />
{/snippet}

{#snippet menuRadio(descriptor, fields)}
  <div
    class="item"
    {...get(descriptor)({ value: fields.label })}
    use:descriptor
    data-disabled={fields.isdisabled ? "" : undefined}
  >
    <div class="check">
      {#if get(fields.helper)(fields.label) === true}
        [x]
      {:else if get(fields.helper)(fields.label) === false}
        [ ]
      {/if}
    </div>
    {label}
    <div class="rightSlot">{fields.hotkey}</div>
  </div>
{/snippet}

{#snippet menuCheckbox(descriptor, fields)}
  <div
    class="item"
    {...get(descriptor)}
    use:descriptor
    data-disabled={fields.isdisabled ? "" : undefined}
  >
    <div class="check">
      {#if fields.ischecked() == true}
        [x]
      {:else}
        [ ]
      {/if}
    </div>
    {fields.label}
    <div class="rightSlot">{fields.hotkey}</div>
  </div>
{/snippet}

{#snippet menuItem(descriptor, fields)}
  <div
    class="item"
    {...get(descriptor)}
    use:descriptor
    data-disabled={fields.isdisabled ? "" : undefined}
  >
    {fields.label}
    <div class="rightSlot">{fields.hotkey}</div>
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
