<script>
    import MainContent from "../components/MainContent.svelte";
    import VideoSection from "../components/VideoSection.svelte";
    import "../global.css";
</script>

<div class="container">
        <MainContent marginRight="550px"/>

        <VideoSection />

</div>

<style>
    .container {
        display: flex;
        justify-content: space-between;
        height: 100vh;
        background-color: var(--background-color);
    }

</style>