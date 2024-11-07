import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Typography, Card, Descriptions, Image, Button, Row, Col, notification} from 'antd';
import {ShoppingOutlined} from '@ant-design/icons';

let DetailsProductComponent = () => {
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

            // Construye la URL de la imagen usando el ID del producto
            const urlImage = `${process.env.REACT_APP_BACKEND_BASE_URL}/images/${id}.png`;
            const existsImage = await checkURL(urlImage);

            // Agrega la URL de la imagen al producto o usa una imagen de reserva
            jsonData.image = existsImage ? urlImage : "/imageMockup.png";

            setProduct(jsonData); // Establece el producto con la imagen en el estado
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
            return response.ok; // Devuelve true si la imagen existe
        } catch (error) {
            return false; // La imagen no existe o hay un error
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
                    duration: 3 // Duración de la notificación en segundos
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

    const clickReturn = () => {
        navigate("/products");
    };

    const labelProductPrice = product.price < 10000 ? "Oferta" : "No-Oferta";

    return (
        <Card justify="center">
            <Row gutter={16} align="middle" justify="center">
                {/* Columna izquierda: Imagen del producto */}
                <Col span={10}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={400} // Ajusta el tamaño directamente usando la propiedad width de Ant Design
                    />
                </Col>

                {/* Columna derecha: Información del producto */}
                <Col span={6}>
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
                            <Link to={`/profile/${product.sellerId}`}> {/* Enlace al perfil del vendedor */}
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



}

export default DetailsProductComponent;