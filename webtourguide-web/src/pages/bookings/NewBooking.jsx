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
  }
}
