import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import WithAuth from "../component/Auth/withAuth";

const AddPlanet = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [population, setPopulation] = useState("");
    const [surface, setSurface] = useState("");
    const [diameter, setDiameter] = useState("");

    const navigate = useNavigate(); // initialize useNavigate hook

    const handleRegister = async (e) => {
        e.preventDefault(); // prevent form from submitting
        const response = await actions.addPlanet(name, population, surface, diameter); // call register action
        console.log(response)
        if (response.ok) {
            actions.initialFetchUsersData()
            navigate("/"); // redirect to home component
        } else {
            alert("error, try again")
        }
    };

    return (
        <>
            <div className="container-fluid bg bg-dark">
                <div className="contactForm container bg bg-white">
                    <div className="d-flex justify-content-center">
                        <h1 className="fs-1 fw-bold mt-5">Register</h1>
                    </div>
                    <div className="form-control border border-0 ps-4 pe-4">
                        <form>
                            <label htmlFor="name" className="form-label fs-5">
                                Planet Name
                            </label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter name"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <label htmlFor="population" className="form-label fs-5">
                                Population
                            </label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter population"
                                onChange={(e) => {
                                    setPopulation(e.target.value);
                                }}
                            />
                            <label htmlFor="surface" className="form-label fs-5">
                                Surface
                            </label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="surface"
                                onChange={(e) => {
                                    setSurface(e.target.value);
                                }}
                            />
                            <label htmlFor="diameter" className="form-label fs-5">
                                Diameter
                            </label>
                            <input
                                type="number"
                                step="any"
                                className="form-control mb-3"
                                placeholder="Enter diameter"
                                onChange={(e) => {
                                    setDiameter(e.target.value);
                                }}
                            />
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="button-save col-md-6 btn btn-primary fs-6 fw-bold"
                                    onClick={handleRegister} // call handleRegister function
                                >
                                    Add New Planet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WithAuth(AddPlanet);
