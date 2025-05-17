import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
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
  const [data, setData] = useState({
    users: 0,
    activeSubscriptions: 0,
    totalApplications: 0,
    monthlyApplications: Array(12).fill(0),
    subscriptionBreakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:3000/api/v1/analytics');

        if (response.data.success && response.data.data) {
          const analyticsData = response.data.data;
          
          // Validate the received data
          if (
            typeof analyticsData.users === 'number' &&
            typeof analyticsData.activeSubscriptions === 'number' &&
            typeof analyticsData.totalApplications === 'number' &&
            Array.isArray(analyticsData.monthlyApplications) &&
            analyticsData.monthlyApplications.length === 12 &&
            Array.isArray(analyticsData.subscriptionBreakdown)
          ) {
            setData(analyticsData);
          } else {
            throw new Error('Invalid data structure received from server');
          }
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError(error.message || 'Failed to load analytics data');
        
        // Implement retry logic
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000); // Retry after 2 seconds
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [retryCount]);

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
    labels: ['Users', 'Active Subscriptions', 'Applications'],
    datasets: [
      {
        label: 'Totals',
        data: [data.users, data.activeSubscriptions, data.totalApplications],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-700">
          {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Loading analytics data...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-600 mb-4">{error}</div>
        {retryCount < 3 && (
          <button
            onClick={() => setRetryCount(prev => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-gray-500 font-semibold">Total Users</h3>
          <p className="text-3xl font-bold text-[#1D5EC7]">{data.users.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-gray-500 font-semibold">Active Subscriptions</h3>
          <p className="text-3xl font-bold text-[#4CAF50]">{data.activeSubscriptions.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-gray-500 font-semibold">Total Applications</h3>
          <p className="text-3xl font-bold text-[#2196F3]">{data.totalApplications.toLocaleString()}</p>
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
