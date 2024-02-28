import React, { useEffect, useState } from 'react'
import deviceService from "../service/device.service"
import { Link } from 'react-router-dom';
import AdminNavbar from '../component/AdminNavbar';
import { useNavigate } from "react-router-dom";


const Devices = () => {
    const [deviceList, setDeviceList] = useState([]);

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        deviceService
            .getAllDevices(token)
            .then((res) => {
                console.log(res.data);
                setDeviceList(res.data);
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
                    <div className='col-md-8 offset-2'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                DEVICES
                            </div>

                            <div className='card-body'>
                                <table class="table table-striped table-hover text-center">
                                    <thead>
                                        <tr>
                                            <th class="col-3" scope="col">Description</th>
                                            <th class="col-3" scope="col">Consumption</th>
                                            <th class="col-2" scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deviceList.map( device => (
                                            <tr>
                                                <td>{device.description}</td>
                                                <td>{device.energyConsumption}</td>
                                                <td>
                                                    <Link to={"/admin/devices/" + device.id} class="btn btn-dark">Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div class = "text-center add-button">
                                <Link to={"/admin/devices/new"} class="btn btn-dark">Add New Device</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Devices