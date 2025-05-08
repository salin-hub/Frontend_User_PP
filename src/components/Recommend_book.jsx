import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios_api from "../API/axios";
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Alert } from "@mui/material";

function Recommendations() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Retrieve token from localStorage
  const token = localStorage.getItem("authToken");
  console.log("Token Retrieved:", token);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) {
        console.error("No auth token found, redirecting...");
        navigate("/");
        return;
      }

      try {
        const response = await axios_api.get("/recommendations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Recommendations Data:", response.data.data);
        setBooks(response.data.data); // Store books in state
      } catch (err) {
        console.error("Error fetching recommendations:", err.response || err);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token, navigate]); // Add token & navigate as dependencies

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Book Recommendations
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : books.length === 0 ? (
        <Alert severity="info">No recommendations found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography color="textSecondary">Genre: {book.genre}</Typography>
                  <Typography color="textSecondary">Author: {book.author}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Recommendations;
