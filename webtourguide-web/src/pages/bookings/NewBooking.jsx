import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";

export default function NewBooking() {
  const [form, setForm] = useState({ packageId: "", guideId: "", bookingDate: "", participants: 1 });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        packageId: Number(form.packageId),
        guideId: form.guideId ? Number(form.guideId) : undefined,
        bookingDate: form.bookingDate,
        participants: Number(form.participants),
      };
      await createBooking(payload);
      navigate("/bookings/my");
    } catch (err) {
      setError(err.response?.data?.error || "Could not create booking");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="page">
      <h1>Book a Tour Package</h1>
      {error && <p className="error">{error}</p>}
      <input name="packageId" type="number" placeholder="Package ID" onChange={handleChange} required />
      <input name="guideId" type="number" placeholder="Guide ID (optional)" onChange={handleChange} />
      <input name="bookingDate" type="date" onChange={handleChange} required />
      <input name="participants" type="number" min="1" value={form.participants} onChange={handleChange} required />
      <button type="submit">Book Now</button>
    </form>
  );
}
