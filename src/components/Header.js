import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <NavLink to="/Patients" style={styles.link}>Patients</NavLink>

                <NavLink to="/Visits" style={styles.link}>
                  Patient Cards
               </NavLink>
              <NavLink to="/Bets" style={styles.link}>
                 Bets
               </NavLink>
               <NavLink to="/FinalizeBets" style={styles.link}>
                                FinalizeBets
                              </NavLink>
                                 <NavLink to="/SignContract" style={styles.link}>
                                                              LegalContract
                                                            </NavLink>


                <NavLink to="/CreateContract" style={styles.link}>
                                                              CreateContract
                                                            </NavLink>
                <NavLink to="/ReviewProposals" style={styles.link}>
                                                                              ReviewProposals
                                                                            </NavLink>

               <NavLink to="/ApprovedTests" style={styles.link}>
                                                                                      ApprovedTests
                                                                                    </NavLink>
             <NavLink to="/ConsentForm" style={styles.link}>
                                                                                      ConsentForm
                                                                                    </NavLink>


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
