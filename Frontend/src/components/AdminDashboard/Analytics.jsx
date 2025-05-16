import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  // Simulated data for analytics
  const [data, setData] = useState({
    users: 0,
    activeSubscriptions: 0,
    totalApplications: 0,
    monthlyApplications: [],
    subscriptionBreakdown: [],
    supportTickets: 0,
  });

  // Fetch analytics data (simulate API call)
  useEffect(() => {
    const fetchAnalytics = async () => {
      // Simulated API data
      const analyticsData = {
        users: 1500,
        activeSubscriptions: 1200,
        totalApplications: 5000,
        monthlyApplications: [200, 250, 400, 450, 300, 350, 400, 420, 500, 600, 700, 800],
        subscriptionBreakdown: [60, 30, 10], // e.g., Basic, Pro, Enterprise
        supportTickets: 15,
      };
      setData(analyticsData);
    };

    fetchAnalytics();
  }, []);

  // Line chart for monthly applications
  const lineChartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Applications',
        data: data.monthlyApplications,
        borderColor: '#8C52FF',
        backgroundColor: 'rgba(140, 82, 255, 0.3)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Doughnut chart for subscription breakdown
  const doughnutChartData = {
    labels: ['Basic Plan', 'Pro Plan', 'Enterprise Plan'],
    datasets: [
      {
        data: data.subscriptionBreakdown,
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        hoverBackgroundColor: ['#45A049', '#FFB300', '#E53935'],
      },
    ],
  };

  // Bar chart for total metrics
  const barChartData = {
    labels: ['Users', 'Active Subscriptions', 'Applications', 'Support Tickets'],
    datasets: [
      {
        label: 'Totals',
        data: [data.users, data.activeSubscriptions, data.totalApplications, data.supportTickets],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'],
      },
    ],
  };

  return (
    <div>
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-gray-500 font-semibold">Total Users</h3>
          <p className="text-3xl font-bold text-[#1D5EC7]">{data.users}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-gray-500 font-semibold">Active Subscriptions</h3>
          <p className="text-3xl font-bold text-[#4CAF50]">{data.activeSubscriptions}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-gray-500 font-semibold">Total Applications</h3>
          <p className="text-3xl font-bold text-[#2196F3]">{data.totalApplications}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-gray-500 font-semibold">Support Tickets</h3>
          <p className="text-3xl font-bold text-[#F44336]">{data.supportTickets}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Applications</h3>
          <Line data={lineChartData} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Subscription Breakdown</h3>
          <Doughnut data={doughnutChartData} />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Overall Metrics</h3>
        <Bar data={barChartData} />
      </div>
    </div>
  );
};

export default Analytics;
