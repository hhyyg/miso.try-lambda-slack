import * as querystring from 'querystring';
import * as axios from 'axios';

const SLACK_ACCESS_TOKEN = process.env.SLACK_ACCESS_TOKEN;
const SLACK_API_URL = 'https://slack.com/api';

exports.handler = async (event: any) => {

    const payload = querystring.parse(event.body);

    const triggerId = payload.trigger_id;
    const dialog = {
        token: SLACK_ACCESS_TOKEN,
        trigger_id: triggerId,
        dialog: JSON.stringify({
            callback_id: "send-form-id",
            title: "Request a Ride",
            submit_label: "Request",
            notify_on_cancel: true,
            state: "Limo",
            elements: [
                {
                    type: "text",
                    label: "Pickup Location",
                    name: "loc_origin"
                },
                {
                    type: "text",
                    label: "Dropoff Location",
                    name: "loc_destination"
                }
            ]
        })
    };

    // open dialog
    await axios.default.post(`${SLACK_API_URL}/dialog.open`, querystring.stringify(dialog));

    const body = {
        response_type: "in_channel",
        text: "Please, input form."
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };

    return response;
};
