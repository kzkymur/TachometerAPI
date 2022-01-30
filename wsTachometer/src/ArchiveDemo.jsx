import React, { useCallback, useEffect, useState, } from 'react';
import Plotly from 'plotly.js/dist/plotly';
import { axios, toEpochTime } from './utils';
import 'regenerator-runtime';
import { useInput } from './customHooks';

const defaultStart = "2022-01-26T06:00";
const defaultEnd = "2022-01-26T06:59";

const ArchiveDemo = () => {
  const start = useInput({init: defaultStart, type: "datetime-local"});
  const end = useInput({init: defaultEnd, type: "datetime-local"});
  const [requestUrl, setRequestUrl] = useState("");
  const [result, setResult] = useState([]);
  const [chartData, setChartData] = useState({});
  const send = useCallback(async (e) => {
    e.preventDefault();
    const startValue = toEpochTime(start.value);
    const endValue = toEpochTime(end.value);
    const res = await axios.get(`${startValue}/${endValue}`);
    setRequestUrl(`${res.config.baseURL}/${res.config.url}`);
    const plotDataX = [];
    const plotDataY = [];
    res.data.forEach((row) => { plotDataX.push(row.time); plotDataY.push(row.rpm); });
    setResult(res.data);
    setChartData({
      x: plotDataX,
      y: plotDataY,
      type: 'scatter',
    });
  }, [start, end]);
  useEffect(()=>{
    if (document.getElementById('chart')) Plotly.newPlot('chart', [chartData], {
      xaxis: { range: [ toEpochTime(start.value), toEpochTime(end.value) ] },
      yaxis: { range: [0, 10000] },
      title:'Data Labels Hover',
    });
  },[chartData]);

  return (
    <div>
      <h1>Archive Demo</h1>
      <form>
        start: <input {...start}/>
        end: <input {...end}/>
        <button onClick={send}>send</button>
      </form>
      {requestUrl !== "" ?
        <>
          <p>url: {requestUrl}</p>
          <div id={'chart'} />
          {result.map((item)=>(
            <li key={item.time}>{item.time}: {item.rpm}</li>
          ))}
        </>
        : undefined}
    </div>
  );
};

export default ArchiveDemo;
