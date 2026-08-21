import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDestinations } from "../../api/destinationApi";

export default function DestinationList() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Destination API error:", err);
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, []);

  if (loading) {
    return <p>Loading destinations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Web Based Tour Guide</h1>
      <h2>Destinations</h2>

      {destinations.length === 0 ? (
        <p>No destinations found.</p>
      ) : (
        destinations.map((destination) => (
          <div key={destination.id}>
            <h3>{destination.name}</h3>
            <p>{destination.description}</p>

            <Link to={`/destinations/${destination.id}`}>
              View Details
            </Link>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}