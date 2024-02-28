import axios from "axios";

// DOCKER 
//const CLIENT_URL = "http://localhost:8031/client/consumptions";     // SCHIMBA SI IN ClientDevices

// LOCAL
const CLIENT_URL = "http://localhost:8070/client/consumptions";     // SCHIMBA SI IN ClientDevices

class ConsumptionService {
    getAllConsumptionsByUserAndTimestamp(userId, timestamp, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
        return axios.get(CLIENT_URL + "/" + userId + "/" + timestamp, config);
    }
}

export default new ConsumptionService;