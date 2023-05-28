export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

type FetchPokemon = (id: string) => Promise<Pokemon>;
type FetchPokemons = () => Promise<Pokemon[]>;

export const fetchPokemon: FetchPokemon = async (id) => {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((response) => {
      return response.json();
    })
    .catch();
  // .then((response) => response.results);

  // console.log("@@@",Object.keys(data));

  return data;
};

export const fetchPokemons: FetchPokemons = async () => {
  return await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`)
    .then((response) => response.json())
    .then((response) =>
      Promise.all<any[]>(
        response.results.map(
          async ({ url }) =>
            await fetch(url).then((response) => response.json())
        )
      )
    );
};

export function stringifyObjects(k: string, v: unknown) {
  return k && v && typeof v !== "number"
    ? Array.isArray(v)
      ? "[object Array]"
      : "" + v
    : v;
}
