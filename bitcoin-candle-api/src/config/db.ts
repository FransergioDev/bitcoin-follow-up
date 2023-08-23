import { config } from 'dotenv';
import { connect } from 'mongoose';

export const connectToMongoDB = async () => {
    config();
    const mongoDBConnection: string | undefined = process.env.MONGODB_CONNECTION_URL;
    if (mongoDBConnection) await connect(mongoDBConnection);
    else throw 'Unable to connect to database';
}