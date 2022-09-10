<script lang="ts">
    import { Progress } from "sveltestrap";
    import { Howl } from "howler";

    export let showControls = true;
    export let playing = false;
    export let volume = 100;
    let sound = new Howl({
        src: [
            "https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3"
        ]
    });

    export function togglePlaying() {
        playing = !playing;
        playing ? sound.play() : sound.pause();
    }
</script>

<div style="display: {showControls ? 'unset' : 'none'}" class="controls">
    <span
        style="display: table;
        margin: 0
        auto;
        padding: 10px"
    >
        <button
            class="previous control-button"
            on:click={() => {
                console.log("previous");
            }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24"
                ><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /><path d="M0 0h24v24H0z" fill="none" /></svg
            >
        </button>
        <button class="play control-button" on:click={togglePlaying}>
            {#if playing}
                <svg width="24" height="24" viewBox="0 0 24 24"
                    ><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /><path
                        d="M0 0h24v24H0z"
                        fill="none"
                    /></svg
                >
            {:else}
                <svg width="24" height="24" viewBox="0 0 24 24"
                    ><path d="M8 5v14l11-7z" /><path d="M0 0h24v24H0z" fill="none" /></svg
                >
            {/if}
        </button>
        <button
            class="next control-button"
            on:click={() => {
                console.log("next");
            }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24"
                ><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /><path
                    d="M0 0h24v24H0z"
                    fill="none"
                /></svg
            >
        </button>
        <Progress class="h-2 w-full" value={90} />
    </span>
</div>

<style>
    .controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .control-button svg {
        @apply w-20 transition-all;
        fill: white;
    }
    .control-button svg:hover {
        fill: rgb(177, 177, 177);
    }
</style>
