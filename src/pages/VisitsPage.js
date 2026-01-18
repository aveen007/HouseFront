import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHDAwaitingVisits,fetchPatients , fetchInsuranceCompanies } from '../api';
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
//import { TableCell, TableRow, Button } from '@mui/material';

const VisitsPage = () => {
  const [patients, setPatients] = useState([]);

  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
   const loadData = async () => {
       try {
         // 1️⃣ Fetch awaiting visits
         const visitsRes = await fetchHDAwaitingVisits();
         const awaitingVisits = visitsRes.data;

         // Extract patientIds from visits
         const awaitingPatientIds = new Set(
           awaitingVisits.map(v => v.patientId)
         );

         // 2️⃣ Fetch all patients
         const patientsRes = await fetchPatients();
         const allPatients = patientsRes.data;

         // 3️⃣ Keep only patients with awaiting visits
         const filteredPatients = allPatients.filter(p =>
           awaitingPatientIds.has(p.id)
         );

         // 4️⃣ Set patients
         setPatients(filteredPatients);
       } catch (error) {
         console.error('Error loading patients/visits', error);
       }
     };

     loadData();

    fetchInsuranceCompanies()
      .then(response => setInsuranceCompanies(response.data))
      .catch(error => console.error("Error fetching companies", error));
  }, []);



  const getCompanyName = (companyId) => {
   console.log(insuranceCompanies);
//   console.log(companyId.insuranceCompany.companyName);
//   console.log(companyId?.id);

    const company = insuranceCompanies.find(c => c.companyName === companyId.insuranceCompany.companyName);
    return company ? company.companyName : 'Unknown';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Records
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/patients/new')}
          sx={{ height: 'fit-content' }}
        >
          Register New Patient
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="patient table">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Last Name</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Date of Birth</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Gender</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Insurance Company</TableCell>
<TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>
  Propose Analysis
</TableCell>
<TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>
  Approve Patient
</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                key={patient.patientId}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{patient.firstName}</TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                <TableCell>
                  {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
                </TableCell>
                <TableCell>{getCompanyName(patient)}</TableCell>
<TableCell>
  <Button
    variant="outlined"
    size="small"
    onClick={() => navigate(`/propose-analysis/${patient.id}`)}
  >
    Propose
  </Button>
</TableCell>

<TableCell>
  <Button
    variant="outlined"
    size="small"
    onClick={() => navigate(`/approve-card/${patient.id}`)}
  >
    Approve
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

export default VisitsPage;