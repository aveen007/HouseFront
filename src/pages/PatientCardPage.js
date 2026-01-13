import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  CircularProgress
} from '@mui/material';

const PatientCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    // Fetch all available symptoms
    setLoading(prev => ({...prev, allSymptoms: true}));
    axios.get('http://localhost:9314/api/getSymptoms')
      .then(response => {
        setAllSymptoms(response.data);
      })
      .catch(error => console.error("Error fetching all symptoms", error))
      .finally(() => setLoading(prev => ({...prev, allSymptoms: false})));

    // Fetch insurance companies
    setLoading(prev => ({...prev, insurance: true}));
    axios.get('http://localhost:9314/api/getInsuranceCompanies')
      .then(response => {
        setInsuranceCompanies(response.data);
      })
      .catch(error => console.error("Error fetching insurance companies", error))
      .finally(() => setLoading(prev => ({...prev, insurance: false})));

    if (id) {
      // Fetch patient data
      setLoading(prev => ({...prev, patient: true}));
      axios.get(`http://localhost:9314/api/getPatient?patientId=${id}`)
        .then(response => {
          setPatient(response.data);
        })
        .catch(error => console.error("Error fetching patient", error))
        .finally(() => setLoading(prev => ({...prev, patient: false})));

      // Fetch visit ID for this patient
      setLoading(prev => ({...prev, visit: true}));
      axios.get('http://localhost:9314/api/getVisitPatients')
        .then(response => {
          const patientVisit = response.data.find(p => p.id === parseInt(id));
          if (patientVisit) {
            setVisitId(patientVisit.visitId);
          }
        })
        .catch(error => console.error("Error fetching visit ID", error))
        .finally(() => setLoading(prev => ({...prev, visit: false})));
    }
  }, [id]);

  useEffect(() => {
    if (visitId && allSymptoms.length > 0) { // Only fetch when we have both visitId and allSymptoms
      setLoading(prev => ({...prev, symptoms: true}));

      axios.get(`http://localhost:9314/api/getVisitSymptoms?visitId=${visitId}`)
        .then(response => {
          // Map symptom IDs to symptom names using allSymptoms
          const symptomsWithDetails = response.data.map(visitSymptom => {
            const symptomDetails = allSymptoms.find(s => s.id === visitSymptom);
            return symptomDetails ? {
              ...visitSymptom,
              name: symptomDetails.symptomName,
              description: symptomDetails.description || 'No description available'
            } : null;
          }).filter(Boolean); // Filter out any null entries if symptom wasn't found
            console.log(symptomsWithDetails);

          setSymptoms(symptomsWithDetails);
        })
        .catch(error => console.error("Error fetching symptoms", error))
        .finally(() => setLoading(prev => ({...prev, symptoms: false})));
    }
  }, [visitId, allSymptoms]); // Depend on both visitId and allSymptoms

  // Find the patient's insurance company
  const patientInsuranceCompany = insuranceCompanies.find(
    company => company.id === patient.insuranceCompany.id
  );
console.log(insuranceCompanies);
  const handleCreateBet = () => {
    navigate(`/patients/${id}/create-bet`);
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
          <Typography variant="h3" component="h1" gutterBottom>
            {patient?.firstName} {patient?.lastName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Date of Birth: {patient?.dateOfBirth && new Date(patient.dateOfBirth).toLocaleDateString()}
          </Typography>
          {visitId && (
            <Typography variant="subtitle1" color="text.secondary">
              Visit ID: {visitId}
            </Typography>
          )}
        </Box>

        {/* Insurance Company */}
        {patientInsuranceCompany && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Insurance Information
            </Typography>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="body1">
                <strong>Company:</strong> {patientInsuranceCompany.companyName}
              </Typography>
              {patient?.insurancePolicyNumber && (
                <Typography variant="body1">
                  <strong>Policy Number:</strong> {patient.insurancePolicyNumber}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Symptoms List */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Reported Symptoms
          </Typography>
          {loading.symptoms ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : symptoms.length > 0 ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {symptoms.map((symptom, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={symptom.name}

                    />
                  </ListItem>
                  {index < symptoms.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No symptoms reported for this visit.
            </Typography>
          )}
        </Box>

        {/* Create Bet Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateBet}
          >
            Create Bet
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientCard;