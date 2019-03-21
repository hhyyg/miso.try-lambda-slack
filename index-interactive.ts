import * as querystring from 'querystring';
import * as axios from 'axios';
import * as aws from 'aws-sdk';
import { DynamoDbSettings } from 'aws-sdk/clients/dms';

const dynamo = new aws.DynamoDB.DocumentClient({
    region: 'ap-northeast-1'
});

exports.handler = async (event: any) => {

    const body = querystring.parse(event.body);
    const payload = JSON.parse(body.payload);

    const responseUrl = payload.response_url;
    const request_location_origin = payload.submission.loc_origin;
    const request_location_destination = payload.submission.loc_destination;
    const userName = payload.user.name;
    const userId = payload.user.id;
    
    putTicket(userId, userName, request_location_origin, request_location_destination);

    const data = {
        text: `Success! userId: ${userId}, userName: ${userName}`,
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

function putTicket(
        userId: string,
        userName: string,
        locOrigin: string,
        locDestination: string,
        ) {

    const item: aws.DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'tickets',
        Item: {
            userId,
            userName,
            locOrigin,
            locDestination,
            createdAt: new Date().toISOString()
        }
    };
    dynamo.put(item, (error, data) => {
        if (error) {
            console.error(error);
        }
    });
}
