import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Observable, Subject } from "rxjs";
import { map, buffer, debounceTime, filter, takeUntil } from "rxjs";
import "./App.css";

const App = () => {
  const [state, setState] = useState("stop");
  const [time, setTime] = useState(0);

  const stop$ = useMemo(() => new Subject(), []);
  const click$ = useMemo(() => new Subject(), []);

  const start = () => {
    setState("start");
  };

  const stop = useCallback(() => {
    setTime(0);
    setState("stop");
  }, []);

  const reset = useCallback(() => {
    setTime(0);
  }, []);

  const wait = useCallback(() => {
    click$.next();
    setState("wait");
    click$.next();
  }, [click$]);

  useEffect(() => {
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => list.length),
      filter((value) => value >= 2)
    );
    const timer$ = new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next((count += 1));
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    });

    const subscribtion$ = timer$
      .pipe(takeUntil(doubleClick$))
      .pipe(takeUntil(stop$))
      .subscribe({
        next: () => {
          if (state === "start") {
            setTime((prev) => prev + 1);
          }
        },
      });

    return () => {
      subscribtion$.unsubscribe();
    };
  }, [click$, state, stop$]);

  const Time = (Sec) => {
    const hours = Math.floor(Sec / 3600);
    const minutes = Math.floor(Sec / 60);
    const seconds = Sec % 60;
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="App">
      <div>
      <h1>Секундомер</h1>
      <span>{Time(time)}</span>
      </div>
      <button className="start" onClick={start}>
        Start
      </button>
      <button className="stop" onClick={stop}>
        Stop
      </button>
      <button className="reset" onClick={reset}>
        Reset
      </button>
      <button className="wait" onClick={wait}>
        Wait
      </button>
    </div>
  );
};

export default App;
