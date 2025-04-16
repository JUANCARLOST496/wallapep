import { useState, useEffect } from "react";
import { RightOutlined } from "@ant-design/icons";
import { modifyStateProperty } from "../../Utils/UtilsState";
import { ConfigProvider, Card, Input, Button, Form, Col, Row, DatePicker, Select, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";

const { Option } = Select;

let CreateUserComponent = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        documentType: '',
        documentNumber: '',
        country: '',
        address: '',
        postalCode: '',
        birthday: ''
    });
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    // Llamada a la API de países al montar el componente
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const data = await response.json();
                const countryNames = data.map((country) => country.name.common).sort();
                setCountries(countryNames);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchCountries();
    }, []);

    const handleFieldChange = (field, value) => {
        modifyStateProperty(formData, setFormData, field, value);
    };

    const openNotification = (placement, message, description) => {
        notification.success({
            message: message,
            description: description,
            placement: placement,
        });
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            name: '',
            surname: '',
            documentType: '',
            documentNumber: '',
            country: '',
            address: '',
            postalCode: '',
            birthday: ''
        });
    };

    let clickCreate = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                birthday: formData.birthday ? formData.birthday.valueOf() : null
            })
        });

        if (response.ok) {
            openNotification("topRight", "User Created", "The user has been successfully created.");
            resetForm();
            navigate("/login");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    const isFormValid = formData.email && formData.password;

    return (
        <ConfigProvider locale={enUS}>
            <Row align="middle" justify="center" style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
                <Col xs={24} sm={24} md={20} lg={12} xl={10}> {/* Se ajusta el tamaño para diferentes dispositivos */}
                    <Card
                        title={<Typography.Title level={3} style={{ textAlign: "center", fontSize: "24px", fontWeight: "600" }}>Create User</Typography.Title>}
                        bordered={false}
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            margin: "20px",
                            padding: "30px",  // Mayor padding para mejor espaciado
                            fontSize: "14px",
                            maxWidth: "600px", // Ancho máximo para la card
                            width: "100%",
                        }}
                    >
                        <Form layout="vertical">
                            {/* Email and Password Fields (Required) */}
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item label="Email" required>
                                        <Input
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(i) => handleFieldChange("email", i.currentTarget.value)}
                                            style={{ padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Password" required>
                                        <Input.Password
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(i) => handleFieldChange("password", i.currentTarget.value)}
                                            style={{ padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Other Fields (Not Required) */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Name">
                                        <Input
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={(i) => handleFieldChange("name", i.currentTarget.value)}
                                            style={{ padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Surname">
                                        <Input
                                            placeholder="Surname"
                                            value={formData.surname}
                                            onChange={(i) => handleFieldChange("surname", i.currentTarget.value)}
                                            style={{ padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Document Type">
                                <Select
                                    placeholder="Select Document Type"
                                    onChange={(value) => handleFieldChange("documentType", value)}
                                    style={{ width: "100%", borderRadius: "4px", fontSize: "14px" }}
                                >
                                    <Option value="DNI">DNI</Option>
                                    <Option value="Passport">Passport</Option>
                                    <Option value="NIE">NIE</Option>
                                    <Option value="TIE">TIE</Option>
                                </Select>
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Document Number">
                                        <Input
                                            placeholder="Document Number"
                                            value={formData.documentNumber}
                                            onChange={(i) => handleFieldChange("documentNumber", i.currentTarget.value)}
                                            style={{ padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Country">
                                        <Select
                                            showSearch
                                            placeholder="Select Country"
                                            value={formData.country}
                                            onChange={(value) => handleFieldChange("country", value)}
                                            style={{ width: "100%", borderRadius: "4px", fontSize: "14px" }}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {countries.map((country) => (
                                                <Option key={country} value={country}>{country}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Address">
                                <Input
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={(i) => handleFieldChange("address", i.currentTarget.value)}
                                    style={{ padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Postal Code">
                                        <Input
                                            placeholder="Postal Code"
                                            value={formData.postalCode}
                                            onChange={(i) => handleFieldChange("postalCode", i.currentTarget.value)}
                                            style={{ padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Birthday">
                                        <DatePicker
                                            style={{ width: '100%', padding: "10px", borderRadius: "4px", fontSize: "14px" }}
                                            onChange={(date) => handleFieldChange("birthday", date)}
                                            disabledDate={(current) => current && current > new Date()}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Row justify="center">
                                    <Button
                                        type="primary"
                                        onClick={clickCreate}
                                        disabled={!isFormValid}
                                        style={{
                                            backgroundColor: isFormValid ? '#1890ff' : '#d9d9d9',
                                            borderColor: isFormValid ? '#1890ff' : '#d9d9d9',
                                            width: '100%',
                                            height: '40px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Create User
                                    </Button>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </ConfigProvider>
    );
}

export default CreateUserComponent;











