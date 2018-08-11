const Controller = require('../../lib/controller')
const paymentFacade = require('./facade')

class PaymentController extends Controller {}

module.exports = new PaymentController(paymentFacade)
