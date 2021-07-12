/* eslint-disable no-unused-vars */
import logo from './logo.svg';
import './App.css';
import { useEffect, useLayoutEffect, useState } from 'react';


function Child() {
  useEffect(() => {
    console.log('child useEffect mount');
    return () => {
      console.log('child useEffect unmount')
    }
  });
  useLayoutEffect(() => {
    console.log('child useLayoutEffect mount')
    return () => {
      console.log('child useLayoutEffect unmount')
    };
  }, []);
  return (
    <div>
      child
    </div>
  )
}

function App() {

  const [state, setState] = useState(0);

  useEffect(() => {
    console.log('useEffect1 mount');
    return () => {
      console.log('useEffect1 unmount');
    }
  }, [state]);

  useEffect(() => {
    console.log('useEffect2 mount');
    return () => {
      console.log('useEffect2 unmount');
    }
  }, [state]);

  useLayoutEffect(() => {
    console.log('useLayoutEffect mount');
    return () => {
      console.log('useLayoutEffect unmount');
    }
  }, [state]);

  return (
    <div className="App">
      <header className="App-header" onClick={() => setState(s => s + 1)}>
        <p>
          Edit {state}
        </p>
        <Child />
      </header>
    </div>
  );
}

export default App;
