/*
import React, { useState, useEffect } from 'react';
import { fetchPatientsWithVisits } from '../api';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';

const PatientCards = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await fetchPatientsWithVisits();
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients with visits", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPatients();
  }, []);

  const handleGoToBets = (patientId) => {
    // You'll implement this later
    console.log("Navigate to bets for patient:", patientId);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Patient Cards
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Bets</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell sx={{ fontSize: '1rem' }}>
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleGoToBets(patient.id)}
                    >
                      Go To Bets
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default PatientCards;*/
