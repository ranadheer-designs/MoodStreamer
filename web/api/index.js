import { createRequestHandler } from '@react-router/node';
import { createServer } from 'http';
import { parse } from 'url';

// Import the server build
import * as serverBuild from '../build/server/index.js';

const handler = createRequestHandler(serverBuild);

export default function (req, res) {
  const parsedUrl = parse(req.url, true);
  
  // Handle API routes separately
  if (parsedUrl.pathname.startsWith('/api/')) {
    // Let Vercel handle API routes
    return;
  }

  // Handle all other routes with React Router
  return handler(req, res);
}