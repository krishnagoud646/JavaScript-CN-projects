async function createChartData(chartAPI, range = "5y", company = "AAPL") {
  try {
    const chartResponse = await fetch(chartAPI);
    if (!chartResponse.ok) {
      throw new Error(`Chart Response HTTP error: ${chartResponse.status}`);
    }

    const chartData = await chartResponse.json();

    let chartrange;
    let labels;

    if (chartData.stocksData[0][company][range]) {
      chartrange = chartData.stocksData[0][company][range].value;
      labels = chartData.stocksData[0][company][range].timeStamp;
      labels = labels.map((timestamp) =>
        new Date(timestamp * 1000).toLocaleDateString()
      );

      // peak and low values
      const maxValue = Math.max(...chartrange);
      const minValue = Math.min(...chartrange);
      const maxIndex = chartrange.indexOf(maxValue);
      const minIndex = chartrange.indexOf(minValue);
      const maxDate = labels[maxIndex]; 
      const minDate = labels[minIndex];

      // Plotly configuration for the line chart
      const trace = {
        x: labels,
        y: chartrange,
        mode: "lines",
        line: { color: "#00FF00" },
        hoverlabel: { bgcolor: "#1E002E", font: { color: "#FFF" } },
      };

      const layout = {
        xaxis: {
          showticklabels: false,
        },
        yaxis: {
          showticklabels: false,
        },
        plot_bgcolor: "rgb(27, 27, 90)",
        paper_bgcolor: "rgb(27, 27, 90)",
        showlegend: false,
        hovermode: "x",
        annotations: [
          {
            x: maxDate,
            y: maxValue,
            xref: "x",
            yref: "y",
            text: `Peak: $${maxValue.toFixed(2)}`,
            showarrow: true,
            arrowhead: 7,
            ax: 0,
            ay: -40,
            font: { color: "#00FF00" },
            bgcolor: "black",
          },
          {
            x: minDate,
            y: minValue,
            xref: "x",
            yref: "y",
            text: `Low: $${minValue.toFixed(2)}`,
            showarrow: true,
            arrowhead: 7,
            ax: 0,
            ay: 40,
            font: { color: "red" },
            bgcolor: "black",
          },
        ],
      };

      Plotly.newPlot("lineChart", [trace], layout, { responsive: true });

      const chart = document.getElementById("lineChart");
      chart.on("plotly_hover", function (event) {
        const xValue = event.points[0].x;

        Plotly.relayout(chart, {
          shapes: [
            {
              type: "line",
              x0: xValue,
              y0: 0,
              x1: xValue,
              y1: 1,
              xref: "x",
              yref: "paper",
              line: {
                color: "#FFFFFF",
                width: 2,
              },
            },
          ],
        });
      });

      // Remove the line on unhover
      chart.on("plotly_unhover", function () {
        Plotly.relayout(chart, { shapes: [] });
      });
    } else {
      console.error(`Data for company ${company} or range ${range} not found.`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

export {createChartData};