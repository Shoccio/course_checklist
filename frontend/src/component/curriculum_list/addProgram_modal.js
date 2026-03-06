import React, {useState} from "react";

export default function AddProgramModal({handleAddProgram, setShowAddProgramModal}){
    const [newProgramName, setNewProgramName] = useState("");

    function addProgram(){
        handleAddProgram(newProgramName);
        setNewProgramName("");
    };
    
    return(
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "500px",
                width: "90%",
            }}>
                <h2>Add Program</h2>
                
                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                        Program Name:
                    </label>
                    <input
                        type="text"
                        value={newProgramName}
                        onChange={(e) => setNewProgramName(e.target.value)}
                        placeholder="Enter program name"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            fontSize: "1rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            boxSizing: "border-box",
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                addProgram();
                            }
                        }}
                    />
                </div>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => {
                            setShowAddProgramModal(false);
                            setNewProgramName("");
                        }}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={addProgram}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}