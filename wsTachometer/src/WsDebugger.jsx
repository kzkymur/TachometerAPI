import React from 'react';
import { useInput, useWsLogger } from './customHooks';

const WsDebugger = () => {
  const uri = useInput("");
  const sendData = useInput("");
  const { ws, log, send, connect } = useWsLogger(uri.value);

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

export default WsDebugger;
