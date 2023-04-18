/* eslint-disable @next/next/no-img-element */
import { pokemonType } from "@/utils/types";
import { FC } from "react";
import style from './PokemonList.module.css'
import Link from "next/link";

interface PokemonListProps {
  pokemonData: pokemonType[],
}

const PokemonList : FC<PokemonListProps> = ({pokemonData}) => {
  return (
  <div className={style.box}>
    {pokemonData instanceof Array && pokemonData.map((pokemon : pokemonType) => (
      <Link href={`/pokemon-details/${pokemon.id}/${pokemon.name}`} key={pokemon.number} className={style.boxCon}>
        <div className={style.content}>
          <img 
            src={pokemon.image}
            alt={pokemon.name}
            title={pokemon.name}
          />
          <div>
            <p>{pokemon.number}</p>
            <h3>{pokemon.name}</h3>
          </div>
        </div>
      </Link>
    ))}
  </div>
  )
}

export default PokemonList;