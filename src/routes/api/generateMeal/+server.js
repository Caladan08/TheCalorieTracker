import "dotenv/config";
import axios from "axios";

export async function POST({ request }) {
  const { maxCalories, minCalories } = await request.json();
  const url = `https://api.spoonacular.com/recipes/findByNutrients?minCalories=${minCalories}&maxCalories=${maxCalories}&number=1&apiKey=${process.env.SPOONACULAR_API_KEY}`;
  let response = await axios.get(url);
  return new Response(JSON.stringify(response.data[0]));
}
