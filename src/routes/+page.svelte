<script>
    import MainContent from "../components/MainContent.svelte";
    import VideoSection from "/Users/terezaknapkova/Library/Mobile Documents/com~apple~CloudDocs/Documents/utb/bakalarka/DeepFake_frontend/src/components/VideoSection.svelte"; 
    import "../global.css";
</script>

<div class="container">
    <MainContent />
    <VideoSection />
</div>

<style>
    .container {
        display: flex;
        height: 100vh;
        background-color: var(--background-color);
    }
</style>