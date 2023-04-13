// JavaScript code that handles the form submission and sends a request to the server to retrieve the bitcoin prices.

$(document).ready(function () {
    $('#btc-form').submit(function (event) {
        event.preventDefault();

        var btcSymbols = $('#btc-symbols').val().toUpperCase().split(',');
        var btcData = [];

        for (var i = 0; i < btcSymbols.length; i++) {
            var btcSymbol = btcSymbols[i].trim();
            if (btcSymbol) {
                btcData.push({
                    symbol: btcSymbol
                });
            }
        }

        if (btcData.length > 0) {
            $.ajax({
                url: 'get_btc_prices.php',
                method: 'POST',
                data: {
                    btcData: JSON.stringify(btcData)
                },
                success: function (response) {
                    if (response && response.success) {
                        drawChart(response.data);
                    } else {
                        alert(response.message);
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                    alert('Error: ' + error);
                }
            });
        } else {
            alert('Please enter at least one Bitcoin symbol.');
        }
    });
});

// Below  code extracts the Bitcoin symbol labels and prices from the data object returned by the CoinMarketCap API and creates a new Chart.js chart with a bar chart type. The chart displays the symbol labels on the x-axis and the prices on the y-axis.
function drawChart(data) {
    var labels = [];
    var prices = [];

    for (var symbol in data) {
        if (data.hasOwnProperty(symbol)) {
            var quote = data[symbol].quote.USD;
            labels.push(symbol);
            prices.push(quote.price);
        }
    }

    var ctx = document.getElementById('btc-chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bitcoin Prices',
                data: prices,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



