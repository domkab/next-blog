'use client';

import { Suspense } from 'react';
import DashboardContent from '../components/Dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}