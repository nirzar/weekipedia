function respond( res, method ) {
  return method().then( function ( data ) {
    var responseText = JSON.stringify( data );
    res.status( 200 );
    res.send( responseText );
    return responseText;
  } ).catch( function ( error ) {
    var msg = error.toString();
    var code = 500;
    if ( msg.indexOf( 'Not logged in' ) > -1 ) {
      code = 401;
    } else if ( msg.indexOf( '404' ) > -1 ) {
      code = 404;
    }
    res.status( code );
    res.send( JSON.stringify( {
      msg: msg
    } ) );
  } );
}

export default respond
