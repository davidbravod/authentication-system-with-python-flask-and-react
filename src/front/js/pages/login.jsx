import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';

const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // initialize useNavigate hook

    useEffect(() => {
        console.log(email);
    }, [email]);

    useEffect(() => {
        console.log(password);
    }, [password]);

    const handleLogin = async (e) => {
        e.preventDefault(); // prevent form from submitting
        let { respuestaJson, response } = await actions.login(email, password); // call login action
        console.log(response)
        if (response.ok) {
            actions.initialFetchUsersData()
            actions.getUserFavorites()
            navigate("/"); // redirect to home component
        } else {
            alert("Login failed")
        }
    };

    return (
        <>
            <div className="container-fluid bg bg-dark">
                <div className="contactForm container bg bg-white">
                    <div className="d-flex justify-content-center">
                        <h1 className="fs-1 fw-bold mt-5">Login</h1>
                    </div>
                    <div className="form-control border border-0 ps-4 pe-4">
                        <form>
                            <label htmlFor="full-name" className="form-label fs-5">
                                Email
                            </label>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <label htmlFor="email" className="form-label fs-5">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control mb-3"
                                placeholder="Enter password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="button-save col-md-6 btn btn-primary fs-6 fw-bold"
                                    onClick={handleLogin} // call handleLogin function
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
