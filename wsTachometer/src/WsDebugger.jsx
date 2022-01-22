import React, { useCallback, useEffect, useState, } from 'react';

const WsDebugger = () => {
  const uri = useInput("");
  const sendData = useInput("");
  const { ws, log, send, connect } = useWs(uri.value);

  const sendMessage = (e) => {
    e.preventDefault();
    send(sendData.value);
    sendData.value = "";
  }

  return (
    <div>
      <h1>WebSocket Debugger</h1>
      <form>
        uri: <input type="text" {...uri}/>
        <button onClick={connect}>connect</button>
      </form>
      {ws !== null ? (
        <div>log
          <form>
            <input type="text" {...sendData}/>
            <button onClick={sendMessage}>send</button>
          </form>
          {log.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </div>
      ) : undefined}
    </div>
  );
}

const useInput = initialValue => {
  const [value, set] = useState(initialValue)
  return { value, onChange: (e) => set(e.target.value) }
};

const useWs = (uri) => {
  const [ws, setWs] = useState(null);
  const [log, setLog] = useState([]);
  const send = useCallback((data) => {
    if (ws !== null) ws.send(data);
    setLog([...log, `send: ${data}`]);
  }, [ws, setLog, log]);

  const connect = useCallback((e)=>{
    e.preventDefault();
    if (uri !== "") setWs(new WebSocket(uri));
    else setWs(null);
    return () => setWs(null);
  }, [uri]);

  useEffect(()=>{
    if (ws === null) return;
    ws.onmessage = ({data}) => {
      setLog([...log, `recv: ${data}`]);
    }
  }, [ws, log]);
  return { ws, send, log, connect };
};

export default WsDebugger;
