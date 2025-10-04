import React, { useState, useNavigate } from 'react';
import { Dumbbell, Users, UserCircle } from 'lucide-react';

export default function FitNWULanding() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAdminOption, setShowAdminOption] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleLogoClick = () => {
    const newCount = adminClicks + 1;
    setAdminClicks(newCount);
    
    if (newCount >= 5) {
      setShowAdminOption(true);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    console.log(`Navigating to ${role} signup page`);
    
    if (role === "student") {
      Navigate("/student-login");
    }else if (role === "admin") {
      navigate('/admin-signup');
    }
  };

  const styles = {
    container: {
      height: '100vh',
      background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #ca8a04)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    wrapper: {
      width: '100%',
      maxWidth: '1200px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '48px'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
      cursor: 'pointer'
    },
    logoCircle: {
      background: 'white',
      borderRadius: '50%',
      padding: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    title: {
      fontSize: window.innerWidth < 768 ? '36px' : '72px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '16px',
      margin: 0
    },
    subtitle: {
      fontSize: window.innerWidth < 768 ? '18px' : '20px',
      color: '#bfdbfe',
      maxWidth: '672px',
      margin: '0 auto'
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: showAdminOption && window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
      gap: window.innerWidth < 768 ? '24px' : '32px',
      maxWidth: '896px',
      margin: '0 auto'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: window.innerWidth < 768 ? '32px' : '40px',
      cursor: 'pointer',
      transform: hoveredCard ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s ease'
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    iconCircleStudent: {
      background: 'linear-gradient(to bottom right, #1e3a8a, #1d4ed8)',
      borderRadius: '50%',
      padding: '24px',
      marginBottom: '24px',
      transition: 'all 0.3s ease'
    },
    iconCircleAdmin: {
      background: 'linear-gradient(to bottom right, #ca8a04, #eab308)',
      borderRadius: '50%',
      padding: '24px',
      marginBottom: '24px',
      transition: 'all 0.3s ease'
    },
    cardTitle: {
      fontSize: window.innerWidth < 768 ? '24px' : '30px',
      fontWeight: 'bold',
      color: '#1e3a8a',
      marginBottom: '16px'
    },
    cardDescription: {
      color: '#4b5563',
      marginBottom: '24px',
      fontSize: window.innerWidth < 768 ? '16px' : '18px'
    },
    buttonStudent: {
      width: '100%',
      background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)',
      color: 'white',
      fontWeight: '600',
      padding: '16px 32px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    buttonAdmin: {
      width: '100%',
      background: 'linear-gradient(to right, #ca8a04, #eab308)',
      color: 'white',
      fontWeight: '600',
      padding: '16px 32px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    footer: {
      textAlign: 'center',
      marginTop: '48px',
      color: '#bfdbfe',
      fontSize: window.innerWidth < 768 ? '14px' : '16px'
    },
    signInLink: {
      fontWeight: '600',
      textDecoration: 'underline',
      background: 'none',
      border: 'none',
      color: '#bfdbfe',
      cursor: 'pointer',
      fontSize: 'inherit',
      transition: 'color 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.logoContainer} onClick={handleLogoClick}>
            <div style={styles.logoCircle}>
              <Dumbbell size={window.innerWidth < 768 ? 64 : 80} color="#1e3a8a" />
            </div>
          </div>
          <h1 style={styles.title}>Fit@NWU</h1>
          <p style={styles.subtitle}>
            Your journey to fitness excellence starts here. Join the NWU fitness community today.
          </p>
        </div>

        <div style={styles.cardsGrid}>
          {/* Student Card */}
          <div 
            style={styles.card}
            onClick={() => handleRoleSelect('student')}
            onMouseEnter={() => setHoveredCard('student')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardContent}>
              <div style={styles.iconCircleStudent}>
                <UserCircle size={window.innerWidth < 768 ? 64 : 80} color="white" />
              </div>
              <h2 style={styles.cardTitle}>I'm a Student</h2>
              <p style={styles.cardDescription}>
                Track your fitness journey, join challenges, and connect with peers
              </p>
              <button style={styles.buttonStudent}>
                Sign Up as Student
              </button>
            </div>
          </div>

          {/* Admin Card - Hidden by default */}
          {showAdminOption && (
            <div 
              style={styles.card}
              onClick={() => handleRoleSelect('admin')}
              onMouseEnter={() => setHoveredCard('admin')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardContent}>
                <div style={styles.iconCircleAdmin}>
                  <Users size={window.innerWidth < 768 ? 64 : 80} color="white" />
                </div>
                <h2 style={styles.cardTitle}>I'm an Admin</h2>
                <p style={styles.cardDescription}>
                  Manage programs, monitor progress, and support student wellness
                </p>
                <button style={styles.buttonAdmin}>
                  Sign Up as Admin
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <p>
            Already have an account?{' '}
            <button 
              style={styles.signInLink}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#bfdbfe'}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}