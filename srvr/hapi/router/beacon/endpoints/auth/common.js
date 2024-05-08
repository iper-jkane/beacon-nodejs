const authorizationCorsHeaders = function( req, res ) {
  const r = res.response()
  r.header('Access-Control-Allow-Headers', 'Accept,Authorization,Content-Type,If-None-Match')
  r.header('Access-Control-Allow-Methods', 'POST,GET')
  r.code(204)
  return r
}

export { authorizationCorsHeaders }
