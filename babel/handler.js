
import fetch from 'node-fetch';

export async function pokedex (event, context) {

  try {
    const url = `https://pokeapi.co/api/v2/pokemon/1`;

    const result = await fetch(url).then(r => r.json());

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }
  catch (err) {
    console.error(err);
    throw err;
  }
}
