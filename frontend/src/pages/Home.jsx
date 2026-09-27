import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <section className="hero">

                <h1>
                    Your Medicines,
                    Delivered Simply.
                </h1>

                <p>
                    MediConnect helps you find medicines,
                    manage prescriptions, place orders,
                    and track your medicines from one place.
                </p>

                <Link
                    to="/medicines"
                    className="primary-button"
                >
                    Browse Medicines
                </Link>

            </section>

            <section className="container page">

                <h2 className="page-title">
                    Why MediConnect?
                </h2>

                <div className="medicine-grid">

                    <div className="medicine-card">
                        <h2>💊 Medicines</h2>

                        <p>
                            Search and explore medicines
                            easily.
                        </p>
                    </div>

                    <div className="medicine-card">
                        <h2>📋 Prescription</h2>

                        <p>
                            Upload your prescription
                            securely.
                        </p>
                    </div>

                    <div className="medicine-card">
                        <h2>📦 Orders</h2>

                        <p>
                            Place orders and track
                            their status.
                        </p>
                    </div>

                </div>

            </section>
        </>
    );
}

export default Home;