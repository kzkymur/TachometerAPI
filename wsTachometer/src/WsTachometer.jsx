import React, { useCallback, useEffect, useState, useRef, } from 'react';
import Gauge from './Gauge';
import style from './WsTachometer.css';

const WsTachometer = () => {
  const uri = useInput("");
  const gaugeRef = useRef();
  const onMessage = useCallback((data) => {
    if (gaugeRef.current?.updateDestiny !== undefined) {
      gaugeRef.current?.updateDestiny(Number(data));
    }
  }, [gaugeRef.current]);
  const { ws, connect } = useWs(uri.value, onMessage);

  return (
    <div>
      <h1>WebSocket Tachometer</h1>
      <form>
        uri: <input type="text" {...uri}/>
        <button onClick={connect}>connect</button>
      </form>
      {ws !== null ? <Gauge ref={gaugeRef} className={style.gauge} min={0} max={10000} fps={30}/> : undefined}
    </div>
  );
}

const useInput = initialValue => {
  const [value, set] = useState(initialValue);
  return { value, onChange: (e) => set(e.target.value) }
};

const useWs = (uri, onMessage) => {
  const [ws, setWs] = useState(null);
  const connect = useCallback((e)=>{
    e.preventDefault();
    if (uri !== "") setWs(new WebSocket(uri));
    else setWs(null);
    return () => setWs(null);
  }, [uri]);

  useEffect(()=>{
    if (ws === null) return;
    ws.onmessage = ({data}) => {
      onMessage(data);
    }
  }, [ws, onMessage]);
  return { ws, connect };
};

export default WsTachometer;
