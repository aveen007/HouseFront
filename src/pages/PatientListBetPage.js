import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPatients, deletePatient, fetchInsuranceCompanies } from '../api';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patients and insurance companies
    fetchPatients()
      .then(response => setPatients(response.data))
      .catch(error => console.error("Error fetching patients", error));

    fetchInsuranceCompanies()
      .then(response => setInsuranceCompanies(response.data))
      .catch(error => console.error("Error fetching companies", error));
  }, []);

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deletePatient(patientToDelete.patient_id)
      .then(() => {
        setPatients(patients.filter(p => p.patient_id !== patientToDelete.patient_id));
      })
      .catch(error => {
        console.error("Error deleting patient", error);
        alert("Failed to delete patient. They may have associated medical records.");
      })
      .finally(() => {
        setOpenDeleteDialog(false);
        setPatientToDelete(null);
      });
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setPatientToDelete(null);
  };

  const getCompanyName = (companyId) => {
    const company = insuranceCompanies.find(c => c.insurance_company_id === companyId);
    return company ? company.company_name : 'Unknown';
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
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                key={patient.patient_id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{patient.first_name}</TableCell>
                <TableCell>{patient.last_name}</TableCell>
                <TableCell>{formatDate(patient.date_of_birth)}</TableCell>
                <TableCell>
                  {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
                </TableCell>
                <TableCell>{getCompanyName(patient.insurance_company_id)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={() => navigate(`/patients/edit/${patient.patient_id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(patient)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {patientToDelete?.first_name} {patientToDelete?.last_name}'s record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientsPage;