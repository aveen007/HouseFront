import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  CircularProgress
} from '@mui/material';

const FinalizeBetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [bets, setBets] = useState([]);
  const [selectedBetId, setSelectedBetId] = useState(null); // Track selected ID only
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitId, setVisitId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSelectedBetId(null); // Reset selection when data reloads

        // Step 1: Fetch patient data
        const patientResponse = await axios.get(`http://localhost:8080/api/getPatient?patientId=${id}`);
        setPatient(patientResponse.data);

        // Step 2: Get all bet patients to find this patient's visitId
        const betPatientsResponse = await axios.get('http://localhost:8080/api/getBetPatients');
        const betPatient = betPatientsResponse.data.find(p => p.id === parseInt(id));

        if (!betPatient) {
          throw new Error('Patient not found in bet patients list');
        }

        setVisitId(betPatient.visitId);

        // Step 3: Get bets for this visit
        const betsResponse = await axios.get(`http://localhost:8080/api/getVisitBets?visitId=${betPatient.visitId}`);
        setBets(betsResponse.data);
        console.log(betsResponse.data);
      } catch (err) {
        console.error("Error fetching data", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFinalizeBet = () => {
    if (!selectedBetId) {
      alert("Please select a bet to finalize");
      return;
    }

    const selectedBet = bets.find(bet => bet.betId === selectedBetId);
    if (!selectedBet) {
      alert("Invalid bet selection");
      return;
    }

    const finalizeData = {
      betId: selectedBetId,
      visitId: visitId,
      diagnosis: selectedBet.diagnosis,
      amount: selectedBet.amount
    };

    axios.post(`http://localhost:8080/api/finalizeBet`, finalizeData)
      .then(() => {
        navigate(`/patients/${id}`);
      })
      .catch(error => {
        console.error("Error finalizing bet", error);
        alert("Failed to finalize bet: " + error.message);
      });
  };

  const handleSelectBet = (betId) => {
   console.log(betId);
    setSelectedBetId(betId);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate(`/patients/${id}`)}>Back to Patient</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Patient Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Finalize Bet for {patient?.firstName} {patient?.lastName}
          </Typography>
        </Box>

        {/* Bets Table */}
        {bets.length === 0 ? (
          <Typography variant="h6" sx={{ mb: 4 }}>
            No bets found for this patient's visit
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'common.white' }}>Select</TableCell>
                  <TableCell sx={{ color: 'common.white' }}>Diagnosis</TableCell>
                  <TableCell sx={{ color: 'common.white' }}>Bid Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bets.map((bet) => (
                  <TableRow key={bet.betId}>
                    <TableCell>
                      <Radio
                        checked={selectedBetId === bet.betId}
                        onChange={() => handleSelectBet(bet.betId)}
                        value={bet.betId}
                        name="bet-selection"
                      />
                    </TableCell>
                    <TableCell>{bet.diagnosis}</TableCell>
                    <TableCell>${bet.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/patients/${id}`)}
            size="large"
          >
            Cancel
          </Button>
          {bets.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleFinalizeBet}
              sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
            >
              Finalize Selected Bet
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default FinalizeBetPage;