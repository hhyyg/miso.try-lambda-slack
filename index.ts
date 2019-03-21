import * as querystring from 'querystring';
import * as axios from 'axios';
import { isVerified } from './verifySignature';
import * as aws from 'aws-sdk';
import { DataPipeline } from 'aws-sdk';

const SLACK_ACCESS_TOKEN = process.env.SLACK_ACCESS_TOKEN;
const SLACK_API_URL = 'https://slack.com/api';

const dynamo = new aws.DynamoDB.DocumentClient({
    region: 'ap-northeast-1'
});

exports.handler = async (event: any) => {

    if (!isVerified(event)) {
        console.error('Verification token mismatch');
        return {
            statusCode: '401'
        }
    }

    const payload = querystring.parse(event.body);
    const responseUrl = payload.response_url;
    const command = payload.text;
    const userId = payload.user_id;
    const triggerId = payload.trigger_id;

    if (command === 'list') {
        await execShowList(userId, responseUrl);
    } else {
        await execShowInputDialog(triggerId);
    }

    return {
            statusCode: '200'
    };
};

async function execShowList(userId: string, responseUrl: string) {
    const fields: any[] = [];
    const data = await getTickets(userId);
    if (data.Items) { 
        data.Items.forEach(element => {
            fields.push( { title: 'location', value: `${element.locOrigin} -> ${element.locDestination}` });
        });
    }
    const message = {
        text: 'Your tickets:',
        response_type: "in_channel",
        attachments: [{
            color: 'good',
            title: 'Tickets:',
            fields: fields
        }],
    }
    await axios.default.post(responseUrl, message);
}

async function execShowInputDialog(triggerId: string) {
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
                    name: "loc_origin",
                    placeholder: "Tokyo",
                    hint: "hint text",
                },
                {
                    type: "text",
                    label: "Dropoff Location",
                    name: "loc_destination",
                    placeholder: "Hokkaido",
                    hint: "hint text",
                }
            ]
        })
    };

    // open dialog
    await axios.default.post(`${SLACK_API_URL}/dialog.open`, querystring.stringify(dialog));
}

function getTickets(userId: string): Promise<aws.DynamoDB.DocumentClient.QueryOutput> {

    return new Promise<aws.DynamoDB.DocumentClient.QueryOutput>((resolve, reject) => {
        const params: aws.DynamoDB.DocumentClient.QueryInput = {
            TableName: 'tickets',
            KeyConditionExpression: '#key = :str',
            ExpressionAttributeNames: {
                '#key': 'userId'
            },
            ExpressionAttributeValues: {
                ':str': userId
            }
        };
        dynamo.query(params, (error, data) => {
            if (error) {
                reject(error)
            } else {
                resolve(data);
            }
        });
    });
}
