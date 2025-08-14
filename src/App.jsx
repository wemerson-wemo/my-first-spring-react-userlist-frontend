import { useEffect, useState } from "react";

export default function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const ac = new AbortController();

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch("http://localhost:8080/api/users", {
                    signal: ac.signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setUsers(data);
            } catch (e) {
                if (e.name !== "AbortError") setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        load();
        return () => ac.abort();
    }, []);

    if (loading) {
        return (
            <main style={{ fontFamily: "system-ui, sans-serif", margin: "2rem auto", maxWidth: 600 }}>
                <h1>Benutzerliste</h1>
                <p>Wird geladen …</p>
            </main>
        );
    }

    if (error) {
        return (
            <main style={{ fontFamily: "system-ui, sans-serif", margin: "2rem auto", maxWidth: 600 }}>
                <h1>Benutzerliste</h1>
                <p style={{ color: "crimson" }}>Fehler: {error}</p>
            </main>
        );
    }

    return (
        <main style={{ fontFamily: "system-ui, sans-serif", margin: "2rem auto", maxWidth: 600 }}>
            <h1>Benutzerliste</h1>
            {users.length === 0 ? (
                <p>Keine Benutzer gefunden.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {users.map((u) => (
                        <li key={u.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
                            <strong>{u.name}</strong>
                            <div><a href={`mailto:${u.email}`}>{u.email}</a></div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
