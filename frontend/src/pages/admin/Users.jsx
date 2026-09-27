import { useEffect, useState } from "react";
import api from "../../services/api.js";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(response.data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const changeRole = async (id, role) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/admin/users/${id}/role`,
                { role },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchUsers();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update role"
            );
        }
    };

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await api.delete(
                `/admin/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchUsers();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };

    if (loading) {
        return <h2>Loading users...</h2>;
    }

    return (
        <div style={{ padding: "30px 50px" }}>

            <h1>Users</h1>

            {users.map((user) => (

                <div key={user._id}>

                    <h3>{user.name}</h3>

                    <p>
                        {user.email}
                    </p>

                    <p>
                        Role: {user.role}
                    </p>

                    <button
                        onClick={() =>
                            changeRole(
                                user._id,
                                user.role === "user"
                                    ? "admin"
                                    : "user"
                            )
                        }
                    >
                        Make{" "}
                        {user.role === "user"
                            ? "Admin"
                            : "User"}
                    </button>

                    <button
                        onClick={() =>
                            deleteUser(user._id)
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

export default Users;