import "./App.css";
import { useEffect, useState } from "react";

type Rates = Record<string, number>;
type ResultType = {
  amount: number;
  rate: number;
  currency: string;
} | null;

const currencyNames: Record<string, string> = {
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

export default function App() {
  const [amount, setAmount] = useState<string>("");
  const [targetCurrency, setTargetCurrency] = useState<string>("inr");
  const [currencies, setCurrencies] = useState<Rates>({});
  const [date, setDate] = useState<string>("");
  const [result, setResult] = useState<ResultType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [converting, setConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    )
      .then((res) => res.json())
      .then((data: { usd: Rates; date: string }) => {
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
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const rate = currencies[targetCurrency];

    if (!rate) {
      setError("Invalid currency selected");
      return;
    }

    setError("");
    setConverting(true);

    setTimeout(() => {
      const converted = Number(amount) * rate;
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
    .filter((c: string) => c !== "usd")
    .sort((a: string, b: string) => {
      const aHasName = !!currencyNames[a];
      const bHasName = !!currencyNames[b];
      if (aHasName && !bHasName) return -1;
      if (!aHasName && bHasName) return 1;
      return a.localeCompare(b);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white">Loading exchange rates...</p>
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h1 className="text-white text-2xl font-bold text-center mb-4">
          USD Currency Converter
        </h1>

        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setResult(null);
            setError("");
          }}
          placeholder="Enter amount in USD"
          className="w-full mb-3 p-3 rounded bg-white/10 text-white border border-white/20"
        />

        <select
          value={targetCurrency}
          onChange={(e) => {
            setTargetCurrency(e.target.value);
            setResult(null);
          }}
          className="w-full mb-3 p-3 rounded bg-white/10 text-white border border-white/20"
        >
          {sortedCurrencies.map((code: string) => (
            <option key={code} value={code} className="bg-black text-white">
              {getCurrencyLabel(code)}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-red-400 mb-3 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleConvert}
          disabled={converting}
          className="w-full bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 disabled:opacity-50"
        >
          {converting ? "Converting..." : "Convert"}
        </button>

        {result && (
          <div className="mt-4 text-center bg-white/10 p-4 rounded">
            <p className="text-white text-xl font-bold">
              {result.amount.toFixed(2)} {result.currency}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              1 USD = {result.rate} {result.currency}
            </p>
          </div>
        )}

        <p className="text-gray-400 text-xs text-center mt-4">
          Rates as of: {date}
        </p>
      </div>
    </div>
  );
}
