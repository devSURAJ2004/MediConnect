import { useEffect, useState } from "react";
import api from "../../services/api.js";

function Medicines() {
    const [medicines, setMedicines] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        manufacturer: "",
        category: "",
        price: "",
        stock: "",
        image: "",
        requiresPrescription: false
    });

    const fetchMedicines = async () => {
        try {
            const response = await api.get("/medicines");

            setMedicines(response.data.medicines);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox"
                ? checked
                : value
        });
    };

    const createMedicine = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/medicines",
                {
                    ...form,
                    price: Number(form.price),
                    stock: Number(form.stock)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setForm({
                name: "",
                description: "",
                manufacturer: "",
                category: "",
                price: "",
                stock: "",
                image: "",
                requiresPrescription: false
            });

            fetchMedicines();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create medicine"
            );
        }
    };

    const deleteMedicine = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await api.delete(
                `/medicines/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchMedicines();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete medicine"
            );
        }
    };

    return (
        <div style={{ padding: "30px 50px" }}>

            <h1>Manage Medicines</h1>

            <form onSubmit={createMedicine}>

                <input
                    name="name"
                    placeholder="Medicine Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />

                <input
                    name="manufacturer"
                    placeholder="Manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    required
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />

                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                />

                <input
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                />

                <label>
                    <input
                        name="requiresPrescription"
                        type="checkbox"
                        checked={
                            form.requiresPrescription
                        }
                        onChange={handleChange}
                    />

                    Prescription Required
                </label>

                <button type="submit">
                    Add Medicine
                </button>

            </form>

            <hr />

            <h2>Medicine List</h2>

            {medicines.map((medicine) => (

                <div key={medicine._id}>

                    <h3>
                        {medicine.name}
                    </h3>

                    <p>
                        ₹{medicine.price}
                    </p>

                    <p>
                        Stock: {medicine.stock}
                    </p>

                    <button
                        onClick={() =>
                            deleteMedicine(
                                medicine._id
                            )
                        }
                    >
                        Delete
                    </button>

                    <hr />

                </div>

            ))}

        </div>
    );
}

export default Medicines;