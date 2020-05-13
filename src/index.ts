import { APIGatewayProxyResult, S3Event } from 'aws-lambda'

export async function handler(event: S3Event): Promise<APIGatewayProxyResult> {
  console.log('an event received:', event)

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  }
}
