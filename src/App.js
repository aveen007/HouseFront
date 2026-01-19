import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from './components/Header';
import PatientPage from './pages/PatientPage';
import PatientForm from './pages/PatientForm';
import PatientVisitPage from './pages/PatientVisitPage';
import PatientListBetPage from './pages/PatientListBetPage';
import PatientCardPage from './pages/PatientCardPage';
import CreateBetPage from './pages/CreateBetPage';
import FinalizeBetList from './pages/FinalizeBetList';
import FinalizeBetPage from './pages/FinalizeBetPage';
import LegalContract from './pages/LegalContract';
import CreateContract from './pages/CreateContract';
import ProposeAnalyses from './pages/ProposeAnalyses';
import ReviewProposals from './pages/ReviewProposals';
import ApprovedTests from './pages/ApprovedTests';
import ConsentForm from './pages/ConsentForm';
import ApproveCard from './pages/ApproveCard';
import VisitsPage from './pages/VisitsPage';
import RegisterPatientPage from './pages/RegisterPatientPage';
import HomePage from './pages/HomePage';


import { fetchMe } from "./auth.service";
import AuthPage from "./pages/AuthPage";
import { NotificationsProvider } from './pages/NotificationContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  // Fetch current user on app load
//  useEffect(() => {
//    const getUser = async () => {
//      try {
//        const data = await fetchMe();
//        setUser(data); // data is user object
//      } catch (err) {
//        setUser(null); // not logged in or 401
//      } finally {
//        setLoading(false);
//      }
//    };
//    getUser();
//  }, []);

//  // Loading spinner while fetching user
//  if (loading) {
//    return <div>Loading...</div>;
//  }

  return (
    <BrowserRouter>
      <NotificationsProvider>
        <div className="medical-app">
          {user && <Header user={user}/>}

          <div className="container">
            <Routes>
              {/* If not logged in → show login page */}
              {!user && (
                <Route
                  path="*"
                  element={<AuthPage onLogin={setUser} />}
                />
              )
              }

              {/* Logged in → main app routes */}
              {user && (
                <>
<Route path="/" element={<HomePage />} />
                  {/* Patient Management */}
                  <Route path="/patients" element={<PatientPage />} />
                  <Route path="/patients/new" element={<PatientForm />} />
                  <Route path="/patients/edit/:id" element={<PatientForm />} />
                  <Route path="/patients/:id" element={<PatientCardPage />} />
                  <Route path="/patients/:id/create-bet" element={<CreateBetPage />} />
                  <Route path="/patients/:id/FinalizeBets" element={<FinalizeBetPage />} />

                  {/* Visits & Bets */}
                  <Route path="/Visits" element={<PatientVisitPage />} />
                  <Route path="/VisitsPage" element={<VisitsPage />} />
                  <Route path="/Bets" element={<PatientListBetPage />} />
                  <Route path="/FinalizeBets" element={<FinalizeBetList />} />

                  {/* Contracts & Legal */}
                  <Route path="/SignContract" element={<LegalContract  user={user}/>} />
                  <Route path="/CreateContract" element={<CreateContract />} />

                  {/* Proposals & Analyses */}
                  <Route path="/ReviewProposals" element={<ReviewProposals />} />
                  <Route path="/ApprovedTests" element={<ApprovedTests />} />
                  <Route path="/ConsentForm" element={<ConsentForm user={user} />} />
                  <Route path="/propose-analysis/:patientId" element={<ProposeAnalyses />} />
                  <Route path="/approve-card/:id" element={<ApproveCard />} />
                  <Route path="/RegisterPatientPage" element={<RegisterPatientPage />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </NotificationsProvider>
    </BrowserRouter>
  );
}

export default App;
