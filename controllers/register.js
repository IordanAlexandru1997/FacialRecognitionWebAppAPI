const handleRegister = (req, res, bcrypt, db) => {
    const { email, name, password } = req.body;

    console.log('Request body:', req.body); // Add this line to log the request body

    if (!(email && name && password)) {
        return res.status(400).json('incorrect form of submission');
    }
    const hash = bcrypt.hashSync(password);

    db.transaction((trx) => {
        trx
            .insert({
                hash: hash,
                email: email,
            })
            .into('login')
            .returning('email')
            .then((loginEmail) => {
                console.log('Login email:', loginEmail); // Add this line to log the login email
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date(),
                    })
                    .then((user) => {
                        res.json(user[0]);
                    });
            })
            .then(trx.commit)
            .catch((err) => {
                console.log('Transaction error:', err); // Add this line to log the transaction error
                trx.rollback;
            });
    }).catch((err) => {
        console.log('Registration error:', err); // Add this line to log the registration error
        res.status(400).json('could not register user');
    });
};

module.exports = {
    handleRegister: handleRegister,
};
