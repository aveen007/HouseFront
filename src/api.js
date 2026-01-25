import axios from 'axios';
import { getAuthHeader } from './auth'; // JWT storage utility

const API_BASE_URL = 'http://localhost:9314/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// ✅ Add interceptor to attach JWT automatically
api.interceptors.request.use((config) => {
  const token = getAuthHeader();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
// Patients
export const fetchPatients = () => {
    return api.get(`${API_BASE_URL}/getPatients`);
};
export const fetchContractTerms = () => {
  return api.get(`${API_BASE_URL}/contracts/terms`);
};
export const fetchPatient = (patientId) => {
    return api.get(`${API_BASE_URL}/getPatient?patientId=${patientId}`);
};
// api/contractApi.js
export const createContract = (payload) => {
  return api.post('http://localhost:9314/api/contracts', payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const createPatient = (patient) => {
    return api.post(`${API_BASE_URL}/createPatient`, patient);
};

export const updatePatient = (patient) => {
    return api.put(`${API_BASE_URL}/updatePatient`, patient, {
        headers: { 'Content-Type': 'application/json' }
    });
};
export const fetchAnalysisTypes = () => {
  return api.get("http://localhost:9314/api/getAnalysesTypes");
};
export const createPatientAnalysis = (data) => {
  return api.post(
    "http://localhost:9314/api/createPatientAnalysis",
    data
  );
};
export const fetchPatientAnalyses = () => {
  return api.get(`${API_BASE_URL}/patientAnalyses`);
};

export const fetchPatientAnalysesByPatient = (patientId) => {
  return api.get("http://localhost:9314/api/getPatientAnalyses", {
    params: { patientId },
  });
};


export const deletePatient = (patientId) => {
    return api.delete(`${API_BASE_URL}/deletePatient?patientId=${patientId}`);
};

export const createVisit = (visitData) => {
    return api.post(`${API_BASE_URL}/visits`, visitData);
};

export const addSymptomsToVisit = (visitId, symptomIds) => {
    return api.post(`${API_BASE_URL}/visits/${visitId}/symptoms`, { symptomIds });
};
export const fetchSymptoms = () => {
    return api.get(`${API_BASE_URL}/getSymptoms`);
};
export const fetchInsuranceCompanies = () => {
    return api.get(`${API_BASE_URL}/getInsuranceCompanies`);
};
export const updatePatientAnalysisStatus = (patientAnalysisId, status) => {
  return api.put(
    `${API_BASE_URL}/updatePatientAnalysisStatus?patientAnalysisId=${patientAnalysisId}`,
    status, // raw body
    {
      headers: { "Content-Type": "application/json" }, // or application/json if backend accepts
    }
  );
};
// fetch all approved analyses
export const fetchApprovedAnalyses = () => {
  return api.get(`${API_BASE_URL}/getApprovedAnalyses`);
};

/* -------- Get contracts by patient -------- */
export const fetchContractsByPatient = (patientId) => {
  return api.get(`${API_BASE_URL}/contracts/patient/${patientId}`);
};

/* -------- Update contract status -------- */
export const updateContractStatus = (contractId, status) => {
  return api.put(
    `${API_BASE_URL}/contracts/${contractId}`,
    { status },
    { headers: { 'Content-Type': 'application/json' } }
  );
};

/* -------- Sign contract -------- */
export const signContract = (contractId, payload) => {
  return api.post(
    `${API_BASE_URL}/contracts/${contractId}/sign`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
};


export const fetchHDAwaitingVisits = () => {
  return api.get(`${API_BASE_URL}/visits/getAllHDAwaitingVisits`);
};
export const fetchHDAcceptedVisits = () => {
  return api.get(`${API_BASE_URL}/visits/getAllAcceptedVisits`);
};
export const fetchBetPatients = () => {
  return api.get(`${API_BASE_URL}/getBetPatients`);
};
export const fetchPatientContracts = (patientId) => {
  return api.get(`${API_BASE_URL}/contracts/patient/${patientId}`);
};
export const getAwaitingHDAnalyses = () => {
  return api.get(`${API_BASE_URL}/getAwaitingHDAnalyses`);
};

export const createAnalysisResult = (patientAnalysisId, result) => {
  return api.post(
    `${API_BASE_URL}/createAnalysisResult`,
    {
      patientAnalysisId,
      result,
    }
  );
};