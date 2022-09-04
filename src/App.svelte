<script>
    import Controls from "./lib/Controls.svelte";
</script>

<main>
    <div class="center">
    <Controls />
</main>

<style>
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>