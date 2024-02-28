import React, { useState, useEffect } from 'react'
import AdminNavbar from '../component/AdminNavbar';
import { Link } from 'react-router-dom';
import deviceService from '../service/device.service';
import userService from "../service/user.service"
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";



const EditDevice = () => {
    const token = sessionStorage.getItem("token");

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        userService
            .getAllUsers(token)
            .then((res) => {
                console.log(res.data);
                setUserList(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const { id } = useParams();
    console.log(id);

    const [device, setDevice] = useState({
        id: "",
        description: "",
        energyConsumption: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setDevice({ ...device, [e.target.name]: value });
    }

    useEffect(() => {
        deviceService
        .getDeviceById(id, token)
            .then((res) => {
                setDevice(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])


    const updateDevice = (e) => {
        e.preventDefault();
        deviceService
            .updateDevice(id, device, token)
            .then((res) => {
                console.log("Device Updated Successfully");
                setSuccessMessage("Device Updated Successfully");
                setErrorMessage("");
            })
            .catch((error) => {
                console.log(error)
                setErrorMessage("Invalid Data");
                setSuccessMessage("");
            })
    }

    const navigate = useNavigate();

    const deleteDevice = (e) => {
        deviceService
            .deleteDeviceById(id, token)
            .then((res) => {
                console.log("Device Deleted Successfully");
                navigate("/admin/devices");
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
                                Edit Device
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
                                <form onSubmit={(e) => updateDevice(e)}>
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
                                        <button class="btn btn-success col-md-2 save-button text-center">Update</button>
                                    </div>
                                </form>
                                <div class="text-center">
                                    <button class="btn btn-danger col-md-2 save-button text-center"
                                        onClick={() => deleteDevice(id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center col-md-6 offset-md-3 add-button">
                    <Link to={"/admin/devices"} class="save-button btn btn-dark">Back</Link>
                </div>
            </div>
        </>
    )
}

export default EditDevice