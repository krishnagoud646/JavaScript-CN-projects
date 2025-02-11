// Stocks array
const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

// API URLs
const chartAPI = 'https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata';
const profileAPI = 'https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata';
const summaryAPI = 'https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata';

// Get elements
const stockList = document.getElementById('stock-list');
const stockName = document.getElementById('stock-name');
const stockBookValue = document.getElementById('stock-bookvalue');
const stockProfit = document.getElementById('stock-profit');
const stockSummary = document.getElementById('stock-summary');
const stockChartCanvas = document.getElementById('stock-chart');

// Chart instance
let stockChart;

// Fetch and display the stock list
function loadStockList() {
    stocks.forEach(symbol => {
        fetch(`${profileAPI}?symbol=${symbol}`)
            .then(response => response.json())
            .then(data => {
                const li = document.createElement('li');
                li.innerText = `${symbol}: Book Value - ${data.bookValue}, Profit - ${data.profit}`;
                li.onclick = () => displayStockDetails(symbol);
                stockList.appendChild(li);
            });
    });
}

// Display stock details
function displayStockDetails(symbol) {
    fetch(`${profileAPI}?symbol=${symbol}`)
        .then(response => response.json())
        .then(data => {
            stockName.innerText = `Name: ${symbol}`;
            stockBookValue.innerText = `Book Value: ${data.bookValue}`;
            stockProfit.innerText = `Profit: ${data.profit}`;
            stockProfit.style.color = data.profit > 0 ? 'green' : 'red';
        });

    fetch(`${summaryAPI}?symbol=${symbol}`)
        .then(response => response.json())
        .then(data => {
            stockSummary.innerText = `Summary: ${data.summary}`;
        });

    loadStockChart(symbol, '1month');
}

// Load and update chart data
function loadStockChart(symbol, range) {
    fetch(`${chartAPI}?symbol=${symbol}&range=${range}`)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(point => new Date(point.timestamp * 1000).toLocaleDateString());
            const prices = data.map(point => point.price);

            if (stockChart) stockChart.destroy();

            stockChart = new Chart(stockChartCanvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${symbol} Stock Price`,
                        data: prices,
                        borderColor: 'blue',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `Price: $${tooltipItem.yLabel}`;
                            }
                        }
                    },
                    scales: {
                        xAxes: [{ display: true }],
                        yAxes: [{ display: true }]
                    }
                }
            });
        });
}

// Update chart range
function updateChartRange(range) {
    const selectedStock = stockName.innerText.split(': ')[1];
    if (selectedStock) loadStockChart(selectedStock, range);
}

// Initialize the stock list on page load
loadStockList();
