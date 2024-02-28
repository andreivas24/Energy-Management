import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminNavbar from '../component/AdminNavbar';
import userService from '../service/user.service';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const EditUser = () => {
    const [user, setUser] = useState({
        id: "",
        name: "",
        password: "",
        role: ""
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setUser({ ...user, [e.target.name]: value });
    }

    const { id } = useParams();
    console.log(id);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        userService.getUserById(id, token)
            .then((res) => {
                setUser(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const token = sessionStorage.getItem("token");

    const updateUser = (e) => {
        e.preventDefault();
        userService
            .updateUser(id, user, token)
            .then((res) => {
                console.log("User Updated Successfully");
                setSuccessMessage("User Updated Successfully");
                setErrorMessage("");
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage("Invalid Data");
                setSuccessMessage("");
            })
    }

    const navigate = useNavigate();

    const deleteUser = (e) => {
        userService
            .deleteUserById(id, token)
            .then((res) => {
                console.log("User Deleted Successfully");
                navigate("/admin/users");
            })
            .catch((error) => {
                console.log(error)
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
                                Edit User
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
                                <form onSubmit={(e) => updateUser(e)}>
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
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="CLIENT">CLIENT</option>
                                        </select>
                                    </div>

                                    <div class="text-center">
                                        <button class="btn btn-success col-md-2 save-button text-center">Update</button>
                                    </div>
                                </form>
                                <div class="text-center">
                                    <button class="btn btn-danger col-md-2 save-button text-center"
                                        onClick={() => deleteUser(id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center col-md-6 offset-md-3 add-button">
                    <Link to={"/admin/users"} class="save-button btn btn-dark">Back</Link>
                </div>
            </div>
        </>
    )
}

export default EditUser