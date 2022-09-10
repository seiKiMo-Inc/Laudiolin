<script lang="ts">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

  export let icon: IconDefinition;
  export let onClick: () => void;
  export let children: string;
  export let style: string;
  export let id: string;
  export let className: string;
  export let tooltip: string;
</script>

<button class={className} data-tooltip={tooltip} {id} on:click={onClick} {style}>
  {#if icon}
    <FontAwesomeIcon
      icon={icon}
      style={children ? { marginRight: "5px", fill: "inherit" } : {}}
    />
  {/if}
  {children}
</button>
