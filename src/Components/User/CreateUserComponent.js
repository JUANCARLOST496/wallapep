import { useState, useEffect } from "react";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { modifyStateProperty } from "../../Utils/UtilsState";
import { ConfigProvider, Card, Input, Button, Form, Col, Row, DatePicker, Select, Typography, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from "antd/lib/locale/en_US";

const { Option } = Select;

let CreateUserComponent = () => {
    const [currentStep, setCurrentStep] = useState(1);
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
    const [countries, setCountries] = useState([]); // Estado para almacenar la lista de países
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
            resetForm(); // Limpiar el formulario después de la creación
            navigate("/login");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    const isStep1Valid = formData.email && formData.password && formData.name && formData.surname;
    const isStep2Valid = formData.postalCode && formData.birthday;

    return (
        <ConfigProvider locale={enUS}>
            <Row align="middle" justify="center" style={{ minHeight: "80vh", backgroundColor: "#f0f2f5" }}>
                <Col xs={24} sm={24} md={12} lg={8}>
                    <Card
                        title={<Typography.Title level={3} style={{ textAlign: "center", fontSize: "20px" }}>Create User</Typography.Title>}
                        bordered={false}
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            margin: "20px",
                            padding: "20px",
                            fontSize: "14px"
                        }}
                    >
                        <Form layout="vertical">
                            {currentStep === 1 ? (
                                <>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Email" required>
                                                <Input
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={(i) => handleFieldChange("email", i.currentTarget.value)}
                                                    style={{ padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Password" required>
                                                <Input.Password
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={(i) => handleFieldChange("password", i.currentTarget.value)}
                                                    style={{ padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Name" required>
                                                <Input
                                                    placeholder="Name"
                                                    value={formData.name}
                                                    onChange={(i) => handleFieldChange("name", i.currentTarget.value)}
                                                    style={{ padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Surname" required>
                                                <Input
                                                    placeholder="Surname"
                                                    value={formData.surname}
                                                    onChange={(i) => handleFieldChange("surname", i.currentTarget.value)}
                                                    style={{ padding: "8px", borderRadius: "4px", fontSize: "14px" }}
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
                                    <Form.Item>
                                        <Row justify="end">
                                            <Button
                                                type="primary"
                                                onClick={() => setCurrentStep(2)}
                                                disabled={!isStep1Valid}
                                                style={{
                                                    backgroundColor: isStep1Valid ? '#1890ff' : '#d9d9d9',
                                                    borderColor: isStep1Valid ? '#1890ff' : '#d9d9d9',
                                                    width: '100%',
                                                    height: '36px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                NEXT<RightOutlined />
                                            </Button>
                                        </Row>
                                    </Form.Item>
                                </>
                            ) : (
                                <>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Document Number">
                                                <Input
                                                    placeholder="Document Number"
                                                    value={formData.documentNumber}
                                                    onChange={(i) => handleFieldChange("documentNumber", i.currentTarget.value)}
                                                    style={{ padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Country" required>
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
                                            style={{ padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                                        />
                                    </Form.Item>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Postal Code" required>
                                                <Input
                                                    placeholder="Postal Code"
                                                    value={formData.postalCode}
                                                    onChange={(i) => handleFieldChange("postalCode", i.currentTarget.value)}
                                                    style={{ padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Birthday" required>
                                                <DatePicker
                                                    style={{ width: '100%', padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                                                    onChange={(date) => handleFieldChange("birthday", date)}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item>
                                        <Row justify="space-between">
                                            <Button
                                                type="default"
                                                onClick={() => setCurrentStep(1)}
                                                style={{
                                                    width: '45%',
                                                    height: '36px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <LeftOutlined /> PREVIOUS
                                            </Button>
                                            <Button
                                                type="primary"
                                                style={{
                                                    width: '45%',
                                                    height: '36px',
                                                    fontSize: '14px'
                                                }}
                                                onClick={clickCreate}
                                                disabled={!isStep2Valid}
                                            >
                                                Create User
                                            </Button>
                                        </Row>
                                    </Form.Item>
                                </>
                            )}
                        </Form>
                    </Card>
                </Col>
            </Row>
        </ConfigProvider>
    );
}

export default CreateUserComponent;







