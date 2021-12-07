import { useEffect, useRef, useState } from "react";
//import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [name, setName] = useState("");
  const [nameApprove, setNameApprove] = useState(false);

  const webSocket = useRef(null);
  useEffect(() => {
    webSocket.current = new WebSocket("ws://127.0.0.1:8080");
    webSocket.current.onmessage = function (event) {
      const msg = JSON.parse(event.data);
      console.log(",,,;;;,", event);
      if (msg.type === "msg") {
        setMessages((messages) => [
          ...messages,
          { value: msg.value, isMe: false },
        ]);
      }
      if (msg.type === "friends") {
        setFriends(msg.value);
      }
      if (msg.type === "setName") {
        setNameApprove(true);
        setName(msg.value);
      }
    };
    return () => webSocket.current.close();
  }, []);
  console.log("name", name);
  const getFriendNameColor = (f) => {
    if (f.id === recipientId) {
      return "#00ABE1";
    }

    if (f.name === name) {
      return "silver";
    }

    return "white";
  };

  return (
    <>
      <div className="flex">
        {nameApprove ? (
          <>
            <div className="flex h-screen w-full">
              <div className="w-60 h-screen bg-gray-800 flex flex-col overflow-y-scroll text-center ">
                {friends.map((f, i) => (
                  <p
                    className="m-2 text-xl font-semibold "
                    style={{ color: getFriendNameColor(f), cursor: "pointer" }}
                    onClick={() => {
                      setRecipientId(f.id);
                    }}
                    key={i}
                  >
                    {f.name}
                  </p>
                ))}
              </div>
              <div className="flex-grow relative h-screen bg-gray-900 flex-col-reverse text-gray-300 ">
                <div className="m-2">
                  <div className="text-2xl mx-10">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={
                          m.isMy
                            ? "flex justify-end"
                            : "flex justify-start text-gray-100"
                        }
                      >
                        <p className="box-border min-w-min   bg-blue-500 m-2 px-4 py-2 rounded-2xl flex items-end justify-end text-right ">
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex max-w-full max-h-full absolute inset-x-0 bottom-0 ml-4 ">
                    <div className="w-full h-full">
                      <form>
                        <textarea
                          className="w-full rounded-full text-gray-900 bg-gray-100 px-8"
                          id="text"
                          name="text"
                          rows="3"
                          cols="50"
                          onChange={(e) => setMessage(e.target.value)}
                          value={message}
                        ></textarea>
                      </form>
                    </div>
                    <div className="px-2 pt-1">
                      <button
                        className="transform rotate-90 rounded-full h-16 w-16 flex items-center justify-center bg-blue-500"
                        onClick={() => {
                          if (recipientId === "") {
                            alert("choose recipient");
                            return;
                          }

                          console.log("sending");
                          webSocket.current.send(
                            JSON.stringify({
                              value: message,
                              type: "msg",
                              to: recipientId,
                            })
                          );
                          setMessages([
                            ...messages,
                            { value: message, isMy: true },
                          ]);
                          setMessage("");
                        }}
                      >
                        <svg
                          className="w-8 text-greay-100"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex w-screen h-screen bg-cover bg-log-bg">
              <div className="box-border shadow-2xl border-4 border-light-blue-500  h-54 w-84 p-4  bg-gray-900 text-blue-500 text-center text-3xl m-auto">
                <h1 className="tracking-widest pb-4">Nickname</h1>
                <form>
                  <input
                    className="text-gray-900 rounded-sm"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="text-3xl text-gray-100 bg-blue-500 w-1/4 tracking-widest m-2 mt-6 rounded-md"
                    type="submit"
                    value="Submit"
                    onClick={(e) => {
                      e.preventDefault();
                      webSocket.current.send(
                        JSON.stringify({
                          value: name,
                          type: "setName",
                        })
                      );
                    }}
                  />
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
