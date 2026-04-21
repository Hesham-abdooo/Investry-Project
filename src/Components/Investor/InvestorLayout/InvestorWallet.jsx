import React, { useState } from "react";
import {
  FaWallet,
  FaCreditCard,
  FaReceipt,
  FaLock,
} from "react-icons/fa";

const quickAmounts = [100, 500, 1000, 5000];

export default function InvestorWallet() {
  const [amount, setAmount] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(null);

  const handleQuickSelect = (value) => {
    setSelectedQuick(value);
    setAmount(value.toString());
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(val);
    setSelectedQuick(null);
  };

  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    // TODO: Stripe integration — replace with actual checkout
    alert(`Stripe checkout for EGP ${amount} — integration coming soon`);
  };

  return (
    <div className="p-4 md:p-6">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1.5" style={{ color: "#D4A017" }}>
          Wallet
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Manage your funds and track your transactions.
        </p>
      </div>

      {/* ── Card + Add Funds ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">

        {/* Credit Card Style Balance */}
        <div className="lg:col-span-2">
          <div
            className="relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0F2044 0%, #1a3a6a 100%)",
              aspectRatio: "1.7 / 1",
            }}
          >
            {/* Decorative circle */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ backgroundColor: "rgba(212,160,23,0.08)" }} />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              {/* Top — Logo + Chip */}
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-bold tracking-tight">
                  <span className="opacity-90">Inves</span>
                  <span style={{ color: "#D4A017" }}>Try</span>
                </span>
                {/* Card chip */}
                <div className="w-9 h-7 rounded-md" style={{ background: "linear-gradient(135deg, #D4A017 0%, #e8b84a 100%)", opacity: 0.8 }} />
              </div>

              {/* Middle — Balance */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                  Available Balance
                </p>
                <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  EGP 0.00
                </p>
              </div>

              {/* Bottom — Card number style */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 tracking-widest font-mono">
                  •••• •••• •••• 0000
                </span>
                <FaCreditCard size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Funds Card */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#0F2044" }}>
            Add Funds
          </h2>

          {/* Amount Input */}
          <div className="relative mb-4">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400 text-sm font-semibold">
              EGP
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full rounded-lg border border-gray-100 bg-white py-3 pl-14 pr-4 text-lg font-semibold outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#FEF9EC]"
              style={{ color: "#0F2044" }}
            />
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {quickAmounts.map((val) => (
              <button
                key={val}
                onClick={() => handleQuickSelect(val)}
                className="py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                style={
                  selectedQuick === val
                    ? { backgroundColor: "#0F2044", color: "#fff" }
                    : { backgroundColor: "#FEF9EC", color: "#D4A017" }
                }
              >
                {val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
              </button>
            ))}
          </div>

          {/* Add Funds Button */}
          <button
            onClick={handleAddFunds}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0F2044" }}
          >
            <FaCreditCard size={14} />
            Add Funds
          </button>

          {/* Stripe Badge */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <FaLock size={9} className="text-gray-300" />
            <span className="text-[11px] text-gray-400">
              Secured by Stripe
            </span>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold mb-6" style={{ color: "#0F2044" }}>
          Recent Transactions
        </h2>

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-2 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Date</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Type</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Amount</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-right">Status</span>
        </div>

        <div className="border-t border-gray-50" />

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#FEF9EC" }}
          >
            <FaReceipt size={20} style={{ color: "#D4A017" }} />
          </div>
          <h3 className="text-base font-semibold mb-1.5" style={{ color: "#0F2044" }}>
            No transactions yet
          </h3>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Your deposit and withdrawal history will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
