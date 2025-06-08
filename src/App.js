import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import PatientPage from './pages/PatientPage';
import PatientForm from './pages/PatientForm';
import PatientVisitPage from './pages/PatientVisitPage'; // New import
import PatientCards from './pages/PatientCards'; // New import

function App() {
  return (
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
          //  <Route path="/Bets" element={<PatientCards />} />

            {/* Future Routes can be added here */}
            {/* <Route path="/reports" element={<ReportsPage />} /> */}
            {/* <Route path="/symptoms" element={<SymptomManagementPage />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;