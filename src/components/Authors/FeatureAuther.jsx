
import { Card, CardContent, CardMedia, Typography, Grid, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios_api from "../../API/axios";
import LinearProgress from '@mui/material/LinearProgress';
const FeaturedAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await axios_api.get('getauthors');
      setAuthors(response.data.authors);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An error occurred while fetching authors');
    } finally {
      setLoading(false);
    }
  };
  const handleBookClick = (AuthorID) => {
    navigate(`/author/${AuthorID}`);
};

  useEffect(() => {
    fetchAuthors();
  }, []);
  if (loading) return(
    <><LinearProgress />
    <div style={{height:"500px"}}>

    </div>
    </>
  
);
    if (error) return <p>Error: {error}</p>;
  return (
    <Grid container spacing={3} sx={{ padding: "20px" }}>
      {authors.map((author, index) => (
        <Grid item xs={12} sm={6} key={index} sx={{ "&:hover": { transform: "scale(1.05)", transition: "0.3s" }}}>
          <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
            <div className="profile_aut">
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, borderRadius: "50%", background: "red" }}
                image={author.image}
                alt={author.name}
              />
            </div>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {author.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden" }}>
                {author.description}
              </Typography>
              <Button size="small" color="error"  onClick={() => handleBookClick(author.id)}>Read More</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturedAuthors;
