import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/tailwind.css';

const MainLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
	  <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      {children}
	  </div>
      {/* Ajoutez d'autres éléments de mise en page ici */}
    </div>
  );
};

export default MainLayout;