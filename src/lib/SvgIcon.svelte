<script lang="ts">
  import iconMap from "./icons";

  export let iconPath: string = "";
  export let width: number = 1.2;
  export let height: number = 1.2;
  export let fill: string | undefined = undefined;
  export let iconData: string | undefined = undefined;
  export let scale: number = 1;
</script>

<svg
  style:fill
  style:width={`${width}em`}
  style:height={`${height}em`}
  style:transform={`scale(${scale})`}
>
  <g>
    {#if iconData}
      {@html iconData}
    {:else if iconMap[iconPath]}
      {@html iconMap[iconPath]}
    {:else}
      <text x="10" y="20">Icon not found: {iconPath}</text>
    {/if}
  </g>
</svg>
