import React, { useState } from "react";

export default function DrugInteraction({ onBack }) {
  // ✅ Keep old data (tablets user already added)
  const allTablets =
    JSON.parse(localStorage.getItem("userTablets")) || [];

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [risk, setRisk] = useState(null);

  // Add tablet
  const addTablet = (tablet) => {
    if (!selected.includes(tablet)) {
      setSelected([...selected, tablet]);
    }
    setSearch("");
  };

  // Remove tablet
  const removeTablet = (tablet) => {
    setSelected(selected.filter((t) => t !== tablet));
  };

  // Risk calculation (REALISTIC RULE-BASED)
  const calculateRisk = () => {
    if (selected.length < 2) {
      alert("Please select at least 2 tablets");
      return;
    }

    let score = selected.length * 15;

    selected.forEach((t) => {
      const name = t.toLowerCase();
      if (
        name.includes("dolo") ||
        name.includes("crocin") ||
        name.includes("aspirin") ||
        name.includes("ibuprofen") ||
        name.includes("diclofenac")
      ) {
        score += 20;
      }
    });

    if (score > 100) score = 100;
    setRisk(score);
  };

  const getColor = () => {
    if (risk < 40) return "#22c55e"; // green
    if (risk < 70) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  return (
    <div style={styles.container}>
      <h1>Drug Interaction 📈@</h1>
      <p>Select two or more tablets to analyze interaction risk.</p>

      {/* SEARCH */}
      <input
        style={styles.input}
        placeholder="Search tablet (e.g. Dolo)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SEARCH RESULTS */}
      {search &&
        allTablets
          .filter((t) =>
            t.toLowerCase().includes(search.toLowerCase())
          )
          .map((t, i) => (
            <div
              key={i}
              style={styles.suggestion}
              onClick={() => addTablet(t)}
            >
              ➕ {t}
            </div>
          ))}

      {/* SELECTED TABLETS */}
      <div style={styles.selectedBox}>
        {selected.map((t, i) => (
          <span key={i} style={styles.tag}>
            {t}
            <button onClick={() => removeTablet(t)}>✖</button>
          </span>
        ))}
      </div>

      <button style={styles.analyzeBtn} onClick={calculateRisk}>
        Analyze Interaction
      </button>

      {/* SPEEDOMETER */}
      {risk !== null && (
        <div style={styles.meterBox}>
          <div style={styles.meter}>
            <div
              style={{
                ...styles.needle,
                transform: `rotate(${(risk / 100) * 180 - 90}deg)`,
              }}
            />
          </div>

          <h2 style={{ color: getColor() }}>
            Risk Level: {risk}%
          </h2>
        </div>
      )}

      {/* BACK */}
      <button style={styles.backBtn} onClick={onBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    padding: 20,
    backgroundColor: "#f4f6f8",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  suggestion: {
    padding: 8,
    background: "#fff",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  selectedBox: {
    marginTop: 10,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    background: "#e0e7ff",
    padding: "5px 8px",
    borderRadius: 6,
  },
  analyzeBtn: {
    width: "100%",
    marginTop: 12,
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  meterBox: {
    marginTop: 20,
    textAlign: "center",
  },
  meter: {
    width: 200,
    height: 100,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    border: "10px solid #ddd",
    borderBottom: "none",
    margin: "0 auto",
    position: "relative",
  },
  needle: {
    width: 4,
    height: 90,
    background: "black",
    position: "absolute",
    bottom: 0,
    left: "50%",
    transformOrigin: "bottom center",
  },
  backBtn: {
    marginTop: 20,
    width: "100%",
    padding: 10,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
