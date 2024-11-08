import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, Col, Row, Select, Input, InputNumber, notification, Button } from 'antd';
import { ShoppingOutlined } from "@ant-design/icons";

const { Option } = Select;

let ListProductsComponent = () => {
    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState(products);
    let [selectedCategory, setSelectedCategory] = useState(null);
    let [searchTerm, setSearchTerm] = useState("");
    let [priceRange, setPriceRange] = useState([0, Infinity]);
    let [priceOrder, setPriceOrder] = useState(null);
    let [categoryCounts, setCategoryCounts] = useState({});

    let location = useLocation();
    let navigate = useNavigate(); // Para redireccionar después de la compra

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryFromUrl = queryParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [location]);

    useEffect(() => {
        const filtered = products
            .filter(p => {
                const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
                const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
                const withinPriceRange = p.price >= priceRange[0] && p.price <= priceRange[1];
                return matchesCategory && matchesSearch && withinPriceRange;
            })
            .sort((a, b) => {
                if (priceOrder === 'asc') return a.price - b.price;
                if (priceOrder === 'desc') return b.price - a.price;
                return 0;
            });

        setFilteredProducts(filtered);
    }, [selectedCategory, searchTerm, priceRange, priceOrder, products]);

    let getProducts = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            let promisesForImages = jsonData.map(async p => {
                let urlImage = process.env.REACT_APP_BACKEND_BASE_URL + "/images/" + p.id + ".png";
                let existsImage = await checkURL(urlImage);
                p.image = existsImage ? urlImage : "/imageMockup.png";
                return p;
            });

            let productsWithImage = await Promise.all(promisesForImages);
            setProducts(productsWithImage);
            setFilteredProducts(productsWithImage);

            updateCategoryCounts(productsWithImage);

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    let checkURL = async (url) => {
        try {
            let response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    const updateCategoryCounts = (products) => {
        const counts = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
        setCategoryCounts(counts);
    };

    const buyProduct = async (productId, event) => {
        event.preventDefault(); // Evitar que se realice cualquier redirección al hacer clic en "Buy"

        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({ productId })
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
                // Redirigir a la página principal después de un minuto, si quieres, o solo mostrar el mensaje
            }
        } else {
            const responseBody = await response.json();
            const serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
                notification.error({
                    message: 'Error de Compra',
                    description: e.msg, // El mensaje de error retornado por el backend
                    placement: 'topRight',
                    duration: 3
                });
            });
        }
    };

    return (
        <div>
            <h2>Products</h2>

            <div style={{ marginBottom: 20 }}>
                <strong>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</strong>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                {/* Campo de búsqueda */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Input
                        placeholder="Search products..."
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Col>

                {/* Selección de categoría */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                        placeholder="Select Category"
                        value={selectedCategory}
                        onChange={value => setSelectedCategory(value)}
                        style={{ width: '100%' }}
                    >
                        <Option value={null}>
                            All ({products.length})
                        </Option>
                        {['Electronics', 'Clothing and Fashion', 'Home and Kitchen', 'Toys and Games', 'Beauty and Personal Care', 'Sports and Outdoors', 'Books and Stationery'].map(category => (
                            <Option key={category} value={category}>
                                {category} ({categoryCounts[category] || 0})
                            </Option>
                        ))}
                    </Select>
                </Col>


                <Col xs={24} sm={12} md={8} lg={6}>
                    <Row gutter={10}>
                        <Col span={12}>
                            <InputNumber
                                placeholder="Min Price"
                                onChange={value => setPriceRange([value || 0, priceRange[1]])}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col span={12}>
                            <InputNumber
                                placeholder="Max Price"
                                onChange={value => setPriceRange([priceRange[0], value || Infinity])}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                </Col>

                {/* Ordenar por precio */}
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Select
                        placeholder="Order by Price"
                        onChange={value => setPriceOrder(value)}
                        style={{ width: '100%' }}
                    >
                        <Option value="asc">Price: Low to High</Option>
                        <Option value="desc">Price: High to Low</Option>
                    </Select>
                </Col>
            </Row>









            <Row gutter={[16, 16]}>
                {filteredProducts.map(p => (
                    <Col
                        key={p.id}
                        xs={24} sm={12} md={8} lg={6} xl={5}
                        style={{ margin: "8px" }}
                    >

                        <Card
                            title={p.title}
                            cover={<img src={p.image} alt={p.title} style={{ padding: '10px', maxHeight: '400px', objectFit: 'contain' }} />}
                            style={{ width: "100%", minHeight: "250px", borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>${p.price}</div>
                                {/* Botón de compra */}
                                <Button
                                    type="primary"
                                    onClick={(e) => buyProduct(p.id, e)} // Manejar compra
                                    icon={<ShoppingOutlined />}
                                    size="large"
                                    style={{
                                        marginTop: '10px',
                                        width: '150px',
                                        textAlign: 'center',
                                        backgroundColor: '#52c41a',
                                        borderColor: '#52c41a',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ListProductsComponent;


