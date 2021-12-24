import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [time,setTime] = useState(0);
  const [start,setStart] = useState(false);

  useEffect(() => {
    let interval = null;
    if (start) {
      interval = setInterval(()=> {
        setTime(prevTime => prevTime+10)
      },10)
    } else {
      clearInterval(interval);
    }
    return() => clearInterval(interval)
  },[start])

  return (
    <div className="App">
    <h1>Секундомер</h1>
    <span>{("0" + (time / 60000) % 60).slice(-2)}</span>
    <span>{("0" + (time / 1000) % 60).slice(-2)}</span>
    <span>{("0" + (time / 10) % 1000).slice(-2)}</span>
    <div>
      <button onClick={()=> setStart(true)} class="start">Старт</button>
      <button onClick={()=> setStart(false)}class="stop">Стоп</button>
      <button onClick={()=> {setTime(0); setStart(false);}} class="reset">Перезапуск</button>
    </div>
    </div>
  );
}

export default App;
