import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Col, Row, Select, Input, InputNumber } from 'antd';

const { Option } = Select;

let ListProductsComponent = () => {
    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState(products);
    let [selectedCategory, setSelectedCategory] = useState(null);
    let [searchTerm, setSearchTerm] = useState("");
    let [priceRange, setPriceRange] = useState([0, Infinity]);
    let [priceOrder, setPriceOrder] = useState(null);

    // Obtén la ubicación actual para obtener los parámetros de la URL
    let location = useLocation();

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        // Extrae el parámetro de la categoría de la URL
        const queryParams = new URLSearchParams(location.search);
        const categoryFromUrl = queryParams.get('category');

        // Si existe una categoría en la URL, actualiza el estado
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [location]);

    useEffect(() => {
        // Filtrado y ordenación de productos
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

    return (
        <div>
            <h2>Products</h2>

            <Input
                placeholder="Search products..."
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 20, width: 300 }}
            />

            <Select
                placeholder="Select Category"
                value={selectedCategory} // Mantenemos el valor seleccionado
                onChange={value => setSelectedCategory(value)}
                style={{ width: 200, marginBottom: 20, marginLeft: 20 }}
            >
                <Option value={null}>All</Option>
                <Option value="Electronics">Electronics</Option>
                <Option value="Clothing and Fashion">Clothing and Fashion</Option>
                <Option value="Home and Kitchen">Home and Kitchen</Option>
                <Option value="Toys and Games">Toys and Games</Option>
                <Option value="Beauty and Personal Care">Beauty and Personal Care</Option>
                <Option value="Sports and Outdoors">Sports and Outdoors</Option>
                <Option value="Books and Stationery">Books and Stationery</Option>
            </Select>

            <InputNumber
                placeholder="Min Price"
                onChange={value => setPriceRange([value || 0, priceRange[1]])}
                style={{ width: 120, marginRight: 10 }}
            />
            <InputNumber
                placeholder="Max Price"
                onChange={value => setPriceRange([priceRange[0], value || Infinity])}
                style={{ width: 120 }}
            />

            <Select
                placeholder="Order by Price"
                onChange={value => setPriceOrder(value)}
                style={{ width: 200, marginLeft: 20 }}
            >
                <Option value="asc">Price: Low to High</Option>
                <Option value="desc">Price: High to Low</Option>
            </Select>

            <Row gutter={[16, 16]}>
                {filteredProducts.map(p => (
                    <Col span={8} key={p.id}>
                        <Link to={"/products/" + p.id}>
                            <Card title={p.title} cover={<img src={p.image} />}>
                                ${p.price}
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ListProductsComponent;