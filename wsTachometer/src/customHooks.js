import { useCallback, useEffect, useState, } from 'react';

export const useInput = initialValue => {
  const [value, set] = useState(initialValue);
  return { value, onChange: (e) => set(e.target.value) };
};

export const useWs = (uri, onMessage) => {
  const [ws, setWs] = useState(null);
  const [errorLog, setErrorLog] = useState([]);
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

  useEffect(()=>{
    if (ws === null) return;
    ws.onerror = ({target}) => {
      setErrorLog([...errorLog, `error!!: ${target.url}`]);
    }
  }, [ws, errorLog]);
  return { ws, connect, errorLog, };
};

export const useWsLogger = (uri) => {
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
    ws.onerror = ({target}) => {
      setLog([...log, `error!!: ${target.url}`]);
    }
  }, [ws, log]);
  return { ws, send, log, connect };
};
