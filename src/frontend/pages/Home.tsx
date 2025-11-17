/**
 * Home Page
 * 
 * Landing page for TaskFlow application.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Home Page Component
 */
const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          AI-Powered Task Management
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Organize, prioritize, and complete tasks with intelligent AI assistance.
          Boost your productivity and achieve your goals faster.
        </p>
        <div className="flex gap-4 justify-center">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Get Started
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
              >
                Learn More
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🤖',
              title: 'AI-Powered',
              description: 'Intelligent task suggestions and prioritization',
            },
            {
              icon: '📊',
              title: 'Analytics',
              description: 'Track your productivity with detailed insights',
            },
            {
              icon: '👥',
              title: 'Collaboration',
              description: 'Work together with your team seamlessly',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-6">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of users who are already using TaskFlow to manage their tasks.
        </p>
        {!isAuthenticated && (
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Sign Up Now
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
