import React from 'react'
import { Link } from 'react-router-dom';

const AdminNavbar = () => {

    return (
        <>
            <nav class="navbar navbar-dark bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand">ADMIN</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link to="/admin/users" class="nav-link">Users</Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/admin/devices" class="nav-link">Devices</Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/admin/mappings" class="nav-link">Users's Devices</Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/admin/chat" class="nav-link">Chat</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default AdminNavbar