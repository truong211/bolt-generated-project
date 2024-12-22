import React from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import LoginPage from './pages/LoginPage';
    import RegisterPage from './pages/RegisterPage';
    import ChatPage from './pages/ChatPage';
    import { useAuth } from './contexts/AuthContext';
    import { SocketProvider } from './contexts/SocketContext';

    function App() {
      const { isAuthenticated } = useAuth();

      return (
        <SocketProvider>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
              <Route path="/" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </SocketProvider>
      );
    }

    export default App;
