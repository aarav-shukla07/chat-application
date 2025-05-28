import React, { useEffect, useRef, useState } from 'react';

const App: React.FC = () => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [tempRoomId, setTempRoomId] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: 'join',
        payload: { roomId }
      }));
    };

    ws.current.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId]);

  const handleSend = () => {
    if (input.trim()) {
      const message = input.trim();
      setMessages(prev => [...prev, message]);

      ws.current?.send(JSON.stringify({
        type: 'chat',
        payload: { message }
      }));

      setInput('');
    }
  };

  if (!roomId) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={tempRoomId}
            onChange={(e) => setTempRoomId(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={() => {
              if (tempRoomId.trim()) setRoomId(tempRoomId.trim());
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#f9f9f9',
      height: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '1rem',
          maxHeight: '70vh'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              backgroundColor: '#e0e0e0',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              marginBottom: '0.5rem',
              alignSelf: 'flex-start',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {msg}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
