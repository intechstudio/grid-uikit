# Grid UI Kit

The UI elements and configurations for projects used by the Grid Ecosystem.

## Developing

When developing this package, the library should be linked using the `npm link` command, which will overwrite the existing folder from node_modules with the locally available package.
To do this, first use the `npm link` command in the folder of the UI kit package.
Next, use the `npm link @intechstudio/grid-uikit` in a project that uses the library.
When finished, use `npm unlink @intechstudio/grid-uikit` to remove the symbolic link and return to using the npmjs package.