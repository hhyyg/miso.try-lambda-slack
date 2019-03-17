import * as querystring from 'querystring';

const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;

exports.handler = async (event: any) => {

    const payload = querystring.parse(event.body);
    if (payload.token !== SLACK_VERIFICATION_TOKEN) {
        throw new Error('Invalid verification token');
    }

    const body = {
        response_type: "in_channel",
        text: "hello miso"
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };

    return response;
};
