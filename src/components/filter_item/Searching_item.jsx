import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios_api from '../../API/axios';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [categories, setCategories] = useState(['All']); // Default includes "All"
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories from the backend
        const fetchCategories = async () => {
            try {
                const response = await axios_api.get('/categories');
                const categoryList = response.data.categories.map((cat) => cat.name); // Assuming the API returns [{id, name}]
                setCategories(['All', ...categoryList]); // Include "All" as the first option
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = () => {
        // Navigate to the search-results page and refresh the route
        navigate(`/search-results?term=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="search_item">
            <div className="category_filter">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>
            <div className="line"></div>
            <div className="search_input">
                <input
                    type="text"
                    placeholder="Searching book ...."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="icon_search" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
