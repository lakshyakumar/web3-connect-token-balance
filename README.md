# web3-connect-token-balance

Web3 login for FMT tokens.

## Integrating this inside your code

Use the package manager npm to install foobar.

```bash
npm i web3 react-use
```

## Usage

- copy the `hooks` folder to your repo
- vopy the `assets` folder to your repo

```javascript
import { useWeb3 } from "./hooks";

function App() {
  const { account, loginStatus, login, logout, tokenBalance } = useWeb3();
  return (
    <div className="App">
      {!loginStatus ? (
        <button onClick={login}>click to connect</button>
      ) : (
        <button onClick={logout}>click to disconnect</button>
      )}
      {loginStatus && account ? <p>{account[0]}</p> : null}
      {loginStatus ? <p>{tokenBalance} fmt</p> : null}
    </div>
  );
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
