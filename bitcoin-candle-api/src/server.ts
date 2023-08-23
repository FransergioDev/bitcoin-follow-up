import { config } from 'dotenv';
import { connection } from 'mongoose';
import { app } from './app';
import { connectToMongoDB } from './config/db';
import CandleMessageChannel from './messages/CandleMessageChannel';

const createServer = async() => {
    config();
    await connectToMongoDB();
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => console.log(`🔥 App running on port ${PORT}`));
    
    const candleMsgChannel = new CandleMessageChannel(server);
    await candleMsgChannel.consumeMessages();

    //Caso o servidor seja encerrado, fechar a conexão com o mongodb
    process.on("SIGINT", async () => {
        await connection.close();
        await server.close();
        console.log("✋ Server and MongoDB connection closed");
    })
}

createServer();