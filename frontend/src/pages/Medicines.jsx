import { useEffect, useState } from "react";
import api from "../services/api.js";
import MedicineCard from "../components/MedicineCard.jsx";

function Medicines() {
    const [medicines, setMedicines] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchMedicines = async (searchValue = "") => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/medicines",
                {
                    params: {
                        search: searchValue
                    }
                }
            );

            setMedicines(
                response.data.medicines
            );

        } catch (error) {
            console.error(error);

            setError(
                "Failed to load medicines"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        fetchMedicines(search);
    };

    return (
        <div className="container page">

            <h1 className="page-title">
                Find Your Medicines
            </h1>

            <form
                className="search-box"
                onSubmit={handleSearch}
            >

                <input
                    type="text"
                    placeholder="Search medicine..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button type="submit">
                    Search
                </button>

            </form>

            {loading && (
                <p>Loading medicines...</p>
            )}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                medicines.length === 0 && (
                    <p>
                        No medicines found.
                    </p>
                )}

            <div className="medicine-grid">

                {medicines.map((medicine) => (
                    <MedicineCard
                        key={medicine._id}
                        medicine={medicine}
                    />
                ))}

            </div>

        </div>
    );
}

export default Medicines;