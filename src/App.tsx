import "./App.css";

import { useState, useEffect } from "react";

const currencyNames = {
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
  const [amount, setAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("inr");
  const [currencies, setCurrencies] = useState({});
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

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

  const handleConvert = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
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

  const getCurrencyLabel = (code) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-white text-base sm:text-lg md:text-xl flex items-center gap-2 sm:gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading exchange rates...
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl mb-3 shadow-lg">
              <span className="text-2xl sm:text-3xl">💱</span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              USD Currency Converter
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Convert USD to 150+ currencies worldwide
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-blue-200 text-xs sm:text-sm font-medium mb-1.5">
                Amount in USD
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setResult(null);
                    setError("");
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-8 pr-3 text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
            </div>

            {/* Currency Select */}
            <div>
              <label className="block text-blue-200 text-xs sm:text-sm font-medium mb-1.5">
                Target Currency
              </label>
              <select
                value={targetCurrency}
                onChange={(e) => {
                  setTargetCurrency(e.target.value);
                  setResult(null);
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 transition appearance-none cursor-pointer"
              >
                {sortedCurrencies.map((code) => (
                  <option
                    key={code}
                    value={code}
                    className="bg-gray-800 text-white"
                  >
                    {getCurrencyLabel(code)}
                  </option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-red-200 text-xs sm:text-sm text-center">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              onClick={handleConvert}
              disabled={converting}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 active:scale-95 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {converting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Converting...
                </>
              ) : (
                <>Convert →</>
              )}
            </button>

            {/* Result */}
            {result && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-3 sm:p-4 mt-4">
                <div className="text-center">
                  <p className="text-green-200 text-xs sm:text-sm mb-1">
                    Converted Amount
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white break-all">
                    {result.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                    <span className="text-green-400 ml-1 sm:ml-2">
                      {result.currency}
                    </span>
                  </p>
                  <div className="mt-2">
                    <span className="text-gray-400 text-xs sm:text-sm">
                      1 USD ={" "}
                    </span>
                    <span className="text-white text-xs sm:text-sm">
                      {result.rate.toLocaleString("en-US", {
                        maximumFractionDigits: 6,
                      })}{" "}
                      {result.currency}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-3 border-t border-white/10">
              <p className="text-gray-400 text-xs">
                📅 Rates as of: <span className="text-blue-300">{date}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["inr", "eur", "gbp", "jpy", "aud"].map((cur) => (
            <button
              key={cur}
              onClick={() => {
                setTargetCurrency(cur);
                setResult(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                targetCurrency === cur
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {cur.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
