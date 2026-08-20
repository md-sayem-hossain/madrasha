import React from 'react';
import { MadrasaProvider, useMadrasa } from './context/MadrasaContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AudioPlayerBar } from './components/layout/AudioPlayerBar';

// Views
import { HomeView } from './components/home/HomeView';
import { AboutHistoryView } from './components/views/AboutHistoryView';
import { FoundersView } from './components/views/FoundersView';
import { TeachersView } from './components/views/TeachersView';
import { DepartmentsView } from './components/views/DepartmentsView';
import { GalleryView } from './components/views/GalleryView';
import { AudioView } from './components/views/AudioView';
import { VideoView } from './components/views/VideoView';
import { NoticesView } from './components/views/NoticesView';
import { EventsView } from './components/views/EventsView';
import { DownloadsView } from './components/views/DownloadsView';
import { ContactView } from './components/views/ContactView';
import { AdminPortal } from './components/admin/AdminPortal';

// Modals
import { SearchModal } from './components/modals/SearchModal';
import { TeacherDetailModal } from './components/modals/TeacherDetailModal';
import { FounderDetailModal } from './components/modals/FounderDetailModal';
import { NoticeDetailModal } from './components/modals/NoticeDetailModal';
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';
import { GalleryLightboxModal } from './components/modals/GalleryLightboxModal';

const MainAppContent: React.FC = () => {
  const { activeTab, currentTrack } = useMadrasa();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'about':
        return <AboutHistoryView />;
      case 'founders':
        return <FoundersView />;
      case 'teachers':
        return <TeachersView />;
      case 'departments':
        return <DepartmentsView />;
      case 'gallery':
        return <GalleryView />;
      case 'audio':
        return <AudioView />;
      case 'video':
        return <VideoView />;
      case 'notices':
        return <NoticesView />;
      case 'events':
        return <EventsView />;
      case 'downloads':
        return <DownloadsView />;
      case 'contact':
        return <ContactView />;
      case 'portal':
        return <AdminPortal />;
      default:
        return <HomeView />;
    }
  };

  const isPortal = activeTab === 'portal';

  return (
    <div id="madrasa-app-root" className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-amber-400 selection:text-emerald-950">
      {/* Navigation Header - Hidden in Portal view */}
      {!isPortal && <Navbar />}

      {/* Main Content View with extra bottom padding if audio player is active */}
      <main className={`flex-grow ${currentTrack ? 'pb-24' : ''}`}>
        {renderActiveView()}
      </main>

      {/* Footer - Hidden in Portal view */}
      {!isPortal && <Footer />}

      {/* Floating Global Audio Player */}
      <AudioPlayerBar />

      {/* Universal Search Modal */}
      <SearchModal />

      {/* Detail & Lightbox Modals */}
      <TeacherDetailModal />
      <FounderDetailModal />
      <NoticeDetailModal />
      <VideoPlayerModal />
      <GalleryLightboxModal />
    </div>
  );
};

export default function App() {
  return (
    <MadrasaProvider>
      <MainAppContent />
    </MadrasaProvider>
  );
}
