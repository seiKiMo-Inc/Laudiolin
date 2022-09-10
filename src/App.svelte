<script>
  import { invoke } from "@tauri-apps/api/tauri";
  import Controls from "components/Controls.svelte";

  async function download() {
    // console.log(await invoke("download", {
    //   id: "cWtgGTCAjYY", engine: "YouTube"
    // }));

    console.log(await invoke("greet", {name: "Hello!"}));
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