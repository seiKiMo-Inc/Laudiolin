<script>
    import { Styles } from "sveltestrap";
    import { Progress } from "sveltestrap";
    import { invoke } from "@tauri-apps/api/tauri";
    import Controls from "components/Controls.svelte";
    import Navbar from "components/Navbar.svelte";
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
    main {
        @apply p-5 text-lg;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
</style>
