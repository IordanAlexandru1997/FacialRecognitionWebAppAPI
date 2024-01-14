const handleRegister = async (req, res, bcrypt, pool) => {
    // Input validation
    if(!(req.body.email && req.body.name && req.body.password)) {
      return res.status(400).json('Invalid input');
    }

    const hash = bcrypt.hashSync(req.body.password);

    try {
        // Get a client from the connection pool
        const client = await pool.connect();

        try {
            // Start a transaction
            await client.query('BEGIN');

            // Insert into login table
            const loginInsertQuery = 'INSERT INTO login(hash, email) VALUES($1, $2) RETURNING email';
            const loginResult = await client.query(loginInsertQuery, [hash, req.body.email]);
            const loginEmail = loginResult.rows[0].email;

            console.log('Login email inserted:', loginEmail);

            // Insert into users table
            const userInsertQuery = 'INSERT INTO users(email, name, joined) VALUES($1, $2, $3) RETURNING *';
            const userResult = await client.query(userInsertQuery, [loginEmail, req.body.name, new Date()]);
            const user = userResult.rows[0];

            console.log('User inserted:', user);

            // Commit the transaction
            await client.query('COMMIT');

            res.json(user);
        } catch (err) {
            // If an error is caught, rollback the transaction
            await client.query('ROLLBACK');
            throw err;
        } finally {
            // Release the client back to the pool
            client.release();
        }
    } catch (err) {
        // Log error
        console.error('Registration error', err);
        res.status(400).json({message: 'Registration failed', error: err.toString()});
    }
};

module.exports = {
    handleRegister
};
