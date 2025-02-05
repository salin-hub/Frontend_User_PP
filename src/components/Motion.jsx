import { useEffect, useState } from "react";
import axios_api from "../API/axios";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import "slick-carousel/slick/slick.css";

// Custom Next Arrow
const NextArrow = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: "absolute",
                top: "50%",
                right: "0px",
                transform: "translateY(-50%)",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            ▶
        </button>
    );
};

// Custom Previous Arrow
const PrevArrow = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: "absolute",
                top: "50%",
                left: "0px",
                transform: "translateY(-50%)",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "100"
            }}
        >
            ◀
        </button>
    );
};

NextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

PrevArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

const Motion = () => {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    // Slick slider settings with custom arrows
    const settings = {
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2, slidesToScroll: 1 },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
            }
        ]
    };

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    // Fetch books from the API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios_api.get('/books');
                setBooks(response.data.books);
                console.log('Fetched books:', response.data.books);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, []);

    return (
        <>
            <div className="Name_menu">
                <h1>Discover the Latest Books</h1>
                <p style={{ fontSize: "18px", color: "#666", marginTop: "10px" }}>
                    Explore new releases and exciting titles to add to your collection.
                </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="slider-container" style={{ width: "90%", maxWidth: "1500px", overflow: "hidden" }}>
                    <Slider {...settings}>
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="slide-item"
                                style={{
                                    padding: "15px",
                                    textAlign: "center",
                                    background: "#fff",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <h3
                                    onClick={() => handleBookClick(book.id)}
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "80%"
                                    }}>
                                    {book.title.length > 20 ? book.title.substring(0, 20) + "..." : book.title}
                                </h3>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>


        </>
    );
};

export default Motion;
