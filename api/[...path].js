const axios = require('axios');

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

  const backendBase = process.env.BACKEND_API_URL;
  const backendHost = new URL(backendBase).hostname;
  const path = req.url.replace(/^\/api/, '');
  const targetUrl = `${backendBase}${path}`;

  try {
    const axiosConfig = {
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: backendHost
      },
      data: req.body,
      maxRedirects: 5,
      validateStatus: (status) => true // Accept any status code
    };

    const response = await axios(axiosConfig);

    // Copy status
    res.status(response.status);

    // Copy headers
    Object.entries(response.headers).forEach(([key, value]) => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });

    // Send response
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Proxy error', 
      details: error.message,
      data: error.response?.data
    });
  }
};