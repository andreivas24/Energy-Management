import React, { useState } from 'react'
import userService from '../service/user.service';
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [user, setUser] = useState({
        name: "",
        password: "",
    });

    const[errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        var value = e.target.value;
        setUser({ ...user, [e.target.name]: value });
    }

    const navigate = useNavigate();
    
    const login = (e) => {
        e.preventDefault();
        userService
            .login(user.name, user.password)
            .then((res) => {
                console.log("User Logged In Successfully");
                sessionStorage.setItem("id",res.data.id);
                sessionStorage.setItem("role",res.data.role);
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("name", user.name);
                if(res.data.role == "ADMIN"){
                    navigate("/admin/users");
                }
                else {
                    navigate("/client/" + res.data.id);
                }
             })
            .catch((error) => {
                sessionStorage.setItem("loggedIn", false);
                console.log(error)
                setErrorMessage("Invalid Data");
                setUser({
                    name: "",
                    password: ""
                })
            })
    }

    return (
        <>
        <div className='container mt-3 centered-div'>
            <div classNAme='row'>
                <div className='col-md-6 offset-md-3'>
                    <div className='card'>
                        <div className='card-header fs-3 text-center'>
                            ENERGY MANAGEMENT SYSTEM
                        </div>
                            {
                                "errorMessage" && 
                                <p className="fs-4 text-center text-error">{errorMessage}</p>
                            }
                        <div className='div-backgorund card-body'>
                            <div className='logo-div'>
                                <img src="./solar-energy.png" className="logo"/>
                            </div>
                            <form onSubmit={(name, password) => login(name, password)}>
                                <div className='mb-3 col-md-6 offset-md-3'>
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className='form-control'
                                        onChange={(e) => handleChange(e)}
                                        value={user.name}
                                    ></input>
                                </div>
                                <div className='mb-3 col-md-6 offset-md-3'>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className='form-control'
                                        onChange={(e) => handleChange(e)}
                                        value={user.password}
                                    ></input>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-dark col-md-2 text-center">Log in</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Login