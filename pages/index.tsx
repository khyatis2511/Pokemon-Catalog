import { Inter } from 'next/font/google'
import client from '@/utils/apollo-client'
import { FC } from 'react';
import PokemonHome from '@/components/PokemonHome';
import { pokemonType } from '@/utils/types';
import { GetStaticProps } from 'next';
import { pokemonDataQry } from '@/utils/query';

const inter = Inter({ subsets: ['latin'] })
interface HomeProps{
  pokemonData: pokemonType[],

}

const Home : FC<HomeProps> = ({pokemonData}) => {
  return (
    <PokemonHome pokemonData={pokemonData} pageNumber={1} />
  )
}

export default Home;

export const getStaticProps : GetStaticProps = async () => {
  const { data } = await client.query({
    query: pokemonDataQry,
  });

  const {pokemons} = data;

  return {
    props: {
      pokemonData: pokemons,
    },
 };
}