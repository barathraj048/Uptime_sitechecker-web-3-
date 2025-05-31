'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { 
  Activity, CheckCircle, Clock, AlertTriangle, XCircle, Settings,
  Plus, ExternalLink, ChevronDown, Sun, Moon, ChevronRight 
} from 'lucide-react';

// Extend the session user type to include accessToken
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string | null;
    }
  }
}

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
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const [toggleAdd, setToggleAdd] = useState(false); // ✅ Moved here
  const [site, setSite] = useState('');              // ✅ Moved here

  const handleToggleAdd = () => setToggleAdd(!toggleAdd);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setToken(session?.user?.accessToken || '');
    };
    fetchSession();
  }, []);

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
          const height = ((point.value - minValue) / (maxValue - minValue || 1)) * 100;
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
    setExpandedMonitor(prev => (prev === id ? null : id));
  };

  return (
  <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {toggleAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 w-96">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Add Website URL
            </h2>
            <input
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setToggleAdd(false)}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => {
                  console.log(`Adding monitor for: ${site}`);
                  axios.post("/api/v1/website", { url: site });
                  setToggleAdd(false);
                  setSite("");
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setToggleAdd(true)}
          className="flex ml-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-md p-2 shadow-lg focus:outline-none focus:ring-2 text-sm mb-4 focus:ring-indigo-500"
          aria-label="Add Website"
        > Add Website <Plus className="w-4 h-4 mt-auto mb-auto ml-2" /> 
        </button>
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {monitor.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{monitor.url}</span>
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {monitor.responseTime}ms
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Response Time
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {monitor.uptime}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Uptime
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            monitor.status
                          )}`}
                        >
                          {monitor.status.toUpperCase()}
                        </span>
                        <ChevronRight
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                            expandedMonitor === monitor.id ? "rotate-90" : ""
                          }`}
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
  </>
);
}

export default App;