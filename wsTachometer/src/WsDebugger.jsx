import React from 'react';
import { useInput, useWsLogger } from './customHooks';

const WsDebugger = () => {
  const uri = useInput({type: 'text', init: ""});
  const sendData = useInput({type: 'text', init: ""});
  const { ws, log, send, clearLog, connect } = useWsLogger(uri.value);

  const sendMessage = (e) => {
    e.preventDefault();
    send(sendData.value);
    sendData.value = "";
  }

  return (
    <div>
      <h1>WebSocket Debugger</h1>
      <form>
        uri: <input {...uri}/>
        <button onClick={connect}>connect</button>
      </form>
      {ws !== null ? (
        <div>log
          <form>
            <input {...sendData}/>
            <button onClick={sendMessage}>send</button>
          </form>
          <button onClick={clearLog}>clear log</button>
          {log.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </div>
      ) : undefined}
    </div>
  );
}

export default WsDebugger;
