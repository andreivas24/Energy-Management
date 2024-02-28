import React, { useState, useEffect } from 'react'
import AdminNavbar from '../component/AdminNavbar';
import { Link } from 'react-router-dom';
import deviceService from '../service/device.service';


const AddDevice = () => {

    const [device, setDevice] = useState({
        id: "",
        description: "",
        energyConsumption: "",
    });

    const token = sessionStorage.getItem("token");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setDevice({ ...device, [e.target.name]: value });
    }

    const saveDevice = (e) => {
        e.preventDefault();
        deviceService
            .saveDevice(device, token)
            .then((res) => {
                console.log("Device Added Successfully");
                setSuccessMessage("Device Added Successfully");
                setErrorMessage("");
                setDevice({
                    description: "",
                    energyConsumption: "",
                })
            })
            .catch((error) => {
                console.log()
                setErrorMessage("Invalid Data");
                setSuccessMessage("");
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
                                Add Device
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
                                <form onSubmit={(e) => saveDevice(e)}>
                                    <div className='mb-3'>
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            name="description"
                                            className='form-control'
                                            onChange={(e) => handleChange(e)}
                                            value={device.description}
                                        ></input>
                                    </div>
                                    <div className='mb-3'>
                                        <label>Consumption</label>
                                        <input
                                            type="text"
                                            name="energyConsumption"
                                            className='form-control'
                                            onChange={(e) => handleChange(e)}
                                            value={device.energyConsumption}
                                        ></input>
                                    </div>
                                    <div class="text-center">
                                        <button class="btn btn-success col-md-3 save-button text-center">Add Device</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center add-button">
                    <Link to={"/admin/devices"} class="save-button btn btn-secondary">Back</Link>
                </div>
            </div>
        </>
    )
}

export default AddDevice