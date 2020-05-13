import { handler } from '../src'

describe('handler()', () => {
  it('resoleves dummy response', async () => {
    expect.assertions(1)
    return expect(handler()).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify({}),
    })
  })
})
