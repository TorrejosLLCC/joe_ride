import type { FC } from "react";
import { VoucherCalculator } from "../components/Voucher/VoucherCalculator";
import { VoucherDisplay } from "../components/Voucher/VoucherDisplay";
import type { VoucherSize } from "../types";

export const VoucherSummary: FC = () => {
  const voucherSizes: VoucherSize[] = ['short', 'tall', 'grande', 'venti', 'trenta'];

  return (
    <div className="voucher-summary-page">
      <h1>☕ Coffee Voucher Guide</h1>
      <p>Understanding Joe Ride's coffee voucher payment system</p>
      
      <section className="voucher-calculator-section">
        <VoucherCalculator />
      </section>

      <section className="voucher-guide-section">
        <h2>All Voucher Sizes</h2>
        <p>Different vehicle types require different voucher sizes for the same distance:</p>
        
        <div className="voucher-grid">
          {voucherSizes.map(size => (
            <VoucherDisplay 
              key={size} 
              size={size} 
              vehicleType="sedan"
            />
          ))}
        </div>

        <div className="voucher-explanation">
          <h3>How It Works</h3>
          <ul>
            <li><strong>Motorcycles</strong> are most fuel-efficient, so they can go further on smaller vouchers</li>
            <li><strong>Sedans/Compact cars</strong> have moderate efficiency</li>
            <li><strong>SUVs/Pickups</strong> consume more fuel, so they require larger vouchers for shorter distances</li>
            <li>The voucher system encourages eco-friendly transportation choices!</li>
          </ul>
        </div>
      </section>
    </div>
  );
};