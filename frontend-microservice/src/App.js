import './App.css';
import { Routes, Route } from 'react-router-dom';
import Users from './component/Users';
import Devices from './component/Devices';
import EditUser from './component/EditUser';
import EditDevice from './component/EditDevice';
import AddUser from './component/AddUser';
import AddDevice from './component/AddDevice';
import ClientDevices from './component/ClientDevices';
import Login from './component/Login';
import Mapping from './component/Mapping';
import AddMapping from './component/AddMapping';
import ClientChart from './component/ClientChart';
import ClientDate from './component/ClientDate';
import ContactsAdmin from './component/ContactsAdmin';
import ContactsClient from './component/ContactsClient';
import ChatAdmin from './component/ChatAdmin';
import ChatClient from './component/ChatClient';
import GroupAdmin from './component/GroupAdmin';
import GroupClient from './component/GroupClient';


function App() {
  return (
    <>
      <Routes>
        <Route path = '/' element = {<Login/>}></Route>
        <Route path = '/admin/users' element = {<Users/>}></Route>
        <Route path = '/admin/devices' element = {<Devices/>}></Route>
        <Route path = '/admin/users/:id' element = {<EditUser/>}></Route>
        <Route path = '/admin/devices/:id' element = {<EditDevice/>}></Route>
        <Route path = '/admin/users/new' element = {<AddUser/>}></Route>
        <Route path = '/admin/devices/new' element = {<AddDevice/>}></Route>
        <Route path = '/admin/mappings' element = {<Mapping/>}></Route>
        <Route path = '/admin/mappings/new' element = {<AddMapping/>}></Route>
        <Route path = '/client/:id' element = {<ClientDevices/>}></Route>
        <Route path = '/client/:id/consumption' element = {<ClientDate/>}></Route>
        <Route path = '/client/:id/consumption/:date' element = {<ClientChart/>}></Route>
        <Route path = '/admin/chat' element = {<ContactsAdmin/>}></Route>
        <Route path = '/client/chat/:id' element = {<ContactsClient/>}></Route>
        <Route path = '/admin/chat/:receiver' element = {<ChatAdmin/>}></Route>
        <Route path = '/client/chat/:id/:receiver' element = {<ChatClient/>}></Route>
        <Route path = '/admin/group/:groupId' element = {<GroupAdmin/>}></Route>
        <Route path = '/client/group/:id/:groupId' element = {<GroupClient/>}></Route>
      </Routes>
    </>
  );
}

export default App;
