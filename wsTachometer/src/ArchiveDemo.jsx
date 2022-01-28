import React, { useCallback, useEffect, useRef, } from 'react';
import { useInput } from './customHooks';
import Plotly from 'plotly.js/dist/plotly';

const ArchiveDemo = () => {
  const start = useInput("");
  const end = useInput("");
  const [sended, setSended] = useState(false);
  const send = useCallback((start, end) => {
    axios.get(`host/${start}/${end}`);
  }, []);

  return (
    <div>
      <h1>Archivet Demo</h1>
      <form>
        start: <input type="text" {...start}/>
        end: <input type="text" {...end}/>
        <button onClick={connect}>send</button>
      </form>
      <div id={'chart'} />
    </div>
  );
}


export default ArchiveDemo;
