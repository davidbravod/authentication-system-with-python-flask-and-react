import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const CardVehicle = () => {
    const { store, actions } = useContext(Context);

    const [people, setPeople] = useState([]);

    useEffect(() => {

        if (store.initialFetch.length > 0) {
            setPeople(store.initialFetch[0]);
        }
    }, [store.initialFetch]);

    // useEffect(() => {
    //     const cargaDatos = async () => {
    //         let { respuestaJson, response } = await actions.useSwapi("/people");
    //         setPeople(respuestaJson.results);
    //     };
    //     cargaDatos();
    // }, []);

    const addToFavorites = (item) => {
        actions.addFavorite(item);
    };

    return (
        <>
            <div className="container mt-3">
                <div className="card-container d-flex flex-nowrap">
                    {people && people.length > 0 ? (
                        <>
                            {people.map((item, index) => {
                                return (
                                    <div className="card-wrapper" key={item.uid}>
                                        <div className="card" style={{ width: "250px" }}>
                                            <img
                                                src={`https://starwars-visualguide.com/assets/img/characters/${item.uid}.jpg`}
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
                                                    <Link to={`/people/${item.uid}`} className="btn btn-primary">
                                                        Learn More!
                                                    </Link>
                                                    <button type="button" className="btn" onClick={() => {
                                                        let urlPath = { ...item, url: "/people/" };
                                                        addToFavorites(urlPath);
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

export default CardVehicle;
