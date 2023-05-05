const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: '6f185842c4104dcca932ce5f402b7bff'
})

const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => { res.json(data) })
    .catch(err => res.status(400).json('Unable to work with API'))
}

handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.status(200).send(entries[0].entries))
    .catch(err => { res.status(400).json('unable to update entries') })
}

module.exports = {
  handleImage,
  handleApiCall
}