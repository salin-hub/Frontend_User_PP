const Footer = () => {
    return (
        <footer className="footer-book">
            <div className="footer-content">
                <div className="footer-section logo-section">
                    <h2 className="logo">📚 BookMe</h2>
                    <p>Your sanctuary for stories, knowledge, and inspiration. Explore, discover, and indulge in the world of books with us.</p>
                </div>
                <div className="footer-section explore-section">
                    <h3>Explore</h3>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#genres">Genres</a></li>
                        <li><a href="#bestsellers">Bestsellers</a></li>
                        <li><a href="#new-arrivals">New Arrivals</a></li>
                    </ul>
                </div>
                <div className="footer-section contact-section">
                    <h3>Contact Us</h3>
                    <p><strong>Email:</strong> support@bookhaven.com</p>
                    <p><strong>Phone:</strong> +123 456 7890</p>
                    <p><strong>Address:</strong> 123 Book Street, Storyville</p>
                </div>
                <div className="footer-section social-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦 Twitter</a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 BookMe. Designed with 📖 and ❤️ for book lovers.</p>
            </div>
        </footer>
    );
};

export default Footer;
