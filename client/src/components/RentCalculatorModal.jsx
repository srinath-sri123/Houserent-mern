import React, { useState } from 'react';
import { X, Calculator, DollarSign, PieChart, CheckCircle2, AlertTriangle } from 'lucide-react';

const RentCalculatorModal = ({ propertyPrice = 2800, onClose }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(8500);
  const [monthlyDebt, setMonthlyDebt] = useState(500);
  const [rentAmount, setRentAmount] = useState(propertyPrice);

  // Standard 30% rule for housing affordability
  const recommendedMaxRent = Math.round((monthlyIncome - monthlyDebt) * 0.3);
  const rentPercentage = monthlyIncome > 0 ? Math.round((rentAmount / monthlyIncome) * 100) : 0;
  const isAffordable = rentPercentage <= 30;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calculator size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                Rent Affordability Calculator
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                Analyze monthly budget against standard 30% rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Calculator Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Gross Monthly Household Income ($)
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Monthly Non-Housing Debts (Loans, Car, Credit Cards) ($)
              </label>
              <input
                type="number"
                value={monthlyDebt}
                onChange={(e) => setMonthlyDebt(Number(e.target.value) || 0)}
                className="glass-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Monthly Property Rent ($)
              </label>
              <input
                type="number"
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value) || 0)}
                className="glass-input"
              />
            </div>
          </div>

          {/* Results Visual Box */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: `1px solid ${isAffordable ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isAffordable ? (
                  <CheckCircle2 size={20} color="#34d399" />
                ) : (
                  <AlertTriangle size={20} color="#fbbf24" />
                )}
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: isAffordable ? '#34d399' : '#fbbf24',
                  }}
                >
                  {isAffordable ? 'Well Within Recommended Budget' : 'Exceeds Standard 30% Recommendation'}
                </span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                {rentPercentage}% of Income
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recommended Max Rent (30%):</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                  ${recommendedMaxRent.toLocaleString()} / mo
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Remaining Net Disposable:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  ${Math.max(0, monthlyIncome - monthlyDebt - rentAmount).toLocaleString()} / mo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCalculatorModal;
