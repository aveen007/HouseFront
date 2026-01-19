import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = ({ user }) => {
  const hasRole = (roles) =>
    roles.some(role => user.roles.includes(role));

  const isPatient = user.roles.includes("PATIENT");

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>

        {/* ADMIN + HEAD_DOCTOR */}
        {hasRole(["ADMIN", "HEAD_DOCTOR"]) && (
          <>
            <NavLink to="/Patients" style={styles.link}>
              Patients
            </NavLink>
  {/* Everyone */}
        <NavLink to="/VisitsPage" style={styles.link}>
          Visits
        </NavLink>


            <NavLink to="/ReviewProposals" style={styles.link}>
              ReviewProposals
            </NavLink>
          </>
        )}

        {/* Everyone except PATIENT */}
        {!isPatient && (
          <>
          <NavLink to="/Visits" style={styles.link}>
                        Patient Cards
                      </NavLink>
            <NavLink to="/Bets" style={styles.link}>
              Bets
            </NavLink>

            <NavLink to="/FinalizeBets" style={styles.link}>
              FinalizeBets
            </NavLink>

            <NavLink to="/CreateContract" style={styles.link}>
              CreateContract
            </NavLink>

            <NavLink to="/ApprovedTests" style={styles.link}>
              ApprovedTests
            </NavLink>

            <NavLink to="/RegisterPatientPage" style={styles.link}>
              Register
            </NavLink>
          </>
        )}

        {/* PATIENT ONLY */}
        {isPatient && (
          <>
            <NavLink to="/SignContract" style={styles.link}>
              LegalContract
            </NavLink>

            <NavLink to="/ConsentForm" style={styles.link}>
              ConsentForm
            </NavLink>
          </>
        )}



      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#f5f5f5',
    padding: '10px 20px',
    marginBottom: '20px'
  },
  nav: {
    display: 'flex',
    gap: '15px'
  },
  link: {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 'bold'
  }
};

export default Header;
