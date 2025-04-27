<!-- src/components/ProgressIndicator.svelte -->
<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { writable } from 'svelte/store';
  
    export let progress = writable(100);
  
    // Create a tweened store for animated progress
    const animatedProgress = tweened(0, { duration: 400, easing: cubicOut });
    $: animatedProgress.set($progress * 6757);
  </script>
  
  <div
    class="progress-indicator relative bg-transparent text-white text-base font-medium text-center p-1 leading-none rounded-full"
    role="progressbar"
    aria-valuenow="{$progress}"
    aria-valuemin="0"
    aria-valuemax="100"
    style="width: {$progress}%"
  >
    👥 { $animatedProgress.toFixed(0) }
  </div>