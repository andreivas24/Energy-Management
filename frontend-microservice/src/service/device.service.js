import axios from "axios";

// DOCKER 
//const ADMIN_URL = "http://localhost:8011/admin/devices";
//const CLIENT_URL = "http://localhost:8011/client/devices";
//const MAPPING_URL = "http://localhost:8011/admin/mappings";

// LOCAL
const ADMIN_URL = "http://localhost:8080/admin/devices";
const CLIENT_URL = "http://localhost:8080/client/devices";
const MAPPING_URL = "http://localhost:8080/admin/mappings";

class DeviceService {
    getDeviceById(id, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(ADMIN_URL + "/" + id, config);
    }

    getAllDevices(token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(ADMIN_URL, config);
    }

    saveDevice(device, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.post(ADMIN_URL, device, config);
    }

    deleteDeviceById(id, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.delete(ADMIN_URL + "/" + id, config);
    }

    updateDevice(id, device, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.put(ADMIN_URL + "/" + id, device, config);
    }

    getDevicesByUserId(id, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(CLIENT_URL + "/" + id, config);
    }

    getAllUserDevices(token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(MAPPING_URL, config);
    }

    saveUserDeviceMapping(userDevice, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.post(MAPPING_URL, userDevice, config);
    }


    
    deleteUserDeviceMapping(uuid, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.delete(MAPPING_URL + "?id=" + uuid, config);
    }
}

export default new DeviceService;