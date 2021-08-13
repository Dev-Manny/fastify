'use strict'

const { test } = require('tap')
const Fastify = require('..')

test('encapuslates an error handler', async t => {
  t.plan(3)

  const fastify = Fastify()
  fastify.register(async function (fastify) {
    fastify.setErrorHandler(async function a (err) {
      t.equal(err.message, 'kaboom')
      throw new Error('catched')
    })
    fastify.get('/encapsulated', async () => { throw new Error('kaboom') })
  })

  fastify.setErrorHandler(async function b (err) {
    t.equal(err.message, 'catched')
    throw new Error('wrapped')
  })

  const res = await fastify.inject('/encapsulated')
  t.equal(res.json().message, 'wrapped')
})
