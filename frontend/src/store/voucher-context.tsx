import { createContext, useContext, useState, type FC } from "react";
import { calculateVoucherRequirement, type VehicleType, type VoucherSize } from "../utils/voucherCalculator";

interface VoucherTransaction {
  id: string;
  userId: string;
  size: VoucherSize;
  type: 'earned' | 'spent';
  description: string;
  date: Date;
}

interface VoucherContextType {
  transactions: VoucherTransaction[];
  addTransaction: (transaction: Omit<VoucherTransaction, 'id' | 'date'>) => void;
  calculateVoucherForTrip: (distance: number, vehicleType: VehicleType) => { size: VoucherSize; description: string };
  getVoucherBalance: () => { [K in VoucherSize]: number };
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export const VoucherProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<VoucherTransaction[]>([]);

  const addTransaction = (transactionData: Omit<VoucherTransaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      date: new Date(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const calculateVoucherForTrip = (distance: number, vehicleType: VehicleType) => {
    return calculateVoucherRequirement(distance, vehicleType);
  };

  const getVoucherBalance = () => {
    const balance: { [K in VoucherSize]: number } = {
      Short: 0,
      Tall: 0,
      Grande: 0,
      Venti: 0,
      Trenta: 0,
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'earned') {
        balance[transaction.size]++;
      } else {
        balance[transaction.size]--;
      }
    });

    return balance;
  };

  return (
    <VoucherContext.Provider value={{ 
      transactions, 
      addTransaction, 
      calculateVoucherForTrip,
      getVoucherBalance
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