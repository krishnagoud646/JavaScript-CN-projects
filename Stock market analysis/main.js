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

// Create Chart
// async function createChartData(chartAPI, range = "5y", company = "AAPL") {
//   try {
//     const chartResponse = await fetch(chartAPI);
//     if (!chartResponse.ok) {
//       throw new Error(`Chart Response HTTP error: ${chartResponse.status}`);
//     }

//     const chartData = await chartResponse.json();

//     let chartrange;
//     let labels;

//     if (chartData.stocksData[0][company][range]) {
//       chartrange = chartData.stocksData[0][company][range].value;
//       labels = chartData.stocksData[0][company][range].timeStamp;
//       labels = labels.map((timestamp) =>
//         new Date(timestamp * 1000).toLocaleDateString()
//       );

//       // peak and low values
//       const maxValue = Math.max(...chartrange);
//       const minValue = Math.min(...chartrange);
//       const maxIndex = chartrange.indexOf(maxValue);
//       const minIndex = chartrange.indexOf(minValue);
//       const maxDate = labels[maxIndex]; 
//       const minDate = labels[minIndex];

//       // Plotly configuration for the line chart
//       const trace = {
//         x: labels,
//         y: chartrange,
//         mode: "lines",
//         line: { color: "#00FF00" },
//         hoverlabel: { bgcolor: "#1E002E", font: { color: "#FFF" } },
//       };

//       const layout = {
//         xaxis: {
//           showticklabels: false,
//         },
//         yaxis: {
//           showticklabels: false,
//         },
//         plot_bgcolor: "rgb(27, 27, 90)",
//         paper_bgcolor: "rgb(27, 27, 90)",
//         showlegend: false,
//         hovermode: "x",
//         annotations: [
//           {
//             x: maxDate,
//             y: maxValue,
//             xref: "x",
//             yref: "y",
//             text: `Peak: $${maxValue.toFixed(2)}`,
//             showarrow: true,
//             arrowhead: 7,
//             ax: 0,
//             ay: -40,
//             font: { color: "#00FF00" },
//             bgcolor: "black",
//           },
//           {
//             x: minDate,
//             y: minValue,
//             xref: "x",
//             yref: "y",
//             text: `Low: $${minValue.toFixed(2)}`,
//             showarrow: true,
//             arrowhead: 7,
//             ax: 0,
//             ay: 40,
//             font: { color: "red" },
//             bgcolor: "black",
//           },
//         ],
//       };

//       Plotly.newPlot("lineChart", [trace], layout, { responsive: true });

//       const chart = document.getElementById("lineChart");
//       chart.on("plotly_hover", function (event) {
//         const xValue = event.points[0].x;

//         Plotly.relayout(chart, {
//           shapes: [
//             {
//               type: "line",
//               x0: xValue,
//               y0: 0,
//               x1: xValue,
//               y1: 1,
//               xref: "x",
//               yref: "paper",
//               line: {
//                 color: "#FFFFFF",
//                 width: 2,
//               },
//             },
//           ],
//         });
//       });

//       // Remove the line on unhover
//       chart.on("plotly_unhover", function () {
//         Plotly.relayout(chart, { shapes: [] });
//       });
//     } else {
//       console.error(`Data for company ${company} or range ${range} not found.`);
//     }
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

const range = "5y";
const company = "AAPL";
createChartData(chartAPI, range, company);

function updateChartRange(company, range) {
  createChartData(chartAPI, range, company);
}

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
  url = "https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata";
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
