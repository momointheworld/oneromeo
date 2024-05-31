'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const OrderConfirmation = () => {
  const searchPath = useSearchParams();
  const sessionId = searchPath.get('session_id');

  if (sessionId) {
    return (
      <Suspense>
        <div>
          Thanks for your order. We will send you an email to confirm the date
        </div>
        <div>You can visit this page to manage your subscriptions.</div>
      </Suspense>
    );
  } else {
    return <div>No order found!</div>;
  }
};

export default OrderConfirmation;
