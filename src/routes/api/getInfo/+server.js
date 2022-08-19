import "dotenv/config";
import axios from "axios";

export async function POST({ request }) {
  const { query } = await request.json();
  const url = `https://api.calorieninjas.com/v1/nutrition?query=${query}`;
  let response = await axios.get(url, {
    headers: {
      "X-Api-Key": process.env.CALORIE_NINJAS_API_KEY,
    },
  });
  if (response.data.items.length === 0) {
    return new Response(
      JSON.stringify({
        itemExists: false,
      })
    );
  }
  return new Response(
    JSON.stringify({
      calories: response.data.items[0].calories,
      data: response.data,
      itemExists: true,
    })
  );
}
