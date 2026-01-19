import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHDAcceptedVisits,fetchPatients , fetchInsuranceCompanies, fetchPatientContracts, fetchBetPatients } from '../api';

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
  Box
} from '@mui/material';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

//   axios.get('http://localhost:9314/api/getBetPatients')
//       .then(response => setPatients(response.data))
//             .catch(error => console.error("Error fetching patients", error));
//         }, []);


const loadData = async () => {
       try {

       const betPatientsRes = await fetchBetPatients();
       const betPatients = betPatientsRes.data;
//       console.log(betPatients)
       const betPatientIds = new Set(betPatients.map(p => p.id));

         // 1️⃣ Fetch accepted visits
         const visitsRes = await fetchHDAcceptedVisits();
         const acceptedVisits = visitsRes.data;

         // Extract patientIds from visits
         const acceptedPatientIds = new Set(
           acceptedVisits.map(v => v.patientId)
         );

         // 2️⃣ Fetch all patients
//         const patientsRes = await fetchPatients();
//         const allPatients = patientsRes.data;

         // 3️⃣ Keep only patients with accepted visits

//        console.log(betPatients)

         const filteredPatients = betPatients.filter(p =>
           acceptedPatientIds.has(p.id)
         );
//const intersectedPatients = filteredPatients.filter(p =>
//  betPatientIds.has(p.id)
//);

         // 4️⃣ Filter only patients with a signed contract
         const patientsWithSignedContract = await Promise.all(
           filteredPatients.map(async (p) => {
             const contractsRes = await fetchPatientContracts(p.id);
             const contracts = contractsRes.data;

             // Keep patient only if at least one contract is SIGNED
             const hasSigned = contracts.some(c => c.status === 'SIGNED');
             return hasSigned ? p : null;
           })
         );
        console.log(filteredPatients)
         // Remove nulls
         const finalPatients = patientsWithSignedContract.filter(Boolean);
//         console.log(finalPatients)
         setPatients(finalPatients);
       } catch (error) {
         console.error('Error loading patients/visits', error);
       }
     };

     loadData();}, []);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewPatient = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="patient table">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Last Name</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Actions</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>
                Propose Analysis
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                key={patient.patient_id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewPatient(patient.id)}
                  >
                    Go to Bets
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/propose-analysis/${patient.id}`)}
                  >
                    Propose
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PatientsPage;