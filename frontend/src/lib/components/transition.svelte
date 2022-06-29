<script>
  import { fly } from "svelte/transition";
  export let url;
</script>

{#key url}
  <div in:fly={{ y: -1, duration: 150, delay: 100 }}>
    <slot />
  </div>
{/key}
