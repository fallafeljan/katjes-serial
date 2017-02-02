function serializeMessage(eventName, data) {
  const payload = new Array(eventName, data)
  return `42${JSON.stringify(payload)}`
}

function deserializeMessage(message) {
  const pattern = /^([0-9]+)(.*)$/
  const [_, code, payload] = pattern.exec(message)
  
  if (parseInt(code) !== 42 || !payload) {
    return {}
  } else {
    const [eventName, data] = JSON.parse(payload)
    return {eventName, data}
  }
}

module.exports = {
  serializeMessage,
  deserializeMessage
}
