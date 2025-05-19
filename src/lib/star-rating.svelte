<script lang="ts">
  // store the selected rating
  export let rating: number = 0;
</script>

<div class="rating" 
     class:red={rating > 3}
     class:yellow={rating == 3}
     class:green={rating < 3}>
  <input bind:group={rating} value="5" name="rating" id="star5" type="radio" />
  <label for="star5"></label>

  <input bind:group={rating} value="4" name="rating" id="star4" type="radio" />
  <label for="star4"></label>

  <input bind:group={rating} value="3" name="rating" id="star3" type="radio" />
  <label for="star3"></label>

  <input bind:group={rating} value="2" name="rating" id="star2" type="radio" />
  <label for="star2"></label>

  <input bind:group={rating} value="1" name="rating" id="star1" type="radio" />
  <label for="star1"></label>
</div>

<style>
  .rating {
    display: inline-block;
  }

  .rating input {
    display: none;
  }

  .rating label {
    float: right;
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
  }

  .rating label:before {
    content: '\2605';
    font-size: 30px;
  }

  /* green when rating ≤ 3 */
  .rating.green input:checked ~ label,
  .rating.green label:hover,
  .rating.green label:hover ~ label {
    color: rgb(222, 52, 61);
  }

  /* red when rating > 3 */
  .rating.red input:checked ~ label,
  .rating.red label:hover,
  .rating.red label:hover ~ label {
    color: rgb(18, 147, 16);
  }

  /* red when rating > 3 */
  .rating.yellow input:checked ~ label,
  .rating.yellow label:hover,
  .rating.yellow label:hover ~ label {
    color: rgb(242, 169, 44);
  }
</style>