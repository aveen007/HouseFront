import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';

const FinalizeBetList = () => {
  const [patientsWithBets, setPatientsWithBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch all patients
        const patientsResponse = await axios.get('http://localhost:8080/api/getBetPatients');
        const allPatients = patientsResponse.data;
        console.log(allPatients);
        // For each patient, check if they have bets
        const patientsWithBetsData = await Promise.all(
          allPatients.map(async (patient) => {
            try {
              const betsResponse = await axios.get(`http://localhost:8080/api/getVisitBets?visitId=${patient.visitId}`);
              // Only include patient if bets exist and the array is not empty
              if (betsResponse.data && betsResponse.data.length > 0) {
                return { ...patient, hasBets: true };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching bets for visit ${patient.visitId}`, error);
              return null;
            }
          })
        );

        // Filter out null values (patients without bets)
        const filteredPatients = patientsWithBetsData.filter(patient => patient !== null);
        setPatientsWithBets(filteredPatients);
      } catch (error) {
        console.error("Error fetching patients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFinalizeBet = (patientId) => {
    navigate(`/patients/${patientId}/FinalizeBets`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Finalize Bets
      </Typography>
      {patientsWithBets.length === 0 ? (
        <Typography variant="h6" component="div" sx={{ mt: 2 }}>
          No patients with active bets found.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="patient table">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientsWithBets.map((patient) => (
                <TableRow
                  key={patient.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleFinalizeBet(patient.id)}
                      sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                    >
                      Finalize Bet
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default FinalizeBetList;