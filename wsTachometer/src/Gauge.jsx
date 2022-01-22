import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState, } from 'react'; import style from './Gauge.css';

const Gauge = forwardRef(({ min, max, fps, className }, fRef) => {
  const ref = useRef(null);
  const [gaugeEmulator, setGaugeEmulator] = useState();

  useEffect(()=>{
    gaugeEmulator?.clearInterval();
    const ge = new GaugeEmulator(ref, fps, min, max);
    setGaugeEmulator(ge);
  }, [ref.current]);

  useImperativeHandle(fRef, () => {
    return {
      updateDestiny: (value) => gaugeEmulator.updateDestiny(value),
    }
  });

  return (
    <div className={className}>
      <div className={style.gauge} style={{
        "--gauge-bg": "#088478",
        "--gauge-value": 0,
        "--gauge-display-value": 100,
      }} ref={ref}>
        <div className={style.ticks}>
          <div className={style.tithe} style={{"--gauge-tithe-tick":1}}></div>
          <div className={style.tithe} style={{"--gauge-tithe-tick":2}}></div>
          <div className={style.tithe} style={{"--gauge-tithe-tick":3}}></div>
          <div className={style.tithe} style={{"--gauge-tithe-tick":4}}></div>
          <div className={style.tithe} style={{"--gauge-tithe-tick":6}}></div>
          <div className={style.tithe} style={{"--gauge-tithe-tick":7}}></div>
          <div className={style.tithe} style={{"--gauge-tithe-tick":8}}></div>
          <div className={style.tithe} style={{"--gauge-tithe-tick":9}}></div>
          <div className={style.min}></div>
          <div className={style.mid}></div>
          <div className={style.max}></div>
        </div>
        <div className={style.tickCircle}></div>
        <div className={style.needle}>
          <div className={style.needleHead}></div>
        </div>
        <div className={style.labels}>
            <div className={style.valueLabel}></div>
        </div>
      </div>
    </div>
  );
});

export default Gauge;

class GaugeEmulator {
  constructor (ref, fps, min, max) {
    this.ref = ref;
    this.fps = fps;
    this.min = min;
    this.max = max;
    this.destiny = 0;
    this.loop = setInterval(() => this.updateGauge(), 1000 / fps);
  }

  updateGauge () {
    const old = Number(this.ref.current.style.getPropertyValue('--gauge-value'));
    this.ref.current.style.setProperty('--gauge-value', old + (this.destiny - old) * 0.2);
  }

  updateDestiny (destiny) {
    if (isNaN(destiny) || typeof(destiny) !== 'number') return;
    this.destiny = ((destiny - this.min) / (this.max - this.min)) * 100;
    this.ref.current.style.setProperty('--gauge-display-value', destiny);
  }

  clearInterval () {
    if (this.loop === 0) {
      throw new Error("loop function not started");
    }
    window.clearInterval(this.loop);
    this.loop = 0;
  }
}
