import { type FC } from "react";
import { useVoucher } from "../../store/voucher-context";
import { Card } from "../UI/Card";
import { type VoucherSize } from "../../utils/voucherCalculator";

interface VoucherDisplayProps {
  compact?: boolean;
  showTransactions?: boolean;
}

export const VoucherDisplay: FC<VoucherDisplayProps> = ({ 
  compact = false, 
  showTransactions = false 
}) => {
  const { getVoucherBalance, transactions } = useVoucher();
  const balance = getVoucherBalance();

  const getVoucherIcon = (size: VoucherSize) => {
    switch (size) {
      case 'Short': return '☕';
      case 'Tall': return '☕☕';
      case 'Grande': return '☕☕☕';
      case 'Venti': return '☕☕☕☕';
      case 'Trenta': return '☕☕☕☕☕';
      default: return '☕';
    }
  };

  if (compact) {
    return (
      <div className="voucher-display-compact">
        {Object.entries(balance).map(([size, count]) => (
          <div key={size} className="voucher-item-compact">
            <span className="voucher-icon">{getVoucherIcon(size as VoucherSize)}</span>
            <span className="voucher-count">{count}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="voucher-display">
      <h3>☕ Your Coffee Voucher Balance</h3>
      
      <div className="voucher-balance-grid">
        {Object.entries(balance).map(([size, count]) => (
          <div key={size} className="voucher-balance-item">
            <div className="voucher-icon-large">
              {getVoucherIcon(size as VoucherSize)}
            </div>
            <div className="voucher-details">
              <h4>{size}</h4>
              <p className="voucher-count">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {showTransactions && (
        <div className="recent-transactions">
          <h4>Recent Transactions</h4>
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <div className="transaction-list">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type === 'earned' ? '+' : '-'} {transaction.size}
                  </span>
                  <span className="transaction-description">
                    {transaction.description}
                  </span>
                  <span className="transaction-date">
                    {transaction.date.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};