import React from 'react';
import { useState } from 'react';
import { BPListPage } from './components/businessPartner/BPListPage';
import { BPCreationPage } from './components/businessPartner/BPCreationPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'list' | 'create'>('list');

  const handleNavigateToCreate = () => {
    setCurrentPage('create');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
  };

  if (currentPage === 'create') {
    return <BPCreationPage onBack={handleBackToList} />;
  }

  return <BPListPage onNavigateToCreate={handleNavigateToCreate} />;
}

export default App;