import { useState } from 'react';
import {StudentLogin} from './components/components/StudentLogin';
import {StudentRegister} from './components/components/StudentRegister';
import {StudentDashboard} from './components/components/StudentDashboard';
import {TeacherLogin} from './components/components/TeacherLogin';
import {TeacherDashboard} from './components/components/TeacherDashboard';

export function App() {
  const [currentView, setCurrentView] = useState('student-login');

  const StudentLoginComp = StudentLogin as any;
  const StudentRegisterComp = StudentRegister as any;
  const StudentDashboardComp = StudentDashboard as any;
  const TeacherLoginComp = TeacherLogin as any;
  const TeacherDashboardComp = TeacherDashboard as any;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* नेविगेशन बार */}
      <nav style={{ 
        padding: '12px', 
        background: '#1e293b', 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button onClick={() => setCurrentView('student-login')} style={btnStyle(currentView === 'student-login')}>
          Student Login
        </button>
        <button onClick={() => setCurrentView('student-register')} style={btnStyle(currentView === 'student-register')}>
          Student Register
        </button>
        <button onClick={() => setCurrentView('student-dashboard')} style={btnStyle(currentView === 'student-dashboard')}>
          Student Dashboard
        </button>
        <button onClick={() => setCurrentView('teacher-login')} style={btnStyle(currentView === 'teacher-login')}>
          Teacher Login
        </button>
        <button onClick={() => setCurrentView('teacher-dashboard')} style={btnStyle(currentView === 'teacher-dashboard')}>
          Teacher Dashboard
        </button>
      </nav>

      {/* सिलेक्टेड पेज */}
      <main style={{ padding: '20px' }}>
        {currentView === 'student-login' && <StudentLoginComp />}
        {currentView === 'student-register' && <StudentRegisterComp />}
        {currentView === 'student-dashboard' && <StudentDashboardComp />}
        {currentView === 'teacher-login' && <TeacherLoginComp />}
        {currentView === 'teacher-dashboard' && <TeacherDashboardComp />}
      </main>
    </div>
  );
}

const btnStyle = (isActive: boolean) => ({
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  background: isActive ? '#3b82f6' : '#334155',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold' as const
});

export default App;