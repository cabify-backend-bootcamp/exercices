const newcredit = require("../clients/newCredit");

module.exports = function(req, res) {
  newcredit(
    {
      ...req.body,
      status: "OK"
    },
    function(_result, error) {
      if (error) {
        res.statusCode = 500;
        res.end(error);
      }
      res.end("OK");
    }
  );
};
