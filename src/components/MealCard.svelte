<script>
  import { Tile } from "carbon-components-svelte";
  export let mealName, time, calories;
</script>

<Tile class="mx-8 mt-4">
  <div class="bg-[#32a852] m-0 p-0 rounded-lg">
    <h4 class="p-4">{mealName} at {time} which had {calories} calories</h4>
  </div>
</Tile>
