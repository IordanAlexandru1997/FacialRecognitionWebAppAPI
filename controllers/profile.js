const handleProfile = (req, res, pool) => {
    const { id } = req.params;
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(500).json('Error accessing database');
        } else if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json('User not found');
        }
    });
};

module.exports = {
    handleProfile: handleProfile
};
