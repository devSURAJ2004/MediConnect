import { useEffect, useState } from "react";
import api from "../services/api.js";

function Prescription() {
    const [file, setFile] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchPrescriptions = async () => {
        try {
            setFetching(true);

            const response = await api.get(
                "/prescriptions/my-prescriptions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPrescriptions(response.data.prescriptions || []);

        } catch (error) {
            console.error(error);
            setError("Failed to load prescriptions");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        setMessage("");
        setError("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Only JPG, PNG and PDF files are allowed.");
            setFile(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5 MB.");
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            setError("Please select a prescription first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setError("");

            const formData = new FormData();

            // IMPORTANT:
            // This name must match upload.single("prescription")
            formData.append("prescription", file);

            await api.post(
                "/prescriptions",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Prescription uploaded successfully.");
            setFile(null);

            // Reset file input
            event.target.reset();

            await fetchPrescriptions();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to upload prescription."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container page">

            <div className="prescription-upload-card">

                <div className="prescription-header">
                    <div className="prescription-icon">
                        📋
                    </div>

                    <h1>Upload Prescription</h1>

                    <p>
                        Upload your prescription and we'll help you
                        find the medicines you need.
                    </p>
                </div>

                <form onSubmit={handleUpload}>

                    <label className="file-upload-area">

                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileChange}
                            hidden
                        />

                        <div className="upload-icon">
                            📄
                        </div>

                        <h3>
                            {file
                                ? file.name
                                : "Choose your prescription"}
                        </h3>

                        <p>
                            JPG, PNG or PDF • Maximum 5 MB
                        </p>

                    </label>

                    {file && (
                        <div className="selected-file">
                            <span>📎 {file.name}</span>

                            <span>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                    )}

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="success">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="upload-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Uploading..."
                            : "Upload Prescription"}
                    </button>

                </form>

            </div>


            <div className="prescription-history-card">

                <div className="prescription-history-header">
                    <h2>My Prescriptions</h2>

                    <p>
                        Your previously uploaded prescriptions
                    </p>
                </div>

                {fetching ? (
                    <p>Loading prescriptions...</p>
                ) : prescriptions.length === 0 ? (
                    <div className="empty-prescriptions">
                        <div>📄</div>
                        <p>No prescriptions uploaded yet.</p>
                    </div>
                ) : (
                    <div className="prescription-list">

                        {prescriptions.map((prescription) => (

                            <div
                                className="prescription-item"
                                key={prescription._id}
                            >

                                <div>
                                    <strong>
                                        Prescription
                                    </strong>

                                    <p>
                                        {new Date(
                                            prescription.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="prescription-actions">

                                    {prescription.fileUrl && (
                                        <a
                                            href={prescription.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="details-button"
                                        >
                                            View
                                        </a>
                                    )}

                                    <span
                                        className={`prescription-status ${
                                            prescription.status || "pending"
                                        }`}
                                    >
                                        {prescription.status || "Pending"}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Prescription;