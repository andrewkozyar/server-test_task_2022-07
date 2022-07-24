import axios from 'axios';
import { transactionService } from '../services';
import { convertNumber, getTransactionFee, sleep } from '../utils';

const getBlockFromEtherscan = async () => {
  const transactionsRes = await axios.get(
    `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&boolean=false&apikey=${process.env.ETHERSCAN_API_KEY}`
  ).catch((e: any) => {
    throw new Error('Fail to get transactions data' + e.message);
  });

  transactionService.updateTransactionsBlockConfirmations(convertNumber(transactionsRes.data?.result?.number))

  return {
    transactions: transactionsRes.data?.result?.transactions,
    timestamp: transactionsRes.data?.result?.timestamp,
    gasUsed: transactionsRes.data?.result?.gasUsed,
    baseFeePerGas: transactionsRes.data?.result?.baseFeePerGas,
  };
};

const getTransactionDataFromEtherscan = async () => {
  const { transactions, timestamp, gasUsed, baseFeePerGas } = await getBlockFromEtherscan();

  for (let transaction of transactions) {
    await sleep(1000);

    const transactionRes = await axios.get(
      `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${transaction}&apikey=${process.env.ETHERSCAN_API_KEY}`
    ).catch((e: any) => {
      throw new Error('Fail to get transaction data' + e.message);
    });
    
    const fullDate = new Date(convertNumber(timestamp) * 1000);

    const convertBaseFeePerGas = convertNumber(baseFeePerGas);
    const convertGasUsed = convertNumber(gasUsed);
    const convertMaxPriorityFeePerGas = convertNumber(transactionRes.data?.result?.maxPriorityFeePerGas);
    const convertGasPrice = convertNumber(transactionRes.data?.result?.gasPrice);
    const convertGas = convertNumber(transactionRes.data?.result?.gas);

    const transactionFee = getTransactionFee(
      convertBaseFeePerGas,
      convertGasUsed,
      convertMaxPriorityFeePerGas,
      convertGasPrice,
      convertGas
    );

    const transactionData = {
      blockNumber: convertNumber(transactionRes.data?.result?.blockNumber).toString(),
      transactionId: transaction,
      senderAddress: transactionRes.data?.result?.from,
      recipientsAddress: transactionRes.data?.result?.to,
      blockConfirmations: 0,
      value: (convertNumber(transactionRes.data?.result?.value) / 1000000000000000000),
      transactionFee,
      date: fullDate.toLocaleString('en-GB', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      importDate: new Date(Date.now()),
    };

    transactionService.createTransaction(transactionData);
  }

  return getTransactionsFromEtherscan();
};

export const getTransactionsFromEtherscan = async () => {
  const transactionsCount = await transactionService.getTransactionsCount();

  if (transactionsCount < 1000) {
    await sleep(1000);
    getTransactionDataFromEtherscan();
  } else {
    await sleep(1000 * 60);
    getTransactionDataFromEtherscan();
  }
};
