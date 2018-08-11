
const crypto = require("crypto");
class Controller {
  constructor (facade) {
    this.facade = facade
  }

  create (body) {
    body["id"]=crypto.randomBytes(16).toString("hex");
    return this.facade.create(body)
      .then(doc => {
        return doc
      })
  }

  find (body) {
    return this.facade.find(body)
      .then(collection => {
        return collection
      })
  }

  update (id,body) {
    return this.facade.update({ id: id }, body)
      .then((results) => {
        return results;
      })
  }

  findOne (req, res, next) {
    return this.facade.findOne(req.query)
      .then(doc => res.status(200).json(doc))
      .catch(err => next(err))
  }

  findById (req, res, next) {
    return this.facade.findById(req.params.id)
      .then((doc) => {
        if (!doc) { return res.sendStatus(404) }
        return res.status(200).json(doc)
      })
      .catch(err => next(err))
  }


  remove (req, res, next) {
    this.facade.remove({ _id: req.params.id })
      .then((doc) => {
        if (!doc) { return res.sendStatus(404) }
        return res.sendStatus(204)
      })
      .catch(err => next(err))
  }
}

module.exports = Controller
