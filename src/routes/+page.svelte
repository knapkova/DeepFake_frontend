<script>
	import MainContent from '$components/MainContent.svelte';
	import VideoSection from '$components/VideoSection.svelte';
	import '../global.css';
</script>

<div class="container">
	<MainContent marginRight="30%" />
    <VideoSection/>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		height: 100vh;
		background-color: var(--background-color);
	}

	@media screen and (max-width: 768px) {
    .container {
      flex-direction: column;
      height: auto;
      padding: 1rem;
    }
    /* give a little gap between the two sections */
    .container > :global(*) + :global(*) {
      margin-top: 1rem;
    }
  }
</style>
