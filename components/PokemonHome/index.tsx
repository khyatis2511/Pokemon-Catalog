import Pagination from "@/View/Pagination";
import PokemonList from "@/View/PokemonList";
import { pokemonType } from "@/utils/types";
import Head from "next/head";
import { FC } from "react";

interface PokemonHomeProps {
  pokemonData: pokemonType[],
  pageNumber: number,
}

const PokemonHome: FC<PokemonHomeProps> = ({pokemonData, pageNumber}) => {
  return (
    <>
      <Head>
        <title>Pokemon Catalog</title>
        <meta name="description" content="Pokemon Catalog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1 className="heading">Pokemon List</h1>
        <PokemonList pokemonData={pokemonData} />
        <Pagination pageCounter={pageNumber} />
      </div>
    </>
  )
}
export default PokemonHome;