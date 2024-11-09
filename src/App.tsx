import { useState, useEffect } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import ListPage from './components/ListPage';
import DetailsPage from './components/DetailsPage';
import NavBar from './components/NavBar';

import "preline/preline";
import { IStaticMethods } from "preline/preline";
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}


function App() {
  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/run/:id" element={<DetailsPage />} />
      </Routes>
    </>
  );
}

export default App
