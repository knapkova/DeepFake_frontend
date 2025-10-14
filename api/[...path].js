const http = require('http');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path from the request
  const path = req.url.replace(/^\/api/, '');
  
  // Forward the request to the Elastic Beanstalk
  const options = {
    hostname: 'klamarium-env-1.eba-e8kqfdqj.us-east-1.elasticbeanstalk.com',
    port: 80,
    path: `/api${path}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: 'klamarium-env-1.eba-e8kqfdqj.us-east-1.elasticbeanstalk.com'
    }
  };

  try {
    const proxyRes = await new Promise((resolve, reject) => {
      const proxyReq = http.request(options, resolve);
      proxyReq.on('error', reject);
      if (req.body) {
        proxyReq.write(JSON.stringify(req.body));
      }
      proxyReq.end();
    });

    // Copy status code
    res.status(proxyRes.statusCode);

    // Copy headers
    Object.entries(proxyRes.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Stream the response
    proxyRes.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
};