import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppHeader from './components/layout/AppHeader';
import Footer from './components/layout/Footer';
import MainContent from './components/layout/MainContent';


interface AppProps { }

const App: React.FC<AppProps> = () => {
  return (
    <Router>
      <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
        <AppHeader />
        <MainContent />
        <Footer />
      </div>
    </Router>
  );
};

export default App;