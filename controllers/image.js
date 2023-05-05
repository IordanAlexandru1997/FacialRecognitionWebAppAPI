const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: '4d9db0dce81a452483b5f3a387dc4971'
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