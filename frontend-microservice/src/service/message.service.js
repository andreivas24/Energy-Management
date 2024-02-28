import axios from "axios";

// DOCKER
//const MESSAGE_URL = "http://localhost:8041/messages";
//const GROUP_MESSAGE_URL = "http://localhost:8041/groupMessages";
//const TYPE_URL = "http://localhost:8041/type";

// LOCAL
// SCHIMBA SI IN ChatAdmin, ChatClient, ContactsAdmin, ContactsClient, GroupAdmin, GroupClient
const MESSAGE_URL = "http://localhost:8060/messages";
const GROUP_MESSAGE_URL = "http://localhost:8060/groupMessages";
const TYPE_URL = "http://localhost:8060/type";

class MessageService {

    sendMessage(messageSaveDto, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
        return axios.post(MESSAGE_URL, messageSaveDto, config);
    }

    getAllMessagesBySenderIdAndReceiverId(senderId, receiverId, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
        return axios.get(MESSAGE_URL + "/" + senderId + "/" + receiverId, config);
    }

    sendGroupMessage(groupMessageSaveDto, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
        return axios.post(GROUP_MESSAGE_URL, groupMessageSaveDto, config);
    }

    getAllGroupMessages(groupId, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
        return axios.get(GROUP_MESSAGE_URL + "/" + groupId, config);
    }

    sendTypeNotification(senderName, receiverId, token) {
        const config = {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
        return axios.post(TYPE_URL + "/" + senderName + "/" + receiverId, {}, config);
    }
}

export default new MessageService;