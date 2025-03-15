"use client";
import React from "react";

function MainComponent() {
  const [orders, setOrders] = useState([
    {
      id: "1",
      status: "collection",
      item: "Electronics Package",
      from: "San Francisco, CA",
      to: "New York, NY",
      timeline: [
        { stage: "collection", completed: true, timestamp: "2024-03-10 09:00" },
        { stage: "packing", completed: false, timestamp: null },
        { stage: "shipping", completed: false, timestamp: null },
        { stage: "received", completed: false, timestamp: null },
        { stage: "payment", completed: false, timestamp: null },
      ],
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Shipment Tracking
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Monitor your shipments in real-time
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            {/* Order Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {order.item}
              </h3>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p>From: {order.from}</p>
                <p>To: {order.to}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {order.timeline.map((step, index) => (
                <div key={step.stage} className="flex items-center">
                  <div
                    className={`
                    w-4 h-4 rounded-full mr-3
                    ${
                      step.completed
                        ? "bg-gray-900 dark:bg-white"
                        : "border-2 border-gray-300 dark:border-gray-600"
                    }
                  `}
                  />
                  <div className="flex-1">
                    <p
                      className={`
                      text-sm capitalize
                      ${
                        step.completed
                          ? "text-gray-900 dark:text-white font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    `}
                    >
                      {step.stage}
                    </p>
                    {step.timestamp && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {step.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 dark:bg-white dark:text-gray-900">
                Track Details
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-md hover:bg-gray-900 hover:text-white dark:text-white dark:border-gray-700">
                View Documents
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No shipments found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new shipment.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 dark:bg-white dark:text-gray-900">
              Create Shipment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;