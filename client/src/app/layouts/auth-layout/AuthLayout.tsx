import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="auth-layout">
    <main>{children}</main>
  </div>
);
