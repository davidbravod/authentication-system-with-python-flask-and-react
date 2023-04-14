import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import WithAuth from "./Auth/withAuth";
import "../../styles/home.css";


const UsersVehicles = () => {
    const { store, actions } = useContext(Context);

    const [usersVehicles, setUsersVehicles] = useState([]);

    useEffect(() => {

        if (store.usersData.length > 0) {
            setUsersVehicles(store.usersData[1]);
        }
    }, [store.usersData]);

    const addToFavorites = (item) => {
        actions.addVehicleFavorite(item);
    };

    return (
        <>
            <div className="container mt-3">
                <div className="card-container d-flex flex-nowrap">
                    {usersVehicles && usersVehicles.length > 0 ? (
                        <>
                            {usersVehicles.map((item, index) => {
                                return (
                                    <div className="card-wrapper" key={item.id}>
                                        <div className="card" style={{ width: "250px" }}>
                                            <img
                                                src={`https://starwars-visualguide.com/assets/img/vehicles/${item.id}.jpg`}
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
                                                    <Link to={`/usersvehicle/${item.id}`} className="btn btn-primary">
                                                        Learn More!
                                                    </Link>
                                                    <button type="button" className="btn" onClick={() => {
                                                        let favoriteInfo = { ...item, url: /usersvehicle/ };
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

export default WithAuth(UsersVehicles);
