const Controller = require('../../lib/controller')
const roomFacade=require('./facade');

class RoomController extends Controller {
}

module.exports = new RoomController(roomFacade)
