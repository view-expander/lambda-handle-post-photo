import { Callback, Context, S3Event } from 'aws-lambda'
import axios from 'axios'

export function handler(
  { Records }: S3Event,
  context: Context,
  callback: Callback
): void {
  if (Records.length < 1) {
    return callback(new Error('No records'))
  }

  axios
    .post<{ ETag: string }>(`${process.env.API_PATH}/skeleton`, {
      key: Records[0].s3.object.key.replace(/^source\/(.+)$/, '$1'),
    })
    .then((res) => callback(undefined, res.data))
    .catch(callback)
}
