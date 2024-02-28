import React, { useEffect, useState } from 'react'
import userService from "../service/user.service"
import { Link } from 'react-router-dom';
import AdminNavbar from '../component/AdminNavbar';
import { useNavigate } from "react-router-dom";


const Users = () => {
    const [userList, setUserList] = useState([]);

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        userService
            .getAllUsers(token)
            .then((res) => {
                setUserList(res.data);
            })
            .catch((error) => {
                navigate("/");

                console.log(error);
            })
    }, [])

    return (
        <>
        <AdminNavbar />
            <div className='container mt-3 padding-top-div'>
                <div className='row'>
                    <div className='col-md-10 offset-1'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                USERS
                            </div>

                            <div className='card-body'>
                                <table class="table table-striped table-hover text-center">
                                    <thead>
                                        <tr>
                                            <th class="col-3" scope="col">Username</th>
                                            <th class="col-3" scope="col">Password</th>
                                            <th class="col-3" scope="col">Role</th>
                                            <th class="col-1" scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map( user => (
                                            <tr>
                                                <td>{user.name}</td>
                                                <td>{user.password}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    <Link to={"/admin/users/" + user.id} class="btn btn-dark">Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            <div class = "text-center add-button">
                                <Link to={"/admin/users/new"} class="btn btn-dark">Add New User</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users