#!/usr/bin/env node
const url = require('url')
const parseOptions = require('argv-options')
const SerialPort = require('serialport')
const WebSocket = require('ws')
const SIOWrapper = require('../util/SIOWrapper')

let args

try {
  args = parseOptions(process.argv.slice(2), {
    p: {
      alias: 'path'
    },
    h: {
      alias: 'host'
    }
  })
}
catch (err) {
  console.log('Usage: katjes-serial --path [path] --host [host]')
  process.exit(1)
}

const path = 'socket.io/?EIO=3&transport=websocket'
const ws = new WebSocket(`ws://${args.host}/${path}`)
const socket = new SIOWrapper(ws)

socket.on('connect', () => {
  socket.emit('handshake', {
    identity: 'cli'
  })

  socket.on('handshake', ({response}) =>
    socket.disconnect())
})
