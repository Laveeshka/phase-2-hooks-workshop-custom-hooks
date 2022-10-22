import styled from "styled-components";
import React, { useEffect, useState } from "react";

/* ✅ modify this usePokemon custom hook to take in a query as an argument */
export function usePokemon(query) {
  /* ✅ this hook should only return one thing: an object with the pokemon data */
  //EXTRA CREDIT: update the state to be an object with `data`, `status` and `errors` properties
  const [{data, status, errors}, setState] = useState({data: null, status: "idle", errors: null});

  useEffect(() => {
    //update status state to `pending` here as the request has been made and waiting for response
    setState(prevState => ({...prevState, status: "pending"}));
    //modify fetch request to obtain the errors from the API
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then((res) => {
        if(res.ok){
          return res.json();
        }
        else {
          return res.text().then((err) => {
            throw err;
          });
        }
      })
      .then(data => {
        setState(prevState => ({...prevState, data, errors: null, status: "fulfilled"}));
      })
      .catch((err) => {
        setState(prevState => ({...prevState, data: null, errors: [err], status: "rejected"}))
      })
  }, [query]);

  //return object
  return {
    data, status, errors
  };
}

function Pokemon({ query }) {
  /* 
   ✅ move the code from the useState and useEffect hooks into the usePokemon hook
   then, call the usePokemon hook to access the pokemon data in this component
  */
  // const [pokemon, setPokemon] = useState(null);
  // useEffect(() => {
  //   fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
  //     .then(r => r.json())
  //     .then(setPokemon);
  // }, [query]);

  const { data : pokemon, status, errors } = usePokemon(query);

  // 🚫 don't worry about the code below here, you shouldn't have to touch it
  if (status === "idle" || status === "pending") return <h3>Loading...</h3>;

  if (status === "rejected"){
    return (
      <div>
        <h3>There was an error!</h3>
        {errors.map((error, index) => (<p key={index}>{error}</p>))}
      </div>
    )
  }

  return (
    <div>
      <h3>{pokemon.name}</h3>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name + " front sprite"}
      />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("charmander");

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(e.target.search.value);
  }

  return (
    <Wrapper>
      <h1>PokéSearcher</h1>
      <Pokemon query={query} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: papayawhip;
  text-align: center;

  h1 {
    background: #ef5350;
    color: white;
    display: block;
    margin: 0;
    padding: 1rem;
    color: white;
    font-size: 2rem;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
  }
`;
