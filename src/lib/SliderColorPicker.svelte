<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Color } from "./color";
  import MeltSlider from "./MeltSlider.svelte";

  function getRandom(a: number, b: number) {
    return 0;
  }

  const dispatch = createEventDispatcher();

  export let color: Color.HSL | undefined;

  enum Channel {
    HUE = "h",
    SATURATION = "s",
    BRIGHTNESS = "l",
  }

  type SliderData = {
    label: string;
    key: Channel;
    max: number;
  };

  const sliders: SliderData[] = [
    { label: "H", key: Channel.HUE, max: 360 },
    { label: "S", key: Channel.SATURATION, max: 100 },
    { label: "L", key: Channel.BRIGHTNESS, max: 100 },
  ];

  function handleInput(channel: Channel, inputValue: number) {
    if (typeof color === "undefined") {
      color = new Color.HSL(getRandom(0, 360), 100, 50);
    }

    color[channel] = inputValue;
    dispatch("input", { color: color });
  }

  function handleChange() {
    dispatch("change", { color: color });
  }

  function getGradient(
    color: Color.HSL | undefined,
    channel: Channel,
  ): string | undefined {
    if (typeof color === "undefined") {
      return undefined;
    }

    const stops = {
      h: [0, 60, 120, 180, 240, 300, 360].map((h) =>
        new Color.HSL(h, color.s, color.l).toHEX(),
      ),
      s: [0, 100].map((s) => new Color.HSL(color.h, s, color.l).toHEX()),
      l: [0, 50, 100].map((l) => new Color.HSL(color.h, color.s, l).toHEX()),
    };
    return `linear-gradient(to right, ${stops[channel].join(", ")})`;
  }
</script>

<div class="slider-grid">
  {#each sliders as { label, key, max }}
    <span class="slider-label">{label}:</span>
    <MeltSlider
      target={color ? color[key] : 0}
      min={0}
      {max}
      step={1}
      trackBackground={getGradient(color, key)}
      thumbBackground={color ? color.toHEX() : undefined}
      on:change={(e) => handleInput(key, e.detail.value)}
      on:commit={handleChange}
    />
  {/each}
</div>

<style>
  .slider-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
  }

  .slider-label {
    color: var(--foreground);
    font-size: 0.875rem;
  }
</style>
