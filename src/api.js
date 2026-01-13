import axios from 'axios';

 const API_BASE_URL = 'http://localhost:9314/api';    // For local development
// const API_BASE_URL = 'http://localhost:8080/api';    // For local development
//const API_BASE_URL = '/api';    // For deployment

// Patients
export const fetchPatients = () => {
    return axios.get(`${API_BASE_URL}/getPatients`);
};
export const fetchContractTerms = () => {
  return axios.get(`${API_BASE_URL}/contracts/terms`);
};
export const fetchPatient = (patientId) => {
    return axios.get(`${API_BASE_URL}/getPatient?patientId=${patientId}`);
};
// api/contractApi.js
export const createContract = (payload) => {
  return axios.post('http://localhost:9314/api/contracts', payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const createPatient = (patient) => {
    return axios.post(`${API_BASE_URL}/createPatient`, patient);
};

export const updatePatient = (patient) => {
    return axios.put(`${API_BASE_URL}/updatePatient`, patient, {
        headers: { 'Content-Type': 'application/json' }
    });
};
export const fetchAnalysisTypes = () => {
  return axios.get("http://localhost:9314/api/getAnalysesTypes");
};
export const createPatientAnalysis = (data) => {
  return axios.post(
    "http://localhost:9314/api/createPatientAnalysis",
    data
  );
};
export const fetchPatientAnalyses = () => {
  return axios.get(`${API_BASE_URL}/patientAnalyses`);
};

export const fetchPatientAnalysesByPatient = (patientId) => {
  return axios.get("http://localhost:9314/api/getPatientAnalyses", {
    params: { patientId },
  });
};


export const deletePatient = (patientId) => {
    return axios.delete(`${API_BASE_URL}/deletePatient?patientId=${patientId}`);
};

export const createVisit = (visitData) => {
    return axios.post(`${API_BASE_URL}/visits`, visitData);
};

export const addSymptomsToVisit = (visitId, symptomIds) => {
    return axios.post(`${API_BASE_URL}/visits/${visitId}/symptoms`, { symptomIds });
};
export const fetchSymptoms = () => {
    return axios.get(`${API_BASE_URL}/getSymptoms`);
};
export const fetchInsuranceCompanies = () => {
    return axios.get(`${API_BASE_URL}/getInsuranceCompanies`);
};
export const updatePatientAnalysisStatus = (patientAnalysisId, status) => {
  return axios.put(
    `${API_BASE_URL}/updatePatientAnalysisStatus?patientAnalysisId=${patientAnalysisId}`,
    status, // raw body
    {
      headers: { "Content-Type": "application/json" }, // or application/json if backend accepts
    }
  );
};
// fetch all approved analyses
export const fetchApprovedAnalyses = () => {
  return axios.get(`${API_BASE_URL}/getApprovedAnalyses`);
};

/* -------- Get contracts by patient -------- */
export const fetchContractsByPatient = (patientId) => {
  return axios.get(`${API_BASE_URL}/contracts/patient/${patientId}`);
};

/* -------- Update contract status -------- */
export const updateContractStatus = (contractId, status) => {
  return axios.put(
    `${API_BASE_URL}/contracts/${contractId}`,
    { status },
    { headers: { 'Content-Type': 'application/json' } }
  );
};

/* -------- Sign contract -------- */
export const signContract = (contractId, payload) => {
  return axios.post(
    `${API_BASE_URL}/contracts/${contractId}/sign`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
};
