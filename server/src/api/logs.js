//grab express router from express
const { Router } = require('express');

//need logEntry model 
const LogEntry = require('../models/LogEntry');

const router = Router();



router.get('/', async(req, res) => {
    try{
        const entries = await LogEntry.find();
        res.json(entries);
    } catch (error){
        next(error);
    }
    res.json(entries);
});


router.post('/', async (req,res,next) => {  //including next to handle errors
    try {
        const logEntry = new LogEntry(req.body);
        const createdEntry = await logEntry.save();//try to save new entry in DB
        res.json(createdEntry); //respond with the entry 
    } catch (error) {
        //we've already created error handling in middlewares file, so any error will follow that logic
        if (error.name === 'ValidationError'){
            res.status(422); //return the 422 status code if data doesn't match model requirements 
        }
        next(error);
    }
});

module.exports = router;