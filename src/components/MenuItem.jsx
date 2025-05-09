import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/style/Menu.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import axios_api from "../API/axios";

const MenuItem = () => {
    const [categories, setCategories] = useState([]);
    const [state, setState] = useState({ left: false });
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios_api.get("/categories");
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchCategories();
    }, []); 


    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
        setState({ ...state, [anchor]: open });
    };

    const handleCategoryClick = (category) => {
        navigate(`/category/${category.id}`);
    };

    const handleSubcategoryClick = async (subcategory) => {
        try {
            const response = await axios_api.get(`/subcategories/${subcategory.id}/books`);
            console.log("Books in Subcategory:", response.data.books);
            navigate(`/subcategories/${subcategory.id}/books`, { state: { books: response.data.books } });
        } catch (error) {
            console.error("Failed to fetch books for subcategory", error);
        }
    };
    

    const handleMouseEnter = (category) => {
        setHoveredCategory(category.id);
    };

    const handleMouseLeave = () => {
        setHoveredCategory(null);
    };

    const list = (anchor) => (
        <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
            <List>
                <div className="Name_menu">
                    <h1>Categories List</h1>
                </div>
                {categories.map((category) => (
                    <div key={category.id} onMouseEnter={() => handleMouseEnter(category)} onMouseLeave={handleMouseLeave}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleCategoryClick(category)}>
                                <ListItemText primary={category.name} />
                            </ListItemButton>
                        </ListItem>
                        {hoveredCategory === category.id && category.subcategories.length > 0 && (
                            <Box sx={{ paddingLeft: 3, backgroundColor: "#f5f5f5", borderRadius: 2, margin: "5px 0" }}>
                                <List>
                                    {category.subcategories.map((sub) => (
                                        <ListItem key={sub.id} disablePadding>
                                            <ListItemButton onClick={() => handleSubcategoryClick(sub)}>
                                                <ListItemText primary={`🔹 ${sub.name}`} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </div>
                ))}
            </List>
            <Divider />
        </Box>
    );

    return (
        <>
            <div className="menu_box">
                <div className="icon_menu" onClick={toggleDrawer("left", true)}>
                    <i className="fa-solid fa-bars"></i>
                </div>

                <Drawer anchor="left" open={state.left} onClose={toggleDrawer("left", false)}>
                    {list("left")}
                </Drawer>

                <div className="title_item">
                    <ul>
                        <li><Link to="/newbook">New Books</Link></li>
                        <li><Link to="/BestSeller">Best Seller </Link></li>
                        <li><Link to="/featureauthor">Featured Authors</Link> </li>
                        <li><Link to="/discount">Deal Of The Day</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default MenuItem;
