import * as querystring from 'querystring';
import * as axios from 'axios';

exports.handler = async (event: any) => {

    const body = querystring.parse(event.body);
    const payload = JSON.parse(body.payload);

    const responseUrl = payload.response_url;
    const request_location_origin = payload.submission.loc_origin;
    const request_location_destination = payload.submission.loc_destination;
    
    const data = {
        text: `Success!`,
        response_type: "in_channel",
        attachments: [{
            color: 'good',
            title: 'Received parameters:',
            fields: [
                { title: 'loc_origin', value: request_location_origin },
                { title: 'loc_destination', value: request_location_destination }
            ]
        }],
    }
    await axios.default.post(responseUrl, data);
    
    const response = {
        statusCode: 200,
    };

    return response;
};
