import { Suspense } from 'react';
import DashboardContent from '../components/Dashboard/DashboardContent';
import { dashboardMetadata } from '@/lib/metadata/dashboard';

export const metadata = dashboardMetadata

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}