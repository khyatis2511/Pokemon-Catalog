/* eslint-disable @next/next/no-img-element */
import { pokemonType } from "@/utils/types";
import { FC } from "react";
import style from './PokemonList.module.css'

interface PokemonListProps {
  pokemonData: pokemonType[],
}

const PokemonList : FC<PokemonListProps> = ({pokemonData}) => {
  return (
  <div className={style.box}>
    {pokemonData instanceof Array && pokemonData.map((pokemon : pokemonType) => (
      <div key={pokemon.number} className={style.boxCon}>
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
      </div>
    ))}
  </div>
  )
}

export default PokemonList;