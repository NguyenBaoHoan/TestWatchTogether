// src/pages/TestWebSocket.jsx
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


export function TestWebSocket(props) {
  return <DefaultTestWebSocket {...props} />;
}

// Rename the default export to avoid conflict
function DefaultTestWebSocket() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [client, setClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws"); // 🧩 backend endpoint
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("✅ Connected to WebSocket server");
        setConnected(true);

        // 📨 Đăng ký lắng nghe topic
        stompClient.subscribe("/topic/test", (message) => {
          const body = message.body;
          console.log("📩 Received:", body);
          setMessages((prev) => [...prev, body]);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (client && connected) {
      client.publish({
        destination: "/app/test", // endpoint bạn sẽ handle ở server
        body: input,
      });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black/70">
      <h1 className="text-2xl font-bold mb-4">🧪 Test WebSocket (no JWT)</h1>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <div className="mt-4">
        <input
          className="border rounded px-2 py-1 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button
          className="ml-2 px-4 py-1 bg-blue-600 rounded"
          onClick={sendMessage}
          disabled={!connected}
        >
          Send
        </button>
      </div>

      <div className="mt-6 w-full max-w-md">
        <h2 className="font-semibold mb-2">Messages:</h2>
        <ul className="bg-gray-800 rounded p-4 min-h-[100px]">
          {messages.map((msg, idx) => (
            <li key={idx} className="mb-1">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
