import React, { useEffect, useState } from 'react'
import userService from "../service/user.service"
import { Link } from 'react-router-dom';
import ClientNavbar from '../component/ClientNavbar';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import groupService from '../service/group.service';
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';


const ContactsClient = () => {

    //const WEB_SOCKET_URL = "http://localhost:8041/ws";  //DOCKER
    const WEB_SOCKET_URL = "http://localhost:8060/ws";  //LOCAL

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const { id } = useParams();

    const [contactsList, setContacts] = useState([]);
    useEffect(() => {
        userService
            .getAllContacts(token)
            .then((res) => {
                setContacts(res.data);
            })
            .catch((error) => {
                navigate("/");

                console.log(error);
            })
    }, [])

    const [groupsList, setGroups] = useState([]);
    useEffect(() => {
        groupService
            .getAllGroupsByClientId(id, token)
            .then((res) => {
                setGroups(res.data);
            })
            .catch((error) => {
                navigate('/');
                console.log(error);
            });
    }, []);

    const [stompClient, setStompClient] = useState(null);
    const [notification, setNotification] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {

        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = StompJs.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, () => {
            const userSpecificDestination = `/topic/${id}/message/seen`;

            stompClient.subscribe(userSpecificDestination, (message) => {
                setNotification(message.body);
                setAlertVisible(true);

                setTimeout(() => {
                    setAlertVisible(false);
                    setNotification(null);
                }, 5000);
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {

        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = StompJs.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, () => {
            const userSpecificDestination = `/topic/${id}/message/new`;

            stompClient.subscribe(userSpecificDestination, (message) => {
                setNotification(message.body);
                setAlertVisible(true);

                setTimeout(() => {
                    setAlertVisible(false);
                    setNotification(null);
                }, 5000);
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);


    useEffect(() => {

        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = StompJs.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, () => {
            const userSpecificDestination = `/topic/${id}/types`;

            stompClient.subscribe(userSpecificDestination, (message) => {
                setNotification(message.body);
                setAlertVisible(true);

                setTimeout(() => {
                    setAlertVisible(false);
                    setNotification(null);
                }, 1000);
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
                    <div className='col-md-4 offset-4'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                CONTACTS
                            </div>

                            <div className='card-body'>
                                <table class="table table-striped table-hover text-center">
                                    <thead>
                                        <tr>
                                            <th class="col-3" scope="col">Username</th>
                                            <th class="col-1" scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactsList.map(contact => (
                                            <tr>
                                                <td>{contact.name}</td>
                                                <td>
                                                    <Link to={"/client/chat/" + id + "/" + contact.id} class="btn btn-dark">Chat</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div style={{ margin: '20px' }}>
                    </div>

                    <div className='col-md-4 offset-4'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                GROUPS
                            </div>

                            <div className='card-body'>
                                <table class="table table-striped table-hover text-center">
                                    <thead>
                                        <tr>
                                            <th class="col-3" scope="col">Name</th>
                                            <th class="col-1" scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupsList.map(group => (
                                            <tr>
                                                <td>{group.name}</td>

                                                <td>
                                                    <Link to={"/client/group/" + id + "/" + group.id} class="btn btn-dark">Chat</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ margin: '80px' }}>
            </div>
        </>
    )
}

export default ContactsClient