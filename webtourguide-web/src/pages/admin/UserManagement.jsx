import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUsers, updateUser, deleteUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

const ROLES = ["TOURIST", "TOUR_GUIDE", "STAFF", "ADMIN"];

const ROLE_META = {
  TOURIST: { bg: "#e8f0fe", color: "#144a9e", border: "#a9c6f0" },
  TOUR_GUIDE: { bg: "#e6f7ed", color: "#0d8a4f", border: "#a9dfbf" },
  STAFF: { bg: "#f3e8ff", color: "#6c3483", border: "#c39bd3" },
  ADMIN: { bg: "#fff3e8", color: "#d86816", border: "#f5cba7" },
};

function RoleBadge({ role }) {
  const meta = ROLE_META[role] || { bg: "#f0f0f0", color: "#555", border: "#ccc" };
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 700, letterSpacing: "0.4px",
      background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
    }}>
      {role.replace("_", " ")}
    </span>
  );
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", phone: "", role: "TOURIST" });
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Load users error:", err);
      setError("Failed to load users. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function startEdit(u) {
    setActionError("");
    setEditingId(u.id);
    setEditForm({ fullName: u.fullName, email: u.email, phone: u.phone || "", role: u.role });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(id) {
    setActionError("");
    setSaving(true);
    try {
      const updated = await updateUser(id, {
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim() || null,
        role: editForm.role,
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      setEditingId(null);
    } catch (err) {
      console.error("Update user error:", err);
      setActionError(err.response?.data?.message || err.response?.data?.error || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(`Permanently delete ${u.fullName} (${u.email})?`)) return;
    setActionError("");
    try {
      await deleteUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      console.error("Delete user error:", err);
      setActionError(err.response?.data?.message || err.response?.data?.error || "Failed to delete user.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="destinations-hero">
        <div className="destinations-hero-overlay">
          <div className="container text-center">
            <h1 className="destinations-hero-title">Manage Users</h1>
            <p className="destinations-hero-subtitle">
              View, edit, and remove user accounts across the platform.
            </p>
          </div>
        </div>
      </div>

      <section className="layout_padding" style={{ backgroundColor: "#fbfbfb" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div className="heading_container text-left" style={{ alignItems: "flex-start" }}>
              <h2 className="text-dark m-0">
                All Users <span className="badge badge-primary ml-2" style={{ fontSize: 14, verticalAlign: "middle" }}>{users.length}</span>
              </h2>
              <p className="text-muted mt-1">Every registered account, across every role.</p>
            </div>
          </div>

          {actionError && <div className="alert alert-danger mb-4">{actionError}</div>}

          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading users...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: 600 }}>
              <p>{error}</p>
              <button onClick={refresh} className="btn-nav-custom mt-2">Retry</button>
            </div>
          ) : (
            <div className="compare-table-container">
              <table className="package-compare-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th style={{ minWidth: 180 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      {editingId === u.id ? (
                        <>
                          <td style={{ fontWeight: 600, color: "#144a9e" }}>#{u.id}</td>
                          <td>
                            <input
                              type="text" name="fullName" className="tripbiz-input"
                              style={{ padding: "6px 10px", fontSize: 13 }}
                              value={editForm.fullName} onChange={handleEditChange} disabled={saving}
                            />
                          </td>
                          <td>
                            <input
                              type="email" name="email" className="tripbiz-input"
                              style={{ padding: "6px 10px", fontSize: 13 }}
                              value={editForm.email} onChange={handleEditChange} disabled={saving}
                            />
                          </td>
                          <td>
                            <input
                              type="text" name="phone" className="tripbiz-input"
                              style={{ padding: "6px 10px", fontSize: 13 }}
                              value={editForm.phone} onChange={handleEditChange} disabled={saving}
                            />
                          </td>
                          <td>
                            <select
                              name="role" className="tripbiz-input"
                              style={{ padding: "6px 10px", fontSize: 13 }}
                              value={editForm.role} onChange={handleEditChange} disabled={saving}
                            >
                              {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                            </select>
                          </td>
                          <td>
                            <div className="d-flex" style={{ gap: 6 }}>
                              <button
                                onClick={() => handleSave(u.id)}
                                className="btn btn-sm"
                                disabled={saving}
                                style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, backgroundColor: "#0d8a4f", borderColor: "#0d8a4f", color: "#fff" }}
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="btn-outline-custom"
                                disabled={saving}
                                style={{ padding: "4px 12px", fontSize: 12 }}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ fontWeight: 600, color: "#144a9e" }}>#{u.id}</td>
                          <td><strong>{u.fullName}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.phone || <span className="text-muted">—</span>}</td>
                          <td><RoleBadge role={u.role} /></td>
                          <td>
                            <div className="d-flex" style={{ gap: 6 }}>
                              <button
                                onClick={() => startEdit(u)}
                                className="btn btn-sm btn-primary"
                                style={{ borderRadius: 20, fontWeight: 600, fontSize: 12, backgroundColor: "#144a9e", borderColor: "#144a9e" }}
                              >
                                Edit
                              </button>
                              {currentUser?.email?.toLowerCase() !== u.email.toLowerCase() && (
                                <button
                                  onClick={() => handleDelete(u)}
                                  className="btn-outline-custom"
                                  style={{ padding: "4px 12px", fontSize: 12, color: "#c0392b", borderColor: "#c0392b" }}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
