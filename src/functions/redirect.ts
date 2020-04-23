import * as AWSLambda from 'aws-lambda';
import * as dns from 'dns';
import * as url from 'url';
import { promisify } from 'util';
import { response } from 'helpers';

const resolveTxt = promisify(dns.resolveTxt);

const DNS_PREFIX = 'REDIRECTLI=';

export default async (
    event: AWSLambda.APIGatewayProxyEvent,
    context: AWSLambda.Context,
): Promise<AWSLambda.APIGatewayProxyResult> => {
    const hostHeader = event.headers['Host'];

    if (!hostHeader) {
        return response({
            body: { error: 'no host header present' },
            statusCode: 500,
        });
    }

    const hostAsUrl = `https://${hostHeader}`;
    const parsedHost = url.parse(hostAsUrl);

    const dnsResponse = await resolveTxt(parsedHost.hostname);

    const redirectRecords = dnsResponse.find((res) => res && res[0].startsWith(DNS_PREFIX));

    if (!redirectRecords || !redirectRecords.length) {
        return response({
            body: { error: 'no redirect record found' },
            statusCode: 500,
        });
    }

    const redirectRecord = redirectRecords[0];

    const destination = redirectRecord.split(DNS_PREFIX)[1];

    const responseHtml = `<a href="${destination}">${destination}</a>`;

    return response({
        body: responseHtml,
        headers: {
            'Content-Type': 'text/html',
            Location: destination,
        },
        statusCode: 302,
    });
};
