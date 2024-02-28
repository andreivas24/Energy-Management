import React, { useEffect, useState } from 'react'
import userService from "../service/user.service"
import { Link } from 'react-router-dom';
import AdminNavbar from '../component/AdminNavbar';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import messageService from "../service/message.service"
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';


const ChatAdmin = () => {

    //const WEB_SOCKET_URL = "http://localhost:8041/ws";  //DOCKER
    const WEB_SOCKET_URL = "http://localhost:8060/ws";  //LOCAL

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("id");
    const name = sessionStorage.getItem("name");


    const { receiver } = useParams();
    const [contact, setContact] = useState([]);
    useEffect(() => {
        userService
            .getContactById(receiver, token)
            .then((res) => {
                setContact(res.data);
            })
            .catch((error) => {
                navigate("/");

                console.log(error);
            })
    }, [])

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        messageService
            .getAllMessagesBySenderIdAndReceiverId(id, receiver, token)
            .then((res) => {
                setMessages(res.data);
            })
            .catch((error) => {
                navigate("/");
                console.log(error);
            })
    }, [])

    const [newMessage, setMessage] = useState('');

    const handleMessageChange = (e) => {
        sendTypeNotification(e);
        setMessage(e.target.value);
    };

    const sendTypeNotification = (e) => {
        e.preventDefault();

        messageService
            .sendTypeNotification(name, contact.id, token)
            .catch((error) => {
                console.log(error)
            })
    };

    const sendMessage = (e) => {
        e.preventDefault();

        const messageSaveDto = {
            senderId: id,
            receiverId: receiver,
            senderName: name,
            receiverName: contact.name,
            content: newMessage
        }

        console.log(messageSaveDto)

        messageService
            .sendMessage(messageSaveDto, token)
            .then(() => {
                setMessage('');
                window.location.reload();
            })
            .catch((error) => {
                console.log(error)
            })
    };

    const appendChatContainer = (message) => {
        const containerClass =
            message.senderId === receiver
                ? 'container-chat container-dark'
                : 'container-chat container-light';

        return (
            <div key={message.id} className={containerClass}>
                <p>
                    {message.content}
                </p>
                <div className="message-footer">
                    <span className={message.senderId === receiver ? 'time-left' : 'time-right'}>
                        {new Date(message.timestamp).toLocaleString()}
                    </span>
                    <br></br>
                    {message.senderId === id && (
                        <div className="seen-status">
                            <span className={message.seen ? 'seen' : 'delivered'}>
                                {message.seen ? 'Seen' : 'Delivered'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

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
                    setTimeout(() => {
                        messageService
                            .getAllMessagesBySenderIdAndReceiverId(id, receiver, token)
                            .then((res) => {
                                setMessages(res.data);
                            })
                            .catch((error) => {
                                navigate("/");
                                console.log(error);
                            })
                    }, 0);
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
                    setTimeout(() => {
                        messageService
                            .getAllMessagesBySenderIdAndReceiverId(id, receiver, token)
                            .then((res) => {
                                setMessages(res.data);
                            })
                            .catch((error) => {
                                navigate("/");
                                console.log(error);
                            })
                    }, 0);
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
            <AdminNavbar />
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
                    <div className='col-md-6 offset-3'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                {contact.name}
                            </div>

                            <div className='card-body' style={{ overflowY: 'auto', height: '400px', display: 'flex', flexDirection: 'column-reverse' }}>

                                {messages.map(appendChatContainer)}

                            </div>
                        </div>

                        <div class="message-div">
                            <form onSubmit={(e) => sendMessage(e)} className="row">
                                <div className='col-10 mb-3'>
                                    <input
                                        type="text"
                                        name="energyConsumption"
                                        className='form-control'
                                        placeholder="Your Message"
                                        onChange={(e) => handleMessageChange(e)}
                                        value={newMessage}
                                    />
                                </div>
                                <div className="col-2 text-center add-button">
                                    <button className="btn btn-dark">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="text-center col-md-6 offset-md-3 add-button">
                        <Link to={"/admin/chat"} class="save-button btn btn-dark">Back</Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ChatAdmin