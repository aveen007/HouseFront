import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { fetchPatient, fetchInsuranceCompanies, fetchSymptoms, fetchHDAwaitingVisits } from '../api';
import axios from 'axios';

const ApproveCard = () => {
  const { id: visitIdParam } = useParams(); // this is visit ID
  const [visitId, setVisitId] = useState(null);
  const [visit, setVisit] = useState(null);
  const [patient, setPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [loading, setLoading] = useState({
    visit: false,
    patient: false,
    insurance: false,
    allSymptoms: false,
    symptoms: false
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  // Fetch visit, patient, insurance, all symptoms
  useEffect(() => {
    if (!visitIdParam) return;

    const loadData = async () => {
      try {
        setLoading(prev => ({ ...prev, visit: true }));

        // 1️⃣ Fetch all awaiting visits and find the one with visitIdParam
        const visitsRes = await fetchHDAwaitingVisits();
        const visits = visitsRes.data;
        const currentVisit = visits.find(v => v.id === parseInt(visitIdParam));
        if (!currentVisit) throw new Error('Visit not found');
        setVisit(currentVisit);
        setVisitId(currentVisit.id);

        // 2️⃣ Fetch patient using currentVisit.patientId
        setLoading(prev => ({ ...prev, patient: true }));
        const patientRes = await fetchPatient(currentVisit.patientId);
        setPatient(patientRes.data);

        // 3️⃣ Fetch insurance companies
        setLoading(prev => ({ ...prev, insurance: true }));
        const insuranceRes = await fetchInsuranceCompanies();
        setInsuranceCompanies(insuranceRes.data);

        // 4️⃣ Fetch all symptoms
        setLoading(prev => ({ ...prev, allSymptoms: true }));
        const symptomsRes = await fetchSymptoms();
        setAllSymptoms(symptomsRes.data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(prev => ({
          ...prev,
          visit: false,
          patient: false,
          insurance: false,
          allSymptoms: false
        }));
      }
    };

    loadData();
  }, [visitIdParam]);

  // Fetch visit-specific symptoms
  useEffect(() => {
    if (!visitId || allSymptoms.length === 0) return;

    setLoading(prev => ({ ...prev, symptoms: true }));
    api.get(`/getVisitSymptoms?visitId=${visitId}`)
      .then(res => {
        const mappedSymptoms = res.data
          .map(symId => allSymptoms.find(a => a.id === symId))
          .filter(Boolean)
          .map(s => ({ name: s.symptomName }));
        setSymptoms(mappedSymptoms);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(prev => ({ ...prev, symptoms: false })));
  }, [visitId, allSymptoms]);

  const patientInsuranceCompany = patient?.insuranceCompany
    ? insuranceCompanies.find(c => c.id === patient.insuranceCompany.id)
    : null;

  const handleApprovePatient = async () => {
    if (!visitId) return;

    try {
      await api.put(
        `/visits/${visitId}/updateHDStatus`,
        `"Accepted"`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSnackbarMessage('Patient approved successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/VisitsPage');
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Failed to approve patient');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleRejectPatient = async () => {
    if (!visitId) return;

    try {
      await api.put(
        `/visits/${visitId}/updateHDStatus`,
        `"Rejected"`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSnackbarMessage('Patient rejected successfully');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      navigate('/VisitsPage');
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Failed to reject patient');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading.visit || loading.patient || loading.insurance || loading.allSymptoms) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Patient Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3">{patient?.firstName} {patient?.lastName}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Date of Birth: {patient?.dateOfBirth && new Date(patient.dateOfBirth).toLocaleDateString()}
          </Typography>
          {visit && <Typography variant="subtitle1" color="text.secondary">Visit ID: {visit.id}</Typography>}
          {visit && <Typography variant="subtitle1" color="text.secondary">Date of Visit: {new Date(visit.dateOfVisit).toLocaleDateString()}</Typography>}
        </Box>

        {/* Insurance */}
        {patientInsuranceCompany && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5">Insurance Information</Typography>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography><strong>Company:</strong> {patientInsuranceCompany.companyName}</Typography>
              {patient?.insurancePolicyNumber && <Typography><strong>Policy Number:</strong> {patient.insurancePolicyNumber}</Typography>}
            </Box>
          </Box>
        )}

        {/* Symptoms */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">Reported Symptoms</Typography>
          {loading.symptoms ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : symptoms.length > 0 ? (
            <List>
              {symptoms.map((s, i) => (
                <React.Fragment key={i}>
                  <ListItem><ListItemText primary={s.name} /></ListItem>
                  {i < symptoms.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No symptoms reported for this visit.</Typography>
          )}
        </Box>

        {/* Approve/Reject Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleApprovePatient}>
            Approve patient
          </Button>
          <Button variant="contained" color="secondary" onClick={handleRejectPatient}>
            Reject patient
          </Button>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApproveCard;
