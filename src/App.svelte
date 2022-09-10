<script>
    import { invoke } from "@tauri-apps/api/tauri";
    import Controls from "components/Controls.svelte";
    import Navbar from "./lib/Navbar.svelte";
    async function download() {
        console.log(
            await invoke("download", {
                id: "cWtgGTCAjYY",
                engine: "YouTube"
            })
        );
    }
</script>

<Navbar />
<main>
    <Controls />
</main>

<style>
    .center {
        height: 1000px;
    }
</style>
