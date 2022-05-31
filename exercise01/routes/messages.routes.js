const router = require("express").Router();
const MessageAppService = require("../services/messageapp.service")

router.get("/message", (req, res) => {

    res.json("Hello world")
})

router.post("/message", (req, res) => {
   
    const {destination, body} = req.body

    MessageAppService
        .createMessage(destination, body)
        .then(resp => res.status(200).json(resp.data))
        .catch(err => res.status(500).json(err))
    
})

router.post("/messages", (req, res) => {
    
    const { destination, message } = req.body

    // MessageAppService
    //     .saveMessage(destination, message)
    //     .then(response => res.json(response.data))
    //     .catch(err => res.json(err))

})


module.exports = router;