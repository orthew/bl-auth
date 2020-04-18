var iconv = require('iconv-lite');
var http = require('http');

exports.authenticate = (username, ip, server) => {
  return new Promise((resolve, reject) => {
    username = iconv.encode(username, 'ISO-8859-1');
    username = username.toString();

    var encodeChars = ['%', ' ', '@', '$', '&', '?', '=', '+', ':', ',', '/'];
    var encodeValues = ['%25', '%20', '%40', '%24', '%26', '%3F', '%3D', '%2B', '%3A', '%2C', '%2F'];

    var regex;
    for (var i = 0; i < encodeChars.length; i++) {
      regex = new RegExp(`\\${encodeChars[i]}`, 'g');
      username = username.replace(regex, encodeValues[i]);
    }

    var authServer;
    var authPort;
    var authPath;
    var authUserAgent;

    if (typeof server === 'undefined') {
      authServer = 'auth.blockland.us';
      authPort = 80;
      authPath = '/authQuery.php';
      authUserAgent = 'Blockland-r2001';
    } else {
      authServer = typeof server.address === 'undefined' ? 'auth.blockland.us' : server.address;
      authPort = typeof server.port === 'undefined' ? 80 : server.port;
      authPath = typeof server.path === 'undefined' ? '/authQuery.php' : server.path;
      authUserAgent = typeof server.userAgent === 'undefined' ? 'Blockland-r2001' : server.userAgent;
    }

    var postData = `NAME=${username}&IP=${ip}`;
    var options = {
      hostname: authServer,
      port: authPort,
      path: authPath,
      method: 'POST',
      headers: {
        'Connection': 'keep-alive',
        'User-Agent': authUserAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      },
    };

    var data = '';
    var request = http.request(options, (response) => {
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        data = data.split(' ');

        var authed = {
          success: false,
          username: username,
          ip: ip,
          blid: null
        };

        if (data[0] === 'YES') {
          authed.success = true;
          authed.blid = data[1].trim();
        }

        resolve(authed);
      });

      response.on('error', () => {
        reject();
      });
    });

    request.write(postData);
    request.end();
  });
}