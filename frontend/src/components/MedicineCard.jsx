import { Link } from "react-router-dom";

function MedicineCard({ medicine }) {
    return (
        <div className="medicine-card">

            {medicine.image ? (
                <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="medicine-image"
                />
            ) : (
                <div className="medicine-placeholder">
                    💊
                </div>
            )}

            <div className="medicine-info">

                <h2>{medicine.name}</h2>

                <p className="medicine-category">
                    {medicine.category}
                </p>

                <p className="medicine-description">
                    {medicine.description}
                </p>

                <p className="medicine-manufacturer">
                    {medicine.manufacturer}
                </p>

                <div className="medicine-bottom">

                    <span className="price">
                        ₹{medicine.price}
                    </span>

                    <span className="stock">
                        {medicine.stock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                    </span>

                </div>

                {medicine.requiresPrescription && (
                    <p className="prescription-required">
                        Prescription Required
                    </p>
                )}

                <Link
                    to={`/medicines/${medicine._id}`}
                    className="details-button"
                >
                    View Details
                </Link>

            </div>

        </div>
    );
}

export default MedicineCard;