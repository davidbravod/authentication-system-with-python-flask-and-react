import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const CardPlanets = () => {
    const { store, actions } = useContext(Context);
    const [planets, setPlanets] = useState([]);

    useEffect(() => {
        if (store.initialFetch.length > 0) {
            setPlanets(store.initialFetch[2]);
        }
    }, [store.initialFetch]);


    // useEffect(() => {
    //     const cargaDatos = async () => {
    //         let { respuestaJson, response } = await actions.useSwapi("/planets");
    //         setPlanets(respuestaJson.results);
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
                    {planets && planets.length > 0 ? (
                        <>
                            {planets.map((item, index) => {
                                return (
                                    <div className="card-wrapper" key={item.uid}>
                                        <div className="card" style={{ width: "250px" }}>
                                            <img
                                                src={`https://starwars-visualguide.com/assets/img/planets/${item.uid}.jpg`}
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
                                                    <Link to={`/planets/${item.uid}`} className="btn btn-primary">
                                                        Learn More!
                                                    </Link>
                                                    <button type="button" className="btn" onClick={() => {
                                                        let urlPath = { ...item, url: "/planets/" };
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

export default CardPlanets;