// 실습 코드를 이 서비스가 돌고 있는 컴퓨터에서 직접 실행합니다.
// Codespace에서 서비스를 띄웠다면 그 Codespace가, 내 컴퓨터에서 띄웠다면 내 컴퓨터가 실행합니다.
import { spawn, type ChildProcess } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import type { Lesson } from './lessons';

type Running = { id: string; child: ChildProcess; log: string; alive: boolean };

// 개발 서버가 코드를 다시 읽어도 실행 중인 프로그램을 잊지 않도록 globalThis에 둡니다.
const store = globalThis as { lab?: Running };

// 한 번에 하나만 실행합니다. 이미 실행 중이면 먼저 끝냅니다.
export async function startLab(lesson: Lesson) {
  await stopLab();

  // 터미널에서 "node server.mjs"를 입력한 것과 같습니다.
  const child = spawn(process.execPath, [lesson.file], {
    cwd: path.join(process.cwd(), lesson.folder),
    // 실습 코드에는 PATH만 넘깁니다. Codespace의 GitHub 토큰 같은 값이 화면에 찍히지 않게 합니다.
    env: { PATH: process.env.PATH },
  });
  const running: Running = { id: lesson.id, child, log: '', alive: true };

  const write = (data: Buffer) => {
    running.log = (running.log + data.toString()).slice(-20000);
  };
  child.stdout.on('data', write);
  child.stderr.on('data', write);
  child.on('exit', (code, signal) => {
    running.alive = false;
    // 중지 버튼으로 끝내면 signal이, 프로그램이 스스로 끝나면 code가 들어옵니다.
    running.log += signal ? '\n[중지했습니다.]\n' : `\n[프로그램이 끝났습니다. 종료 코드: ${code}]\n`;
  });

  store.lab = running;
}

export async function stopLab() {
  const running = store.lab;
  if (!running || !running.alive) return;
  const ended = new Promise((resolve) => running.child.once('exit', resolve));
  running.child.kill();
  await ended;
}

export function labStatus(lesson: Lesson) {
  const running = store.lab;
  if (!running || running.id !== lesson.id) return { alive: false, log: '' };
  return { alive: running.alive, log: running.log };
}

// 실습 서버에 TCP로 연결해 글자를 그대로 보내고, 돌아온 글자를 그대로 돌려줍니다.
export function sendRaw(port: number, text: string) {
  return new Promise<string>((resolve) => {
    let received = '';
    const socket = net.connect(port, '127.0.0.1', () => {
      // HTTP는 줄 끝을 \r\n으로 쓰고, 빈 줄로 요청의 끝을 알립니다.
      socket.write(text.trim().replace(/\r?\n/g, '\r\n') + '\r\n\r\n');
    });
    socket.on('data', (data) => (received += data.toString()));
    socket.on('end', () => resolve(received));
    socket.on('error', (error) => resolve(`[연결하지 못했습니다: ${error.message}]`));
    socket.setTimeout(3000, () => {
      socket.destroy();
      resolve(received + '\n[3초 동안 응답이 끝나지 않아 연결을 닫았습니다.]');
    });
  });
}
