const Clarifai = require('clarifai');

// Define fetch at the top level, but don't assign it yet
let fetch;

// Self-invoking async function to import fetch
(async () => {
    fetch = (await import('node-fetch')).default;
})();

const app = new Clarifai.App({
    apiKey: '4d9db0dce81a452483b5f3a387dc4971'
});

const handleApiCall = async (req, res) => {
    if (!fetch) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for fetch to be imported
    }

    const IMAGE_URL = req.body.input;
    const raw = JSON.stringify({
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
const handleImage = (req, res, pool) => {
    const { id } = req.body;

    if (id === 0 || id === 'guest') {
        id= '14'
    }

    const query = `
        UPDATE users
        SET entries = entries + 1
        WHERE id = $1
        RETURNING entries;`;

        pool.query(query, [id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(400).json('Unable to update entries');
            }
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0].entries);
            } else {
                res.status(400).json('User not found');
            }
        });
};



module.exports = {
    handleImage,
    handleApiCall
};
