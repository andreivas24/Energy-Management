import React, { useEffect, useState } from 'react'
import ClientNavbar from '../component/ClientNavbar'
import deviceService from "../service/device.service"
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';


const ClientDevices = () => {

    //const WEB_SOCKET_URL = "http://localhost:8031/ws";  //DOCKER
    const WEB_SOCKET_URL = "http://localhost:8070/ws";  //LOCAL

    const [deviceList, setDeviceList] = useState([]);

    const { id } = useParams();
    console.log(id);

    const token = sessionStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        deviceService
            .getDevicesByUserId(id, token)
            .then((res) => {
                console.log(res.data);
                setDeviceList(res.data);
            })
            .catch((error) => {
                navigate("/");
                console.log(error);
            })
    }, [])

    const [stompClient, setStompClient] = useState(null);
    const [notification, setNotification] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {

        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = StompJs.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, () => {
            const userSpecificDestination = `/topic/${id}/notification`;

            stompClient.subscribe(userSpecificDestination, (message) => {
                setNotification(message.body);
                setAlertVisible(true);
                console.log("Device " + message.body)

                setTimeout(() => {
                    setAlertVisible(false);
                    setNotification(null);
                }, 3000);

            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);


    return (
        <>
            <ClientNavbar />
            <div className='container mt-3 padding-top-div'>
                {
                    alertVisible && notification && (
                        <div className="alert alert-danger" role="alert">
                            <center>
                                {notification}
                            </center>
                        </div>
                    )
                }

                <div className='row'>
                    <div className='col-md-8 offset-2'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                MY DEVICES
                            </div>

                            <div className='card-body'>
                                <table class="table table-striped table-hover text-center">
                                    <thead>
                                        <tr>
                                            <th class="col-3" scope="col">Description</th>
                                            <th class="col-3" scope="col">Address</th>
                                            <th class="col-2" scope="col">Consumption</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deviceList.map(device => (
                                            <tr>
                                                <td>{device.description}</td>
                                                <td>{device.address}</td>
                                                <td>{device.energyConsumption}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientDevices