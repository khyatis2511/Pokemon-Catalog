/* eslint-disable @next/next/no-img-element */
import client from "@/utils/apollo-client";
import { pokemonType } from "@/utils/types";
import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { ParsedUrlQuery } from "querystring";
import PokemonList from "@/View/PokemonList";

interface Params extends ParsedUrlQuery {
  slug: string;
}

interface PokemonDetailsProps {
  pokemon: pokemonType,
}

const PokemonDetails : FC<PokemonDetailsProps> = ({pokemon}) => {
  console.log('pokemon data : ', pokemon)

  const [evloutionData, setEvloutionData] = useState<pokemonType[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  
  const getPokemanEvolutions = async () => {
    const {id, name} = pokemon

    console.log(id, name);
    const fragment = gql `
      fragment RecursivePokemonFragment on Pokemon {
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
    `
    const { data } = await client.query({
      query: gql`
      query pokemon {
        pokemon(id: "${id}", name: "${name}"){
          id
          name
          evolutions{
            id
            number
            name
            classification
            types
            resistant
            weaknesses
            fleeRate
            maxCP
            evolutions{
              ...RecursivePokemonFragment
            }
            maxHP
            image
          }
        }
      }
      ${fragment}
      `,
    });
    setEvloutionData(data.pokemon.evolutions);
    setShowPopup(true);
    // console.log('evloution dta:', data);
  }

  console.log(evloutionData);

  if (router.isFallback) {
    return (
      <h1>Loading</h1>
    )
  }

  if(!pokemon || Object.keys(pokemon).length === 0) {
    return (
      <h1>Data not found </h1>
    )
  }
  
  return (
    <>
    <div>
      <img 
        src={pokemon.image} 
        alt={pokemon.name} 
        title={pokemon.name} 
      />
      <div>
        <h3>{pokemon.name}</h3>
        <p>maximum height : {pokemon.height.maximum}</p>
        <p>maximum weight : {pokemon.weight.maximum}</p>
        <p>Classification : {pokemon.classification}</p>
        <div>
          <h2>Type</h2>
          {pokemon.types.map((type) => (
            <p key={type}>{type}</p>
          ))}
        </div>
        <div>
          <h2>Resistant</h2>
          {pokemon.resistant.map((resistant1) => (
            <p key={resistant1}>{resistant1}</p>
          ))}
        </div>
        <div>
          <h2>Weaknesses</h2>
          {pokemon.weaknesses.map((weakness) => (
            <p key={weakness}>{weakness}</p>
          ))}
        </div>
        <button 
          type="button"
          onClick={getPokemanEvolutions}
        >
          Pokemon evolutions
        </button>
      </div>
    </div>
    {showPopup && <div>
      <button type="button" onClick={() => setShowPopup(false)}>Close</button>
      {evloutionData.length !== 0 ? 
        <PokemonList pokemonData={evloutionData} /> : 
        <p>Data not found.</p>
      }
    </div>}
    </>
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
  let pokemonData;
  try {
    const {index} = params as Params;
    if(index) {
      id = index[0]
      name = index[1]
    }
    if(id && name) {
      const { data } = await client.query({
        query: gql`
        {
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

  const { pokemon } = pokemonData;
  
  return {
    props: {
      pokemon: pokemon || null,
    },
  };
}