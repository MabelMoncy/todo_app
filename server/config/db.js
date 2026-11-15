const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

let cached = global.mongoose;
let lastConnectionError = null;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getFormattedUri = () => {
  let uri = process.env.MONGO_URI || '';
  if (!uri) {
    return null;
  }

  // Ensure database name and options are present
  if (uri.startsWith('mongodb+srv://') || uri.startsWith('mongodb://')) {
    const urlParts = uri.split('?');
    let baseUrl = urlParts[0];
    const query = urlParts[1] ? `?${urlParts[1]}` : '?retryWrites=true&w=majority';

    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl + 'todo_app';
    } else {
      const lastSlash = baseUrl.lastIndexOf('/');
      const afterSlash = baseUrl.slice(lastSlash + 1);
      if (!afterSlash || afterSlash.includes('@')) {
        baseUrl = baseUrl + '/todo_app';
      }
    }
    return baseUrl + query;
  }
  return uri;
};

const connectDB = async () => {
  // If already connected, return cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = getFormattedUri();
  if (!uri) {
    lastConnectionError = 'MONGO_URI environment variable is not defined in Vercel settings';
    console.error(lastConnectionError);
    return null;
  }

  // If connection is dropped or disconnected, clear old promise
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.promise = null;
    cached.conn = null;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      bufferCommands: true, // Buffer operations while connecting
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log(`MongoDB Connected: ${m.connection.host}/${m.connection.name}`);
      lastConnectionError = null;
      cached.conn = m;
      return m;
    }).catch(err => {
      cached.promise = null;
      cached.conn = null;
      lastConnectionError = err.message;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    lastConnectionError = error.message;
    console.error(`MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

const getDbDiagnostics = () => {
  const hasUri = Boolean(process.env.MONGO_URI);
  let uriMasked = 'none';
  if (hasUri) {
    const raw = process.env.MONGO_URI;
    const atIndex = raw.indexOf('@');
    if (atIndex !== -1) {
      uriMasked = raw.slice(0, 14) + '***@' + raw.slice(atIndex + 1);
    } else {
      uriMasked = raw.slice(0, 10) + '***';
    }
  }

  return {
    hasMongoUri: hasUri,
    uriPreview: uriMasked,
    readyState: mongoose.connection.readyState,
    lastError: lastConnectionError,
  };
};

module.exports = {
  connectDB,
  getDbDiagnostics,
};
