import { Inter } from 'next/font/google'
import client from '@/utils/apollo-client'
import { gql } from "@apollo/client";
import { FC } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { pokemonType } from '@/utils/types';
import PokemonHome from '@/components/PokemonHome';

const inter = Inter({ subsets: ['latin'] })

interface PokemonProps{
  pokemonData: pokemonType[],
  pageNumber: number,

}

const Pokemon : FC<PokemonProps> = ({pokemonData, pageNumber}) => {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <h1>Loading</h1>
    )
  }
  return (
    <PokemonHome pokemonData={pokemonData} pageNumber={pageNumber} />
  )
}

export default Pokemon;

export const getStaticPaths : GetStaticPaths = async () => {
  return {
    paths : [
      {
        params : {pageNo: "1"}
      },
      {
        params : {pageNo: "2"}
      },
      {
        params : {pageNo: "3"}
      }
    ],
    fallback : true
  }
  
}

export const getStaticProps : GetStaticProps = async ({params}) => {
  let dataUpperLimit = 20;
  if(params?.pageNo && typeof params.pageNo === "string") {
    dataUpperLimit = 20 * parseInt(params.pageNo);
  }
  const { data } = await client.query({
    query: gql`
    {
      pokemons(first: ${dataUpperLimit}){
        id
        number
        name
        weight{
          minimum
          maximum
        }
        height{
          minimum
          maximum
        }
        classification
        types
        resistant
        weaknesses
        fleeRate
        maxCP
        maxHP
        image
      }
    }
    `,
  });


  const {pokemons} = data;
  const pokemonData = pokemons.slice((Math.ceil(pokemons.length/20) -1 ) * 20, pokemons.length)

  return {
    props: {
      pokemonData: pokemonData,
      pageNumber: params?.pageNo && typeof params.pageNo === "string" ? parseInt(params.pageNo) : 1,
    },
 };
}