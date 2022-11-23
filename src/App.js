import { useWeb3 } from "./hooks";
import "./App.css";

function App() {
  const { account, loginStatus, login, logout, tokenBalance } = useWeb3();
  return (
    <div className="App">
      <header className="App-header">
        {!loginStatus ? (
          <button onClick={login}>click to connect</button>
        ) : (
          <button onClick={logout}>click to disconnect</button>
        )}
        {loginStatus && account ? <p>{account[0]}</p> : null}
        {loginStatus ? <p>{tokenBalance} fmt</p> : null}
      </header>
    </div>
  );
}

export default App;
