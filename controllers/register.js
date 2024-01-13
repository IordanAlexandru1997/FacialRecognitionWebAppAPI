const handleRegister = (req, res, bcrypt, db) => {

    // Input validation
    if(!(req.body.email && req.body.name && req.body.password)) {
      return res.status(400).json('Invalid input');
    }
  
    const hash = bcrypt.hashSync(req.body.password);
    
    // Log input
    console.log('Register Request:', req.body); 
    
    // Try login insert
    db('login').insert({
      hash: hash,
      email: req.body.email  
    })
    .returning('email')
    .then(loginEmail => {
  
      // Log db result 
      console.log('Login email inserted:', loginEmail);
  
      // Try user insert
      return db('users').insert({
        email: loginEmail[0].email,
        name: req.body.name,
        joined: new Date()
      }) 
      .returning('*');
  
    })
    .then(user => {
      
      // Log user 
      console.log('User inserted:', user);
  
      // Success
      res.json(user[0]);
  
    })
    .catch(err => {
  
      // Log error
      console.error('Registration error', err);
      res.status(400).json({message: 'Registration failed', error: err.toString()});
  
    });
  
  };
  
  module.exports = {
    handleRegister
  }