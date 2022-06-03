


const handleProfile =(req,res,db)=>{const { id } = req.params;
    db.select('*').from('users').where({id}).then(user =>{
        res.json(user[0])
    })

}


module.exports = {
    handleProfile:handleProfile
}