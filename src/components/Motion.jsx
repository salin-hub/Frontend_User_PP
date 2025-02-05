import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import axios_api from "../API/axios";
import { useNavigate } from 'react-router-dom';

const Motion = () => {
    const [books, setBooks] = useState([]); // Correctly declare state
    const carouselRef = useRef(null);
    const controls = useAnimation();
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    // Fetch books from the API
    const fetchBooks = async () => {
        try {
            const response = await axios_api.get('/books');
            setBooks(response.data.books);
            console.log('Fetched books:', response.data.books);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        fetchBooks(); // Call once when the component mounts
    }, []); // Add an empty dependency array to prevent multiple calls

    useEffect(() => {
        const startScrolling = async () => {
            const scrollWidth = carouselRef.current?.scrollWidth || 0;

            await controls.start({
                x: -scrollWidth / 2,
                transition: {
                    duration: isHovering ? 30 : 15, // Slow down on hover and normal speed after hover
                    ease: "easeInOut", // Smooth scroll easing
                    repeat: Infinity, // Infinite scroll loop
                },
            });
        };

        startScrolling();
    }, [controls, isHovering]); // Re-run when hover state changes

    return (
        <><div className="Books">
        <div className="Name_menu">
            <h1>Title another Books</h1>
        </div>
    </div>
        <div className="carousel-container" style={{ overflow: "hidden", position: "relative" }}>
            <motion.div
                className="carousel-track"
                ref={carouselRef}
                animate={controls}
                style={{ display: "flex", transition: "transform 0.5s ease" }} // Flexbox and smooth transition
            >
                {books.map((item, index) => (
                    <motion.div
                        className="carousel-item"
                        key={index}
                        onHoverStart={() => setIsHovering(true)} // Start slow scrolling on hover
                        onHoverEnd={() => setIsHovering(false)} // Reset to normal speed on hover end
                        whileHover={{
                            scale: 1.1, // Slightly enlarge the item
                            rotate: 5,  // Slight rotation for a fun effect
                            transition: { duration: 0.3 }, // Smooth scale effect on hover
                        }}
                        style={{
                            display: "inline-block",
                           
                            textAlign: "center",
                            borderRadius: "15px",  // Rounded corners for a cute effect
                            boxShadow: "0px 10px 15px rgba(0,0,0,0.1)", // Soft shadow for depth
                            backgroundColor: "#fff", // Light background for a clean look
                            overflow: "hidden", // Prevent items from overflowing
                            padding: "10px",  // Add some padding to give it more space
                        }}
                    >
                        <div 
                            className="carousel-item-details"  
                            onClick={() => handleBookClick(item.id)} // Corrected this line to pass a function reference
                        >
                            
                            <h3 style={{"white-space":"nowrap", "padding":"10px"}}>{item.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
        </>
    );
};

export default Motion;
