import { Row, Col, Carousel, Card } from "antd";
import Meta from "antd/es/card/Meta";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";


let MainPage = () => {

    const isLoggedIn = localStorage.getItem("apiKey") !== null;
    const userEmail = isLoggedIn ? localStorage.getItem("email") || "User" : "";
    const userId = isLoggedIn ? localStorage.getItem("country") || "ID no disponible" : "";



    const [randomImage, setRandomImage] = useState({
        electronics: "",
       clothing: "",
        kitchen: "",
        toys: "",
        beauty: "",
        sports: "",
        book: ""
    });

    useEffect(() => {
        if (isLoggedIn) {
            console.log("Usuario logueado:", userEmail);
            console.log("ID del usuario:", userId);
            getRandomImageByCategory("Electronics", "electronics");
            getRandomImageByCategory("Clothing and Fashion", "clothing");
            getRandomImageByCategory("Home and Kitchen", "kitchen");
            getRandomImageByCategory("Toys and Games", "toys");
            getRandomImageByCategory("Beauty and Personal Care", "beauty");
            getRandomImageByCategory("Sports and Outdoors", "sports");
            getRandomImageByCategory("Books and Stationery", "book");
        } else {
            console.log("Usuario no está logueado");
        }
    }, [isLoggedIn]);

    const getRandomImageByCategory = async (category, key) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            const products = await response.json();
            const filteredProducts = products.filter(
                (product) => product.category === category
            );

            if (filteredProducts.length > 0) {
                const randomProduct = filteredProducts[Math.floor(Math.random() * filteredProducts.length)];
                const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${randomProduct.id}.png`;
                const existsImage = await checkURL(urlImage);

                setRandomImage(prevState => ({
                    ...prevState,
                    [key]: existsImage ? urlImage : "/default.png"
                }));
            }
        } else {
            const responseBody = await response.json();
            responseBody.errors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    const checkURL = async (url) => {
        try {
            const response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    let contentStyle = {
        height: '300px',
        color: '#fff',
        lineHeight: '300px', // Center text vertically
        textAlign: 'center',
        fontSize: '3rem', // Increased font size for better visibility
    };

    return (
        <div>
            <Carousel autoplay>
                <div>
                    <div style={{ ...contentStyle, background: '#ff6347' }}>
                        ONLINE SHOP
                    </div>
                </div>
                <div>
                    <div style={{ ...contentStyle, background: '#4682b4' }}>
                        CLOTHING
                    </div>
                </div>
                <div>
                    <div style={{ ...contentStyle, background: '#32cd32' }}>
                        KITCHEN
                    </div>
                </div>
                <div>
                    <div style={{ ...contentStyle, background: '#ffd700' }}>
                        ELECTRONICS
                    </div>
                </div>
            </Carousel>

            <Row justify="center">
                <Col span={2}></Col>
                <Col span={20}>
                    <Card
                        title="Welcome to Our Application"
                        style={{ marginTop: 20, textAlign: 'center' }}>
                        <p>
                            This application is designed for buying and selling products easily and efficiently. Browse
                            through various categories, find what you need, and make purchases with just a few clicks!
                        </p>
                    </Card>
                </Col>
                <Col span={2}></Col>
            </Row>

            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Link to="/products?category=Electronics">
                        <Card
                            hoverable
                            style={{ marginTop: 20 }}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden' }} >
                                    <img
                                        alt="Electronics"
                                        src={isLoggedIn ? randomImage.electronics : "/laptop.png"}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }>
                            <Meta
                                title="Electronics"
                                description="Discover the latest in electronics, from laptops to smart devices."
                            />
                        </Card>
                    </Link>
                </Col>

                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Link to="/products?category=Clothing and Fashion">
                        <Card
                            hoverable
                            style={{ marginTop: 20 }}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden' }}>
                                    <img
                                        alt="Clothing and Fashion"
                                        src={isLoggedIn ? randomImage.clothing : "/clothing.png"}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }>
                            <Meta
                                title="Clothing and Fashion"
                                description="Stay trendy with the latest in fashion. Accessories."
                            />
                        </Card>
                    </Link>
                </Col>

                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Link to="/products?category=Home and Kitchen">
                        <Card
                            hoverable
                            style={{ marginTop: 20 }}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden' }}>
                                    <img
                                        alt="Home and Kitchen"
                                        src={isLoggedIn ? randomImage.kitchen : "/kitchen.png"}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }>
                            <Meta
                                title="Home and Kitchen"
                                description="Upgrade your home with essentials and decor. Eeverything from kitchen!"
                            />
                        </Card>
                    </Link>
                </Col>


                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Link to="/products?category=Toys and Games">
                        <Card
                            hoverable
                            style={{ marginTop: 20 }}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden' }}>
                                    <img
                                        alt="Toys and Games"
                                        src={isLoggedIn ? randomImage.toys : "/toys.png"}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }>
                            <Meta
                                title="Toys and Games"
                                description="Explore fun and educational toys for kids of all ages."
                            />
                        </Card>
                    </Link>
                </Col>
            </Row>

            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Link to="/products?category=Beauty and Personal Care">
                        <Card
                            hoverable
                            style={{ marginTop: 20 }}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden' }}>
                                    <img
                                        alt="Beauty and Personal Care"
                                        src={isLoggedIn ? randomImage.beauty : "/beauty.png"}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }>
                            <Meta
                                title="Beauty and Personal Care"
                                description="Pamper yourself with high-quality beauty products. From skincare."
                            />
                        </Card>
                    </Link>
                </Col>

                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Link to="/products?category=Sports and Outdoors">
                        <Card
                            hoverable
                            style={{ marginTop: 20 }}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden' }}>
                                    <img
                                        alt="Sports and Outdoors"
                                        src={isLoggedIn ? randomImage.sports : "/sports.png"}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }>
                            <Meta
                                title="Sports and Outdoors"
                                description="Get ready for your next adventure with outdoor gear!"
                            />
                        </Card>
                    </Link>
                </Col>

                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Link to="/products?category=Books and Stationery">
                        <Card
                            hoverable
                            style={{ marginTop: 20 }}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden' }}>
                                    <img
                                        alt="Books and Stationery"
                                        src={isLoggedIn ? randomImage.book : "/books.png"}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            }>
                            <Meta
                                title="Books and Stationery"
                                description="Find your next great read or stock up on school supplies, office essentials, and more!."
                            />
                        </Card>
                    </Link>
                </Col>
            </Row>
        </div>
    );
                }

                export default MainPage;