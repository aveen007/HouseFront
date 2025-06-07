import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPatient, updatePatient } from '../api';
import axios from 'axios';

const PatientForm = () => {
    const [patient, setPatient] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        insurance_company_id: 0,
        age: 0
    });
    const [insuranceCompanies, setInsuranceCompanies] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        // Fetch insurance companies
        axios.get('http://localhost:8080/api/insuranceCompanies')
            .then(response => {
                setInsuranceCompanies(response.data);
            })
            .catch(error => console.error("Error fetching insurance companies", error));

        if (id) {
            // Fetch patient data for editing
            axios.get(`http://localhost:8080/api/getPatient?patient_id=${id}`)
                .then(response => {
                    setPatient(response.data);
                })
                .catch(error => console.error("Error fetching patient", error));
        }
    }, [id]);

    const handleChange = (e) => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            updatePatient(patient)
                .then(() => {
                    navigate('/patients');
                })
                .catch(error => console.error("Error updating patient", error));
        } else {
            createPatient(patient)
                .then(() => {
                    navigate('/patients');
                })
                .catch(error => console.error("Error creating patient", error));
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit Patient' : 'Register New Patient'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        value={patient.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        value={patient.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date_of_birth">Date of Birth:</label>
                    <input
                        id="date_of_birth"
                        type="date"
                        name="date_of_birth"
                        value={patient.date_of_birth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={patient.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="insurance_company_id">Insurance Company:</label>
                    <select
                        id="insurance_company_id"
                        name="insurance_company_id"
                        value={patient.insurance_company_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Insurance Company</option>
                        {insuranceCompanies.map(company => (
                            <option key={company.insurance_company_id} value={company.insurance_company_id}>
                                {company.company_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="age">Age:</label>
                    <input
                        id="age"
                        type="number"
                        name="age"
                        value={patient.age}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                <button type="submit">{id ? 'Save Changes' : 'Register Patient'}</button>
            </form>
        </div>
    );
};

export default PatientForm;