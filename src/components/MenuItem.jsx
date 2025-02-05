import { Link } from 'react-router-dom';
import '../assets/style/Menu.css';
import { useState, useEffect } from 'react';
import axios_api from '../API/axios';
const MenuItem = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state before fetching
            const response = await axios_api.get("/categories");
         
            
            setCategories(response.data.categories || []); // Safeguard for response structure
        } catch (error) {
            if (error.response) {
                setError(`Failed to load categories: ${error.response.data.message || error.message}`);
            } else {
                setError('Failed to load categories: An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
  

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    return (
        <>
            <div className="menu_box">
                <div className="icon_menu" onClick={toggleMenu}>
                    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}>categories</i>
                </div>

                <div className={`menu_item ${isOpen ? 'open' : 'close'}`}>
                    <h2>Category Lists:</h2>
                    {loading ? (
                        <p>Loading categories...</p>
                    ) : error ? (
                        <p className="error_message">{error}</p>
                    ) : categories.length > 0 ? (
                        categories.map((category) => (
                            
                            <div className="item_text" key={category.id || category.name}>
                                <Link to={category.path || `/category/${category.id}`}>
                                    <h1>{category.name}</h1>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No categories available</p>
                    )}
                </div>

                <div className="title_item">
                    <ul>
                        <li><Link to="/newbook">New Books</Link></li>
                        <li>Best Seller</li>
                        <li>Featured Authors</li>
                        <li>Recommended Book</li>
                        <li>Deal Of The Day</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default MenuItem;
