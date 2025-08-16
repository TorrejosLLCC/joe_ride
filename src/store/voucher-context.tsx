import { createContext, useContext, useState, type FC } from "react";

interface VoucherTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
  date: Date;
}

interface VoucherContextType {
  balance: number;
  transactions: VoucherTransaction[];
  addTransaction: (transaction: Omit<VoucherTransaction, 'id' | 'date'>) => void;
  calculateVoucherRequirement: (distance: number, seats: number) => number;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export const VoucherProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<VoucherTransaction[]>([]);

  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'earned' 
      ? acc + transaction.amount 
      : acc - transaction.amount;
  }, 0);

  const addTransaction = (transactionData: Omit<VoucherTransaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      date: new Date(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const calculateVoucherRequirement = (distance: number, seats: number) => {
    // Simple formula: base voucher requirement per km per seat
    const baseRate = 0.1; // vouchers per km per seat
    return Math.ceil(distance * seats * baseRate);
  };

  return (
    <VoucherContext.Provider value={{ 
      balance, 
      transactions, 
      addTransaction, 
      calculateVoucherRequirement 
    }}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => {
  const context = useContext(VoucherContext);
  if (!context) {
    throw new Error("useVoucher must be used within a VoucherProvider");
  }
  return context;
};