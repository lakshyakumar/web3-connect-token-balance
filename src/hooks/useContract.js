export function useContract(contractAddress, contractABI, web3) {
  if (!web3) return null;
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  return contract;
}
