const EventEmitter = require('events')

const {
  serializeMessage,
  deserializeMessage
} = require('./socket_io')

module.exports = class SIOWrapper extends EventEmitter {
  constructor(ws) {
    super()

    this.ws = ws

    ws.on('open', () => super.emit('connect'))

    ws.on('message', message => {
      const {eventName, data} = deserializeMessage(message)
      super.emit(eventName, data)
    })
  }

  emit(eventName, data) {
    const {ws} = this
    const serialized = serializeMessage(eventName, data)

    ws.send(serialized)
  }

  disconnect() {
    const {ws} = this
    ws.close()
  }
}
