import React, { useState } from 'react'
import userService from '../service/user.service';
import AdminNavbar from '../component/AdminNavbar';
import { Link } from 'react-router-dom';


const AddUser = () => {
    const [user, setUser] = useState({
        id: "",
        name: "",
        password: "",
        role: ""
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        var value = e.target.value;
        setUser({ ...user, [e.target.name]: value });
    }

    const token = sessionStorage.getItem("token");


    const saveUser = (e) => {
        e.preventDefault();
        userService
            .saveUser(user, token)
            .then((res) => {
                console.log("User Added Successfully");
                setSuccessMessage("User Added Successfully");
                setErrorMessage("");
                setUser({
                    name: "",
                    password: "",
                    role: ""
                })
            })
            .catch((error) => {
                console.log(error)
                setSuccessMessage("");
                setErrorMessage("Invalid Data");
            })
    }

    return (
        <>
            <AdminNavbar />
            <div className='container mt-3 centered-div'>
                <div classNAme='row'>
                    <div className='col-md-6 offset-md-3'>
                        <div className='card'>
                            <div className='card-header fs-3 text-center'>
                                Add User
                            </div>
                            {
                                successMessage &&
                                <p className="fs-4 text-center text-success">{successMessage}</p>
                            }
                            {
                                errorMessage &&
                                <p className="fs-4 text-center text-error">{errorMessage}</p>
                            }
                            <div className='card-body'>
                                <form onSubmit={(e) => saveUser(e)}>
                                    <div className='mb-3'>
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className='form-control'
                                            onChange={(e) => handleChange(e)}
                                            value={user.name}
                                        ></input>
                                    </div>
                                    <div className='mb-3'>
                                        <label>Password</label>
                                        <input
                                            type="text"
                                            name="password"
                                            className='form-control'
                                            onChange={(e) => handleChange(e)}
                                            value={user.password}
                                        ></input>
                                    </div>
                                    <div className='mb-3'>
                                        <label>Role</label>
                                        <select class="form-select" name="role" onChange={(e) => handleChange(e)} value={user.role}>
                                            <option selected>Select Role</option>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="CLIENT">CLIENT</option>
                                        </select>
                                    </div>
                                    <div class="text-center">
                                        <button class="btn btn-success col-md-3 save-button text-center">Add User</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center add-button">
                    <Link to={"/admin/users"} class="save-button btn btn-secondary">Back</Link>
                </div>
            </div>
        </>
    )
}

export default AddUser