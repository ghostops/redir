import * as AWSLambda from 'aws-lambda';
import { response } from 'helpers';

export default async (
    event: AWSLambda.APIGatewayProxyEvent,
    context: AWSLambda.Context,
): Promise<AWSLambda.APIGatewayProxyResult> => {
    return response({  body: { alive: true } });
};
