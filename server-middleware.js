let util = require('./server-util');
function authorize(req, res, next) {

  var val  = util.validateRequest(req);
  if(val.isValid){
    next();
  }else{
    return res.json({ status: 401, message: val.message })
  }
}


module.exports ={
  authorize
}
