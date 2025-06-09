import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  Grid
} from '@mui/material';

const CreateBetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [betData, setBetData] = useState({
    diagnosis: '',
    bidAmount: ''
  });

  useEffect(() => {
    // Fetch patient data
    if (id) {
      axios.get(`http://localhost:8080/api/getPatient?patientId=${id}`)
        .then(response => {
          setPatient(response.data);
        })
        .catch(error => console.error("Error fetching patient", error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare the bet data to send to your API
    const betToCreate = {
      patientId: id,
      diagnosis: betData.diagnosis,
      bidAmount: parseFloat(betData.bidAmount),
      // You might want to add more fields like date, status, etc.
    };

    // Here you would connect to your API to create the bet
    axios.post('http://localhost:8080/api/createBet', betToCreate)
      .then(response => {
        // After successful creation, navigate back to patient card
        navigate(`/patients/${id}`);
      })
      .catch(error => {
        console.error("Error creating bet", error);
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Patient Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Create New Bet for {patient?.firstName} {patient?.lastName}
          </Typography>
        </Box>

        {/* Bet Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                name="diagnosis"
                value={betData.diagnosis}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ '& .MuiInputBase-root': { height: '56px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bid Amount ($)"
                name="bidAmount"
                type="number"
                value={betData.bidAmount}
                onChange={handleChange}
                required
                variant="outlined"
                inputProps={{ step: "0.01", min: "0" }}
                sx={{ '& .MuiInputBase-root': { height: '56px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/patients/${id}`)}
                  size="large"
                  sx={{ py: 2, fontSize: '1.1rem' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ py: 2, fontSize: '1.1rem' }}
                >
                  Create Bet
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateBetPage;