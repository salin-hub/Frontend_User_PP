import { useEffect, useState } from "react";
import axios_api from "../API/axios";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import "slick-carousel/slick/slick.css";

const NextArrow = (props) => {
    const { onClick } = props; // ✅ Extract onClick
    return (
        <button
            onClick={onClick}
            style={{
                position: "absolute",
                top: "50%",
                right: "0px",
                transform: "translateY(-50%)",
                background:"none",
                border:"none",
                cursor: "pointer",
                fontSize: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black"
            }}
        >
            <i className="fa-solid fa-chevron-right"></i>
        </button>
    );
};

const PrevArrow = (props) => {
    const { onClick } = props; 
    return (
        <button
            onClick={onClick}
            style={{
                position: "absolute",
                top: "50%",
                left: "-5px",
                transform: "translateY(-50%)",
                background:"none",
                border:"none",
                cursor: "pointer",
                fontSize: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
                zIndex:"100"
            }}
        >
            <i className="fa-solid fa-chevron-left"></i>
        </button>
    );
};

NextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
};

PrevArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
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
    const settings = {
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow onClick={() => { }} />,
        prevArrow: <PrevArrow onClick={() => { }} />,
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
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios_api.get('/books');
                setBooks(response.data.books);
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

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div className="slider-container" style={{ width: "90%", maxWidth: "1500px", overflow: "hidden" }}>
                    <Slider {...settings}>
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="slide-item"
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
