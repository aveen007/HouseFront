import { useState } from "react";
import { register } from "../auth.service"; // make sure your auth.service.js has register()
import { useNavigate } from "react-router-dom";

export default function RegisterPatientPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [patientId, setPatientId] = useState(""); // optional
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
const [role, setRole] = useState("PATIENT"); // default
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        username,
        password,
        fullName,
        role, // default role
      };

      if (patientId) {
        payload.patientId = Number(patientId); // convert to number if entered
      }

      const res = await register(payload);
      console.log("Registered user:", res);

      setLoading(false);
      alert(`Patient ${res.username} registered successfully!`);
      navigate("/patients"); // redirect to patients list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Register New Patient</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Full Name:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Patient ID (optional):
            <input
              type="number"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          </div>
          <div style={{ marginBottom: 12 }}>

          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
            <option value="HEAD_DOCTOR">Head Doctor</option>
          </select>
        </div>


        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
