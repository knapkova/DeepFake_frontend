<script>
	export let password
	import checkPasswordStrength from 'check-password-strength'
	
	$: strength = checkPasswordStrength.passwordStrength(password)
</script>

<style>
	#color-indicators {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		column-gap: 0.2rem;
	}
	#color-indicators span {
			height: 5px;
	}
	span.valid:nth-child(1) { background-color: red }
	span.valid:nth-child(2) { background-color: orange }
	span.valid:nth-child(3) { background-color: rgb(255, 238, 0) }
	span.valid:nth-child(4) { background-color: green }
	
	li.valid {color: green;}
</style>

<div id="color-indicators">
	<span class:valid={strength.id >= 0}></span>
	<span class:valid={strength.id >= 1}></span>
	<span class:valid={strength.id >= 2}></span>
	<span class:valid={strength.id >= 3}></span>
</div>
{#if strength.id >= 3}
    <p>Silné heslo!</p>
    {console.log(strength.id)}
{:else}
    <p>Zvolte silnější heslo</p>
    <ul>
        <li class:valid={strength.contains.includes("lowercase")}>Malá písmena</li>
        <li class:valid={strength.contains.includes("uppercase")}>Velká písmena</li>
        <li class:valid={strength.contains.includes("number")}>Číslo</li>
        <li class:valid={strength.contains.includes("symbol")}>Symbol</li>
    </ul>
    
{/if}
