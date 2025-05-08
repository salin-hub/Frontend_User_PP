import '../assets/style/shoppingCart.css'; // Import CSS
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios_api from '../API/axios';
import LinearProgress from '@mui/material/LinearProgress';
const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCheckoutInProgress, setIsCheckoutInProgress] = useState(false);  // To handle checkout button state
    const userId = localStorage.getItem('userID');

    // Fetch cart data
    const fetchCart = async (userId) => {
        try {
            const response = await axios_api.get(`/cart/${userId}`);
            setCartItems(response.data.cartItems);
        } catch (error) {
            console.error('Error fetching cart data:', error);
            setError('An error occurred while fetching the cart data.');
        } finally {
            setLoading(false);
        }
    };

    // Remove item from cart
    const removeCart = async (itemId) => {
        try {
            const response = await axios_api.delete(`/cart/${itemId}`);
            alert(response.data.message);
            setCartItems(cartItems.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting cart item:', error);
            alert('An error occurred while deleting the cart item.');
        }
    };

    // Update quantity of an item
    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const updatedItems = cartItems.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedItems);

            await axios_api.put(`/cart/update/${itemId}`, { quantity: newQuantity });
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('An error occurred while updating the quantity.');
        }
    };

    const handleCheckout = async () => {
        setIsCheckoutInProgress(true); // Set to true at the start

        try {
            // Validate cart items
            if (cartItems.length === 0) {
                alert('Your cart is empty.');
                return;
            }

            const items = cartItems.map(item => {
                if (!item.book?.id || !item.quantity || !item.book?.price_handbook) {
                    throw new Error('One or more items are missing required information.');
                }
                const price = item.quantity * item.book.price_handbook;
                return {
                    order_id: item.id,
                    books_id: item.book.id,
                    quantity: item.quantity,
                    price: price,
                };

            });
            console.log(items)
            const userId = localStorage.getItem('userID');
            if (!userId) {
                alert('User ID is missing.');
                return;
            }

            const orderData = {
                user_id: userId,
                items,
            };

            const response = await axios_api.post('/orders', orderData);

            // Ensure response has a message before using it
            if (response?.data?.message) {
                alert(response.data.message);
            } else {
                throw new Error('Unexpected response format.');
            }

            setCartItems([]); // Clear cart after successful checkout
        } catch (error) {
            // Improved error handling with message check
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred during checkout.';
            console.error('Error during checkout:', errorMessage);
            alert(errorMessage);
        } finally {
            setIsCheckoutInProgress(false); // Reset to false after request
        }
    };






    // Calculate total price
    const calculateTotalPrice = () => {
        const subtotal = cartItems.reduce((total, item) => {
            const price = item.book.discounted_price && item.book.discounted_price < item.book.price_handbook
                ? item.book.discounted_price
                : item.book.price_handbook;
            return total + price * item.quantity;
        }, 0);
        return subtotal.toFixed(2);
    };
    

    // Calculate total items in cart
    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Fetch cart when userId is available
    useEffect(() => {
        if (userId) {
            fetchCart(userId);
        }
    }, [userId]);

    if (loading) return <LinearProgress />;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="Books">
                <div className="Name_menu">
                    <h1>Shopping Cart</h1>
                </div>
            </div>
            <div className="shopping-cart">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">No</TableCell>
                                <TableCell align="center">Cover</TableCell>
                                <TableCell align="center">Title</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Price (USD)</TableCell>
                                <TableCell align="center">Discount</TableCell>
                                <TableCell align="center">Total Price (USD)</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={
                                                item.book.cover_path
                                            }
                                            alt={item.book.title}
                                            style={{ width: '50px', height: 'auto' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{item.book.title}</TableCell>

                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            disabled={item.quantity <= 1}
                                        >
                                            <RemoveIcon />
                                        </Button>
                                        {item.quantity}
                                        <Button
                                            size="small"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <AddIcon />
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.book.discounted_price && item.book.discounted_price < item.book.price_handbook ? (
                                            <>
                                                <span style={{ textDecoration: "line-through", color: "gray", marginRight: "10px" }}>
                                                    USD {item.book.price_handbook}
                                                </span>
                                                <span style={{ fontWeight: "bold", color: "red" }}>
                                                    $ {item.book.discounted_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: "bold" }}>$ {item.book.price_handbook}</span>
                                        )}</TableCell>
                                    <TableCell align="center">{item.book.discount_percentage}%</TableCell>
                                    <TableCell align="center">
                                        {(
                                            (item.book.discounted_price ?? item.book.price_handbook) * item.quantity
                                        ).toFixed(2)}
                                    </TableCell>

                                    <TableCell align="center">
                                        <DeleteIcon
                                            style={{
                                                color: 'red',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => removeCart(item.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className="cart-summary" style={{ marginTop: '20px' }}>
                    <h1>Order Summary:</h1>
                    <span className="lines"></span>
                    <div className="control_checkout">
                        <Typography variant="h6" color="white">
                            Items: {calculateTotalItems()}
                        </Typography>
                        <Typography variant="h6" color="white">
                            Total Price: ${calculateTotalPrice()}
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                        onClick={handleCheckout}
                        disabled={isCheckoutInProgress}  // Disable button during checkout
                    >
                        {isCheckoutInProgress ? 'Processing...' : 'Checkout'}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ShoppingCart;
