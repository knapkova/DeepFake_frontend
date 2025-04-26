<script lang="ts">
    /**
     * Represents one slice of the emotion wheel.
     */
    interface EmotionSlice {
      label: string;
      color: string;
      startAngle: number;  // in degrees
      endAngle: number;    // in degrees
      selected: boolean;
    }
  
    // Example data: You can expand, change angles, colors, or add more slices.
    let emotions: EmotionSlice[] = [
      { label: "Positivity", color: "#4FC3F7", startAngle: 0,   endAngle: 40,  selected: false },
      { label: "Anger",      color: "#F44336", startAngle: 40,  endAngle: 80,  selected: false },
      { label: "Fear",       color: "#FF9800", startAngle: 80,  endAngle: 120, selected: false },
      { label: "Sadness",    color: "#2196F3", startAngle: 120, endAngle: 160, selected: false },
      { label: "Surprise",   color: "#9C27B0", startAngle: 160, endAngle: 200, selected: false },
      { label: "Trust",      color: "#4CAF50", startAngle: 200, endAngle: 240, selected: false },
      { label: "Joy",        color: "#FFEB3B", startAngle: 240, endAngle: 280, selected: false },
      { label: "Anticipation", color: "#FFC107", startAngle: 280, endAngle: 320, selected: false },
      { label: "Disgust",    color: "#795548", startAngle: 320, endAngle: 360, selected: false },
    ];
  
    // Center and radius of the wheel
    let cx = 200;
    let cy = 200;
    let radius = 150;
  
    /**
     * Toggles the selected state of a segment by index.
     */
    function toggleSegment(index: number) {
      emotions[index].selected = !emotions[index].selected;
      // Reassign to trigger reactivity in Svelte
      emotions = [...emotions];
    }
  
    /**
     * Creates an arc path from (startAngle) to (endAngle).
     */
    function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
      // Convert degrees to radians
      const rad = Math.PI / 180;
  
      // Calculate start and end points
      const x1 = cx + r * Math.cos(startAngle * rad);
      const y1 = cy + r * Math.sin(startAngle * rad);
      const x2 = cx + r * Math.cos(endAngle * rad);
      const y2 = cy + r * Math.sin(endAngle * rad);
  
      // Determine if the arc is larger than 180 degrees
      const largeArcFlag = (endAngle - startAngle) <= 180 ? 0 : 1;
  
      // Draw a "pie-slice" path:
      // 1) Move to center (M cx, cy)
      // 2) Line to arc start (L x1, y1)
      // 3) Arc to arc end (A r r 0 largeArcFlag 1 x2, y2)
      // 4) Close path (Z)
      return `M ${cx} ${cy}
              L ${x1} ${y1}
              A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z`;
    }
  </script>
  
  <!-- SVG Container -->
  <svg width="400" height="400">
    {#each emotions as emotion, i}
      <path
        d={arcPath(cx, cy, radius, emotion.startAngle, emotion.endAngle)}
        fill={emotion.selected ? "#000" : emotion.color} 
        stroke="#fff"
        stroke-width="2"
        on:click={() => toggleSegment(i)}
        style="cursor: pointer;"
      />
      <!-- Optionally, place text near the arc's midpoint -->
      {#if emotion.selected}
        <!-- Example: show text in the center of the wheel for selected segments,
             or you can place it along the arc. This is a basic approach. -->
        <text
          x={cx} y={cy + (i * 15) - 100} 
          fill="#333"
          text-anchor="middle"
          font-size="14"
        >
          {emotion.label}
        </text>
      {/if}
    {/each}
  </svg>
  
  <style>
    /* Simple styling - adjust as needed */
    svg {
      background: #fafafa;
      display: block;
      margin: 0 auto;
    }
  </style>
  