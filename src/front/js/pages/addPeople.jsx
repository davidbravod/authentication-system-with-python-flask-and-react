import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import WithAuth from "../component/Auth/withAuth";

const AddPeople = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [eyes, setEyes] = useState("");
    const [height, setHeight] = useState("");

    const navigate = useNavigate(); // initialize useNavigate hook

    const handleRegister = async (e) => {
        e.preventDefault(); // prevent form from submitting
        const response = await actions.addPeople(name, birthdate, eyes, height); // call register action
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
                                Character Name
                            </label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter name"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <label htmlFor="birthdate" className="form-label fs-5">
                                Birthdate
                            </label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter birthdate"
                                onChange={(e) => {
                                    setBirthdate(e.target.value);
                                }}
                            />
                            <label htmlFor="eyes" className="form-label fs-5">
                                Eyes
                            </label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Eyes Color"
                                onChange={(e) => {
                                    setEyes(e.target.value);
                                }}
                            />
                            <label htmlFor="height" className="form-label fs-5">
                                Height
                            </label>
                            <input
                                type="number"
                                step="any"
                                className="form-control mb-3"
                                placeholder="Enter Height"
                                onChange={(e) => {
                                    setHeight(e.target.value);
                                }}
                            />
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="button-save col-md-6 btn btn-primary fs-6 fw-bold"
                                    onClick={handleRegister} // call handleRegister function
                                >
                                    Add New Character
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WithAuth(AddPeople);
