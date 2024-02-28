import axios from "axios";

// DOCKER
//const ADMIN_URL = "http://localhost:8021/admin/users";
//const USER_URL = "http://localhost:8021";
//const LOGIN_URL = "http://localhost:8021/login";

// LOCAL
const ADMIN_URL = "http://localhost:8090/admin/users";
const USER_URL = "http://localhost:8090";
const LOGIN_URL = "http://localhost:8090/login";

class UserService {
    getUserById(id, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(ADMIN_URL + "/" + id, config);
    }

    getAllUsers(token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(ADMIN_URL, config);
    }

    saveUser(user, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.post(ADMIN_URL, user, config);
    }

    deleteUserById(id, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.delete(ADMIN_URL + "/" + id, config);
    }

    updateUser(id, user, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.put(ADMIN_URL + "/" + id, user, config);
    }

    login(name, password){
        return axios.get(LOGIN_URL, {params: {name, password}});
    }

    getAllContacts(token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(USER_URL + "/contacts", config);
    }

    getContactById(id, token){
        const config = {
            headers: {
                "Authorization": "Bearer " + token}
          };
        return axios.get(USER_URL + "/contacts/" + id, config);
    }
}

export default new UserService;