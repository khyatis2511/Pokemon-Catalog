import client from "@/utils/apollo-client";
import { pokemonType } from "@/utils/types";
import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FC } from "react";
import { ParsedUrlQuery } from "querystring";

interface Params extends ParsedUrlQuery {
  slug: string;
}

interface PokemonDetailsProps {
  pokemonData: pokemonType[],
}

const PokemonDetails : FC<PokemonDetailsProps> = ({pokemonData}) => {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <h1>Loading</h1>
    )
  }
  return (
    <div>
        <h1>123</h1>
    </div>
  );
}

export default PokemonDetails;

export const getStaticPaths : GetStaticPaths = async () => {
  const { data } = await client.query({
    query: gql`
    {
      pokemons(first: 20){
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

  const paths = pokemons.map((pokemon : pokemonType) => {
    const {id, name} = pokemon
    return {
      params : { index: [id, name] }
    }
  });

  return {
    paths,
    fallback : true
  }
  
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  let id;
  let name;
  let pokemonData = [];
  try {
    const {index} = params as Params;
    if(index) {
      id = index[0]
      name = index[1]
    }
    if(id && name) {
      const { data } = await client.query({
        query: gql`
        query pokemon{
          pokemon(id: "${id}", name: "${name}"){
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
      pokemonData = data
    }
  } catch (error) {
    console.log('error', error);
  }
  
  return {
    props: {
      pokemonData: pokemonData || null,
    },
  };
}