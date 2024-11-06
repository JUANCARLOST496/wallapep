import { Row, Col, Carousel, Card } from "antd";
import Meta from "antd/es/card/Meta";


let MainPage = () => {


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
                    <div style={{...contentStyle, background: '#ff6347'}}> {/* Tomato */}
                        ONLINE SHOP
                    </div>
                </div>
                <div>
                    <div style={{...contentStyle, background: '#4682b4'}}> {/* Steel Blue */}
                        CLOTHING
                    </div>
                </div>
                <div>
                    <div style={{...contentStyle, background: '#32cd32'}}> {/* Lime Green */}
                        KITCHEN
                    </div>
                </div>
                <div>
                    <div style={{...contentStyle, background: '#ffd700'}}> {/* Gold */}
                        ELECTRONICS
                    </div>
                </div>
            </Carousel>

            <Row justify="center">
                <Col span={2}>
                </Col>
                <Col span={20}>
                <Card
                    title="Welcome to Our Application"
                    style={{marginTop: 20 , textAlign: 'center'}}>
                    <p>This application is designed for buying and selling products easily and efficiently. Browse
                        through
                        various categories, find what you need, and make purchases with just a few clicks!</p>
                </Card>
                </Col>
                <Col span={2}>
                </Col>
            </Row>

            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Card
                        hoverable
                        style={{  marginTop: 20 }}
                        cover={
                            <div style={{ height: 200, overflow: 'hidden' }}>
                                <img
                                    alt="example"
                                    src="/laptop.png"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        }
                    >
                        <Meta title="Electronics" description="www.instagram.com" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Card
                        hoverable
                        style={{ marginTop: 20 }}
                        cover={
                            <div style={{ height: 200, overflow: 'hidden' }}>
                                <img
                                    alt="example"
                                    src="/clothing.png"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        }
                    >
                        <Meta title="Clothing and Fashion" description="www.instagram.com" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Card
                        hoverable
                        style={{  marginTop: 20 }}
                        cover={
                            <div style={{ height: 200, overflow: 'hidden' }}>
                                <img
                                    alt="example"
                                    src="/kitchen.png"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        }
                    >
                        <Meta title="Home and Kitchen" description="www.instagram.com" />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{  marginTop: 20 }}
                        cover={
                            <div style={{ height: 200, overflow: 'hidden' }}>
                                <img
                                    alt="example"
                                    src="/toys.png"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        }
                    >
                        <Meta title="Toys and Games" description="www.instagram.com" />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify="center">
                <Col span={2}>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Card
                        hoverable
                        style={{  marginTop: 20 }}
                        cover={
                            <div style={{ height: 200, overflow: 'hidden' }}>
                                <img
                                    alt="example"
                                    src="/beauty.png"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        }
                    >
                        <Meta title="Beauty and Personal Care" description="www.instagram.com" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Card
                        hoverable
                        style={{  marginTop: 20 }}
                        cover={
                            <div style={{ height: 200, overflow: 'hidden' }}>
                                <img
                                    alt="example"
                                    src="/sports.png"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        }
                    >
                        <Meta title="Sports and Outdoors" description="www.instagram.com" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8} xl={6}>
                    <Card
                        hoverable
                        style={{ width: 300, marginTop: 20 }}
                        cover={
                            <div style={{ height: 200, overflow: 'hidden' }}>
                                <img
                                    alt="example"
                                    src="/books.png"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        }
                    >
                        <Meta title="Books and Stationery" description="www.instagram.com" />
                    </Card>
                </Col>

            </Row>

        </div>
                );
                }

                export default MainPage;