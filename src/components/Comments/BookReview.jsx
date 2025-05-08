import { useState } from "react";
import {
    Box, Typography, Button, Card, CardContent, Rating,
    TextField, Select, MenuItem,
    Divider, Avatar
} from "@mui/material";
import PropTypes from "prop-types";
import { formatDistanceToNow } from 'date-fns';
import axios_api from "../../API/axios";

const BookReviews = ({ bookDetails }) => {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewContent, setReviewContent] = useState("");
    const [recommend, setRecommend] = useState("");

    const handleSubmit = async () => {
        try {
            const user_id = localStorage.getItem("userID");

            if (!user_id) {
                console.error("User ID not found. Please log in.");
                return;
            }
            const response = await axios_api.post("/addReview", {
                user_id,
                book_id: bookDetails.book.id,
                title: reviewTitle,
                rating,
                review: reviewContent,
                recommended: recommend === "yes"
            });

            console.log("Review submitted successfully:", response.data);
            setShowForm(false);
        } catch (error) {
            console.error("Error submitting review:", error.response?.data || error.message);
        }
    };



    return (
        <Box sx={{ width: "90%", margin: "auto", padding: 3 }}>
            {/* Title */}
            <Typography variant="h5" align="center" color="red" gutterBottom>
                How would you rate your experience shopping for books on Bookswagon?
            </Typography>

            {/* Rating Scale */}
            <Box sx={{ textAlign: "center", marginBottom: 3 }}>
                <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} size="large" />
                <Typography variant="body2">Very poor - Neutral - Great</Typography>
            </Box>

            {/* Customer Reviews Header */}
            <Card sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">Customer Reviews</Typography>
                <Box display="flex" alignItems="center">
                    <Rating value={bookDetails.averageRating} readOnly precision={0.5} />
                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                        {parseFloat(bookDetails.averageRating).toFixed(2)} | {bookDetails.recommendationCount} Reviews
                    </Typography>

                </Box>
                <Typography variant="body2">{bookDetails.recommendationCount} out of {bookDetails.recommendationCount} ({bookDetails.recomendations})% of reviewers recommend this product</Typography>
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
            <Box display="flex" justifyContent="flex-end" sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
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
            {bookDetails.book.reviews.length > 0 ? (
                bookDetails.book.reviews.map((review, index) => (
                    <Card key={index} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Avatar src={"/default-avatar.png"} alt={review.user.name} />
                                <Typography variant="h6">{review.user.name}</Typography>
                            </div>
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                Reviewed {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                            </Typography>
                            <Typography variant="h6">{review.title}</Typography>
                            <Rating value={review.rating} readOnly />
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                {review.review}
                            </Typography>
                            <Divider sx={{ marginY: 1 }} />
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No reviews yet.</Typography>
            )}
        </Box>
    );
};

BookReviews.propTypes = {
    bookDetails: PropTypes.shape({
        book: PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            reviews: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    title: PropTypes.string.isRequired,
                    review: PropTypes.string.isRequired,
                    rating: PropTypes.number.isRequired,
                    created_at: PropTypes.string.isRequired,
                })
            ).isRequired
        }).isRequired,
        averageRating: PropTypes.number.isRequired,
        recomendations: PropTypes.number.isRequired,
        recommendationCount: PropTypes.number.isRequired
    }).isRequired
};

export default BookReviews;
