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
  Radio
} from '@mui/material';

const FinalizeBetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [bets, setBets] = useState([]);
  const [selectedBetId, setSelectedBetId] = useState(null);

  useEffect(() => {
    // Fetch patient data
    axios.get(`http://localhost:8080/api/getPatient?patientId=${id}`)
      .then(response => setPatient(response.data))
      .catch(error => console.error("Error fetching patient", error));

    // Fetch bets for this patient (assuming you have an endpoint that gets bets by patient ID)
    axios.get(`http://localhost:8080/api/getBetsByPatientId?patientId=${id}`)
      .then(response => setBets(response.data))
      .catch(error => console.error("Error fetching bets", error));
  }, [id]);

  const handleFinalizeBet = () => {
    if (!selectedBetId) {
      alert("Please select a bet to finalize");
      return;
    }

    axios.post(`http://localhost:8080/api/finalizeBet`, { betId: selectedBetId })
      .then(() => {
        navigate(`/patients/${id}`);
      })
      .catch(error => console.error("Error finalizing bet", error));
  };

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
                <TableRow key={bet.id}>
                  <TableCell>
                    <Radio
                      checked={selectedBetId === bet.id}
                      onChange={() => setSelectedBetId(bet.id)}
                    />
                  </TableCell>
                  <TableCell>{bet.diagnosis}</TableCell>
                  <TableCell>${bet.bidAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/patients/${id}`)}
            size="large"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleFinalizeBet}
            sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
          >
            Finalize Selected Bet
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FinalizeBetPage;