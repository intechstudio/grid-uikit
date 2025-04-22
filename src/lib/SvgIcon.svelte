<script lang="ts">
  import iconMap from "./icons";

  export let iconPath: string = "";
  export let width: number = 15;
  export let height: number = 15;
  export let fill: string | undefined = undefined;
</script>

<svg style:fill style:width={`${width}px`} style:height={`${height}px`}>
  <g>
    {#if iconMap[iconPath]}
      {@html iconMap[iconPath]}
    {:else}
      <text x="10" y="20">Icon not found: {iconPath}</text>
    {/if}
  </g>
</svg>
