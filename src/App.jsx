import { useEffect, useState } from "react";
import "./App.css";
import { Form } from "react-bootstrap";

const client = new WebSocket("ws://127.0.0.1:8080");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  client.addEventListener("message", function (event) {
    setMessages([...messages, event.data]);
  });

  return (
    <>
      <div className="container-main">
        <div className="row-1">
          <div className="c-friends">friends list</div>
          <div className="c-message">
            <div className="message-container">
              <div className="r-message-display">
                {messages.map((m, i) => (
                  <p key={i}>{m}</p>
                ))}
              </div>
              <div className="r-message-type">
                <div className="c-form">
                  <form>
                    <textarea
                      id="text"
                      name="text"
                      rows="3"
                      cols="50"
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                    ></textarea>
                  </form>
                </div>
                <div className="c-button">
                  <button
                    className="button"
                    onClick={() => {
                      client.send(message);
                      setMessages([...messages, message]);
                      setMessage("");
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
