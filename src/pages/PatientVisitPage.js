import React, { useState, useEffect } from 'react';
import { createVisit, fetchSymptoms, fetchPatients, addSymptomsToVisit } from '../api';

const PatientRegistrationPage = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSymptoms()
            .then(response => {
                setSymptoms(response.data);
            })
            .catch(error => console.error("Error fetching symptoms", error));

        fetchPatients()
            .then(response => {
                setPatients(response.data);
            })
            .catch(error => console.error("Error fetching patients", error));
    }, []);

    const handleSymptomChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(parseInt(options[i].value));
            }
        }
        setSelectedSymptoms(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPatient || selectedSymptoms.length === 0) {
            alert("Please select a patient and at least one symptom");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create the visit with current date
            const today = new Date().toISOString().split('T')[0];
            const visitResponse = await createVisit({
                patient_id: selectedPatient,
                date_of_visit: today
            });

            const visitId = visitResponse.data.visit_id;

            // Add symptoms to the visit
            await addSymptomsToVisit(visitId, selectedSymptoms);

            alert("Visit created successfully with symptoms recorded!");

            // Reset form
            setSelectedPatient('');
            setSelectedSymptoms([]);
        } catch (error) {
            console.error("Error during visit creation", error);
            alert("Visit creation failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="patient-registration">
            <h2> Patient Card</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="patient">Patient:</label>
                    <select
                        id="patient"
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        required
                    >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                            <option key={patient.patient_id} value={patient.patient_id}>
                                {patient.first_name} {patient.last_name} (ID: {patient.patient_id})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="symptoms">Symptoms (Select multiple with Ctrl/Cmd):</label>
                    <select
                        id="symptoms"
                        multiple
                        size="5"
                        value={selectedSymptoms}
                        onChange={handleSymptomChange}
                        required
                        style={{ minHeight: '100px' }}
                    >
                        {symptoms.map(symptom => (
                            <option key={symptom.symptom_id} value={symptom.symptom_id}>
                                {symptom.name} ({symptom.code})
                            </option>
                        ))}
                    </select>

                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Create Patient Card'}
                </button>
            </form>
        </div>
    );
};

export default PatientRegistrationPage;