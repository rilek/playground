import { cache } from "react";

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

type FetchPokemon = (id: string) => Promise<Pokemon>;
type FetchPokemons = () => Promise<Pokemon[]>;

export const fetchPokemon: FetchPokemon = cache(async (id) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  return data;
});

export const fetchPokemons: FetchPokemons = cache(async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`);
  const data = await response.json();

  return await Promise.all<Pokemon[]>(
    data.results.map(
      async ({ url }) => await fetch(url).then((response) => response.json())
    )
  );
});

export function stringifyObjects(k: string, v: unknown) {
  return k && v && typeof v !== "number"
    ? Array.isArray(v)
      ? "[object Array]"
      : "" + v
    : v;
}
