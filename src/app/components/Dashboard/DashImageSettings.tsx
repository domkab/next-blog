'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashImageSettings() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setToast(null);

    try {
      const { data } = await axios.post('/api/image/sync-fb');
      setToast({ type: 'success', message: data.message || 'Images synced successfully!' });
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Sync failed. Please try again.';
      setToast({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`p-4 rounded-lg shadow-md text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Image Storage Tools</h2>

      <button
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? 'Syncing...' : 'Sync Images from Firebase'}
      </button>
    </div>
  );
}