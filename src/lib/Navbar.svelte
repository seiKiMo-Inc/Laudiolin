<script>
    import { onMount } from "svelte";
    let linksContainer;

    onMount(() => {
        linksContainer = document.querySelector(".linksContainer");
    });

    function toggleDropdown(e) {
        linksContainer.classList.toggle("hidden");
        linksContainer.classList.toggle("lg:visible");
    }
</script>

<nav class="main-nav">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tights title">Laudiolin</span>
    </div>
    <div class="block lg:hidden">
        <button class="button-outline" on:click={toggleDropdown}>
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20"
                ><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg
            >
        </button>
    </div>
    <div class="linksContainer hidden lg:hidden">
        <div class="text-sm">
            <a href="#responsive-header" class="navlink"> Docs </a>
            <a href="#responsive-header" class="navlink"> Examples </a>
            <a href="#responsive-header" class="navlink"> Blog </a>
        </div>
        <div>
            <a href="#" class="button-outline">Download</a>
        </div>
    </div>
</nav>

<style>
    .main-nav {
        @apply flex items-center justify-between flex-wrap backdrop-blur bg-slate-900 p-6;
        @apply bg-gradient-to-r from-slate-900 to-black;
    }
    .navlink {
        @apply block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4;
    }

    .linksContainer {
        @apply w-full flex-grow lg:flex lg:items-center lg:w-auto;
    }

    .title {
        @apply bg-gradient-to-r bg-clip-text text-transparent from-indigo-500 to-purple-500;
        font-family: "GAU_font_cube_R";
    }
</style>
