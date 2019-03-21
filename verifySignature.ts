import * as crypto from 'crypto';
import * as timingSafeCompare from 'tsscmp';

export function isVerified(req: any) {
    console.log(req['headers']);
    const signature = req['headers']['X-Slack-Signature'];
    const timestamp = req['headers']['X-Slack-Request-Timestamp'];
    const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
    const [version, hash] = signature.split('=');

    // Check if the timestamp is too old
    const fiveMinutesAgo = ~~(Date.now() / 1000) - (60 * 5);
    if (timestamp < fiveMinutesAgo) return false;

    hmac.update(`${version}:${timestamp}:${req['body']}`);

    // check that the request signature matches expected value
    return timingSafeCompare(hmac.digest('hex'), hash);
}; 