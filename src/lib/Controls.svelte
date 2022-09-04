<script>
    import { onMount } from "svelte";
    let paused = true;
    const buttonEvent = () => (paused = !paused);
    onMount(() => {
        document.querySelector(".button").addEventListener("click", function () {
            this.classList.toggle("paused");
        });
    });
</script>

<div>
    <center>
        <div style="padding:10px;max-width:60px;max-height:60px;">
            <button class="button paused" on:click={buttonEvent} />
        </div>
        <div>
            <span class="currentTime">00:00</span> /
            <span class="duration">00:00</span>
        </div>
        <br>
        <input type="range" min="0" max="1" step=".01" value=".5" class="volume" />
    </center>

</div>

<style>
    .button {
        border: 0;
        background: transparent;
        box-sizing: border-box;
        width: 60px;
        height: 60px;
        border-color: transparent transparent transparent #404040;
        transition: 100ms all ease;
        cursor: pointer;
        border-style: solid;
        border-width: 30px 0 30px 60px;
    }
    .button.paused {
        border-style: double;
        width: 60px;
        height: 60px;
        border-width: 0px 0px 0px 60px;
    }
    .volume {
        width: 100px;
        height: 10px;
        background: #404040;
        border-radius: 5px;
        margin: 0 10px;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    .volume::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #404040;
        cursor: pointer;
    }
    .volume::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #404040;
        cursor: pointer;
    }
    .button:hover {
        border-color: transparent transparent transparent #404040;
    }
</style>
