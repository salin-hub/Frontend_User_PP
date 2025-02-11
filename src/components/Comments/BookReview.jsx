import{ useState } from "react";
import { 
    Box, Typography, Button, Card, CardContent, Rating, 
    TextField, Select, MenuItem, Checkbox, FormControlLabel, 
    Divider
} from "@mui/material";

const reviews = [
    { id: 1, name: "dechen", stars: 5, title: "Clean print, good paper", content: "This review is about the content of the book, not about the delivery...", recommend: "yes", helpful: 2, report: 4 },
    { id: 2, name: "John Doe", stars: 4, title: "Interesting read", content: "Great book, but the language is a bit difficult...", recommend: "yes", helpful: 5, report: 1 }
];

const BookReviews = () => {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewContent, setReviewContent] = useState("");
    const [recommend, setRecommend] = useState("");

    const handleSubmit = () => {
        console.log("Submitted Review:", { rating, reviewTitle, reviewContent, recommend });
        setShowForm(false); // Hide form after submission
    };

    return (
        <Box sx={{ width: "90%", margin: "auto", padding: 3 }}>
            {/* Title */}
            <Typography variant="h5" align="center" color="red" gutterBottom>
                How would you rate your experience shopping for books on Bookswagon?
            </Typography>

            {/* Rating Scale */}
            <Box sx={{ textAlign: "center", marginBottom: 3 }}>
                <Rating value={0} size="large" />
                <Typography variant="body2">Very poor - Neutral - Great</Typography>
            </Box>

            {/* Customer Reviews Header */}
            <Card sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Customer Reviews</Typography>
                <Box display="flex" alignItems="center">
                    <Rating value={4.5} readOnly precision={0.5} />
                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                        4.5 | 6 Reviews
                    </Typography>
                </Box>
                <Typography variant="body2">6 out of 6 (100%) reviewers recommend this product</Typography>
            </Card>

            {/* Rating Breakdown */}
            <Card sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" color="primary">
                    Rating Snapshot
                </Typography>
                <Typography variant="body2">Select a row below to filter reviews.</Typography>

                {[5, 4, 3, 2, 1].map((star) => (
                    <Box key={star} display="flex" alignItems="center">
                        <Typography>{star} ★</Typography>
                        <Box sx={{ flexGrow: 1, bgcolor: "#ddd", height: 10, marginX: 1 }}>
                            <Box sx={{ width: star >= 4 ? "50%" : "0%", bgcolor: "green", height: "100%" }} />
                        </Box>
                        <Typography>{star >= 4 ? 3 : 0}</Typography>
                    </Box>
                ))}
            </Card>

            {/* Write a Review Button */}
            <Button 
                variant="contained" 
                color="error" 
                fullWidth 
                sx={{ marginBottom: 2 }} 
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancel Review" : "Write A Review"}
            </Button>

            {/* Review Form - Show when Button Clicked */}
            {showForm && (
                <Card sx={{ padding: 2, marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Write Your Review</Typography>

                        {/* Rating Input */}
                        <Typography sx={{ marginTop: 1 }}>Overall Rating</Typography>
                        <Rating 
                            value={rating} 
                            onChange={(event, newValue) => setRating(newValue)} 
                            size="large"
                        />

                        {/* Review Title */}
                        <TextField 
                            fullWidth 
                            label="Review Title" 
                            variant="outlined" 
                            sx={{ marginTop: 2 }} 
                            value={reviewTitle} 
                            onChange={(e) => setReviewTitle(e.target.value)}
                        />

                        {/* Review Content */}
                        <TextField 
                            fullWidth 
                            label="Your Review" 
                            multiline 
                            rows={4} 
                            variant="outlined" 
                            sx={{ marginTop: 2 }} 
                            value={reviewContent} 
                            onChange={(e) => setReviewContent(e.target.value)}
                        />

                        {/* Recommendation */}
                        <Typography sx={{ marginTop: 2 }}>Would you recommend this book?</Typography>
                        <Select 
                            fullWidth 
                            value={recommend} 
                            onChange={(e) => setRecommend(e.target.value)} 
                        >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                        </Select>

                        {/* Terms Agreement */}
                        <FormControlLabel 
                            control={<Checkbox />} 
                            label="I agree to the terms & conditions"
                            sx={{ marginTop: 2 }}
                        />

                        <Divider sx={{ marginY: 2 }} />

                        {/* Submit Button */}
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            onClick={handleSubmit}
                        >
                            Post Review
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Sorting */}
            <Box display="flex" justifyContent="flex-end" sx={{ marginBottom: 2,display:"flex",alignItems:"center"}}>
                <Typography variant="body2" sx={{ marginRight: 1 }}>
                    Sort by:
                </Typography>
                <Select defaultValue="Most Relevant" size="small">
                    <MenuItem value="Most Relevant">Most Relevant</MenuItem>
                    <MenuItem value="Newest">Newest</MenuItem>
                    <MenuItem value="Highest Rating">Highest Rating</MenuItem>
                    <MenuItem value="Lowest Rating">Lowest Rating</MenuItem>
                </Select>
            </Box>

            {/* Reviews List */}
            {reviews.map((review) => (
                <Card key={review.id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{review.title}</Typography>
                        <Rating value={review.stars} readOnly />
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                            {review.content}
                        </Typography>
                        <Divider sx={{ marginY: 1 }} />
                        <Typography variant="body2">Helpful? Yes: {review.helpful} | Report: {review.report}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default BookReviews;
