import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { handler } from '../src'

describe('handler()', () => {
  let mock: MockAdapter
  const flush = () => new Promise((resolve) => setTimeout(resolve, 0))
  const event = {
    Records: [
      {
        eventVersion: '2.0',
        eventSource: 'aws:s3',
        awsRegion: 'ap-northeast-1',
        eventTime: '1970-01-01T00:00:00.000Z',
        eventName: 'ObjectCreated:Put',
        userIdentity: {
          principalId: 'EXAMPLE',
        },
        requestParameters: {
          sourceIPAddress: '127.0.0.1',
        },
        responseElements: {
          'x-amz-request-id': 'EXAMPLE123456789',
          'x-amz-id-2':
            'EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH',
        },
        s3: {
          s3SchemaVersion: '1.0',
          configurationId: 'testConfigRule',
          bucket: {
            name: 'example-bucket',
            ownerIdentity: {
              principalId: 'EXAMPLE',
            },
            arn: 'arn:aws:s3:::example-bucket',
          },
          object: {
            key: 'source/image.jpg',
            size: 1024,
            eTag: '0123456789abcdef0123456789abcdef',
            sequencer: '0A1B2C3D4E5F678901',
          },
        },
      },
    ],
  }

  beforeEach(() => {
    mock = new MockAdapter(axios)
    mock.onPost(`${process.env.API_PATH}/skeleton`).reply(200, {
      ETag: '1123456789abcdef0123456789abcdef',
    })
  })

  afterEach(() => {
    mock.restore()
  })

  it('calls axios.get() with some arguments', async () => {
    const spy = jest.spyOn(axios, 'post')
    handler(event, {} as any, () => undefined)
    await flush()

    expect(spy).toHaveBeenCalledWith(
      'https://api.view-expander.net/v1/skeleton',
      {
        key: 'image.jpg',
      }
    )

    spy.mockRestore()
  })

  it('calls callback', async () => {
    const callback = jest.fn()
    handler(event, {} as any, callback)
    await flush()

    return expect(callback).toHaveBeenCalledWith(undefined, {
      ETag: '1123456789abcdef0123456789abcdef',
    })
  })
})
