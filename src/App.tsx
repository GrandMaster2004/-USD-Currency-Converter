import { useState, useEffect } from "react";

import "./App.css";

interface CurrencyRates {
  [key: string]: number;
}

interface ConversionResult {
  amount: number;
  rate: number;
  currency: string;
}

const currencyNames: { [key: string]: string } = {
  inr: "Indian Rupee",
  eur: "Euro",
  gbp: "British Pound",
  jpy: "Japanese Yen",
  aud: "Australian Dollar",
  cad: "Canadian Dollar",
  chf: "Swiss Franc",
  cny: "Chinese Yuan",
  hkd: "Hong Kong Dollar",
  sgd: "Singapore Dollar",
  aed: "UAE Dirham",
  krw: "South Korean Won",
  mxn: "Mexican Peso",
  brl: "Brazilian Real",
  zar: "South African Rand",
  rub: "Russian Ruble",
  thb: "Thai Baht",
  php: "Philippine Peso",
  idr: "Indonesian Rupiah",
  myr: "Malaysian Ringgit",
  nzd: "New Zealand Dollar",
  sek: "Swedish Krona",
  nok: "Norwegian Krone",
  dkk: "Danish Krone",
  pln: "Polish Zloty",
  try: "Turkish Lira",
  sar: "Saudi Riyal",
  btc: "Bitcoin",
  eth: "Ethereum",
};

export default function USDConverter() {
  const [amount, setAmount] = useState<string>("");
  const [targetCurrency, setTargetCurrency] = useState<string>("inr");
  const [currencies, setCurrencies] = useState<CurrencyRates>({});
  const [date, setDate] = useState<string>("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [converting, setConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(data.usd);
        setDate(data.date);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch exchange rates");
        setLoading(false);
      });
  }, []);

  const handleConvert = (): void => {
    if (!amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
    setConverting(true);
    setTimeout(() => {
      const rate = currencies[targetCurrency];
      const converted = parseFloat(amount) * rate;
      setResult({
        amount: converted,
        rate,
        currency: targetCurrency.toUpperCase(),
      });
      setConverting(false);
    }, 300);
  };

  const getCurrencyLabel = (code: string): string => {
    const name = currencyNames[code];
    return name ? `${code.toUpperCase()} - ${name}` : code.toUpperCase();
  };

  const sortedCurrencies = Object.keys(currencies)
    .filter((c) => c !== "usd")
    .sort((a, b) => {
      const aHasName = currencyNames[a];
      const bHasName = currencyNames[b];
      if (aHasName && !bHasName) return -1;
      if (!aHasName && bHasName) return 1;
      return a.localeCompare(b);
    });

  const quickCurrencies = ["inr", "eur", "gbp", "jpy", "aud", "cad"];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 overflow-y-auto">
        <div className="text-white text-sm sm:text-base md:text-lg flex items-center gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading exchange rates...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center px-2 py-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-3 sm:mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg sm:rounded-xl mb-2 shadow-lg">
              <span className="text-xl sm:text-2xl">💱</span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
              USD Currency Converter
            </h1>
            <p className="text-blue-200 text-xs mt-0.5">
              Convert USD to 150+ currencies
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-blue-200 text-xs font-medium mb-1">
                Amount in USD
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setResult(null);
                    setError("");
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 sm:py-3 pl-7 pr-3 text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Currency Select */}
            <div>
              <label className="block text-blue-200 text-xs font-medium mb-1">
                Target Currency
              </label>
              <div className="relative">
                <select
                  value={targetCurrency}
                  onChange={(e) => {
                    setTargetCurrency(e.target.value);
                    setResult(null);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 sm:py-3 px-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition-all appearance-none cursor-pointer pr-8"
                >
                  {sortedCurrencies.map((code) => (
                    <option
                      key={code}
                      value={code}
                      className="bg-gray-800 text-white py-2"
                    >
                      {getCurrencyLabel(code)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Currency Buttons */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {quickCurrencies.map((cur) => (
                <button
                  key={cur}
                  onClick={() => {
                    setTargetCurrency(cur);
                    setResult(null);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all active:scale-95 ${
                    targetCurrency === cur
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {cur.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-red-200 text-xs text-center">
                ⚠️ {error}
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={converting}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 active:scale-95 text-white font-semibold py-2.5 sm:py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {converting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>Convert</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Result */}
            {result && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-3 sm:p-4">
                <div className="text-center">
                  <p className="text-green-200 text-xs mb-1">Converted Amount</p>
                  <div className="flex items-baseline justify-center flex-wrap gap-1">
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {result.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </p>
                    <span className="text-base sm:text-lg text-green-400 font-semibold">
                      {result.currency}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="inline-flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                      <span className="text-gray-400 text-xs">1 USD =</span>
                      <span className="text-white text-xs font-medium">
                        {result.rate.toLocaleString("en-US", {
                          maximumFractionDigits: 6,
                        })}{" "}
                        {result.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-2 border-t border-white/10">
              <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                <span>📅</span>
                <span>Rates:</span>
                <span className="text-blue-300">{date}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}