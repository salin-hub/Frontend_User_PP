import { useState } from 'react';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';
import image1 from '../assets/Images/p001.jpg'
import image2 from '../assets/Images/book2.jpg'
import image3 from '../assets/Images/image1.jpg'
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
const Caroulsel = () => {
    const slides = [
        { id: 1, text: 'Welcome to Our Bookstore  ', image: image1 },
        { id: 2, text: 'Explore a World of Knowledge', image: image2 },
        { id: 3, text: 'Find Your Next Great Read', image: image3 },
        { id: 4, text: 'Find Your Next Great Read', image: image2 },

    ];
    // const NextArrow = ({ onClick }) => {
    //     return (
    //         <div className="arrow next" onClick={onClick}>
    //             <MdKeyboardArrowRight size={"30px"} color='#A858EE' />
    //         </div>
    //     );
    // }
    // const PrevArrow = ({ onClick }) => {
    //     return (
    //         <div className="arrow prev" onClick={onClick}>
    //             <MdKeyboardArrowLeft size={'30px'} color='#A858EE' />
    //         </div>
    //     );
    // }
    const [imageIndex, setImageIndex] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        lazyLoad: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: 0,
        autoplay: true,
        slidesToScroll: 1,
        autoplaySpeed: 3000,
        // nextArrow: <NextArrow />,
        // prevArrow: <PrevArrow />,
        beforeChange: (current, next) => setImageIndex(next),
    }
    return (
        <div className="carousel-container ">
            {/* <div className="App"> */}
                <Slider {...settings} className='slider'>
                    {slides.map((item, idx) => (
                        <div key={item.id} className={idx === imageIndex ? "slide activeSlide" : "slide"}>
                            <img src={item.image} alt={`Slide ${idx}`} />
                            <div className="text-slide">
                                <h1>{item.text}</h1>
                            </div>

                        </div>
                    ))}
                </Slider>
            {/* </div> */}
        </div>
    )

}
export default Caroulsel;