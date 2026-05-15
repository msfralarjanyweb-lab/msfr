import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="font-sans text-dark overflow-x-hidden">
          <Routes>
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
  );
}

export default App;
