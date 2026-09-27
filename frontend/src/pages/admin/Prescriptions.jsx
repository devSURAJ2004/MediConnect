import { useEffect, useState } from "react";
import api from "../../services/api.js";

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPrescriptions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/prescriptions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPrescriptions(
                response.data.prescriptions
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const updateStatus = async (
        id,
        status
    ) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/admin/prescriptions/${id}/status`,
                {
                    status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchPrescriptions();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update prescription"
            );
        }
    };

    if (loading) {
        return <h2>Loading prescriptions...</h2>;
    }

    return (
        <div style={{ padding: "30px 50px" }}>

            <h1>Manage Prescriptions</h1>

            {prescriptions.length === 0 && (
                <p>No prescriptions found.</p>
            )}

            {prescriptions.map(
                (prescription) => (

                    <div
                        key={prescription._id}
                    >

                        <p>
                            User:{" "}
                            {prescription.user?.name}
                        </p>

                        <p>
                            Email:{" "}
                            {prescription.user?.email}
                        </p>

                        <p>
                            Status:{" "}
                            {prescription.status}
                        </p>

                        <a
                            href={
                                prescription.imageUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            View Prescription
                        </a>

                        <br />

                        <button
                            onClick={() =>
                                updateStatus(
                                    prescription._id,
                                    "approved"
                                )
                            }
                        >
                            Approve
                        </button>

                        <button
                            onClick={() =>
                                updateStatus(
                                    prescription._id,
                                    "rejected"
                                )
                            }
                        >
                            Reject
                        </button>

                        <hr />

                    </div>

                )
            )}

        </div>
    );
}

export default Prescriptions;