import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import CardPeople from "../component/cardPeople.jsx";
import CardVehicle from "../component/cardVehicle.jsx";
import CardPlanets from "../component/cardPlanets.jsx";
import UsersPeople from "../component/usersPeople.jsx";
import UsersPlanets from "../component/usersPlanets.jsx";
import UsersVehicles from "../component/usersVehicles.jsx";

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <>
      {store.userLogin ? (
        <>
          <div className="d-flex">
            <h1 className="text-danger ms-5">Characters</h1>
            <Link to="/add-people">
              <button type="button" className="btn btn-primary ms-3">
                Add New Character
              </button>
            </Link>
          </div>
          <UsersPeople />

          <div className="d-flex">
            <h1 className="text-danger ms-5">Vehicles</h1>
            <Link to="/add-vehicle">
              <button type="button" className="btn btn-primary ms-3">
                Add New Vehicle
              </button>
            </Link>
          </div>
          <UsersVehicles />

          <div className="d-flex">
            <h1 className="text-danger ms-5">Planets</h1>
            <Link to="/add-planet">
              <button type="button" className="btn btn-primary ms-3">
                Add New Planet
              </button>
            </Link>
          </div>
          <UsersPlanets />
        </>
      ) : (
        <>
          <h1 className="text-danger ms-5">Characters</h1>
          <CardPeople />
          <h1 className="text-danger ms-5">Vechicles</h1>
          <CardVehicle />
          <h1 className="text-danger ms-5">Planets</h1>
          <CardPlanets />
        </>
      )}
    </>
  );
};
