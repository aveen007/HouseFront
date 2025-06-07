import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPatients, deletePatient } from '../api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    const loadPatients = () => {
        fetchPatients()
            .then(response => {
                setPatients(response.data);
            })
            .catch(error => {
                console.error("Error fetching patients", error);
            });
    };

    useEffect(() => {
        loadPatients();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            deletePatient(id)
                .then(() => {
                    loadPatients();
                })
                .catch(error => {
                    console.error("Error deleting patient", error);
                    alert("Failed to delete patient. They may have associated medical records.")
                });
        }
    };

    return (
        <div>
            <h2>Patients</h2>
            <button onClick={() => navigate('/patients/new')}>Register New Patient</button>
            <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '20px', width: '100%' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Insurance ID</th>
                    <th>Age</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {patients.map(patient => (
                    <tr key={patient.patient_id}>
                        <td>{patient.patient_id}</td>
                        <td>{patient.first_name}</td>
                        <td>{patient.last_name}</td>
                        <td>{patient.date_of_birth}</td>
                        <td>{patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}</td>
                        <td>{patient.insurance_company_id}</td>
                        <td>{patient.age}</td>
                        <td>
                            <FaEdit
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                onClick={() => navigate(`/patients/edit/${patient.patient_id}`)}
                            />
                            <FaTrash
                                role="button"
                                aria-label="delete"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDelete(patient.patient_id)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientsPage;