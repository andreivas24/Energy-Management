import axios from "axios";

// DOCKER 
//const GROUP_URL = "http://localhost:8041/groups";   

// LOCAL
const GROUP_URL = "http://localhost:8060/groups";   

class GroupService {
    saveGroup(groupCreationDto, adminId, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.post(GROUP_URL + "/admin/" + adminId, groupCreationDto, config);
    }

    getAllGroupsByAdminId(adminId, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(GROUP_URL + "/admin/" + adminId, config);
    }

    getAllGroupsByClientId(clientId, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(GROUP_URL + "/client/" + clientId, config);
    }

    deleteGroupById(groupId, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.delete(GROUP_URL + "/admin/" + groupId, config);
    }

    getGroupById(groupId, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(GROUP_URL + "/" + groupId, config);
    }
}

export default new GroupService;