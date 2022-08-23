<script>
  import {
    Form,
    Tile,
    TextInput,
    Button,
    SkeletonText,
    Modal,
  } from "carbon-components-svelte";
  import { browser } from "$app/env";
  import MealCard from "../components/MealCard.svelte";
  let mealsData = browser && JSON.parse(localStorage.getItem("meals"));
  let loadingState = false;
  let open = false;
  let mealString = "";
  let invalid = false;
  let invalidMealInputString = "Enter a meal!";
  const avg = (arr) => {
    const sum = arr.reduce((acc, cur) => acc + cur);
    const average = sum / arr.length;
    return average;
  };
  async function onSubmit(event) {
    event.preventDefault();
    if (event.target[0].value.length === 0) {
      invalid = true;
      return;
    }
    const res = await fetch("/api/getInfo", {
      method: "POST",
      body: JSON.stringify({
        query: event.target[0].value,
      }),
    });
    const data = await res.json();
    if (!data.itemExists) {
      invalidMealInputString =
        "The meal you have entered does not exist in our database!";
      invalid = true;
      return;
    }
    let existingMeals = JSON.parse(localStorage.getItem("meals"));
    const newMeal = {
      time: Date.now().toString(),
      mealName: event.target[0].value,
      calories: data.calories,
    };
    existingMeals ? existingMeals.push(newMeal) : (existingMeals = [newMeal]);
    localStorage.setItem("meals", JSON.stringify(existingMeals));
    mealsData = JSON.parse(localStorage.getItem("meals"));
    loadingState = false;
    mealString = "";
    invalid = false;
  }
  async function generateNewMeal() {
    const storedMeals = browser && JSON.parse(localStorage.getItem("meals"));
    if (!storedMeals || storedMeals.length === 0)
      mealString = "Enter a meal to generate a new one!";
    let caloriesArray = [];
    storedMeals.forEach((storedMeal) => {
      caloriesArray.push(storedMeal.calories);
    });
    const calorieAverage = avg(caloriesArray);
    const res = await fetch("/api/generateMeal", {
      method: "POST",
      body: JSON.stringify({
        maxCalories: calorieAverage,
        minCalories: calorieAverage - 20,
      }),
    });
    const generatedRecipe = await res.json();
    mealString = `We have generated a meal based on your current food intake! The meal's name is ${generatedRecipe.title}! It has ${generatedRecipe.calories} calories, ${generatedRecipe.carbs} of carbs, ${generatedRecipe.protein} of protein and ${generatedRecipe.fat} of fat.`;
  }
</script>

<svelte:head>
  <title>The Calorie Tracker</title>
</svelte:head>

<body>
  <Modal
    bind:open
    modalHeading="Your Generated Meal!"
    primaryButtonText="Ok!"
    secondaryButtonText="Cancel!"
    on:click:button--secondary={() => (open = false)}
    on:click:button--primary={() => (open = false)}
  >
    <p>{mealString}</p>
  </Modal>
  <h1 class="font-bold m-4">The Calorie Tracker</h1>
  <Tile class="mx-8 mt-4">
    <h2 class="mx-4 mb-4">Enter a new meal!</h2>
    <Form class="mx-4" on:submit={onSubmit}>
      <TextInput
        labelText="Name of meal*"
        placeholder="Enter the name of the meal"
        {invalid}
        invalidText={invalidMealInputString}
      />
      <br class="my-2" />
      <div align="right">
        <Button class="rounded-lg" type="submit">Submit</Button>
      </div>
    </Form>
  </Tile>
  <Tile class="mx-8 mt-4">
    <h2 class="mx-4 mb-4">Previous Meals:</h2>
    {#if mealsData}
      {#each mealsData as meal}
        <MealCard
          mealName={meal.mealName}
          time={new Date(parseInt(meal.time)).toLocaleString()}
          calories={meal.calories}
        />
      {/each}
    {:else if !mealsData && loadingState}
      <br class="my-2" />
      <SkeletonText />
    {:else}
      <h4>There aren't any meals registered!</h4>
    {/if}
  </Tile>
  <Tile class="mx-8 mt-4">
    <div align="center">
      <Button
        on:click={() => {
          generateNewMeal();
          open = true;
        }}>Generate a new meal!</Button
      >
    </div>
  </Tile>
</body>
