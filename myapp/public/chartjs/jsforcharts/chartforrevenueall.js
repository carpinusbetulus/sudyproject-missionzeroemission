// define hear the needed datasets
var years = [];
var revenue = [];

for (var i in data) {
    years.push(data[i].umsatz_jahr);
    revenue.push(data[i].umsatz_umsatz);
}

var chartdata = {
    labels: years,
    datasets: [
        {
            label: 'Umsatz',
            backgroundColor: 'rgba(200, 200, 200, 0.75)',
            borderColor: 'rgba(200, 200, 200, 0.75)',
            hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
            hoverBorderColor: 'rgba(200, 200, 200, 1)',
            data: revenue
        }
    ]
};

var ctx = document.getElementById('revenueAll');
var myChart = new Chart(ctx, {
    type: 'line',
    data: chartdata,
    options: {
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true                
        }
    }
});