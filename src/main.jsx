import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './jsx/MainPage.jsx';
import PostWritePage from './jsx/PostWritePage.jsx';
import PostViewPage from './jsx/PostViewPage.jsx';
import './index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<MainPage />} />
      <Route path="write" element={<PostWritePage />} />
      <Route path="write/:id" element={<PostWritePage />} />
      <Route path="post/:id" element={<PostViewPage />} />
    </Routes>
    <ToastContainer position="bottom-right" autoClose={3000} />
  </BrowserRouter>
);
