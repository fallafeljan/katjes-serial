#!/usr/bin/env node
const url = require('url')
const parseOptions = require('argv-options')
const SerialPort = require('serialport')
const WebSocket = require('ws')
const SIOWrapper = require('../util/SIOWrapper')

let args

try {
  args = parseOptions(process.argv.slice(2), {
    p: 'path',
    h: 'host'
  })
}
catch (err) {
  console.log('Usage: katjes-serial --path [path] --host [host]')
  process.exit(1)
}

const {path, host} = args
console.log(`Connecting to device ${path} and ${host}`)

var port = new SerialPort(path, {
  baudRate: 9600
})

port.on('open', () => {
  port.write('main screen turn on', err => {
    if (err) {
      return console.log('Error on write: ', err.message)
    }

    createSocket(host)
  })
})

port.on('error', err => {
  console.log('Error: ', err.message)
})

port.on('data', buffer => {
  if (!Buffer.isBuffer(buffer)) {
    buffer = new Buffer(buffer)
  }

  const data = buffer.toString()
  console.log(`Data (${typeof data}):`, data)

  if (data === 'OK') {
    port.write('OK')
  }
})

function createSocket(host) {
  const endpoint = 'socket.io/?EIO=3&transport=websocket'
  const ws = new WebSocket(`ws://${host}/${endpoint}`)
  const socket = new SIOWrapper(ws)

  socket.on('connect', () => {
    socket.emit('handshake', {
      identity: 'cli'
    })

    socket.on('handshake', ({response}) =>
      socket.disconnect())
  })
}
