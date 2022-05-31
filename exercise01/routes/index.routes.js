const router = require("express").Router();


router.use("/", require("./messages.routes") )


module.exports = router;
