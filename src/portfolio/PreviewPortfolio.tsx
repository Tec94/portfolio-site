import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PortfolioShell } from './components/PortfolioShell';
import { ArticleBoundaryPage, MissingContentPage, ProjectBoundaryPage } from './pages';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OverviewPage } from './pages/OverviewPage';
import { ServicesPage } from './pages/ServicesPage';
import { WritingPage } from './pages/WritingPage';
import { PortfolioProviders } from './providers/PortfolioProviders';
import { getPreviewRedirect } from './routeOwnership';
import './portfolio.css';
import './styles/overview.css';
import './styles/services.css';
import './styles/overview-responsive.css';
import './styles/dossier.css';

export default function PreviewPortfolio() {
  return (
    <PortfolioProviders>
      <PortfolioShell>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/work" element={<Navigate to="/#work" replace />} />
          <Route path="/work/:slug" element={<ProjectBoundaryPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/writing/:slug" element={<ArticleBoundaryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/preview/*" element={<PreviewRedirect />} />
          <Route path="*" element={<MissingContentPage />} />
        </Routes>
      </PortfolioShell>
    </PortfolioProviders>
  );
}

function PreviewRedirect() {
  const location = useLocation();
  return <Navigate to={getPreviewRedirect(location.pathname, location.search)} replace />;
}
