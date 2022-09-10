<script>
  import Controls from "components/Controls.svelte";
  import {invoke} from "@tauri-apps/api/tauri";

  async function download() {
    console.log(await invoke("download", {
      id: "cWtgGTCAjYY", engine: "YouTube"
    }));
  }
</script>

<main>
  <div class="center">
    <Controls />

    <button on:click={download}>Download</button>
  </div>
</main>

<style>
  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>