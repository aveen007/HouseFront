import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import PatientPage from './pages/PatientPage';
import PatientForm from './pages/PatientForm';
import PatientVisitPage from './pages/PatientVisitPage'; // New import
import PatientListBetPage from './pages/PatientListBetPage'; // New import
import PatientCardPage from './pages/PatientCardPage'; // New import
import CreateBetPage from './pages/CreateBetPage'; // New import
import FinalizeBetList from './pages/FinalizeBetList'; // New import
import FinalizeBetPage from './pages/FinalizeBetPage'; // New import
import { NotificationsProvider } from './pages/NotificationContext';
import  LegalContract  from './pages/LegalContract';
import  CreateContract  from './pages/CreateContract';
import ProposeAnalyses from './pages/ProposeAnalyses'
import ReviewProposals from './pages/ReviewProposals'
import ApprovedTests from './pages/ApprovedTests'
import ConsentForm from './pages/ConsentForm'
import ApproveCard from './pages/ApproveCard'

function App() {
  return (
   <NotificationsProvider>
    <BrowserRouter>
      <div className="medical-app">
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/patients" />} />

            {/* Patient Management Routes */}
            <Route path="/patients" element={<PatientPage />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/edit/:id" element={<PatientForm />} />

            {/* Patient Visit Routes */}
            <Route path="/Visits" element={<PatientVisitPage />} />
            <Route path="/Bets" element={<PatientListBetPage />} />
            <Route path="/patients/:id" element={<PatientCardPage />} />
            {/* Future Routes can be added here */}
            <Route path="/patients/:id/create-bet" element={<CreateBetPage />} />
            <Route path="/FinalizeBets" element={<FinalizeBetList />} />
            <Route path="/SignContract" element={<LegalContract />} />
            <Route path="/CreateContract" element={<CreateContract />} />
            <Route path="/ReviewProposals" element={<ReviewProposals />} />
            <Route path="/ApprovedTests" element={<ApprovedTests />} />
            <Route path="/ConsentForm" element={<ConsentForm />} />
          <Route path="/propose-analysis/:patientId" element={<ProposeAnalyses />} />
          <Route path="/approve-card/:id" element={<ApproveCard />} />
           <Route path="/patients/:id/FinalizeBets" element={<FinalizeBetPage />} />

            {/* <Route path="/reports" element={<ReportsPage />} /> */}
            {/* <Route path="/symptoms" element={<SymptomManagementPage />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </NotificationsProvider>
  );
}

export default App;