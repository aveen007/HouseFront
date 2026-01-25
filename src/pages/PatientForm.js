import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPatient, updatePatient, fetchInsuranceCompanies, fetchPatient } from '../api';
import MuiAlert from '@mui/material/Alert';
import { register } from '../auth.service';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  Paper,
  Snackbar,
  Grid
} from '@mui/material';

const transformToBackendFormat = (data) => ({
  firstName: data.first_name,
  lastName: data.last_name,
  dateOfBirth: data.date_of_birth,
  gender: data.gender,
  insuranceCompanyId: data.insurance_company_id
});

const PatientForm = () => {
  const [patient, setPatient] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    insurance_company_id: ''
  });

  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    // Fetch insurance companies
    fetchInsuranceCompanies()
      .then(response => {
        setInsuranceCompanies(response.data);
      })
      .catch(error => console.error("Error fetching insurance companies", error));

    if (id) {
      fetchPatient(id)
        .then(response => {
          setPatient(response.data);
        })
        .catch(error => console.error("Error fetching patient", error));
    }
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient.first_name || !patient.last_name) return; // basic validation

    if (id) {
      // Update existing patient
      updatePatient(patient)
        .then(() => navigate('/patients'))
        .catch(error => {
          const errorMsg = error?.response?.data || "An error occurred while updating the patient.";
          setSnackbarMessage(errorMsg);
          setSnackbarOpen(true);
          console.error("Error updating patient", error);
        });
    } else {
      // Creating new patient
      const transformedData = transformToBackendFormat(patient);
      console.log(transformedData)
      try {
        const createdPatient = await createPatient(transformedData);
        console.log("Patient created:", createdPatient);

        // Automatically register auth user for this patient
        const username = `${patient.first_name.toLowerCase()}.${patient.last_name.toLowerCase()}`;
        const password = "123"; // default password
        const fullName = `${patient.first_name} ${patient.last_name}`;

        const authPayload = {
          username,
          password,
          fullName,
          role: "PATIENT",
          patientId: createdPatient.data.id // assuming createPatient returns patient ID
        };

        const authUser = await register(authPayload);
        console.log("Auth user created:", authUser);

        alert(`Patient and account created successfully!\nUsername: ${username}\nPassword: ${password}`);
        navigate('/patients');
      } catch (error) {
        const errorMsg = error?.response?.data || "An error occurred while creating the patient.";
        setSnackbarMessage(errorMsg);
        setSnackbarOpen(true);
        console.error("Error creating patient/auth user", error);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          {id ? 'Edit Patient' : 'Register New Patient'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={patient.first_name}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ '& .MuiInputBase-root': { height: '56px' } }}
                inputProps={{
                  'data-testid': 'patient-form-first-name'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={patient.last_name}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ '& .MuiInputBase-root': { height: '56px' } }}
                inputProps={{
                  'data-testid': 'patient-form-last-name'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                name="date_of_birth"
                value={patient.date_of_birth}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': { height: '56px' } }}
                inputProps={{
                  'data-testid': 'patient-form-dob'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                variant="outlined"
                sx={{ '& .MuiInputBase-root': { height: '56px' } }}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                  label="Gender"
                  inputProps={{
                    'data-testid': 'patient-form-gender'
                  }}
                >
                  <MenuItem value=""><em>Select Gender</em></MenuItem>
                  <MenuItem
                    value="M"
                    data-testid="patient-form-gender-M"
                  >
                    Male
                  </MenuItem>
                  <MenuItem
                    value="F"
                    data-testid="patient-form-gender-F"
                  >
                    Female
                  </MenuItem>
                  <MenuItem
                    value="O"
                    data-testid="patient-form-gender-O"
                  >
                    Other
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                required
                variant="outlined"
                sx={{ '& .MuiInputBase-root': { height: '56px' } }}
              >
                <InputLabel>Insurance Company</InputLabel>
                <Select
                  name="insurance_company_id"
                  value={patient.insurance_company_id}
                  onChange={handleChange}
                  label="Insurance Company"
                  inputProps={{
                    'data-testid': 'patient-form-insurance'
                  }}
                >
                  <MenuItem value=""><em>Select Insurance Company</em></MenuItem>
                  {insuranceCompanies.map(company => (
                    <MenuItem
                      key={company.id}
                      value={company.id}
                      data-testid={`patient-form-insurance-${company.companyName.replace(/\s+/g, '-')}`}
                    >
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    height: '56px'
                  }}
                  data-testid="patient-form-submit"
                >
                  {id ? 'Save Changes' : 'Register Patient'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/patients')}
                  size="large"
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    height: '56px'
                  }}
                  data-testid="patient-form-cancel"
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PatientForm;