'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      console.log('Testing Backend...');
      
      const response = await fetch('http://localhost:3000/api/products?pageIndex=1&pageSize=5', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setResult({
          success: true,
          status: response.status,
          data: data
        });
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setResult({
          success: false,
          status: response.status,
          error: errorText
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <button
            onClick={testBackend}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend API'}
          </button>
          
          {result && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Result:</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Make sure Backend Express is running on port 3000</li>
            <li>Check if <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/api/products</code> works in browser</li>
            <li>Click "Test Backend API" button above</li>
            <li>Check browser console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}