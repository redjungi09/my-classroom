// http 모듈 없이 TCP 소켓으로 만든 웹 서버입니다. (03-통신과웹/02-http-server에서 옮김)
// 받은 요청 원문을 그대로 찍고, HTTP 응답을 글자로 직접 적어 보냅니다.
import net from 'node:net';

const server = net.createServer((socket) => {
  socket.once('data', (data) => {
    console.log(data.toString());

    // 상태 줄, 헤더, 빈 줄, 본문 순서입니다. 줄 끝은 \r\n 입니다.
    socket.end(
      'HTTP/1.0 200 OK\r\n' +
      'Content-Type: text/html\r\n' +
      '\r\n' +
      '<h1>Hello, web!</h1><p>This page came from a TCP socket.</p>'
    );
  });
});

// 원래는 0.0.0.0이었지만, 내 컴퓨터 안에서만 열리도록 127.0.0.1로 바꿨습니다.
server.listen(8081, '127.0.0.1', () => {
  console.log('HTTP server: http://127.0.0.1:8081/');
});
