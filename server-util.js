
var jwt = require('jsonwebtoken');
var jwtPrivateKey = '4ee442f8-42ec-473e-b565-5df657a0348a';

function getToken(req) {
  try {
    var authStr = req.headers["authorization"];
    if (!authStr)
      authStr = req.query["authorization"];

    if (!authStr)
      return null;

    authStr = authStr.split(' ');
    return { schema: authStr[0], token: authStr[1] };
  } catch (ex) {

  }
}


function signJWTToken(claims, expiry) {
  var options = { issuer: 'github.com/premchandrasingh', audience: 'all' };
  if (expiry && expiry == 'never') {
    // do not define expiresIn option
  } else {
    options.expiresIn = expiry || '10h';
  }

  return jwt.sign(claims, jwtPrivateKey, options);
}

function varifyJwtToken(jwtToken) {
  try {
    var decoded = jwt.verify(jwtToken, jwtPrivateKey);
    var user = {
      identity: {
        is_authenticated: true,
        name: decoded['user_name'],
        user_id: decoded['user_id'],
      },
      roles: decoded['roles'] || [],
      isInRole: function (roles) {
        if (typeof roles == 'string')
          roles = [roles];

        if (this.roles.length == 0)
          return false;

        return true;
        //return _.intersection(this.roles, roles).length > 0;
      }
    };

    return { success: true, user: user };
  } catch (ex) {
    return { success: false, message: 'Expired or invalid token.' };
  }
}


function validateRequest(req) {
  var authHeader = getToken(req);
  if (!authHeader) {
    return { isValid: false, message: 'No Authorization token supplied.' };
  }

  if (authHeader.schema.toLowerCase() != 'bearer') {
    return { isValid: false, message: 'Invalid Authorization schema. It should be bearer.' };
  }

  var result = varifyJwtToken(authHeader.token);

  if (result.success) {
    req.user = result.user;
    return { isValid: true };
  } else {
    return { isValid: false, message: result.message };
  }
}

function login(req, res) {
  if (req.body.username != 'user@email.com' && req.body.password != 'password') {
    res.json({
      status: 400,
      payload: {
        message: 'Invalid user name or password'
      }
    });
    return;
  }


  var claims = {
    user_name: req.body.username || 'premchandrasingh',
    user_id: 111
  };

  res.json({
    status: 200,
    payload: {
      access_token: signJWTToken(claims, '1m'),
      refresh_token: signJWTToken(claims, '10m'),
      display_name: claims.user_name
    }
  });
}

function refreshToken(req, res) {
  if (!req.body.refresh_token) {
    res.json({
      status: 400,
      message: 'refresh_token not supplied'
    })
    return;
  }

  var result = varifyJwtToken(req.body.refresh_token);
  if (result.success) {
    var claims = {
      user_name: result.user.user_name || 'premchandrasingh',
      user_id: 111
    };

    res.json({
      status: 200,
      payload: {
        access_token: signJWTToken(claims, '1m'),
        refresh_token: signJWTToken(claims, '10m'),
        display_name: claims.user_name,
        isrefresh: true,
        refreshed_at: new Date()
      }
    });
  } else {
    res.json({ status: 400, message: 'Invalida or expired refresh token' })
  }
}



module.exports = {
  login,
  refreshToken,
  getToken,
  signJWTToken,
  varifyJwtToken,
  validateRequest
}
