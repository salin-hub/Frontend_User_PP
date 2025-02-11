import { useState } from "react";
import {
    Box, Typography, TextField, Button, Rating, FormControlLabel, Checkbox,
    Select, MenuItem, Grid, Paper, Chip
} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const tags = ["Classic", "Inspirational", "Family", "Tear Jerker", "Laughed Out Loud", "Being in Love", 
              "Strong Female Protagonist", "Beach Read", "High School", "Cultural", "Trending"];

const ReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);
    const [review, setReview] = useState({ title: "", content: "", username: "", location: "", email: "" });
    const [spoilers, setSpoilers] = useState("");
    const [readerType, setReaderType] = useState("");
    const [recommend, setRecommend] = useState(null);
    const [agree, setAgree] = useState(false);

    const handleTagClick = (tag) => {
        setSelectedTags((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    return (
        <Paper sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
            {/* Book Info */}
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/5/5e/Satanic_Verses.jpg" alt="Book Cover" width="100%" />
                </Grid>
                <Grid item xs={9}>
                    <Typography variant="h6">The Satanic Verses</Typography>
                    <Typography variant="body2">Consortium Inc - The Satanic Verses</Typography>
                </Grid>
            </Grid>

            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Required fields are marked with *
            </Typography>

            {/* Rating */}
            <Typography sx={{ mt: 2 }}>Overall Rating</Typography>
            <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />

            {/* Review Title */}
            <TextField
                label="Review Title *"
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                value={review.title}
                onChange={(e) => setReview({ ...review, title: e.target.value })}
            />

            {/* Review Content */}
            <TextField
                label="Review"
                fullWidth
                multiline
                rows={4}
                sx={{ mt: 2 }}
                value={review.content}
                onChange={(e) => setReview({ ...review, content: e.target.value })}
            />

            {/* Add Photo */}
            <Button variant="outlined" startIcon={<AddPhotoAlternateIcon />} sx={{ mt: 2 }}>
                Add Photo (Max 6)
            </Button>

            {/* Recommend Product */}
            <Typography sx={{ mt: 3 }}>Would you recommend this product to a friend?</Typography>
            <Button
                variant={recommend === "yes" ? "contained" : "outlined"}
                onClick={() => setRecommend("yes")}
                sx={{ mr: 1 }}
            >
                Yes
            </Button>
            <Button
                variant={recommend === "no" ? "contained" : "outlined"}
                onClick={() => setRecommend("no")}
            >
                No
            </Button>

            {/* Tags */}
            <Typography sx={{ mt: 3 }}>Tag this Book</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {tags.map(tag => (
                    <Chip
                        key={tag}
                        label={tag}
                        clickable
                        color={selectedTags.includes(tag) ? "primary" : "default"}
                        onClick={() => handleTagClick(tag)}
                    />
                ))}
            </Box>

            {/* Spoiler & Reader Type */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                    <Typography>Does your review contain spoilers?</Typography>
                    <Select
                        fullWidth
                        value={spoilers}
                        onChange={(e) => setSpoilers(e.target.value)}
                        size="small"
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6}>
                    <Typography>What type of reader best describes you?</Typography>
                    <Select
                        fullWidth
                        value={readerType}
                        onChange={(e) => setReaderType(e.target.value)}
                        size="small"
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        <MenuItem value="Casual Reader">Casual Reader</MenuItem>
                        <MenuItem value="Book Enthusiast">Book Enthusiast</MenuItem>
                        <MenuItem value="Critic">Critic</MenuItem>
                    </Select>
                </Grid>
            </Grid>

            {/* User Info */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                    <TextField
                        label="User Name"
                        fullWidth
                        size="small"
                        value={review.username}
                        onChange={(e) => setReview({ ...review, username: e.target.value })}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Location"
                        fullWidth
                        size="small"
                        value={review.location}
                        onChange={(e) => setReview({ ...review, location: e.target.value })}
                    />
                </Grid>
            </Grid>

            <TextField
                label="Email"
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                value={review.email}
                onChange={(e) => setReview({ ...review, email: e.target.value })}
            />

            {/* Terms & Conditions */}
            <FormControlLabel
                control={<Checkbox checked={agree} onChange={() => setAgree(!agree)} />}
                label="I agree to the terms & conditions"
                sx={{ mt: 2 }}
            />

            {/* Submit Button */}
            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
                Post Review
            </Button>
        </Paper>
    );
};

export default ReviewForm;
