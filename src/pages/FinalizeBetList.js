import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNotifications } from './NotificationContext';
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
  const { pendingBets, clearPendingBets } = useNotifications();

  // Handle both pending bets notifications and URL-based notifications
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // Priority to pending bets notifications if they exist
    if (pendingBets.length > 0) {
      setNotification({
        message: `${pendingBets.length} new bet(s) created since your last visit`,
        severity: 'info'
      });
      clearPendingBets();
    }
    // If no pending bets, check for URL notification
    else if (searchParams.get('notification') === 'true') {
      setNotification({
        message: `New bet placed for ${searchParams.get('patient')} on ${searchParams.get('diagnosis')} ($${searchParams.get('amount')})`,
        severity: 'success'
      });
      // Clean the URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [pendingBets.length, location.search, clearPendingBets]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsResponse = await axios.get('http://localhost:9314/api/getBetPatients');
        const allPatients = patientsResponse.data;

        const patientsWithBetsData = await Promise.all(
          allPatients.map(async (patient) => {
            try {
              const betsResponse = await axios.get(
                `http://localhost:9314/api/getVisitBets?visitId=${patient.visitId}`
              );
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
        setNotification({
          message: 'Failed to load patient data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {/* Unified Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification?.severity || 'info'}
          sx={{ width: '100%' }}
        >
          {notification?.message}
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
                      sx={{
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#388e3c' }
                      }}
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