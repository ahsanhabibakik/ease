import mongoose from 'mongoose';
// Import models so they are registered before index sync
import '../models/User';
import '../models/Account';
import '../models/VerificationToken';
import '../models/Worry';
import '../models/Reflection';
import '../models/UserSettings';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ease-dev';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as unknown as { _mongoose: GlobalMongoose };

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null };
}

let indexesEnsured = false;

async function ensureIndexesOnce() {
  if (indexesEnsured) return;
  const conn = mongoose.connection;
  const modelNames = ['User','Account','VerificationToken','Worry','Reflection','UserSettings'];
  await Promise.allSettled(modelNames.map(async name => {
    try { await conn.model(name).syncIndexes(); } catch { /* ignore index sync errors at startup */ }
  }));
  indexesEnsured = true;
}

export async function dbConnect() {
  const store = globalWithMongoose._mongoose;
  if (store.conn) {
    if (!indexesEnsured) void ensureIndexesOnce();
    return store.conn;
  }
  if (!store.promise) {
    store.promise = mongoose.connect(MONGODB_URI, { autoIndex: false }).then((m: typeof mongoose) => m);
  }
  store.conn = await store.promise;
  void ensureIndexesOnce();
  return store.conn;
}
