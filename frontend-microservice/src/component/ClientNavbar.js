import React from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'

const ClientNavbar = () => {
    const { id } = useParams();
    console.log(id);

    return (
        <>
            <nav class="navbar navbar-dark bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand">CLIENT</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link to={"/client/"+id} class="nav-link active" aria-current="page">Devices</Link>
                            </li>
                            <li class="nav-item">
                                <Link to={"/client/"+id+"/consumption"} class="nav-link active" aria-current="page">Consumption</Link>
                            </li>
                            <li class="nav-item">
                                <Link to={"/client/chat/" + id} class="nav-link">Chat</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default ClientNavbar