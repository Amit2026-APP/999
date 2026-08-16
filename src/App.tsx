import { useState,type ComponentType } from 'react';
import { StudentLogin as RawStudentLogin } from './components/components/StudentLogin';
import { StudentRegister as RawStudentRegister } from './components/components/StudentRegister';
import { StudentDashboard as RawStudentDashboard } from './components/components/StudentDashboard';
import { TeacherLogin as RawTeacherLogin } from './components/components/TeacherLogin';
import { TeacherDashboard as RawTeacherDashboard } from './components/components/TeacherDashboard';

// Named imports को सही JSX Component Type में कास्ट करना
const StudentLogin = RawStudentLogin as unknown as ComponentType;
const StudentRegister = RawStudentRegister as unknown as ComponentType;
const StudentDashboard = RawStudentDashboard as unknown as ComponentType;
const TeacherLogin = RawTeacherLogin as unknown as ComponentType;
const TeacherDashboard = RawTeacherDashboard as unknown as ComponentType;

export function App() {
  const [currentView, setCurrentView] = useState('student-login');

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

      {/* सिलेक्टेड पेज दिखाने का हिस्सा */}
      <main style={{ padding: '20px' }}>
        {currentView === 'student-login' && <StudentLogin />}
        {currentView === 'student-register' && <StudentRegister />}
        {currentView === 'student-dashboard' && <StudentDashboard />}
        {currentView === 'teacher-login' && <TeacherLogin />}
        {currentView === 'teacher-dashboard' && <TeacherDashboard />}
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