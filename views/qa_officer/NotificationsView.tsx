import React from 'react';

const NotificationsView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Inbox / Notifications</h1>
       <div className="mt-6 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p>This module will provide a unified stream of all system alerts, messages, and action items.</p>
      </div>
    </div>
  );
};

export default NotificationsView;
