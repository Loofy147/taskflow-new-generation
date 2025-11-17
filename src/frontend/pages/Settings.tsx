/**
 * Settings Page
 * 
 * User settings and preferences.
 */

import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

      {/* Settings Sections */}
      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                placeholder="your@email.com"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-foreground">Email Notifications</label>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-foreground">Desktop Notifications</label>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-950 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">Danger Zone</h2>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
