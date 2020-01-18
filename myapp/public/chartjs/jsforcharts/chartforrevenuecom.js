// Part of SQL Statement: SELECT umsatz_jahr, umsatz_umsatz FROM  ...
// define hear the needed datasets
var years = [];
var revenue = [];

//they have to have the same names as after select in the SQL query
for (const i in data) {
    years.push(data[i].umsatz_jahr);
    revenue.push(data[i].umsatz_umsatz);
}

var chartdata = {
    labels: years,
    datasets: [
        {
            label: 'Umsatz',
            backgroundColor: 'rgba(181,158,133,0.75)',
            borderColor: 'rgba(181,158,133,0.75)',
            data: revenue
        }
    ]
};

var ctx = document.getElementById('revenueCompany');
var myChart = new Chart(ctx, {
    type: 'line',
    data: chartdata,
    options: {
        responsive: false,
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