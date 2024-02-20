import React, { useState, useEffect } from 'react';
//import Navbar from './components/Navbar';
//import Card from './components/Card';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { getPokemon, getAllPokemon } from './services/pokemon';
import './App.css';



function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialUrl = 'https://pokeapi.co/api/v2/pokemon'

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialUrl);
      //console.log(response);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      let pokemon = await loadingPokemon(response.results);
      console.log(pokemon);
      setLoading(false);
    }
    fetchData();
  }, []);

  const next = async () =>{
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadingPokemon(data.results)
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }
  const prev = async () =>{
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadingPokemon(data.results)
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  }

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon.url);
      return pokemonRecord;
    }));

    setPokemonData(_pokemonData);
  };


  

  return (
    <>
      <div>
        {loading ? <h1 style={{ textAlign: 'center' }}>Loading...</h1> : (
          <>

            <div className="d-grid gap-2 col-2 mx-auto">
              <button className='btn btn-outline-info' onClick={prev}>Prev</button>
              <button className='btn btn-outline-info' onClick={next}>Next</button>
            </div>
            <div className="container">
              <div className='row justify-content-center m-3'>
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />
              })}
              </div>
            
            </div>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
          </>
        )}
      </div>
    </>
  );

}

function Card({ pokemon }) {
  return (
      <div className="Card card">
          <div className="Card_img card-img-top">
              <img src={pokemon.sprites.front_default} className="card-img-top" alt="" />
          </div>
          <div className="Card_name card-title">
              {pokemon.name}
          </div>
          <div className="Card_types">
              {
                  pokemon.types.map(type => {
                      return (
                          <div className="Card_type">
                              {type.type.name}
                          </div>
                      )
                  })
              }
          </div>
          <div className="Card_info">
              <div className="Card_data Card_data_weight">
                  <p className="title">Weight</p>
                  <p>{pokemon.weight}</p>
              </div>
              <div className="Card_data Card_data_height">
                  <p className="title">Height</p>
                  <p>{pokemon.height}</p>
              </div>
              <div className="Card_data Card_data_ability">
                  <p className="title">Ability</p>
                  <p>{pokemon.abilities[0].ability.name}</p>
              </div>
          </div>
      </div>
  );
}

function Navbar() {
  return (
      <div className="Navbar">
          Pokemon API
      </div>
  );
}

export default App;
