import axios from 'axios';
import { transactionService } from '../services';
import { convertNumber } from '../utils';

const getTransactionsFromEtherscan = async () => {
  const transactionsRes = await axios.get(
    `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&boolean=false&apikey=${process.env.ETHERSCAN_API_KEY}`
  ).catch((e: any) => {
    throw new Error('Fail to get transactions data' + e.message);
  });

  return {
    transactions: transactionsRes.data?.result?.transactions,
    timestamp: transactionsRes.data?.result?.timestamp,
    size: transactionsRes.data?.result?.size,
    gasUsed: transactionsRes.data?.result?.gasUsed
  };
};

export const getTransactionDataFromEtherscan = async () => {
  const { transactions, timestamp, size, gasUsed } = await getTransactionsFromEtherscan();

  await Promise.all(transactions.map(async (transaction: string) => {
    const transactionRes = await axios.get(
      `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${transaction}&apikey=${process.env.ETHERSCAN_API_KEY}`
    ).catch((e: any) => {
      throw new Error('Fail to get transaction data' + e.message);
    });

    const date = new Date(convertNumber(timestamp) * 1000);    
    const convertGasUsed = convertNumber(gasUsed)
    const convertMaxPriorityFeePerGas = convertNumber(transactionRes.data?.result?.maxPriorityFeePerGas)

    const transactionData = {
      blockNumber: convertNumber(transactionRes.data?.result?.blockNumber).toString(),
      transactionId: transaction,
      senderAddress: transactionRes.data?.result?.from,
      recipientsAddress: transactionRes.data?.result?.to,
      blockInformation: convertNumber(size),
      value: (convertNumber(transactionRes.data?.result?.value) / 1000000000000000000),
      transactionFee: ((convertGasUsed * convertMaxPriorityFeePerGas) / 1000000000000000000),
      date,
    }

    transactionService.createTransaction(transactionData)
  }));

  return true;
};
