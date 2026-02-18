import React, { useState, useEffect } from "react";

const SUGGESTED_TABLETS = [
  "Dolo 650",
  "Dolo 500",
  "Dolo Cold",
  "Paracetamol",
  "Zincovit",
  "Crocin",
  "Azithromycin",
  "Vitamin C",
];

export default function TabletList({ compact = false, onBack }) {
  const [search, setSearch] = useState("");
  const [tablets, setTablets] = useState(() => {
    const saved = localStorage.getItem("userTablets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("userTablets", JSON.stringify(tablets));
  }, [tablets]);

  const filteredSuggestions = SUGGESTED_TABLETS.filter(
    (t) =>
      t.toLowerCase().includes(search.toLowerCase()) &&
      !tablets.includes(t)
  );

  const addTablet = (name) => {
    setTablets([...tablets, name]);
    setSearch("");
  };

  const removeTablet = (index) => {
    setTablets(tablets.filter((_, i) => i !== index));
  };

  /* ================= DASHBOARD COMPACT VIEW ================= */
  if (compact) {
    return (
      <div>
        {tablets.length === 0 && <p>No tablets added</p>}

        {tablets.length > 0 && (
          <>
            <p>💊 {tablets[0]}</p>
            {tablets.length > 1 && (
              <p style={{ color: "#2563eb", cursor: "pointer" }}>
                View more
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  /* ================= FULL VIEW (VIEW MORE) ================= */
  return (
    <div style={styles.container}>
      <h3>Your Tablets</h3>

      {/* SEARCH */}
      <input
        style={styles.input}
        placeholder="Search tablet (e.g. Dolo)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SUGGESTIONS */}
      {search && filteredSuggestions.length > 0 && (
        <div style={styles.suggestions}>
          {filteredSuggestions.map((t, i) => (
            <div
              key={i}
              style={styles.suggestionItem}
              onClick={() => addTablet(t)}
            >
              ➕ {t}
            </div>
          ))}
        </div>
      )}

      {/* TABLET LIST */}
      <ul style={styles.list}>
        {tablets.map((tablet, index) => (
          <li key={index} style={styles.item}>
            💊 {tablet}
            <button
              style={styles.deleteBtn}
              onClick={() => removeTablet(index)}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>

      {onBack && (
        <button style={styles.backBtn} onClick={onBack}>
          ← Back to Dashboard
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "white",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  suggestions: {
    border: "1px solid #ddd",
    marginTop: 5,
    borderRadius: 6,
  },
  suggestionItem: {
    padding: 8,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: 15,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "red",
  },
  backBtn: {
    marginTop: 15,
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};


