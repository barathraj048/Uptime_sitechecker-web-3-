'use client'
import  { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle, Settings, Plus, ExternalLink, ChevronDown } from 'lucide-react';

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded';
  uptime: number;
  lastChecked: string;
  responseTime: number;
}

export default function App() {
  const [monitors] = useState<Monitor[]>([
    {
      id: '1',
      name: 'Production API',
      url: 'api.example.com',
      status: 'up',
      uptime: 99.98,
      lastChecked: '30 seconds ago',
      responseTime: 187
    },
    {
      id: '2',
      name: 'Marketing Website',
      url: 'www.example.com',
      status: 'degraded',
      uptime: 99.45,
      lastChecked: '1 minute ago',
      responseTime: 892
    },
    {
      id: '3',
      name: 'Customer Dashboard',
      url: 'dashboard.example.com',
      status: 'down',
      uptime: 98.76,
      lastChecked: '2 minutes ago',
      responseTime: 2344
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monitors</h1>
            <p className="text-gray-500">Track the uptime of your websites and services</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-5 w-5 mr-2" />
            Add Monitor
          </button>
        </div>

        {/* Monitors List */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">All Monitors</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {monitors.map((monitor) => (
              <div key={monitor.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(monitor.status)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{monitor.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{monitor.url}</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{monitor.responseTime}ms</div>
                      <div className="text-sm text-gray-500">Response Time</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{monitor.uptime}%</div>
                      <div className="text-sm text-gray-500">Uptime</div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(monitor.status)}`}>
                        {monitor.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Last checked {monitor.lastChecked}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

