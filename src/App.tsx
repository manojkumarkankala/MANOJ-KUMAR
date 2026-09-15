import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProfile } from '@/pages/admin/AdminProfile';
import { AdminAbout } from '@/pages/admin/AdminAbout';
import { AdminSkills } from '@/pages/admin/AdminSkills';
import { AdminEducation } from '@/pages/admin/AdminEducation';
import { AdminProjects } from '@/pages/admin/AdminProjects';
import { AdminServices } from '@/pages/admin/AdminServices';
import { AdminResume } from '@/pages/admin/AdminResume';
import { AdminMessages } from '@/pages/admin/AdminMessages';
import { AdminSocial } from '@/pages/admin/AdminSocial';
import { AdminSettings } from '@/pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ParticleBackground />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="resume" element={<AdminResume />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="social" element={<AdminSocial />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
