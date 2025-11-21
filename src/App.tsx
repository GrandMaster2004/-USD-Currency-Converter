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

  const quickCurrencies = ["inr", "eur", "gbp", "jpy", "aud", "cad"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-white text-sm sm:text-base md:text-lg flex items-center gap-3">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading exchange rates...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-start sm:justify-center px-3 py-4 sm:p-6 md:p-8 overflow-auto">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 shadow-lg">
              <span className="text-2xl sm:text-3xl md:text-4xl">💱</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
              USD Currency Converter
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1">
              Convert USD to 150+ currencies worldwide
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* Amount Input */}
            <div>
              <label className="block text-blue-200 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Amount in USD
              </label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-base sm:text-lg">
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
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 sm:py-3.5 md:py-4 pl-8 sm:pl-10 pr-4 text-white text-base sm:text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Currency Select */}
            <div>
              <label className="block text-blue-200 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Target Currency
              </label>
              <div className="relative">
                <select
                  value={targetCurrency}
                  onChange={(e) => {
                    setTargetCurrency(e.target.value);
                    setResult(null);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 sm:py-3.5 md:py-4 px-4 text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all appearance-none cursor-pointer pr-10"
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
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {quickCurrencies.map((cur) => (
                <button
                  key={cur}
                  onClick={() => {
                    setTargetCurrency(cur);
                    setResult(null);
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                    targetCurrency === cur
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {cur.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-xs sm:text-sm text-center animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={converting}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 active:scale-98 text-white font-semibold py-3.5 sm:py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              {converting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>Convert</span>
                  <svg
                    className="w-5 h-5"
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
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 sm:p-5 md:p-6 animate-fade-in">
                <div className="text-center">
                  <p className="text-green-200 text-xs sm:text-sm mb-2">
                    Converted Amount
                  </p>
                  <div className="flex items-baseline justify-center flex-wrap gap-1">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {result.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </p>
                    <span className="text-lg sm:text-xl md:text-2xl text-green-400 font-semibold">
                      {result.currency}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                      <span className="text-gray-400 text-xs sm:text-sm">
                        1 USD =
                      </span>
                      <span className="text-white text-xs sm:text-sm font-medium">
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
            <div className="text-center pt-3 sm:pt-4 border-t border-white/10">
              <p className="text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-1.5 flex-wrap">
                <span>📅</span>
                <span>Rates as of:</span>
                <span className="text-blue-300 font-medium">{date}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Attribution */}
        <p className="text-center text-gray-500 text-xs mt-4 px-4">
          Exchange rates provided by open-source currency API
        </p>
      </div>
    </div>
  );
}
