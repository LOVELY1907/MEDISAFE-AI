import { useEffect, useState } from "react";
import api from "../services/api";

export default function AddTablet() {
  // 🔹 Tablet search states
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedTablet, setSelectedTablet] = useState("");

  // 🔹 Purpose states
  const [purposes, setPurposes] = useState([]);
  const [selectedPurposes, setSelectedPurposes] = useState([]);

  // 🔹 UI feedback
  const [message, setMessage] = useState("");

  // 🔍 Search tablet from OpenFDA
  const searchTablet = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await api.get(`/tablet/search?name=${value}`);
      setResults(res.data || []);
    } catch {
      setResults([]);
    }
  };

  // 🎯 Fetch purposes when tablet is selected
  useEffect(() => {
    if (!selectedTablet) return;

    const fetchPurposes = async () => {
      try {
        const res = await api.get(
          `/tablet/purpose?name=${selectedTablet}`
        );
        setPurposes(Array.isArray(res.data) ? res.data : []);
      } catch {
        setPurposes([]);
      }
    };

    fetchPurposes();
  }, [selectedTablet]);

  // ☑️ Toggle purpose checkbox
  const togglePurpose = (purpose) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose]
    );
  };

  // 💾 Save tablet to backend
  const saveTablet = async () => {
    try {
      await api.post(
        "/tablet/add",
        {
          tabletName: selectedTablet,
          purposes: selectedPurposes
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setMessage("✅ Tablet saved successfully");
      setQuery("");
      setResults([]);
      setSelectedTablet("");
      setPurposes([]);
      setSelectedPurposes([]);
    } catch (err) {
      console.error("Save error:", err);
      setMessage("❌ Failed to save tablet");
    }
  };

  return (
    <div>
      <h3>Add Tablet</h3>

      {/* 🔍 Tablet Search */}
      <input
        placeholder="Search tablet name"
        value={query}
        onChange={searchTablet}
      />

      {/* 🔽 Search Results */}
      {results.length > 0 && (
        <ul>
          {results.map((t, i) => {
            const name =
              t.openfda?.brand_name?.[0] ||
              t.openfda?.generic_name?.[0];

            return (
              <li
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedTablet(name);
                  setQuery(name);
                  setResults([]);
                  setSelectedPurposes([]);
                }}
              >
                {name}
              </li>
            );
          })}
        </ul>
      )}

      {/* ☑️ Purpose Section */}
      {selectedTablet && (
        <>
          <h4>Purpose for {selectedTablet}</h4>

          {purposes.length > 0 ? (
            purposes.map((p, i) => (
              <div key={i}>
                <input
                  type="checkbox"
                  checked={selectedPurposes.includes(p)}
                  onChange={() => togglePurpose(p)}
                />
                <label>{p}</label>
              </div>
            ))
          ) : (
            <>
              <p style={{ color: "orange" }}>
                No official purpose data available.
              </p>

              <input
                placeholder="Enter purpose manually and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    setSelectedPurposes((prev) => [
                      ...prev,
                      e.target.value.trim()
                    ]);
                    e.target.value = "";
                  }
                }}
              />
            </>
          )}

          <br />

          <button
            disabled={selectedPurposes.length === 0}
            onClick={saveTablet}
          >
            Save Tablet
          </button>
        </>
      )}

      {/* 📢 Status Message */}
      {message && <p>{message}</p>}
    </div>
  );
}
