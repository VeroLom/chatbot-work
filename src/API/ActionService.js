import axios from "axios";

export default class ActionService {
    static async getActions() {
        //console.log("* ActionService::getActions()");
        const apiUrlPrefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : '';
        const response = await axios.get(`${apiUrlPrefix}/udata://content/getActions/`);
        return response;
    }
}