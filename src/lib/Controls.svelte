<script lang="ts">
    export let showControls = true;
    export let playing = false;

    export function togglePlaying() {
        playing = !playing;
        console.log("how are you?");
    }
</script>

<div style="display: {showControls ? 'unset' : 'none'}" class="controls">
    <span
        style="display: table;
        margin: 0 auto;
        padding: 10px"
    >
        <button
            class="previous control-button"
            on:click={() => {
                console.log("previous");
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                ><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /><path d="M0 0h24v24H0z" fill="none" /></svg
            >
        </button>
        <button class="play control-button" on:click={togglePlaying}>
            {#if playing}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    ><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /><path
                        d="M0 0h24v24H0z"
                        fill="none"
                    /></svg
                >
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                ><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /><path
                    d="M0 0h24v24H0z"
                    fill="none"
                /></svg
            >
        </button>
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
        @apply w-20;
        fill: white;
    }
</style>
