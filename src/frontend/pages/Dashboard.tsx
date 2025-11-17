/**
 * Dashboard Page
 * 
 * Main dashboard showing overview and key metrics.
 */

import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Tasks', value: '24', icon: '📋' },
          { label: 'In Progress', value: '8', icon: '⚙️' },
          { label: 'Completed', value: '12', icon: '✓' },
          { label: 'Overdue', value: '4', icon: '⚠️' },
        ].map((stat, index) => (
          <div key={index} className="bg-card p-6 rounded-lg border border-border">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Task Distribution</h2>
          <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
            Chart placeholder
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-3 bg-muted rounded">
                <p className="text-sm text-foreground">Task activity item {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
