import { useEffect, useState } from "react";
import "./App.css";

const client = new WebSocket("ws://127.0.0.1:8080");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [name, setName] = useState("");
  const [nameApprove, setNameApprove] = useState(false);
  const [itisme, setItisme] = useState(true);

  client.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    console.log(event);
    if (msg.type === "msg") {
      setMessages([...messages, msg.value]);
    }
    if (msg.type === "friends") {
      setFriends(msg.value);
    }
    if (msg.type === "setName") {
      setNameApprove(true);
    }
  };

  return (
    <>
      <div className="container-main">
        {nameApprove ? (
          <>
            <div className="row-1">
              <div className="c-friends">
                {friends.map((f, i) => (
                  <p
                    style={{
                      ...(f.id === recipientId ? { color: "pink" } : {}),
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setRecipientId(f.id);
                    }}
                    key={i}
                  >
                    {f.name}
                  </p>
                ))}
              </div>
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
                          if (recipientId === "") {
                            alert("choose recipient");
                            return;
                          }

                          console.log("sending");
                          client.send(
                            JSON.stringify({
                              value: message,
                              type: "msg",
                              to: recipientId,
                            })
                          );
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
          </>
        ) : (
          <>
            <div className="setName">
              <h1>Name/Nickname</h1>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="submit"
                value="Submit"
                onClick={() => {
                  client.send(
                    JSON.stringify({
                      value: name,
                      type: "setName",
                    })
                  );
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
