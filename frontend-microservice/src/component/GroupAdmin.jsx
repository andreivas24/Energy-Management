import React, { useEffect, useState } from 'react'
import groupService from "../service/group.service"
import { Link } from 'react-router-dom';
import AdminNavbar from '../component/AdminNavbar';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import messageService from "../service/message.service"
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';


const GroupAdmin = () => {

    //const WEB_SOCKET_URL = "http://localhost:8041/ws";  //DOCKER
    const WEB_SOCKET_URL = "http://localhost:8060/ws";  //LOCAL

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const { groupId } = useParams();
    const id = sessionStorage.getItem("id");
    const name = sessionStorage.getItem("name");


    const [group, setGroup] = useState([]);
    useEffect(() => {
        groupService
            .getGroupById(groupId, token)
            .then((res) => {
                setGroup(res.data);
            })
            .catch((error) => {
                navigate("/");

                console.log(error);
            })
    }, [])

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        messageService
            .getAllGroupMessages(groupId, token)
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
        setMessage(e.target.value);
    };

    const sendMessage = (e) => {
        e.preventDefault();

        const messageSaveDto = {
            senderId: id,
            senderName: name,
            groupId: groupId,
            content: newMessage
        }

        messageService
            .sendGroupMessage(messageSaveDto, token)
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
            message.senderId === id
                ? 'container-chat container-light'
                : 'container-chat container-dark';

        const headerContent =
            message.senderId === id ? null : message.senderName;

        return (
            <div key={message.id} className={containerClass}>
                {headerContent && (
                    <div>
                        <em class="time-left">{headerContent}</em>
                        <br />  <br />
                    </div>
                )}
                <p>
                    {message.content}
                </p>
                <div className="message-footer">
                    <span className={message.senderId === id ? 'time-left' : 'time-right'}>
                        {new Date(message.timestamp).toLocaleString()}
                    </span>
                </div>
            </div>
        );
    };

    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {

        const socket = new SockJS(WEB_SOCKET_URL);
        const stompClient = StompJs.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, () => {
            const userSpecificDestination = `/topic/${groupId}/groupMessage/new`;

            stompClient.subscribe(userSpecificDestination, (message) => {

                setTimeout(() => {
                    messageService
                        .getAllGroupMessages(groupId, token)
                        .then((res) => {
                            setMessages(res.data);
                        })
                        .catch((error) => {
                            navigate("/");
                            console.log(error);
                        })
                }, 0);
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
                <div className='row'>
                    <div className='col-md-6 offset-3'>
                        <div className='card'>

                            <div className='card-header text-white bg-secondary fs-3 text-center'>
                                {group.name}
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

export default GroupAdmin