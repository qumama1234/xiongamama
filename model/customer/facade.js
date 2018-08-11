const Facade = require('../../lib/facade')
const customerSchema = require('./schema')

class CustomerFacade extends Facade {}

module.exports = new CustomerFacade('Customer', customerSchema)
