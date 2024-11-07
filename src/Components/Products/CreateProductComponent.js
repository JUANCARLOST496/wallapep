import { useState } from "react";
import { modifyStateProperty } from "../../Utils/UtilsState";
import { Card, Input, Button, Row, Col, Form, Typography, Upload, Select, Grid, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../Reducers/reducerCountSlice";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la redirección
const { Option } = Select;
const { useBreakpoint } = Grid;

let CreateProductComponent = () => {
    const screens = useBreakpoint();
    const countGlobalState1 = useSelector(state => state.reducerCount);
    const countGlobalState2 = useSelector(state => state.reducerCountSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Inicializa useNavigate para redirección

    let [formData, setFormData] = useState({});
    let [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        "Electronics",
        "Clothing and Fashion",
        "Home and Kitchen",
        "Toys and Games",
        "Beauty and Personal Care",
        "Sports and Outdoors",
        "Books and Stationery"
    ];

    const [form] = Form.useForm();

    const isFormComplete = formData.title && formData.description && formData.price && formData.category && formData.image;

    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            });

        if (response.ok) {
            let data = await response.json();
            await uploadImage(data.productId);
            message.success('Added Product'); // Muestra mensaje de éxito
            navigate('/products'); // Redirige a /listproducts
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    let uploadImage = async (productId) => {
        let formDataPhotos = new FormData();
        formDataPhotos.append('image', formData.image);
        formDataPhotos.append('productId', productId);

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + productId + "/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataPhotos
            });
        if (response.ok) {
            console.log("Image uploaded successfully");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh", padding: "0 16px" }}>
            <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                <Card title="Create product" style={{ width: "100%" }}>
                    <Form form={form} layout="vertical" requiredMark="optional">
                        <Form.Item label="Product Title" required>
                            <Input
                                onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)}
                                size="large"
                                type="text"
                                placeholder="Product title"
                            />
                        </Form.Item>

                        <Form.Item label="Description" required>
                            <Input
                                onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)}
                                size="large"
                                type="text"
                                placeholder="Description"
                            />
                        </Form.Item>

                        <Form.Item label="Price" required>
                            <Input
                                onChange={(i) => modifyStateProperty(formData, setFormData, "price", i.currentTarget.value)}
                                size="large"
                                type="number"
                                placeholder="Price"
                            />
                        </Form.Item>

                        <Form.Item label="Category" required>
                            <Select
                                placeholder="Select Category"
                                onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)}
                                size="large"
                            >
                                {categories.map((category) => (
                                    <Select.Option key={category} value={category}>
                                        {category}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Image" required>
                            <Upload
                                maxCount={1}
                                customRequest={(options) => modifyStateProperty(formData, setFormData, "image", options.file)}
                                listType="picture-card"
                            >
                                Upload
                            </Upload>
                        </Form.Item>

                        <Button
                            type="primary"
                            block
                            onClick={clickCreateProduct}
                            disabled={!isFormComplete} // Desactivado hasta que todos los campos estén completos
                        >
                            Sell Product
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}

export default CreateProductComponent;
