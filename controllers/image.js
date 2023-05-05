const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: '4d9db0dce81a452483b5f3a387dc4971'
})
const handleApiCall = (req, res) => {
  const IMAGE_URL = req.body.input;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": "clarifai",
      "app_id": "main"
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Key 4d9db0dce81a452483b5f3a387dc4971'
    },
    body: raw
  };

  fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
      console.log('error', error);
      return res.status(400).json('Unable to work with API');
    });
};

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