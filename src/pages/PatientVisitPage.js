import React, { useState, useEffect } from 'react';
import { createVisit, fetchSymptoms, fetchPatients, addSymptomsToVisit } from '../api';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  CircularProgress
} from '@mui/material';

const PatientRegistrationPage = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSymptoms()
      .then(response => setSymptoms(response.data))
      .catch(error => console.error("Error fetching symptoms", error));

    fetchPatients()
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients", error));
  }, []);

  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient || selectedSymptoms.length === 0) {
      alert("Please select a patient and at least one symptom");
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const visitResponse = await createVisit({
        patientId: selectedPatient,
        dateOfVisit: today
      });

      await addSymptomsToVisit(visitResponse.data.visit_id, selectedSymptoms);
      alert("Visit created successfully!");

      setSelectedPatient('');
      setSelectedSymptoms([]);
    } catch (error) {
      console.error("Error during visit creation", error);
      alert("Visit creation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Patient Visit Registration
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Patient Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Patient</InputLabel>
            <Select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              label="Select Patient"
              sx={{ height: '56px' }}
            >
              {patients.map(patient => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Symptoms Selection */}
          <Typography variant="h6" gutterBottom>
            Select Symptoms:
          </Typography>
          <List sx={{
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            maxHeight: '400px',
            overflow: 'auto',
            mb: 3
          }}>
            {symptoms.map(symptom => (
              <ListItem
                key={symptom.id}
                button
                onClick={() => handleSymptomToggle(symptom.id)}
                sx={{
                  py: 2,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                <Checkbox
                  edge="start"
                  checked={selectedSymptoms.includes(symptom.id)}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText
                  primary={`${symptom.symptomName} `}
                  primaryTypographyProps={{ style: { fontSize: '1.1rem' } }}
                />
              </ListItem>
            ))}
          </List>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{ py: 2, fontSize: '1.1rem' }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Create Patient Card'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientRegistrationPage;