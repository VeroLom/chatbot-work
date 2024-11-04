import axios from "axios";

export default class MessageService {
    static async getActions() {
        //console.log("* MessageService::getActions()");
        const apiUrlPrefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : '';
        const response = await axios.get(`${apiUrlPrefix}/udata://content/getMessages/`);
        return response;
    }
}