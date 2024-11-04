import axios from 'axios';

export default class FormService {
    static async sendForm(data) {
        //console.log("* FormService::sendForm()", data);
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            //console.log(key, data[key]);
            formData.append(key, data[key]);
        });
        //console.log('* Fields', formData);

        const apiUrlPrefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : '';
        const response = await axios.postForm(`${apiUrlPrefix}/udata://webforms/send/`, formData);
        return response;
    }
}