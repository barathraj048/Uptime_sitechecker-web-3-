'use client'
import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, XCircle, Settings, Plus, ExternalLink, ChevronDown, Sun, Moon, ChevronRight } from 'lucide-react';

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded';
  uptime: number;
  lastChecked: string;
  responseTime: number;
  responseHistory: { time: string; value: number }[];
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const [expandedMonitor, setExpandedMonitor] = useState<string | null>(null);
  const [monitors] = useState<Monitor[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const ResponseTimeGraph = ({ data }: { data: { time: string; value: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    
    return (
      <div className="h-20 flex items-end space-x-1">
        {data.map((point, index) => {
          const height = ((point.value - minValue) / (maxValue - minValue)) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-indigo-200 dark:bg-indigo-600 hover:bg-indigo-300 dark:hover:bg-indigo-500 transition-colors duration-150 rounded-t group relative"
              style={{ height: `${height}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {point.time}: {point.value}ms
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const toggleMonitor = (id: string) => {
    setExpandedMonitor(expandedMonitor === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitors</h1>
            <p className="text-gray-500 dark:text-gray-400">Track the uptime of your websites and services</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
            <Plus className="h-5 w-5 mr-2" />
            Add Monitor
          </button>
        </div>

        {/* Monitors List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">All Monitors</span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {monitors.map((monitor) => (
              <div 
                key={monitor.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleMonitor(monitor.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(monitor.status)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{monitor.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{monitor.url}</span>
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{monitor.responseTime}ms</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{monitor.uptime}%</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(monitor.status)}`}>
                          {monitor.status.toUpperCase()}
                        </span>
                        <ChevronRight 
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedMonitor === monitor.id ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {expandedMonitor === monitor.id && (
                  <div className="px-4 pb-4 animate-fadeIn">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Response Time (Last 30 minutes)
                      </div>
                      <ResponseTimeGraph data={monitor.responseHistory} />
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Last checked {monitor.lastChecked}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;