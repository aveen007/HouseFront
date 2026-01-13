import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

const ApproveCard = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [visitId, setVisitId] = useState(null);
  const [loading, setLoading] = useState({
    patient: false,
    insurance: false,
    visit: false,
    symptoms: false,
    allSymptoms: false
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch data
  useEffect(() => {
    setLoading(prev => ({ ...prev, allSymptoms: true }));
    axios.get('http://localhost:9314/api/getSymptoms')
      .then(res => setAllSymptoms(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(prev => ({ ...prev, allSymptoms: false })));

    setLoading(prev => ({ ...prev, insurance: true }));
    axios.get('http://localhost:9314/api/getInsuranceCompanies')
      .then(res => setInsuranceCompanies(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(prev => ({ ...prev, insurance: false })));

    if (id) {
      setLoading(prev => ({ ...prev, patient: true }));
      axios.get(`http://localhost:9314/api/getPatient?patientId=${id}`)
        .then(res => setPatient(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(prev => ({ ...prev, patient: false })));

      setLoading(prev => ({ ...prev, visit: true }));
      axios.get('http://localhost:9314/api/getVisitPatients')
        .then(res => {
          const patientVisit = res.data.find(p => p.id === parseInt(id));
          if (patientVisit) setVisitId(patientVisit.visitId);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(prev => ({ ...prev, visit: false })));
    }
  }, [id]);

  useEffect(() => {
    if (visitId && allSymptoms.length > 0) {
      setLoading(prev => ({ ...prev, symptoms: true }));
      axios.get(`http://localhost:9314/api/getVisitSymptoms?visitId=${visitId}`)
        .then(res => {
          const mappedSymptoms = res.data.map(symId => {
            const s = allSymptoms.find(a => a.id === symId);
            return s ? { name: s.symptomName } : null;
          }).filter(Boolean);
          setSymptoms(mappedSymptoms);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(prev => ({ ...prev, symptoms: false })));
    }
  }, [visitId, allSymptoms]);

  const patientInsuranceCompany = patient?.insuranceCompany
    ? insuranceCompanies.find(c => c.id === patient.insuranceCompany.id)
    : null;

  const handleApprovePatient = async () => {
    if (!visitId) return;

    try {
      await axios.put(
        `http://localhost:9314/api/visits/${visitId}/updateHDStatus`,
        `"Accepted"`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSnackbarMessage('Patient approved successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (error) {
      console.error(error);
      setSnackbarMessage('Failed to approve patient');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading.patient || loading.insurance || loading.allSymptoms) {
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
          {visitId && <Typography variant="subtitle1" color="text.secondary">Visit ID: {visitId}</Typography>}
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

        {/* Approve Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleApprovePatient}>
            Approve patient
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
