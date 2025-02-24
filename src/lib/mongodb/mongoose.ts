import mongoose from 'mongoose';

const initialized = false;
const uri = process.env.MONGODB_URI;

export const connect = async () => {
  mongoose.set('strictQuery', true);

  if (!uri) {
    throw new Error('MongoDB URI is not defined in the environment variables');
  }

  if (initialized) {
    console.log('already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: 'next-blog',
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error (`Database connection error: ${error.message}`);
    } else {
      throw new Error(`Database connection error: ${String(error)}`);
    }
  }

}