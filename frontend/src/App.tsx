import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteLayout } from './layouts/SiteLayout';
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { WorkDiscipline } from './pages/WorkDiscipline';
import { Reels } from './pages/Reels';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Journal } from './pages/Journal';
import { JournalArticle } from './pages/JournalArticle';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:discipline" element={<WorkDiscipline />} />
          <Route path="reels" element={<Reels />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<JournalArticle />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
