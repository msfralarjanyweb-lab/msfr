import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Reset from './pages/Reset';
import Login from './pages/Login';
import ArticlePage from './pages/ArticlePage';
import Articles from './pages/Articles';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="font-sans text-dark overflow-x-hidden">
            <Routes>
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reset"
                element={<Reset />}
              />
              <Route
                path="/article/:index"
                element={
                  <>
                    <Header />
                    <ArticlePage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/articles"
                element={
                  <>
                    <Header />
                    <Articles />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <Home />
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
