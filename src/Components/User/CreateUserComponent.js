import {useState, useRef} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import { Card, Input, Button, Form, Col, Row } from "antd";

let CreateUserComponent = () => {
    const [currentStep, setCurrentStep] = useState(1);

    let [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    let clickCreate = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/users", {
            method: "POST",
            headers: {"Content-Type": "application/json "},
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            let responseBody = await response.json();
            console.log("ok " + responseBody)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    return (


        <Row align="middle" justify="center" style={{ minHeight: "80vh" }}>
            <Col xs={24} sm={24} md={12} lg={10}>
                <Card title="Create User" style={{ margin: "20px" }}>
                    <Form layout="vertical">
                        {currentStep === 1 ? ( // Sección 1
                            <>
                                <Form.Item>
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <Form.Item>
                                    <Input.Password placeholder="Password" />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Name" />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Surname" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={() => setCurrentStep(2)}>Next →</Button>
                                </Form.Item>
                            </>
                        ) : ( // Sección 2
                            <>
                                <Form.Item>
                                    <Input placeholder="Document Identity" />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Document Number" />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Country" />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Address" />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Postal Code" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="default" onClick={() => setCurrentStep(1)} style={{ marginRight: "10px" }}>← Back</Button>
                                    <Button type="primary">Create User</Button>
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </Card>
            </Col>
        </Row>
    );

}

export default CreateUserComponent;