import openSocket from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config();

let io;

const socket = {
    init: () => {
        io = openSocket(process.env.REACT_APP_API_URL);
        return io;
    },
    getIo: () => {
        if(!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
}

export default socket;