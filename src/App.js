import './App.css';
import Model from './components/Model';
import Test from './components/Test';


const App = () => {

  return (

    <div className="App">
      <p>Hello!</p>
      <p>Witaj w aplikacji służącej do symualcji procesów biznesowych.</p>

      <Test />

      <Model />
    </div>
  );
}

export default App;
