import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Card, Descriptions, Image, Button, Row, Col, notification } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

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
                console.log("Producto comprado exitosamente");
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

    return (
        <Card justify="center">
            <Row gutter={16} align="middle" justify="center">
                {/* Columna izquierda: Imagen del producto */}
                <Col xs={24} sm={12} md={10} lg={10}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        width="100%" // Ajuste el ancho a 100% para que sea responsivo
                    />
                </Col>

                {/* Columna derecha: Información del producto */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Descriptions title={product.title} column={1}>
                        <Descriptions.Item label="Id">
                            {product.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {product.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Price">
                            <Text strong underline style={{ fontSize: 20 }}>{product.price}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {labelProductPrice}
                        </Descriptions.Item>
                        <Descriptions.Item label="Seller">
                            <Link to={`/profile/${product.sellerId}`}>
                                View Seller Profile
                            </Link>
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <Button type="primary" onClick={buyProduct} icon={<ShoppingOutlined />} size="large">
                                Buy
                            </Button>
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </Card>
    );
};

export default DetailsProductComponent;
