import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ease-dev';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as unknown as { _mongoose: GlobalMongoose };

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  const store = globalWithMongoose._mongoose;
  if (store.conn) return store.conn;
  if (!store.promise) {
  store.promise = mongoose.connect(MONGODB_URI, { autoIndex: true }).then((m: typeof mongoose) => m);
  }
  store.conn = await store.promise;
  return store.conn;
}
