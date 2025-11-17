/**
 * Projects Page
 * 
 * Display and manage all projects.
 */

import React from 'react';

const ProjectsPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          + New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
            <h3 className="text-xl font-bold text-foreground mb-2">Project {item}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Project description and details go here.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">8 tasks</span>
              <button className="text-primary hover:underline">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
