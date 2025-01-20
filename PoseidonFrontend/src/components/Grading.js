import React, { useState } from "react";
import axios from "axios";

const GradingApp = () => {
    const [gradingResult, setGradingResult] = useState(null);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [answerFile, setAnswerFile] = useState(null); // State for answer file
    const [handwritingSampleFile, setHandwritingSampleFile] = useState(null); // State for handwriting sample
    const [category, setCategory] = useState(""); // Dropdown for categories
    const [aiInstruction, setAiInstruction] = useState(""); // Text input for AI instruction

    const API_URL = "https://2805-2620-8d-8000-e018-58a7-4fc8-c579-d777.ngrok-free.app/grade";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setGradingResult(null);

        try {
            if (!file || !category || !aiInstruction) {
                setError("Please upload a file, select a category, and provide instructions for the AI.");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("answerFile", answerFile); // Include answer file
            formData.append("handwritingSampleFile", handwritingSampleFile); // Include handwriting sample
            formData.append("category", category);
            formData.append("instruction", aiInstruction);

            const response = await axios.post(API_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setGradingResult(response.data.grading_result);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Grading App</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Upload File:
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Upload Answer File (optional):
                        <input
                            type="file"
                            onChange={(e) => setAnswerFile(e.target.files[0])}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Upload Handwritten Sample (optional):
                        <input
                            type="file"
                            onChange={(e) => setHandwritingSampleFile(e.target.files[0])}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Select Subject:
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">--Select--</option>
                            <option value="essay">Essay</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="physics">Physics</option>
                            <option value="math">Math</option>
                            <option value="code">Code</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        AI Instruction:
                        <input
                            type="text"
                            value={aiInstruction}
                            onChange={(e) => setAiInstruction(e.target.value)}
                            placeholder="Instructions for AI"
                            required
                        />
                    </label>
                </div>
                <button type="submit">Grade</button>
            </form>

            {gradingResult && (
                <div>
                    <h2>Grading Result</h2>
                    <p>{gradingResult}</p>
                </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default GradingApp;
