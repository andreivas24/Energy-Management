import React, { useEffect, useState } from 'react'
import deviceService from "../service/device.service"
import { Link } from 'react-router-dom';
import AdminNavbar from '../component/AdminNavbar';
import { useNavigate } from "react-router-dom";


const Mapping = () => {
    const [userDevices, setUserDevicesList] = useState([]);

    const token = sessionStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        init();
    },[]);

    const init = () => {
        deviceService
            .getAllUserDevices(token)
            .then((res) => {
                console.log(res.data);
                setUserDevicesList(res.data);
            })
            .catch((error) => {
                navigate("/");
                console.log(error);
            })
    };

    const deleteUserDevice = (id) => {
        console.log(id)
        deviceService
            .deleteUserDeviceMapping(id, token)
            .then((res) => {
                console.log("User Deleted Successfully");
                init();
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
        <AdminNavbar />
            <div className='container mt-3 padding-top-div'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                USERS'S DEVICES
                            </div>

                            <div className='card-body'>
                                <table class="table table-striped table-hover text-center">
                                    <thead>
                                        <tr>
                                            <th class="col-4" scope="col">User</th>
                                            <th class="col-4" scope="col">Device</th>
                                            <th class="col-2" scope="col">Address</th>
                                            <th class="col-1" scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userDevices.map( userDevice => (
                                            <tr>
                                                <td>{userDevice.userName}</td>
                                                <td>{userDevice.deviceDescription}</td>
                                                <td>{userDevice.address}</td>
                                                <td>
                                                    <button onClick={() => deleteUserDevice(userDevice.id)} 
                                                    class="btn btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                
                                </table>
                            </div>
                            <div class = "text-center add-button">
                                <Link to={"/admin/mappings/new"} class="btn btn-dark">Assign Device to User</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Mapping