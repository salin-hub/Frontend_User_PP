import '../../assets/style/Books.css';
import axios_api from '../../API/axios';
import { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from "react-icons/fa";
import {
    Box,
    Typography,
    Slider,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Paper
} from '@mui/material';
const BestSeller = () => {
    const [newBook, setNewBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('default');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const [price, setPrice] = useState(100);
    const [discount, setDiscount] = useState(80);

    const categories = ['Education', 'Horror', 'History', 'Fiction Books'];

    const fetchBestSeller = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios_api.get("/bestsellers");
            setNewBook(response.data.bestsellers);

        } catch (error) {
            console.error("Error fetching new books:", error);
            setError("Failed to fetch books. Please try again later.");
        } finally {
            setLoading(false);
        }
    };






    const handleSortChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);

        let sortedBooks = [...newBook];

        switch (order) {
            case 'asc':
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'desc':
                sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'year-asc':
                sortedBooks.sort((a, b) => new Date(a.publish_date) - new Date(b.publish_date));
                break;
            case 'year-desc':
                sortedBooks.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));
                break;
            case 'price-asc':
                sortedBooks.sort((a, b) => a.price_handbook - b.price_handbook);
                break;
            case 'price-desc':
                sortedBooks.sort((a, b) => b.price_handbook - a.price_handbook);
                break;
            default:
                fetchBestSeller();
                return;
        }

        setNewBook(sortedBooks);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((item) => item !== category)
                : [...prevCategories, category]
        );
    };

    const filteredBooks = newBook.filter((book) => {
        const originalPrice = parseFloat(book.price_handbook) || 0;
        const discountedPrice = parseFloat(book.discounted_price) || originalPrice;
        const discountPercentage = parseFloat(book.discount) || 0;
    
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
            return false;
        }
    
        // Price filter: pass if either original OR discounted price is within selected range
        if (originalPrice > price && discountedPrice > price) {
            return false;
        }
    
        // Discount filter
        if (discountPercentage > discount) {
            return false;
        }
    
        return true;
    });
    
    useEffect(() => {
        fetchBestSeller();

    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <FaStar key={i} color="#FFD700" /> : <FaRegStar key={i} color="#FFD700" />);
        }
        return stars;
    };
    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };
    if (loading) return (
        <>
            <LinearProgress />
            <div style={{ height: "500px" }}>

            </div>
        </>);
    if (error) return <p>Error: {error}</p>;
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    return (
        <>
            {error && <div>Error: {error}</div>}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >

            </Snackbar>
            {loading && <LinearProgress sx={{ marginBottom: '20px' }} />}
            <div className="name_menu">
                <h1>Best Of Seller</h1>
            </div>

            <div className="Books_item">
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom>Refine Your Search</Typography>

                    <Box sx={{ my: 2 }}>
                        <Typography gutterBottom>Price Range: 0$ - {price.toFixed(2)}$</Typography>
                        <Slider
                            value={price}
                            onChange={(e, val) => setPrice(val)}
                            min={0}
                            max={100}
                            valueLabelDisplay="auto"
                            sx={{ color: 'primary.main' }}
                        />
                    </Box>


                    <Box sx={{ my: 2 }}>
                        <Typography gutterBottom>Discount Range: 0% - {discount}%</Typography>
                        <Slider
                            value={discount}
                            onChange={(e, val) => setDiscount(val)}
                            min={0}
                            max={80}
                            valueLabelDisplay="auto"
                            sx={{ color: 'secondary.main' }}
                        />
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Categories</Typography>
                        <FormGroup>
                            {categories.map((category) => (
                                <FormControlLabel
                                    key={category}
                                    control={
                                        <Checkbox
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                    }
                                    label={category}
                                />
                            ))}
                        </FormGroup>
                    </Box>
                </Paper>
                <div className="templates">
                    <div className="sortItems">
                        <h1>{filteredBooks.length} Results Found</h1>
                        <select className="sortDropdowns" value={sortOrder} onChange={handleSortChange}>
                            <option value="default">Default</option>
                            <option value="asc">Title A-Z</option>
                            <option value="desc">Title Z-A</option>
                            <option value="year-asc">Oldest Year</option>
                            <option value="year-desc">Newest Year</option>
                            <option value="price-asc">Price Low to High</option>
                            <option value="price-desc">Price High to Low</option>
                        </select>
                    </div>
                    <div className="template_books">
                        {filteredBooks.length === 0 ? (
                            <div>No books found for your selected filters.</div>
                        ) : (
                            filteredBooks.map((book, index) => (
                                <div className="item" key={index} style={{ cursor: 'pointer',position: 'relative' }}>
                                    {book.discount_percentage > 0 && (
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                position: 'absolute',
                                                top: '5px',
                                                left: '10px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                padding: '10px',
                                                borderRadius: '50%',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                zIndex: '10',
                                            }}
                                        >
                                            {book.discount_percentage}%
                                        </div>
                                    )}
                                    <div onClick={() => handleBookClick(book.id)} style={{ cursor: 'pointer' }}>

                                        <div className="cover_item">
                                            <img src={book.cover_path} alt={book.title} />
                                        </div>
                                        <div className="text_item">
                                            <h1>{book.title}</h1>
                                            <p>{book.description || "No description available."}</p>
                                            <div className="rating">{renderStars(book.rating)}</div>
                                            <div className="price">
                                                {book.discounted_price && book.discounted_price < book.price_handbook ? (
                                                    <>
                                                        <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                                            ${book.price_handbook}
                                                        </span>
                                                        <span style={{ fontWeight: "bold", color: "red" }}>
                                                            ${book.discounted_price}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span style={{ fontWeight: "bold" }}>USD {book.price_handbook}</span>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BestSeller;
