<script>
 
</script>
 
<ul class="wheel-of-fortune">
    <li><button>$1000</button></li>
    <li><button>$2000</button></li>
    <li><button>$30000</button></li>
    <li><button>$100</button></li>
    <li><button>$4000</button></li>
    <li><button>$9000</button></li>
    <li><button>$8000</button></li>
    <li><button>000</button></li>
    <li><button>$1000</button></li>
    <li><button>$1000</button></li>
    <li><button>$1000</button></li>
    <li><button>$1000</button></li>
   </ul>
 
<style>

:where(.wheel-of-fortune){
--_items: 12;
all: unset;
clip-path: inset(0 0 0 0 round 50%);

 aspect-ratio: 1 / 1;
background: rgba(223, 208, 211, 0.247);
 container-type: inline-size;
direction: ltr;
display: grid;
 place-content: center start;
}

li {
align-content: center;
display: grid;
font-size: 5cqi;
grid-area: 1 /-1;
list-style: none;
padding-left: 1ch;
transform-origin: center right;
width: 20rem;

&:nth-of-type(1){--_idx: 1;}
   &:nth-of-type(2){--_idx: 2;}
   &:nth-of-type(3){--_idx: 3;}
   &:nth-of-type(4){--_idx: 4;}
   &:nth-of-type(5){--_idx: 5;}
   &:nth-of-type(6){--_idx: 6;}
   &:nth-of-type(7){--_idx: 7;}
   &:nth-of-type(8){--_idx: 8;}
   &:nth-of-type(9){--_idx: 9;}
   &:nth-of-type(10){--_idx: 10;}
   &:nth-of-type(11){--_idx: 11;}
   &:nth-of-type(12){--_idx: 12;}

 rotate: calc(360deg / var(--_items)* calc(var(--_idx)- 1));


height: calc((2 * pi * 20rem)/ var(--_items));
clip-path: polygon(0% 0%, 100% 50%, 0% 100%);


}
button{
 clip-path: inset(0 0 0 0 round 50%);
 text-align: start;
  &:nth-of-type(1){--_idx: 1;}
   &:nth-of-type(2){--_idx: 2;}
   &:nth-of-type(3){--_idx: 3;}
   &:nth-of-type(4){--_idx: 4;}
   &:nth-of-type(5){--_idx: 5;}
   &:nth-of-type(6){--_idx: 6;}
   &:nth-of-type(7){--_idx: 7;}
   &:nth-of-type(8){--_idx: 8;}
   &:nth-of-type(9){--_idx: 9;}
   &:nth-of-type(10){--_idx: 10;}
   &:nth-of-type(11){--_idx: 11;}
   &:nth-of-type(12){--_idx: 12;}
   

   background: lightblue;
   padding: 1rem;
 rotate: calc(360deg / var(--_items)* calc(var(--_idx)- 1));

height: calc((2 * pi * 20rem)/ var(--_items));
clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}
button:hover{
 background-color: blueviolet;
 height: calc((2 * pi * 25rem)/ var(--_items));
 padding-left: 100px ;
 margin-left:-10%;
}


</style>