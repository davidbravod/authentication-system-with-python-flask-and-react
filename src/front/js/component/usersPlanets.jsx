import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import WithAuth from "./Auth/withAuth";
import "../../styles/home.css";


const UsersPlanets = () => {
    const { store, actions } = useContext(Context);

    const [usersPlanets, setUsersPlanets] = useState([]);

    useEffect(() => {

        if (store.usersData.length > 0) {
            setUsersPlanets(store.usersData[2]);
        }
    }, [store.usersData]);

    const addToFavorites = (item) => {
        actions.addPlanetFavorite(item);
    };

    return (
        <>
            <div className="container mt-3">
                <div className="card-container d-flex flex-nowrap">
                    {usersPlanets && usersPlanets.length > 0 ? (
                        <>
                            {usersPlanets.map((item, index) => {
                                return (
                                    <div className="card-wrapper" key={item.id}>
                                        <div className="card" style={{ width: "250px" }}>
                                            <img
                                                src={`https://starwars-visualguide.com/assets/img/planets/${item.id}.jpg`}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg' }}
                                                className="card-img-top"
                                                alt="..."
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.name}</h5>

                                                <p className="card-text">
                                                    Some quick example text to build on the card title and
                                                    make up the bulk of the card's content.
                                                </p>
                                                <div className="d-flex justify-content-between">
                                                    <Link to={`/usersplanet/${item.id}`} className="btn btn-primary">
                                                        Learn More!
                                                    </Link>
                                                    <button type="button" className="btn" onClick={() => {
                                                        let favoriteInfo = { ...item, url: /usersplanet/ };
                                                        addToFavorites(favoriteInfo);
                                                    }}><i className="fa-regular fa-heart fa-2xl"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <h1>Loading</h1>
                    )}
                </div>
            </div>
        </>
    );
};

export default WithAuth(UsersPlanets);
