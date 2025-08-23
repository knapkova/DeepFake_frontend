<script>
	export let marginRight = '30%';
</script>

<div class="main-content">
	<h1>Klamárium</h1>
	<div class="info">
		<div class="funfact">
			<h3>Vítejte v Klamáriu,</h3>
			<p>
				interaktivní vzdělávací platformě od Zvol si info, kde se učení spojuje se zábavou a
				kritickým myšlením. V Klamáriu najdete hry, které vám pomohou porozumět světu dezinformací,
				manipulace a mediálního chaosu
			</p>
		</div>
		<div class="funfact">
			<p>
				Aktuálně si můžete zahrát MarsGate, příběhovou hru o konspiracích, emocích a ověřování
				faktů.
			</p>
		</div>
	</div>
</div>

<style>
	.main-content {
		background-image: url('/zvolsiinfo_QLogoTransparent.png') !important;
		background-size: cover !important;
		background-repeat: no-repeat !important;
		background-position: center !important;
		align-items: start;
		margin-right: 30%;
		color: black;
		flex: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.funfact {
		border-radius: 10px;
		padding: 20px;
		margin: 10px;
		width: 70%;
		box-shadow: 3px 4px 3px 5px rgba(0, 0, 0, 0.2);
	}

	.funfact p {
		font-size: 0.9rem;
		color: #333;
		font-weight: lighter;
		font-family: 'Courier New', Courier, monospace;
	}

	@media screen and (max-width: 768px) {
		.main-content {
			margin-right: 0;
			padding: 0.75rem;
			background-position: top center;
		}
		
		
		.info {
			flex-direction: column;
			gap: 0.75rem;
		}
		.funfact {
		
		width: 100%;
	}
	}
</style>
