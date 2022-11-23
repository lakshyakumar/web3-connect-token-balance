import { createGlobalState } from "react-use";
import Web3 from "web3";
import contractABI from "../assets/contracts/fmt-abi.json";
const netId = 56;

const contractAddress = "0x99c6e435eC259A7E8d65E1955C9423DB624bA54C";

const sharedState = createGlobalState({
  connected: false,
  sendTransaction: () => undefined,
  createTransaction: () => undefined,
  loginStatus: null,
  token: null,
  contract: null,
  tokenBalance: null,
});

export function useWeb3() {
  const [state, setState] = sharedState();
  let web3 = null;

  const onConnect = async () => {
    console.log("connecting with metamask");
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      console.log("web3 created");
      try {
        // Request account access if needed
        console.log("waiting for enabling");
        await window.ethereum.enable();
        subscribeProvider(window.ethereum);
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(netId) }],
        });
      } catch (error) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Smart Chain",
                chainId: web3.utils.toHex(netId),
                nativeCurrency: {
                  name: "BNB",
                  decimals: 18,
                  symbol: "BNB",
                },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
              },
            ],
          });
        }
        console.log(error);
      }
    }

    const account = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    setState((prev) => ({
      ...prev,
      connected: true,
      web3,
      account,
      networkId,
      chainId: Number(networkId),
      provider: window.ethereum,
    }));

    return {
      account,
      networkId,
      web3,
    };
  };

  const onDisconnect = async () => {
    console.log("disconnect");
    setState((prev) => ({
      ...prev,
      connected: false,
      web3: null,
      account: null,
      networkId: null,
      chainId: null,
      provider: null,
    }));
  };

  const getAccountBalance = async () => {
    const [account] = await web3.current.eth.getAccounts();
    if (account) {
      const balance = await web3.current.eth.getBalance(account);
      setState((prev) => ({
        ...prev,
        balance: web3.utils.fromWei(balance),
      }));
    }
  };

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => {
      setState((prev) => ({
        ...prev,
        connected: false,
      }));
    });
    provider.on("accountsChanged", async (accounts) => {
      setState((prev) => ({
        ...prev,
        account: accounts[0],
      }));
    });
    provider.on("chainChanged", async (chain) => {
      const network = await state.web3.current.eth.net.getId();
      setState((previous) => ({
        ...previous,
        chainId: Number(chain),
        networkId: network,
      }));
    });
  };

  const login = async () => {
    let data = await onConnect();
    // let Contract = await useContract(contractAddress, contractABI, data.web3);

    // console.log("contract created!", data.account[0], Contract);
    const Contract = new web3.eth.Contract(contractABI, contractAddress);
    setState((prev) => ({
      ...prev,
      contract: Contract,
    }));
    let tokenBalance = await Contract.methods.balanceOf(data.account[0]).call();
    console.log(tokenBalance);
    const loginStatus = true;
    console.log(loginStatus);
    setState((prev) => ({
      ...prev,
      loginStatus: loginStatus,
      tokenBalance,
    }));
  };

  const logout = async () => {
    await onDisconnect();
    setState((prev) => ({
      ...prev,
      loginStatus: false,
      tokenBalance: null,
      contract: null,
    }));
    console.log("logged out successfully!");
  };

  return {
    web3: state.web3,
    connected: state.connected,
    account: state.account,
    networkId: state.networkId,
    connect: onConnect,
    disconnect: onDisconnect,
    login,
    logout,
    loginStatus: state.loginStatus,
    contract: state.contract,
    getAccountBalance,
    tokenBalance: state.tokenBalance,
  };
}
