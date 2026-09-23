// Shim for $app/environment (a SvelteKit-only module) so svelte-splitpanes
// resolves outside a SvelteKit app. The demo here is a plain Vite app;
// consumers that aren't SvelteKit apps need an equivalent alias of their own
// (see grid-editor's src/renderer/lib/app-environment-shim.ts).
export const browser = true;
export const building = false;
export const dev = import.meta.env.DEV;
export const version = "";
