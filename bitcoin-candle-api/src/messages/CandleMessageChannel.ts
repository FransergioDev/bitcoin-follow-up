import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import * as http from 'http';
import CandleService from "../services/CandleService";
import { Candle } from "../models/CandleModel";

config();

export default class CandleMessageChannel { 
    private _channel: Channel;
    private _candleService: CandleService;
    private _io: Server;

    constructor(server: http.Server) {
        this._candleService = new CandleService();
        this._io = new Server(server, {
            cors: {
                origin: process.env.SOCKET_CLIENT_SERVER,
                methods: ["GET", "POST"]
            }
        });
        this._io.on('connection', () => console.log(`🪄 Web Socket connection created`))
        
    }

    private async _createMessageChannel() {
        try {
            const connection = await connect(process.env.AMQP_SERVER);
            this._channel = await connection.createChannel();
            this._channel.assertQueue(process.env.QUEUE_NAME);
        } catch (error) {
            console.log('Connection to RabbitMQ Failed');
            console.log(error);
        }
    }

    async consumeMessages() {
        await this._createMessageChannel();

        if (this._channel) {
            this._channel.consume(process.env.QUEUE_NAME, async msg => {
                const candleObj: Object = JSON.parse(msg.content.toString());
                console.log('Message received', candleObj);
                this._channel.ack(msg); //Remove a mensagem da fila depois de receber
    
                const candle: Candle = <Candle>candleObj;
                await this._candleService.save(candle);
                console.log('Candle saved to database');
    
                this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
                console.log('New candle emited by web socket');
            });
    
            console.log('🕯️  Candle consumer started');
        }
    }
}