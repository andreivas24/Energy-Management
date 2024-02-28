import React, { useEffect, useState } from 'react';
import userService from '../service/user.service';
import { Link } from 'react-router-dom';
import AdminNavbar from '../component/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import groupService from '../service/group.service';
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';


const ContactsAdmin = () => {

  //const WEB_SOCKET_URL = "http://localhost:8041/ws";  //DOCKER
  const WEB_SOCKET_URL = "http://localhost:8060/ws";  //LOCAL

  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const adminId = sessionStorage.getItem('id');


  const [contactsList, setContacts] = useState([]);
  useEffect(() => {
    userService
      .getAllContacts(token)
      .then((res) => {
        setContacts(res.data);
      })
      .catch((error) => {
        navigate('/');
        console.log(error);
      });
  }, []);

  const [groupsList, setGroups] = useState([]);
  useEffect(() => {
    groupService
      .getAllGroupsByAdminId(adminId, token)
      .then((res) => {
        setGroups(res.data);
      })
      .catch((error) => {
        navigate('/');
        console.log(error);
      });
  }, []);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

  const handleCheckboxChange = (contactId, contactName) => {
    const isSelected = selectedUsers.includes(contactId);

    if (isSelected) {
      setSelectedUsers((prevSelected) => prevSelected.filter((id) => id !== contactId));
      setSelectedNames((prevSelected) => prevSelected.filter((name) => name !== contactName));
    } else {
      setSelectedUsers((prevSelected) => [...prevSelected, contactId]);
      setSelectedNames((prevSelected) => [...prevSelected, contactName]);
    }
  };

  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const [group, setGroup] = useState({
    name: '',
    users: '',
    names: '',
  });

  const saveGroup = (e) => {
    e.preventDefault();

    const updatedGroup = {
      name: message,
      users: selectedUsers,
      names: selectedNames,
    };

    setGroup(updatedGroup);

    console.log(message);
    console.log(selectedUsers);
    console.log(selectedNames);

    groupService
      .saveGroup(updatedGroup, adminId, token)
      .then(() => {
        setGroup({
          name: '',
          users: '',
          names: '',
        });

        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteGroup = (id) => {
    console.log(id)
    groupService
      .deleteGroupById(id, token)
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    console.log('Updated Group State:', group);
  }, [group]);


  const [stompClient, setStompClient] = useState(null);
  const [notification, setNotification] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {

    const socket = new SockJS(WEB_SOCKET_URL);
    const stompClient = StompJs.over(socket);
    setStompClient(stompClient);

    stompClient.connect({}, () => {
      const userSpecificDestination = `/topic/${adminId}/message/seen`;

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
      const userSpecificDestination = `/topic/${adminId}/message/new`;

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
      const userSpecificDestination = `/topic/${adminId}/types`;

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
                CONTACTS
              </div>

              <div className='card-body'>
                <table class="table table-striped table-hover text-center">
                  <thead>
                    <tr>
                      <th class="col-4" scope="col">Username</th>
                      <th class="col-1" scope="col"></th>
                      <th class="col-1" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactsList.map(contact => (
                      <tr>
                        <td>{contact.name}</td>
                        <td>
                          {contact.role !== 'ADMIN' && (
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(contact.id, contact.name)}
                              checked={selectedUsers.includes(contact.id)}
                            />
                          )}
                        </td>
                        <td>
                          <Link to={"/admin/chat/" + contact.id} class="btn btn-dark">Chat</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="message-div">
              <form onSubmit={(e) => saveGroup(e)}>
                <div className='mb-3'>
                  <input
                    type="text"
                    name="energyConsumption"
                    className='form-control'
                    placeholder="Group Name"
                    onChange={(e) => handleMessageChange(e)}
                  ></input>
                </div>
                <div class="text-center add-button">
                  <button class="btn btn-dark">Create Group</button>
                </div>
              </form>
            </div>
          </div>

          <div className='col-md-6 offset-3'>
            <div className='card'>

              <div className='card-header text-white bg-secondary fs-3 text-center'>
                GROUPS
              </div>

              <div className='card-body'>
                <table class="table table-striped table-hover text-center">
                  <thead>
                    <tr>
                      <th class="col-4" scope="col">Name</th>
                      <th class="col-1" scope="col"></th>
                      <th class="col-1" scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupsList.map(group => (
                      <tr>
                        <td>{group.name}</td>
                        <td>
                          <button onClick={() => deleteGroup(group.id)}
                            class="btn btn-danger">Delete</button>
                        </td>
                        <td>
                          <Link to={"/admin/group/" + group.id} class="btn btn-dark">Chat</Link>
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

export default ContactsAdmin