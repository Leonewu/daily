import './Home.css';
import {
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Link to="page1">page1</Link>
        <Link to="page2">page2</Link>
        <Link to="page3">page3</Link>
      </header>
    </div>
  );
}

export default App;
