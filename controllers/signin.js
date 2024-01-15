const handleSignin = async (req, res, bcrypt, pool) => {
    const { email, password } = req.body;
    if (!(email && password) && email != "guest@example.com") {
        return res.status(400).json('incorrect form of submission');
    }

    try {
        // Get a client from the connection pool
        const client = await pool.connect();

        try {
            // Query to get the hash from the login table
            const loginQuery = 'SELECT email, hash FROM login WHERE email = $1';
            const loginResult = await client.query(loginQuery, [email]);

            if (loginResult.rows.length > 0) {
                const isValid = bcrypt.compareSync(password, loginResult.rows[0].hash);

                if (isValid) {
                    // Query to get the user from the users table
                    const userQuery = 'SELECT * FROM users WHERE email = $1';
                    const userResult = await client.query(userQuery, [email]);

                    if (userResult.rows.length > 0) {
                        res.json(userResult.rows[0]);
                    } else {
                        res.status(400).json('unable to get user');
                    }
                } else {
                    res.status(400).json('wrong credentials');
                }
            } else {
                res.status(400).json('wrong credentials');
            }
        } catch (err) {
            // Handle any query errors
            console.error('Sign in error', err);
            res.status(500).json({ message: 'Error during sign in', error: err.message });
} finally {
// Release the client back to the pool
client.release();
}
} catch (err) {
// Handle any connection errors
console.error('Database connection error', err);
res.status(500).json({ message: 'Unable to connect to database', error: err.message });
}
};

module.exports = {
handleSignin
};