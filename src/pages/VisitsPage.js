import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHDAwaitingVisits,fetchPatients , fetchInsuranceCompanies, fetchbet } from '../api';
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
  const [visitsWithPatientInfo, setVisitsWithPatientInfo] = useState([]);

  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️⃣ Fetch awaiting visits
        const visitsRes = await fetchHDAwaitingVisits();
        const awaitingVisits = visitsRes.data; // each visit has patientId

        // 2️⃣ Fetch all patients
        const patientsRes = await fetchPatients();
        const allPatients = patientsRes.data;

        // 3️⃣ Merge patient info into each visit
        const visitsWithInfo = awaitingVisits.map(visit => {
          const patient = allPatients.find(p => p.id === visit.patientId);
          return {
            ...visit,
            patient
          };
        });

        setVisitsWithPatientInfo(visitsWithInfo);
      } catch (error) {
        console.error('Error loading visits/patients', error);
      }
    };

    loadData();

    fetchInsuranceCompanies()
      .then(response => setInsuranceCompanies(response.data))
      .catch(error => console.error("Error fetching companies", error));
  }, []);


const getCompanyName = (visit) => {
  const companyId = visit.patient?.insuranceCompany?.companyName;
  const company = insuranceCompanies.find(c => c.companyName === companyId);
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
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Visit Date</TableCell>

<TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>
  Approve Patient
</TableCell>

            </TableRow>
          </TableHead>
         <TableBody>
           {visitsWithPatientInfo.map((visit) => (
             <TableRow
               key={visit.id} // use visit ID as key
               hover
               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
             >
               <TableCell>{visit.patient?.firstName}</TableCell>
               <TableCell>{visit.patient?.lastName}</TableCell>
               <TableCell>{formatDate(visit.patient?.dateOfBirth)}</TableCell>
               <TableCell>
                 {visit.patient?.gender === 'M'
                   ? 'Male'
                   : visit.patient?.gender === 'F'
                   ? 'Female'
                   : 'Other'}
               </TableCell>
               <TableCell>{getCompanyName(visit)}</TableCell>
               <TableCell>{formatDate(visit.dateOfVisit)}</TableCell> {/* NEW column */}
               <TableCell>
                 <Button
                   variant="outlined"
                   size="small"
                   onClick={() => navigate(`/approve-card/${visit.id}`)}
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