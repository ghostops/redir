import * as AWSLambda from 'aws-lambda';

interface ResponseProps {
    body: Object | string;
    statusCode?: number;
    headers?: {
        [header: string]: boolean | number | string;
    };
    multiValueHeaders?: {
        [header: string]: boolean | number | string;
    };
}

export const response = (opts: ResponseProps): AWSLambda.APIGatewayProxyResult => ({
    statusCode: opts.statusCode || 200,
    body: typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body),
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...opts.headers,
    },
    multiValueHeaders: opts.multiValueHeaders as any,
    isBase64Encoded: false,
});
