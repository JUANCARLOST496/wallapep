import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Card, Input, Button, Row, Col, Form, Typography, Upload, Select} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../Reducers/reducerCountSlice"
const { Option } = Select;

let CreateProductComponent = () => {
    const countGlobalState1 = useSelector(state => state.reducerCount);
    const countGlobalState2 = useSelector(state => state.reducerCountSlice);
    const dispatch = useDispatch();

    let [formData, setFormData] = useState({})
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

    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            })

        if (response.ok) {
            let data = await response.json()
            await uploadImage(data.productId)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    let uploadImage = async (productId) => {
        let formDataPhotos = new FormData();
        formDataPhotos.append('image', formData.image);
        formDataPhotos.append('productId', productId);

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/"+productId+"/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataPhotos
            })
        if (response.ok) {

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }

    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                <Card title="Create product" style={{width: "500px"}}>


                    <Form.Item label="">
                        <Input onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "title", i.currentTarget.value)}
                               size="large" type="text" placeholder="product title"></Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Input onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "description", i.currentTarget.value)}
                               size="large" type="text" placeholder="description"></Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Input onChange={
                            (i) => modifyStateProperty(
                                formData, setFormData, "price", i.currentTarget.value)}
                               size="large" type="number" placeholder="price"></Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Select
                            placeholder="Select Category"
                            onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)} // Aquí pasamos el valor directamente
                            size="large">
                            {categories.map((category) => (
                                <Select.Option key={category} value={category}> {/* Asegúrate de usar Select.Option en lugar de Option */}
                                    {category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="image">
                        <Upload maxCount={1} action={
                            (file) => modifyStateProperty(
                                formData, setFormData, "image", file)} listType="picture-card">
                            Upload
                        </Upload>
                    </Form.Item>

                    <Button type="primary" block onClick={clickCreateProduct}>Sell Product</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateProductComponent;