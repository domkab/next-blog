'use client';

export default function GATestButton() {
  return (
    <button
      onClick={() => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'test_event', {
            event_category: 'debug',
            event_label: 'Test Click',
          });
          console.log('[GA] Fired test_event');
        }
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Fire Test Event
    </button>
  );
}