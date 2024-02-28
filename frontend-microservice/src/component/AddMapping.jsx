import React, { useState, useEffect } from 'react'
import AdminNavbar from '../component/AdminNavbar';
import { Link } from 'react-router-dom';
import deviceService from '../service/device.service';
import userService from "../service/user.service"


const AddMapping = () => {
    const [userList, setUserList] = useState([]);

    const token = sessionStorage.getItem("token");

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

    const [deviceList, setDeviceList] = useState([]);

    useEffect(() => {
        deviceService
            .getAllDevices(token)
            .then((res) => {
                console.log(res.data);
                setDeviceList(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const [userDevice, setUserDevice] = useState({
        id: "",
        userId: "",
        deviceId: "",
        userName: "",
        deviceDescription: "",
        address: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleAddressChange = (e) => {
        const address = e.target.value;
        setUserDevice({ ...userDevice, address: address });
    }

    const handleUserChange = (e) => {
        const id = e.target.value;
        console.log(id);
        const user = userList.find(option => option.id === id);
        setUserDevice({ ...userDevice, userId: id, userName: user.name});
        
    }

    const handleDeviceChange = (e) => {
        const id = e.target.value;
        const device = deviceList.find(option => option.id === id);
        setUserDevice({ ...userDevice, deviceId: id, deviceDescription: device.description});
    }

    const saveUserDevice = (e) => {
        e.preventDefault();
        deviceService
            .saveUserDeviceMapping(userDevice, token)
            .then((res) => {
                console.log("Assignation Done Successfully");
                setSuccessMessage("Assignation Done Successfully");
                setErrorMessage("");
                setUserDevice({
                    id: "",
                    userId: "",
                    deviceId: "",
                    userName: "",
                    deviceDescription: "",
                    address: "",
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
                                Assign Device to User
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
                                <form onSubmit={(e) => saveUserDevice(e)}>
                                    <div className='mb-3'>
                                        <label>User</label>
                                        <select class="form-select" name="userId" onChange={(e) => handleUserChange(e)} value={userDevice.userId}>
                                            <option selected>Select User</option>
                                            {
                                                userList.map(user =>
                                                    <option value={user.id}>{user.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className='mb-3'>
                                        <label>Device</label>
                                        <select class="form-select" name="deviceId" onChange={(e) => handleDeviceChange(e)} value={userDevice.deviceId}>
                                            <option selected>Select Device</option>
                                            {
                                                deviceList.map(device =>
                                                    <option value={device.id}>{device.description}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className='mb-3'>
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            className='form-control'
                                            onChange={(e) => handleAddressChange(e)}
                                            value={userDevice.address}
                                        ></input>
                                    </div>
                                    <div class="text-center">
                                        <button class="btn btn-success col-md-3 save-button text-center">Assign</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center add-button">
                    <Link to={"/admin/mappings"} class="save-button btn btn-secondary">Back</Link>
                </div>
            </div>
        </>
    )
}

export default AddMapping