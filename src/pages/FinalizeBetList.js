import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

const FinalizeBetList = () => {
  const [patientsWithBets, setPatientsWithBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('notification') === 'true') {
      setNotification({
        patientName: searchParams.get('patient'),
        diagnosis: searchParams.get('diagnosis'),
        amount: searchParams.get('amount')
      });
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const fetchData = async () => {
      try {
        const patientsResponse = await axios.get('http://localhost:8080/api/getBetPatients');
        const allPatients = patientsResponse.data;

        const patientsWithBetsData = await Promise.all(
          allPatients.map(async (patient) => {
            try {
              const betsResponse = await axios.get(`http://localhost:8080/api/getVisitBets?visitId=${patient.visitId}`);
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

        const filteredPatients = patientsWithBetsData.filter(patient => patient !== null);
        setPatientsWithBets(filteredPatients);
      } catch (error) {
        console.error("Error fetching patients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleCloseNotification = () => {
    setNotification(null);
  };

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

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
         A new bet was placed for {notification?.patientName} on {notification?.diagnosis} with amount ${notification?.amount}
        </Alert>
      </Snackbar>

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