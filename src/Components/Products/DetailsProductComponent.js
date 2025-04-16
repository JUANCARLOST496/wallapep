import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Card, Image, Button, Row, Col, notification, Avatar } from 'antd';
import { ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const DetailsProductComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const { Text } = Typography;

    useEffect(() => {
        getProduct(id);
    }, [id]);

    const getProduct = async (id) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${id}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            const jsonData = await response.json();
            const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${id}.png`;
            const existsImage = await checkURL(urlImage);
            jsonData.image = existsImage ? urlImage : "/imageMockup.png";
            setProduct(jsonData);
        } else {
            const responseBody = await response.json();
            const serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
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

    const buyProduct = async () => {
        if (!product.available) {
            notification.warning({
                message: 'Product not available',
                description: 'Product not available',
                placement: 'topRight',
                duration: 3
            });
            return;
        }

        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({ productId: id })
            }
        );

        if (response.ok) {
            const jsonData = await response.json();
            if (jsonData.affectedRows === 1) {
                notification.success({
                    message: 'Compra Exitosa',
                    description: 'Gracias por su compra',
                    placement: 'topRight',
                    duration: 3
                });
                setTimeout(() => navigate('/'), 1000);
            }
        } else {
            const responseBody = await response.json();
            const serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    const labelProductPrice = product.price < 10000 ? "Oferta" : "No-Oferta";

    const getInitials = (name) => {
        const names = name.split(' ');
        const initials = names.map(n => n.charAt(0).toUpperCase()).join('');
        return initials;
    };

    return (
        <Card
            style={{
                padding: '12px 6px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                maxWidth: '1100px',
                margin: '0 auto',
                width: '100%',
            }}
        >
            <Row gutter={[32, 32]} align="middle" justify="center">
                {/* Imagen del producto */}
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        width="100%"
                        style={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            maxHeight: '600px',
                            objectFit: 'cover',
                            marginBottom: '20px',
                        }}
                    />
                </Col>

                {/* Contenido del producto */}
                <Col xs={24} sm={24} md={12} lg={10}>
    <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <h2 style={{ fontSize: '2.2em', fontWeight: 'bold', marginBottom: '20px' }}>
            {product.title}
        </h2>

        <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Description</h4>
            <p style={{ fontSize: '1.3em' }}>{product.description}</p>
        </div>

        <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Status</h4>
            <p style={{ fontSize: '1.3em' }}>{labelProductPrice}</p>
        </div>

        <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Seller</h4>
            <Link to={`/profile/${product.buyerId}`} style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#1890ff' }}>
                <Avatar
                    size="large"
                    style={{ marginRight: '8px' }}
                    src={product.sellerImage}
                >
                    {getInitials(product.buyerName || 'Unknown')}
                </Avatar>
                {product.buyerName || 'Unknown Seller'}
            </Link>
        </div>

        <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '2.4em', fontWeight: 'bold', textAlign: 'center', color: '#4CAF50' }}>
                {product.price} €
            </h3>

            <Button
                type="primary"
                onClick={buyProduct}
                icon={<ShoppingOutlined />}
                size="large"
                block
                style={{ marginBottom: '12px', marginTop: '8px' }}
            >
                Buy Now
            </Button>
        </div>

        <Button
    type="link"
    icon={<ArrowLeftOutlined />}
    onClick={() => navigate(-1)}
    style={{
        marginTop: '12px',
        display: 'block',
        fontSize: '1.3em',
        textAlign: 'right',
        float: 'right',
    }}
>
    Go Back
</Button>
    </div>
</Col>
            </Row>
        </Card>
    );
};

export default DetailsProductComponent;














