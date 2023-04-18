/* eslint-disable @next/next/no-img-element */
import client from "@/utils/apollo-client";
import { pokemonType } from "@/utils/types";
import { gql } from "@apollo/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { ParsedUrlQuery } from "querystring";
import PokemonList from "@/View/PokemonList";
import style from "./PokemonDetails.module.css";

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
    <h1 className="heading">Pokemon Details</h1>
    <div className={style.detailsDiv}>
      <img 
        src={pokemon.image} 
        alt={pokemon.name} 
        title={pokemon.name} 
      />
      <div className={style.content}>
        <h2>{pokemon.name}</h2>
        <p><b>Height : </b> {pokemon.height.minimum}-{pokemon.height.maximum}</p>
        <p><b>Weight : </b> {pokemon.weight.minimum}-{pokemon.weight.maximum}</p>
        <p><b>Classification : </b> {pokemon.classification}</p>
        <div className={style.typeData}>
          <h3>Type</h3>
          <ul>
          {pokemon.types.map((type) => (
            <li key={type} className="btn">{type}</li>
          ))}
          </ul>
        </div>
        <div className={style.typeData}>
          <h3>Resistant</h3>
          <ul>
          {pokemon.resistant.map((resistant1) => (
            <li key={resistant1} className="btn">{resistant1}</li>
          ))}
          </ul>
        </div>
        <div className={style.typeData}>
          <h3>Weaknesses</h3>
          <ul>
          {pokemon.weaknesses.map((weakness) => (
            <li key={weakness} className="btn">{weakness}</li>
          ))}
          </ul>
        </div>
        <button 
          className={`btn ${style.evlBtn}`}
          type="button"
          onClick={getPokemanEvolutions}
        >
          Pokemon evolutions
        </button>
      </div>
    </div>
    {showPopup && <div className={style.evlPopup}>
      <div className={style.modelDiv}>
      <button type="button" className={style.closeBtn} onClick={() => setShowPopup(false)}>X</button>
      {evloutionData && evloutionData.length !== 0 ? 
        <PokemonList pokemonData={evloutionData} setShowPopup={setShowPopup} /> : 
        <p>Data not found.</p>
      }
      </div>
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