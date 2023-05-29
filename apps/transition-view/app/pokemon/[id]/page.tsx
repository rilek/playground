import Link from "../../../src/components/Link";
import { fetchPokemon, stringifyObjects } from "../../utils";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: PageProps) {
  const item = await fetchPokemon(id);

  if (!item) return <>Not Found</>;

  const {
    name,
    sprites: { front_default: imageUrl },
  } = item;

  return (
    <div className="container mx-auto mt-24">
      <Link goBack href={"/"} className="text-sky-800 hover:bg-sky-100 h-fit">
        Go back
      </Link>

      <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div>
          <div className="banner-img">
            <img src={imageUrl} className={`w-full aspect-square`} alt="" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">{name}</h1>
          <div className="max-w-full overflow-hidden">
            <code>
              <pre>{JSON.stringify(item, stringifyObjects, 2)}</pre>
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
