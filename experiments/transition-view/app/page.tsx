import Link from "../src/components/Link";
import { Pokemon, fetchPokemons } from "./utils";

const Card = ({ id, name, sprites: { front_default: imageUrl } }: Pokemon) => {
  return (
    <div className="border w-40 rounded-lg overflow-hidden pb-4" key={id}>
      <div className="">
        <img
          src={imageUrl}
          className={`w-full aspect-square`}
          data-id={`pokemon-id-${id}`}
          alt=""
        />
      </div>
      <div className="mx-6 my-4">
        <h1 className="font-bold mb-2">{name}</h1>
      </div>
      <footer className="mt-2 mx-6">
        <Link
          href={`/pokemon/${id}`}
          className="text-sky-800 hover:bg-sky-100"
          nodeSelector={`[data-id=pokemon-id-${id}]`}
          viewTransitionName="pokemon-img"
        >
          Check out
        </Link>
      </footer>
    </div>
  );
};

export default async function Page() {
  const data = await fetchPokemons();

  if (!data) return <></>;

  return (
    <div className="container mx-auto mt-24">
      <div className="flex flex-wrap gap-4 gallery">
        {data.map((item) => (
          <Card {...item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
