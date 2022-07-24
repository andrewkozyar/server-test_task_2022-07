export interface Transaction {
  _id?: string;
  blockNumber: string;
  transactionId: string;
  senderAddress: string
  recipientsAddress: string;
  blockConfirmations: number;
  date: string;
  importDate: Date;
  value: number;
  transactionFee: number;
}
