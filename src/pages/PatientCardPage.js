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
  Chip
} from '@mui/material';

const PatientCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);

  useEffect(() => {
    // Fetch insurance companies
    axios.get('http://localhost:8080/api/getInsuranceCompanies')
      .then(response => {
        setInsuranceCompanies(response.data);
      })
      .catch(error => console.error("Error fetching insurance companies", error));

    if (id) {
      // Fetch patient data
      axios.get(`http://localhost:8080/api/getPatient?patientId=${id}`)
        .then(response => {
          setPatient(response.data);
        })
        .catch(error => console.error("Error fetching patient", error));
    }
  }, [id]);

  // Find the patient's insurance company
  const patientInsuranceCompany = insuranceCompanies.find(
    company => company.companyId === patient?.insuranceCompanyId
  );

  const handleCreateBet = () => {
    navigate(`/patients/${id}/create-bet`);
  };

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
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {symptoms.map((symptom, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={symptom.description}
                      secondary={`Reported on: ${new Date(symptom.reported_date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < symptoms.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
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