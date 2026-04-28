import React, { useState, useEffect } from "react";
import {
  FaWallet,
  FaCreditCard,
  FaReceipt,
  FaLock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FiArrowDownLeft, FiArrowUpRight, FiCheck, FiClock, FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../../../Api/axiosInstance";

const quickAmounts = [100, 500, 1000, 5000];

/* ── Format helpers ── */
const fmt = (n) => Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const formatTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";

/* ── Transaction type styling ── */
const txStyles = {
  Deposit: { icon: FiArrowDownLeft, color: "#059669", bg: "#ECFDF5", label: "Deposit" },
  Withdrawal: { icon: FiArrowUpRight, color: "#EF4444", bg: "#FEF2F2", label: "Withdrawal" },
  Investment: { icon: FiArrowUpRight, color: "#D4A017", bg: "#FEF9EC", label: "Investment" },
  Refund: { icon: FiArrowDownLeft, color: "#3B82F6", bg: "#EFF6FF", label: "Refund" },
};
const getStyle = (type) => txStyles[type] || { icon: FiArrowDownLeft, color: "#6b7280", bg: "#F9FAFB", label: type || "Transaction" };

/* ── Status badge ── */
const statusColors = {
  Completed: { bg: "#ECFDF5", color: "#059669", icon: FiCheck },
  Pending: { bg: "#FEF9EC", color: "#D4A017", icon: FiClock },
  Failed: { bg: "#FEF2F2", color: "#EF4444", icon: FiAlertCircle },
};

export default function InvestorWallet() {
  const [amount, setAmount] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMsg, setDepositMsg] = useState(null);

  const pageSize = 10;

  /* ── Fetch Balance ── */
  useEffect(() => {
    axiosInstance
      .get("/Wallet/balance")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setBalance(typeof data === "number" ? data : data?.balance ?? data?.availableBalance ?? 0);
      })
      .catch((err) => { console.error("Balance error:", err); setBalance(0); })
      .finally(() => setBalanceLoading(false));
  }, []);

  /* ── Fetch Transactions ── */
  useEffect(() => {
    setTxLoading(true);
    axiosInstance
      .get(`/Wallet/transactions?page=${page}&pageSize=${pageSize}`)
      .then((res) => {
        const data = res.data?.data ?? res.data?.value ?? res.data;
        const list = Array.isArray(data) ? data : data?.items ?? data?.transactions ?? [];
        setTransactions(list);
        setHasMore(list.length >= pageSize);
      })
      .catch((err) => { console.error("Transactions error:", err); setTransactions([]); })
      .finally(() => setTxLoading(false));
  }, [page]);

  /* ── Handlers ── */
  const handleQuickSelect = (value) => { setSelectedQuick(value); setAmount(value.toString()); };
  const handleAmountChange = (e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); setSelectedQuick(null); };

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setDepositLoading(true);
    setDepositMsg(null);
    try {
      const res = await axiosInstance.post("/Wallet/deposit", { amount: parseFloat(amount) });
      const data = res.data?.data ?? res.data;
      // If API returns a payment URL (Stripe), redirect
      if (data?.url || data?.checkoutUrl || data?.paymentUrl) {
        window.location.href = data.url || data.checkoutUrl || data.paymentUrl;
        return;
      }
      // Otherwise, assume success
      setDepositMsg({ type: "success", text: "Deposit successful!" });
      setAmount("");
      setSelectedQuick(null);
      // Refresh balance & transactions
      const balRes = await axiosInstance.get("/Wallet/balance");
      const bData = balRes.data?.data ?? balRes.data;
      setBalance(typeof bData === "number" ? bData : bData?.balance ?? bData?.availableBalance ?? 0);
      setPage(1);
    } catch (err) {
      console.error("Deposit error:", err);
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Deposit failed. Please try again.";
      setDepositMsg({ type: "error", text: msg });
    } finally {
      setDepositLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1.5" style={{ color: "#D4A017" }}>Wallet</h1>
        <p className="text-sm text-gray-500 leading-relaxed">Manage your funds and track your transactions.</p>
      </div>

      {/* ── Card + Add Funds ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">
        {/* Credit Card Style Balance */}
        <div className="lg:col-span-2">
          <div
            className="relative rounded-2xl p-6 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0F2044 0%, #1a3a6a 100%)", aspectRatio: "1.7 / 1" }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ backgroundColor: "rgba(212,160,23,0.08)" }} />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-bold tracking-tight">
                  <span className="opacity-90">Inves</span><span style={{ color: "#D4A017" }}>Try</span>
                </span>
                <div className="w-9 h-7 rounded-md" style={{ background: "linear-gradient(135deg, #D4A017 0%, #e8b84a 100%)", opacity: 0.8 }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Available Balance</p>
                {balanceLoading ? (
                  <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    EGP <span style={{ color: "#D4A017" }}>{fmt(balance)}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 tracking-widest font-mono">•••• •••• •••• 0000</span>
                <FaCreditCard size={18} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Funds Card */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#0F2044" }}>Add Funds</h2>

          {depositMsg && (
            <div
              className={`text-sm px-4 py-3 rounded-xl mb-4 ${depositMsg.type === "error" ? "bg-red-50 border border-red-200 text-red-600" : "bg-green-50 border border-green-200 text-green-600"}`}
            >
              {depositMsg.text}
            </div>
          )}

          <div className="relative mb-4">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400 text-sm font-semibold">EGP</span>
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

          <button
            onClick={handleAddFunds}
            disabled={!amount || parseFloat(amount) <= 0 || depositLoading}
            className="w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0F2044" }}
          >
            <FaCreditCard size={14} />
            {depositLoading ? "Processing..." : "Add Funds"}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            <FaLock size={9} className="text-gray-300" />
            <span className="text-[11px] text-gray-400">Secured by Stripe</span>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: "#0F2044" }}>Recent Transactions</h2>
          {transactions.length > 0 && (
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Page {page}</span>
          )}
        </div>

        {txLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-gray-100" />
                <div className="flex-1">
                  <div className="h-3.5 bg-gray-100 rounded w-28 mb-2" />
                  <div className="h-2.5 bg-gray-100 rounded w-20" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-24" />
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <>
            {/* Table Header - Desktop */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 mb-2">
              <span className="col-span-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Transaction</span>
              <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Date</span>
              <span className="col-span-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-right">Amount</span>
              <span className="col-span-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-right">Status</span>
            </div>
            <div className="border-t border-gray-50" />

            {transactions.map((tx, i) => {
              const style = getStyle(tx.type);
              const Icon = style.icon;
              const isPositive = tx.type === "Deposit" || tx.type === "Refund";
              const statusStyle = statusColors[tx.status] || statusColors.Pending;
              const StatusIcon = statusStyle.icon;

              return (
                <div key={tx.id || i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg">
                  {/* Type + Description */}
                  <div className="sm:col-span-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: style.bg }}>
                      <Icon size={16} style={{ color: style.color }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: "#0F2044" }}>{style.label}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{tx.description || tx.projectTitle || "Wallet transaction"}</p>
                    </div>
                  </div>
                  {/* Date */}
                  <div className="sm:col-span-2 flex sm:block items-center gap-2">
                    <span className="text-[12px] text-gray-500">{formatDate(tx.createdAt || tx.date)}</span>
                    <span className="text-[11px] text-gray-400 hidden sm:block">{formatTime(tx.createdAt || tx.date)}</span>
                  </div>
                  {/* Amount */}
                  <div className="sm:col-span-3 text-right">
                    <span className="text-[14px] font-bold" style={{ color: isPositive ? "#059669" : "#0F2044" }}>
                      {isPositive ? "+" : "−"} EGP {fmt(Math.abs(tx.amount))}
                    </span>
                  </div>
                  {/* Status */}
                  <div className="sm:col-span-2 flex justify-end">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                    >
                      <StatusIcon size={10} /> {tx.status || "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:text-[#0F2044] transition-colors"
              >
                <FaChevronLeft size={10} /> Previous
              </button>
              <span className="text-[12px] font-semibold text-gray-400">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:text-[#0F2044] transition-colors"
              >
                Next <FaChevronRight size={10} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#FEF9EC" }}>
              <FaReceipt size={20} style={{ color: "#D4A017" }} />
            </div>
            <h3 className="text-base font-semibold mb-1.5" style={{ color: "#0F2044" }}>No transactions yet</h3>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Your deposit and withdrawal history will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
