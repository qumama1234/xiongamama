const Facade = require('../../lib/facade')
const paymentSchema = require('./schema')

class PaymentFacade extends Facade {}

module.exports = new PaymentFacade('Payment', paymentSchema)
