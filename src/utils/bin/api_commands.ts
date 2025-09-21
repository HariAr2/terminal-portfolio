// // List of commands that require API calls

import { getProjects } from '../api';
import { getQuote } from '../api';
import { getReadme } from '../api';
import { getWeather } from '../api';
import asciichart from "asciichart";


export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};


export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  return weather;
};

// Add this to your terminal commands
async function getStockPrice(symbol) {
  const apiKey = process.env.API_KEY; // Get one free at alphavantage.co
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
      return `${symbol.toUpperCase()}: $${data["Global Quote"]["05. price"]}`;
    } else {
      return `Could not fetch stock price for ${symbol}`;
    }
  } catch (err) {
    return "Error fetching stock data.";
  }
}

// Example command usage
export const stocks = async (args) => {
  if (args.length === 0) return "Usage: stocks AAPL";
  return await getStockPrice(args[0]);
};



async function getStockHistory(symbol) {
  const apiKey = process.env.API_KEY; // from Alpha Vantage or Finnhub
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data["Time Series (Daily)"]) return `No data for ${symbol}`;

  // Get last 30 days closing prices
  const prices = Object.values(data["Time Series (Daily)"])
    .map(d => parseFloat(d["4. close"]))
    .slice(0, 30)
    .reverse();

  return `
${symbol.toUpperCase()} - Last 30 Days
${asciichart.plot(prices, { height: 10 })}
`;
}

export const stockchart = async (args) => {
  if (args.length === 0) return "Usage: stockchart AAPL";
  return await getStockHistory(args[0]);
};



