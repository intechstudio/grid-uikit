import "./lib/theme.css";
import "./app.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
