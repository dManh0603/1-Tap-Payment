// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

async function getData() {
  const token = localStorage.getItem('userToken');
  try {
    const response = await fetch('/api/admin/activity/monthly', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Extract just the count values from the response array
      const counts = data.map(({ count }) => count);
      const labels = data.map(({ type }) => type);
      return { labels, counts };
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    // Handle the error response
    console.error('Error:', error);
  }
}

async function renderChart() {
  var ctx = document.getElementById("myPieChart");

  try {
    const data = await getData();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const totalCheckout = data.counts.reduce((sum, count) => sum += count, 0)
    const formattedDate = `${currentYear} - ${currentMonth}: ${totalCheckout} checkouts`;
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.counts,
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: formattedDate,
          fontSize: 18,
        },
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: function (tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
              });
              var currentValue = dataset.data[tooltipItem.index];
              var percentage = Math.floor((currentValue / total) * 100 + 0.5);
              return data.labels[tooltipItem.datasetIndex] + ': ' + currentValue + ' (' + percentage + '%)';
            }
          }
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });
    console.log(myPieChart)
  } catch (error) {
    // Handle the error response
    console.error('Error:', error);
  }
}

renderChart();
