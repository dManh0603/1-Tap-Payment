import Chart from 'chart.js'
import axios from 'axios';

async function getData(date) {
  try {
    let endpoint = '/api/admin/activity/monthly';
    if (date) {
      endpoint += `/${date}`
    }
    const token = localStorage.getItem('userToken');
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    });

    if (response.status === 200) {
      const data = response.data;
      const { currentMonth, currentYear } = data

      // Extract just the count values from the response array
      const counts = data.activityCounts.map(({ count }) => count);
      const labels = data.activityCounts.map(({ type }) => type);
      return { labels, counts, currentMonth, currentYear };
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    // Handle the error response
    console.error('Error:', error);
  }
}

export async function initPieChart(date = null) {
  try {
    var ctx = document.getElementById("myPieChart");
    const data = await getData(date);

    const totalCheckout = data.counts.reduce((sum, count) => sum += count, 0)
    const formattedDate = `${data.currentYear} - ${data.currentMonth}: ${totalCheckout} checkouts`;
    return new Chart(ctx, {
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
  } catch (error) {
    // Handle the error response
    console.error('Error:', error);
  }

}

