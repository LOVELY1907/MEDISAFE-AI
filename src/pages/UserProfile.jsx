import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();

  // User state (later connect to backend)
  const [user, setUser] = useState({
    name: "Rohith HS",
    email: "rohith@gmail.com",
    dob: "2003-06-15",
    phone: "9876543210",
    address: "Bengaluru, Karnataka"
  });

  const [isEditing, setIsEditing] = useState(false);

  // Calculate age automatically
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div style={styles.card}>
        <div style={styles.avatar}>👤</div>

        {!isEditing ? (
          <>
            <h2>{user.name}</h2>
            <p style={styles.email}>{user.email}</p>

            <div style={styles.info}>
              <p><strong>Date of Birth:</strong> {user.dob}</p>
              <p><strong>Age:</strong> {calculateAge(user.dob)}</p>
              <p><strong>Contact:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address}</p>
            </div>

            <button
              style={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              style={styles.input}
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              style={styles.input}
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <input
              style={styles.input}
              type="date"
              name="dob"
              value={user.dob}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="Contact Number"
            />

            <textarea
              style={styles.textarea}
              name="address"
              value={user.address}
              onChange={handleChange}
              placeholder="Address"
            />

            <p style={{ marginBottom: "10px" }}>
              <strong>Age:</strong> {calculateAge(user.dob)}
            </p>

            <div style={styles.btnGroup}>
              <button
                style={styles.saveBtn}
                onClick={() => setIsEditing(false)}
              >
                💾 Save
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setIsEditing(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "20px",
    fontFamily: "Arial"
  },
  backBtn: {
    marginBottom: "20px",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  },
  card: {
    maxWidth: "420px",
    margin: "auto",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  avatar: {
    fontSize: "60px",
    marginBottom: "10px"
  },
  email: {
    color: "gray",
    marginBottom: "20px"
  },
  info: {
    textAlign: "left",
    marginBottom: "20px"
  },
  editBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "70px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  btnGroup: {
    display: "flex",
    justifyContent: "space-between"
  },
  saveBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  cancelBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};
