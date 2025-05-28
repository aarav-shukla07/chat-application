import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = () => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', payload: { roomId } }));
      setJoined(true);
    };
    ws.onmessage = (event) => {
      const data = event.data;
      // Skip echo if already displayed by sender
      if (!data.startsWith('You:')) {
        setMessages((prev) => [...prev, data]);
      }
    };

    setSocket(ws);
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.send(JSON.stringify({ type: 'chat', payload: { message } }));
      setMessage('');
    }
  };

  return (
    <div className="cyberpunk-bg min-h-screen flex flex-col items-center justify-center text-green-400 font-mono relative z-10">

      <div className="absolute inset-0 z-0 matrix-animation"></div>
      <h1 className="text-3xl font-bold mb-6 text-center neon-heading">
  Welcome to the Cyberpunk Chat Application
</h1>
      {!joined ? (
        <div className="glass-box w-full max-w-sm p-6 rounded-lg shadow-lg z-10">
          <h2 className="text-2xl font-bold mb-4 text-center neon-text">Enter Room ID</h2>
          <input
            className="w-full p-2 mb-4 bg-transparent border border-green-400 text-green-300 rounded focus:outline-none neon-border"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room ID"
          />
          <button
            onClick={joinRoom}
            className="w-full p-2 bg-transparent border border-green-400 text-green-300 rounded neon-border hover:bg-green-500 hover:text-black transition-all duration-300"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="glass-box w-full max-w-2xl h-[80vh] flex flex-col rounded-lg p-4 shadow-xl z-10">
          <h1 className="text-xl text-center mb-4 neon-text">Room: {roomId}</h1>
          <div className="flex-1 overflow-y-auto bg-transparent border border-green-600 rounded p-3 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className="text-green-300 bg-transparent border border-green-500 rounded p-2">
                {msg}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="mt-3 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 bg-transparent border border-green-400 text-green-300 rounded-l focus:outline-none neon-border"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-transparent border border-green-400 text-green-300 rounded-r neon-border hover:bg-green-500 hover:text-black transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
