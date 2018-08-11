const Facade = require('../../lib/facade')
const roomSchema = require('./schema')

class RoomFacade extends Facade {}

module.exports = new RoomFacade('Room', roomSchema)
