<script lang="ts">
  import { writable } from 'svelte/store';
	import ToggleSwitch from '$lib/toggle_switch.svelte';
	import type { ManipulativeTextComments, AssignmentManipulativeText } from '$types/interfaces';
	
    export 	let comments = writable<ManipulativeTextComments[]>([]);
  

</script>
<div class="card">

			<div class="comments">
				{#each $comments as comment}
				<div class="comment-card">

					<div class="comment-react">
						<button>
							<svg
								fill="none"
								viewBox="0 0 24 24"
								height="16"
								width="16"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="#707277"
									stroke-linecap="round"
									stroke-width="2"
									stroke="#707277"
									d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
								></path>
							</svg>
						</button>
						<hr />
						<span> {Math.floor(Math.random() * 500)}</span>
					</div>

					<div class="comment-container">
						<div class="user">
							<div class="user-pic">
								<svg
									fill="none"
									viewBox="0 0 24 24"
									height="20"
									width="20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linejoin="round"
										fill="#707277"
										stroke-linecap="round"
										stroke-width="2"
										stroke="#707277"
										d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
									></path>
									<path
										stroke-width="2"
										fill="#707277"
										stroke="#707277"
										d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
									></path>
								</svg>
							</div>
							<div class="user-info">
								<span>{comment.username}</span>
								<p>Před {Math.floor(Math.random() * 60)} min </p>
							</div>
						</div>
						<hr class="solid" />
						<div class="comment-content">
							<p class="comment-content">
									{comment.comment}
								</p>							
								
						</div>
					</div>
					    </div>

				{/each}
			</div>
			</div>

<style>
	
	.comment-card {
  display: grid;
  grid-template-columns: 35px 1fr;
  gap: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}
	.comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;   /* vertical space between cards */
  padding: 0;
  margin: 0;
}

  .comment-react {
    width: 35px;
    height: fit-content;
    display: grid;
    grid-template-columns: auto;
    margin: 0;
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  .comment-react button {
    width: 35px;
    height: 35px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    outline: none;
  }

  .comment-react button:after {
    content: '';
    width: 40px;
    height: 40px;
    position: absolute;
    left: -2.5px;
    top: -2.5px;
    background-color: #f5356e;
    border-radius: 50%;
    z-index: 0;
    transform: scale(0);
  }

  .comment-react button svg {
    position: relative;
    z-index: 9;
  }

  .comment-react button:hover:after {
    animation: ripple 0.6s ease-in-out forwards;
  }

  .comment-react button:hover svg {
    fill: #f5356e;
  }

  .comment-react button:hover svg path {
    stroke: #f5356e;
    fill: #f5356e;
  }

  .comment-react hr {
    width: 80%;
    height: 1px;
    background-color: #dfe1e6;
    margin: auto;
    border: 0;
  }

  .comment-react span {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    font-size: 13px;
    font-weight: 600;
    color: #707277;
  }

  .comment-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0;
    margin: 0;
  }

  .comment-container .user {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 10px;
  }

  .comment-container .user .user-pic {
    width: 40px;
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f1f1f1;
    border-radius: 50%;
  }

  .comment-container .user .user-pic:after {
    content: '';
    width: 9px;
    height: 9px;
    position: absolute;
    right: 0px;
    bottom: 0px;
    border-radius: 50%;
    background-color: #0fc45a;
    border: 2px solid #ffffff;
  }

  .comment-container .user .user-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 3px;
  }

  .comment-container .user .user-info span {
    font-weight: 700;
    font-size: 16px;
    color: #47484b;
  }

  .comment-container .user .user-info p {
    font-weight: 600;
    font-size: 10px;
    color: #acaeb4;
  }

  .comment-container .comment-content {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: #5f6064;
  }

  

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }

    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
	
	
</style>
