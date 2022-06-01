const axios = require('axios')

class MessageAppService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://messageapp:3000",
        })
    }
    createMessage = (destination, body) => {
      
        return this.api.post('/message', {destination, body})
    }

    saveMessage = (destination, message) => {

        return this.api.post('/messages', { destination, message })
    }

}

const messageAppService = new MessageAppService()
module.exports = messageAppService

