import React from 'react';
import { createRoot } from 'react-dom/client';
import HelloWorld from './components/HelloWorld';

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('root'));
  root.render(<HelloWorld />);
});
