import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ClientNavbar from '../component/ClientNavbar';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import consumptionService from "../service/consumption.service"
import { useNavigate } from "react-router-dom";


const ClientChart = () => {
    const { id } = useParams();
    const { date } = useParams();

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
      consumptionService
            .getAllConsumptionsByUserAndTimestamp(id, date, token)
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                navigate("/");
                console.log(error);
            })
    }, [])

    console.log("id = " + id);
    console.log("date = " + date);

    return (
        <>
          <ClientNavbar />
      
          <div className="chart-header">
              <h1>Energy Consumption</h1>
            </div>

            <div className="chart-container">
              <BarChart width={1200} height={600} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" fill="#8884d8" />
              </BarChart>
            </div>

            <div class="text-center col-md-6 offset-md-3 add-button">
                <Link to={"/client/" + id + "/consumption"} class="save-button btn btn-dark">Back</Link>
            </div>
        </>
      );
};

export default ClientChart;