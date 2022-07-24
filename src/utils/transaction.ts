export const convertNumber = (numb: string): number => parseInt(numb, 16);

export const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

export const getTransactionFee = (baseFeePerGas: number, gasUsed: number, maxPriorityFeePerGas: number, gasPrice: number, gas: number): number => {
  if (maxPriorityFeePerGas && baseFeePerGas && gasUsed) {
    return ((maxPriorityFeePerGas + baseFeePerGas) * gasUsed) / 1000000000 / 1000000000;
  }

  if (maxPriorityFeePerGas && gasUsed) {
    return (maxPriorityFeePerGas * gasUsed) / 1000000000 / 1000000000;
  }

  if (gasPrice && gas) {
    return (gasPrice * gas) / 1000000000 / 1000000000;
  }

  return 0;
};

