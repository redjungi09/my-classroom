import net from 'node:net';

const server = net.createServer((socket) => {
  socket.once('data', (data) => {
    console.log(data.toString());

    socket.end(
      'HTTP/1.0 200 OK\r\n' +
      'Content-Type: text/html\r\n' +
      '\r\n' +
      '<h1>Hello!</h1>'
    );
  });
});

server.listen(8080);
