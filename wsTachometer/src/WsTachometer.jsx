import React, { useCallback, useRef, } from 'react';
import { useInput, useWs } from './customHooks';
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
  const { ws, connect, errorLog } = useWs(uri.value, onMessage);

  return (
    <div>
      <h1>WebSocket Tachometer</h1>
      <form>
        uri: <input type="text" {...uri}/>
        <button onClick={connect}>connect</button>
      </form>
      {ws !== null ? 
        <>
          <Gauge ref={gaugeRef} className={style.gauge} min={0} max={10000} fps={30}/>
          {errorLog.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </>
      : undefined}
    </div>
  );
}

export default WsTachometer;
