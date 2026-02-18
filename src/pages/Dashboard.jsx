import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [tablets, setTablets] = useState(
    JSON.parse(localStorage.getItem("tablets")) || []
  );

  const [newTablet, setNewTablet] = useState("");
  const [tabletImage, setTabletImage] = useState(null);

  const [reminders, setReminders] = useState(
    JSON.parse(localStorage.getItem("reminders")) || []
  );

  const [selectedTablets, setSelectedTablets] = useState([]);
  const [risk, setRisk] = useState(0);

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile")) || {
      name: "Lovely",
      age: "",
      dob: "",
      email: "",
      phone: "",
      medical: "",
      allergies: "",
      emergencyName: "",
      emergencyPhone: "",
      doctorName: "",
      doctorPhone: "",
    }
  );

  useEffect(() => {
    localStorage.setItem("tablets", JSON.stringify(tablets));
  }, [tablets]);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // ---------------- TABLETS ----------------

  const handleAddTablet = () => {
    if (!newTablet.trim()) return;

    const newEntry = {
      name: newTablet,
      image: tabletImage || null,
    };

    setTablets([...tablets, newEntry]);
    setNewTablet("");
    setTabletImage(null);
  };

  const handleDeleteTablet = (index) => {
    setTablets(tablets.filter((_, i) => i !== index));
  };

  // ---------------- REMINDERS ----------------

  const handleAddReminder = (tablet, time) => {
    if (!tablet || !time) return;
    setReminders([...reminders, { tablet, time }]);
  };

  const handleDeleteReminder = (index) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  // ---------------- INTERACTION (UNCHANGED) ----------------

  const handleSelectTablet = (tablet) => {
    setSelectedTablets((prev) =>
      prev.includes(tablet)
        ? prev.filter((t) => t !== tablet)
        : [...prev, tablet]
    );
  };

  const calculateRisk = () => {
    if (selectedTablets.length < 2) {
      alert("Select at least 2 tablets");
      return;
    }
    const calculatedRisk = Math.min(selectedTablets.length * 25, 100);
    setRisk(calculatedRisk);
  };

  const needleRotation = `rotate(${(risk / 100) * 180 - 90}deg)`;

const getRiskLevel = () => {
  if (risk <= 25) return "Low";
  if (risk <= 75) return "Medium";
  return "High";
};

  return (
    <div className="dashboard-wrapper">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div>
          <h2>MediSafe AI</h2>

          <div className="profile-mini" onClick={() => setProfileOpen(true)}>
            <div className="avatar">{profile.name[0]}</div>
            <div>
              <p>{profile.name}</p>
              <small>View Profile</small>
            </div>
          </div>

          <ul>
            {[
              ["dashboard", "Dashboard"],
              ["add", "Add Tablet"],
              ["tablets", "Your Tablets"],
              ["reminders", "Reminders"],
              ["interaction", "Interaction"],
              ["assistant", "AI Assistant"],
            ].map(([key, label]) => (
              <li
                key={key}
                className={activeTab === key ? "active" : ""}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="live-risk">
          Live Risk: <span>{risk}%</span>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <h1>Welcome back {profile.name} 👋</h1>

        {/* ADD TABLET */}
        {(activeTab === "dashboard" || activeTab === "add") && (
          <div className="card">
            <h2>Add Tablet</h2>

            <input
              value={newTablet}
              onChange={(e) => setNewTablet(e.target.value)}
              placeholder="Tablet name"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageURL = URL.createObjectURL(file);
                  setTabletImage(imageURL);
                  if (!newTablet) {
                    setNewTablet(file.name.split(".")[0]);
                  }
                }
              }}
            />

            {tabletImage && (
              <img src={tabletImage} alt="preview" width="120" />
            )}

            <button onClick={handleAddTablet}>Add Tablet</button>
          </div>
        )}

        {/* YOUR TABLETS */}
        {(activeTab === "dashboard" || activeTab === "tablets") && (
          <div className="card">
            <h2>Your Tablets</h2>

            {tablets.map((t, i) => (
              <div key={i} className="tablet-row">
                <div>
                  <strong>{t.name}</strong>
                  {t.image && <br />}
                  {t.image && <img src={t.image} width="60" alt="" />}
                </div>

                <button onClick={() => handleDeleteTablet(i)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* REMINDERS */}
        {(activeTab === "dashboard" || activeTab === "reminders") && (
          <div className="card">
            <h2>Reminders</h2>

            <select id="tabletSelect">
              <option value="">Select Tablet</option>
              {tablets.map((t, i) => (
                <option key={i} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <input type="time" id="remTime" />

            <button
              onClick={() =>
                handleAddReminder(
                  document.getElementById("tabletSelect").value,
                  document.getElementById("remTime").value
                )
              }
            >
              Add Reminder
            </button>

            {reminders.map((r, i) => (
              <div key={i} className="tablet-row">
                {r.tablet} - {r.time}
                <button onClick={() => handleDeleteReminder(i)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* INTERACTION — UNCHANGED */}
        {(activeTab === "dashboard" || activeTab === "interaction") && (
          <div className="card">
            <h2>Drug Interaction</h2>

            {tablets.map((t, i) => (
              <div key={i}>
                <input
                  type="checkbox"
                  checked={selectedTablets.includes(t.name)}
                  onChange={() => handleSelectTablet(t.name)}
                />{" "}
                {t.name}
              </div>
            ))}

            <button onClick={calculateRisk}>Analyze</button>

            <div className="speedometer">
  <div className="needle" style={{ transform: needleRotation }} />
</div>

<div style={{ textAlign: "center", marginTop: "15px" }}>
  <h3>{risk}% Risk</h3>
  <p style={{ fontWeight: "600" }}>
    {getRiskLevel()} Risk
  </p>
</div>
          </div>
        )}

        {/* AI ASSISTANT — UNCHANGED */}
        {activeTab === "assistant" && (
          <div className="card">
            <h2>MediSafe Assistant</h2>

            <p>You can now chat with the AI MediSafe Assistant.</p>
            <small style={{ color: "#666" }}>
              Note: Ask only health or healthcare related questions.
            </small>

            <div className="assistant-big">
              <input id="assistantInputBig" placeholder="Type here..." />

              <button
  onClick={() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById("assistantInputBig");
      if (input) input.value = transcript;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Microphone error: " + event.error);
    };

    recognition.start();
  }}
>
  🎤
</button>
            </div>

            <input type="file" />
          </div>
        )}
      </div>

      {/* FLOATING ASSISTANT (UNCHANGED) */}
      <div className="assistant-float" onClick={() => setAssistantOpen(true)}>
        💬
      </div>

      {assistantOpen && (
        <div className="assistant-box">
          <h3>MediSafe Assistant</h3>
          <input id="assistantInput" placeholder="Type here..." />
          <button>🎤</button>
          <input type="file" />
          <button onClick={() => setAssistantOpen(false)}>Close</button>
        </div>
      )}

      {/* PROFILE MODAL */}
      {profileOpen && (
        <div className="profile-modal">
          <div className="profile-content">
            <h2>Profile</h2>
            {Object.keys(profile).map((key) => (
              <input
                key={key}
                placeholder={key}
                value={profile[key]}
                onChange={(e) =>
                  setProfile({ ...profile, [key]: e.target.value })
                }
              />
            ))}
            <button onClick={() => setProfileOpen(false)}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}