import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tablet() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [selectedTablet, setSelectedTablet] = useState(null);
    const [purposes, setPurposes] = useState([]);
    const [selectedPurposes, setSelectedPurposes] = useState([]);
    const [savedTablets, setSavedTablets] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ---------------------------
       SEARCH TABLETS (FDA)
    ---------------------------- */
    useEffect(() => {
        if (search.length < 2) {
            setResults([]);
            return;
        }

        const fetchSearch = async () => {
            try {
                const res = await api.get(`/tablet/search?name=${search}`);
                setResults(res.data || []);
            } catch (err) {
                console.error("Search error", err);
            }
        };

        fetchSearch();
    }, [search]);

    /* ---------------------------
       SELECT TABLET
    ---------------------------- */
    const selectTablet = async (tablet) => {
        const name =
            tablet.openfda?.brand_name?.[0] ||
            tablet.openfda?.generic_name?.[0];

        setSelectedTablet(name);
        setSelectedPurposes([]);
        setPurposes([]);

        try {
            const res = await api.get(`/tablet/purpose?name=${name}`);
            setPurposes(res.data || []);
        } catch (err) {
            console.error("Purpose fetch error", err);
        }
    };

    /* ---------------------------
       TOGGLE PURPOSE CHECKBOX
    ---------------------------- */
    const togglePurpose = (purpose) => {
        setSelectedPurposes((prev) =>
            prev.includes(purpose)
                ? prev.filter((p) => p !== purpose)
                : [...prev, purpose]
        );
    };

    /* ---------------------------
       SAVE TABLET
    ---------------------------- */
    const saveTablet = async () => {
        if (!selectedTablet || selectedPurposes.length === 0) {
            alert("Select tablet and at least one purpose");
            return;
        }

        try {
            setLoading(true);

            await api.post("/tablet/add", {
                tabletName: selectedTablet,
                purposes: selectedPurposes,
            });

            alert("Tablet saved ✅");

            setSelectedTablet(null);
            setPurposes([]);
            setSelectedPurposes([]);
            setSearch("");
            setResults([]);

            fetchSavedTablets();
        } catch (err) {
            console.error("Save error", err);
            alert("Failed to save tablet ❌");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------------
       FETCH SAVED TABLETS
    ---------------------------- */
    const fetchSavedTablets = async () => {
        try {
            const res = await api.get("/tablet/list");
            setSavedTablets(res.data || []);
        } catch (err) {
            console.error("Fetch saved tablets error", err);
        }
    };

    useEffect(() => {
        fetchSavedTablets();
    }, []);

    /* ---------------------------
       UI
    ---------------------------- */
    return (
        <div style={{ padding: "20px" }}>
            <h2>Add Tablet</h2>

            <input
                type="text"
                placeholder="Search tablet name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "10px" }}
            />

            {/* SEARCH RESULTS */}
            {results.length > 0 && (
                <div style={{ border: "1px solid #ccc", marginTop: "10px" }}>
                    {results.map((r, i) => (
                        <div
                            key={i}
                            style={{ padding: "8px", cursor: "pointer" }}
                            onClick={() => selectTablet(r)}
                        >
                            {r.openfda?.brand_name?.[0] ||
                                r.openfda?.generic_name?.[0]}
                        </div>
                    ))}
                </div>
            )}

            {/* PURPOSES */}
            {purposes.length > 0 && (
                <>
                    <h3>Purpose</h3>
                    {purposes.map((p, i) => (
                        <label key={i} style={{ display: "block" }}>
                            <input
                                type="checkbox"
                                checked={selectedPurposes.includes(p)}
                                onChange={() => togglePurpose(p)}
                            />
                            {p}
                        </label>
                    ))}

                    <button onClick={saveTablet} disabled={loading}>
                        {loading ? "Saving..." : "Save Tablet"}
                    </button>
                </>
            )}
            <button
                onClick={async () => {
                    const res = await api.post("/tablet/analysis", {
                        tabletName: t.tabletName,
                        purposes: t.purposes,
                    });
                    alert(res.data.result);
                }}
            >
                Advantages & Side Effects
            </button>
            <button
                onClick={async () => {
                    const names = savedTablets.map(t => t.tabletName);
                    const res = await api.post("/tablet/interaction", {
                        tablets: names,
                    });
                    alert(res.data.result);
                }}
            >
                Combined Tablet Effect
            </button>



            {/* SAVED TABLETS */}
            <hr />
            <h2>Saved Tablets</h2>

            {savedTablets.length === 0 && <p>No tablets saved</p>}

            {savedTablets.map((t) => (
                <div
                    key={t.id}
                    style={{ border: "1px solid #aaa", marginBottom: "10px", padding: "10px" }}
                >
                    <strong>{t.tabletName}</strong>
                    <ul>
                        {t.purposes.map((p, i) => (
                            <li key={i}>{p}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

const res = await api.post("/tablet/analysis", {
  tabletName: t.tabletName,
  purposes: t.purposes
});

alert(res.data.result);
