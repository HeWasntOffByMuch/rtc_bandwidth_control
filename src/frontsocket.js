console.log('connnection to socket io');
const socket = io();

socket.on('connection', console.log('connection established'));