const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getFormattedUri = () => {
  let uri = process.env.MONGO_URI || '';
  if (!uri) {
    return 'mongodb://127.0.0.1:27017/todo_app';
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
  // If already connected, return cached connection (critical for Vercel serverless)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = getFormattedUri();
    const opts = {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log(`MongoDB Connected: ${m.connection.host}/${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
