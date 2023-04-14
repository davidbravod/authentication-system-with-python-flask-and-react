import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const [favorites, setFavorites] = useState(store.userFavorites);
  const dropdownRef = useRef(null);

  const getUserLink = (item) => {
    let url = "";
    switch (item.url) {
      case "/people":
        url = "/userspeople";
        break;
      case "/planets":
        url = "/usersplanet";
        break;
      case "/vehicles":
        url = "/usersvehicle";
        break;
      default:
        url = item.url;
        break;
    }
    return `${url}/${item.id}`;
  };

  const removeFavorite = (item) => {
    switch (item.url) {
      case "/people":
        actions.removePeopleFavorite(item);
        break;
      case "/planets":
        actions.removePlanetFavorite(item);
        break;
      case "/vehicles":
        actions.removeVehicleFavorite(item);
    }
    return;
  };

  useEffect(() => {
    setFavorites(store.userFavorites);
  }, [store.userFavorites]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const dropdownMenu =
          dropdownRef.current.querySelector(".dropdown-menu");
        dropdownMenu.classList.remove("show");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/2560px-Star_Wars_Logo.svg.png"
            style={{ width: "100px" }}
          ></img>
        </Link>
        {store.userLogin ? (
          <></>
        ) : (
          <Link to="/login">
            <button type="button" className="btn btn-primary">
              Login
            </button>
          </Link>
        )}
        {store.userLogin ? (
          <></>
        ) : (
          <Link to="/register">
            <button type="button" className="btn btn-success">
              Register
            </button>
          </Link>
        )}
        {store.userLogin ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => {
              actions.logout();
            }}
          >
            Logout
          </button>
        ) : (
          <></>
        )}
        {store.userLogin ? (
          <div className="ml-auto">
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                onClick={(e) => {
                  const dropdownMenu = e.currentTarget.nextElementSibling;
                  dropdownMenu.classList.toggle("show");
                }}
              >
                Favorites
                <span className="badge text-bg-secondary">
                  {favorites.length}
                </span>
              </button>
              <ul className="dropdown-menu">
                {favorites && favorites.length > 0 ? (
                  <>
                    {favorites.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="dropdown-item d-flex justify-content-between align-items-center"
                        >
                          <Link to={getUserLink(item)} className="item-name">
                            <span className="item-name">{item.name}</span>
                          </Link>
                          <i
                            className="btn fa-solid fa-trash-can fa-lg"
                            onClick={() => {
                              removeFavorite(item);
                            }}
                          ></i>
                        </li>
                      );
                    })}
                  </>
                ) : (
                  <>empty</>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};
