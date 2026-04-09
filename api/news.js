const https = require('https');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=300');

  const options = {
    hostname: 'oilprice.com',
    path: '/rss/main',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    },
  };

  const request = https.get(options, function(response) {
    let data = '';
    response.on('data', function(chunk) { data += chunk; });
    response.on('end', function() {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.status(200).send(data);
    });
  });

  request.on('error', function(err) {
    res.status(500).json({ error: err.message });
  });

  request.setTimeout(8000, function() {
    request.destroy();
    res.status(504).json({ error: 'timeout' });
  });
};
