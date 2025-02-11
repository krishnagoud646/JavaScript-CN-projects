import {createChartData} from "./chart.js"
const Stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];

const chartAPI = "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata";
const stockList = document.getElementById("stock-list");
const stockDetails = document.querySelector("stock-details");


const range = "5y";
const company = "AAPL";
createChartData(chartAPI, range, company);

function updateChartRange(company, range) {
  createChartData(chartAPI, range, company);
}
window.updateChartRange = updateChartRange;

let stock;

// Create the Stock list
async function createStockList() {
  for (const stock of Stocks) {
    const listItem = document.createElement("li");
    listItem.classList.add("list");
    const { bookValue, profit } = await getstockstatsdata(stock);
    listItem.innerHTML = `
        <p class="stock-name">${stock}</p>
        <p class="bookValue">$${bookValue}</p>
        <p class="stock-profit">$${profit.toFixed(2)}</p>`;
    stockList.appendChild(listItem);
    const profitEle = listItem.querySelector(".stock-profit");
    if (profit == "0.00") {
      profitEle.style.color = "red";
    } else {
      profitEle.style.color = "green";
    }
  }
}

// Get bookValue and profit Stats Data from API
async function getstockstatsdata(company) {
  const url = "https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Chart Response HTTP error: ${response.status}`);
    }
    const result = await response.json();
    let bookValue = result.stocksStatsData[0][company].bookValue;
    let profit = result.stocksStatsData[0][company].profit;
    // profit = profit.toFixed(2);
    return { bookValue, profit };
  } catch (err) {
    console.error("Error:", err);
  }
}

createStockList();

async function stocksProfileData(stock = "AAPL") {
  const url =
    "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Chart Response HTTP error: ${response.status}`);
    }
    const result = await response.json();
    let summaryText = result.stocksProfileData[0][stock].summary;
    const summary = document.querySelector(".summary");
    summary.textContent = summaryText;
  } catch (err) {
    console.error("Error:", err);
  }
}
stocksProfileData(company);

stockList.addEventListener("click", (event) => {
  if (event.target) {
    const stockText = event.target.textContent;
    addStockDetails(stockText);
    stocksProfileData(stockText);
    createChartData(chartAPI, range, stockText);
    const buttons = document.querySelectorAll(".chartButtons button");
    const rangeVal = ["1mo", "3mo", "1y", "5y"];
    buttons.forEach((button, index) => {
      const rangeValue = rangeVal[index];
      button.setAttribute(
        "onclick",
        `updateChartRange('${stockText}', '${rangeValue}')`
      );
    });
    updateChartRange(stockText, range);
  }
});

async function addStockDetails(name) {
  const stockName = document.querySelector(".stock-name-summary");
  const bookValuele = document.querySelector(".bookValue-summary");
  const profitele = document.querySelector(".stock-profit-summary");
  const { bookValue, profit } = await getstockstatsdata(name);
  stockName.textContent = name;
  if (profit == "0.00") {
    profitele.style.color = "red";
  } else {
    profitele.style.color = "green";
  }
  bookValuele.textContent = `$${bookValue}`;
  profitele.textContent = `${profit}%`;
}
addStockDetails(company);
