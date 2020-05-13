import { APIGatewayProxyResult, S3Event } from 'aws-lambda'
import axios from 'axios'

export async function handler({
  Records,
}: S3Event): Promise<APIGatewayProxyResult> {
  try {
    if (Records.length < 1) {
      throw new Error('No records')
    }

    const { key } = Records[0].s3.object
    const res = await axios
      .post<{ ETag: string }>(
        `${process.env.API_PATH}/skeleton?key=${key}`,
        undefined,
        {
          timeout: 180000,
        }
      )
      .catch((err) => {
        throw err
      })

    return {
      statusCode: res.status,
      body: JSON.stringify(res.data),
    }
  } catch (err) {
    return {
      statusCode: err.response?.status || err.statusCode || 500,
      body: JSON.stringify(err.message),
    }
  }
}
