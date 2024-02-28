import React, { useState, useEffect } from 'react';
import ClientNavbar from '../component/ClientNavbar';
import { useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';


const ClientDate = () => {
    const { id } = useParams();
    console.log(id);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 
    const [selectedDate, setSelectedDate] = useState(currentDate);

    const defaultUnixTimestamp = Math.floor(currentDate.getTime() / 1000);

    const [unixTimestamp, setUnixTimestamp] = useState(defaultUnixTimestamp);

    const handleDateChange = date => {
        setSelectedDate(date);
        const timestamp = date ? Math.floor(date.getTime() / 1000) : null;
        setUnixTimestamp(timestamp);
    };

    useEffect(() => {
        console.log(defaultUnixTimestamp);
    }, []);

    return (
        <>
            <ClientNavbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 date-container ">
                        <h1 className="text-center">Select Date</h1>
    
                        <div className="text-center date-container ">
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy/MM/dd"
                                showPopperArrow={false}
                                inline
                            />
                        </div>
    
                        <div className="text-center add-button date-container ">
                            <Link to={"/client/" + id + "/consumption/" + unixTimestamp} className="save-button btn btn-dark">
                                Show Consumption
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default ClientDate;
