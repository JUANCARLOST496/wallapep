import {useState, useRef} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import { Card, Input, Button, Form, Col, Row , Radio} from "antd";
import {RightOutlined, LeftOutlined, RightCircleOutlined} from "@ant-design/icons";


let CreateUserComponent = () => {
    const [currentStep, setCurrentStep] = useState(1);

    let [formData, setFormData] = useState({
        email: '',
        password: '',
        name:'',
        surname:'',
        documentIdentity:'',
        documentNumber:'',
        country:'',
        address:'',
        postalCode:'',
        birthday:''



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
                <Card
                    title="Create User"
                    style={{
                        margin: "20px",
                        height: "500px"
                    }}
                >
                    <Form layout="vertical">
                        {currentStep === 1 ? ( // Sección 1
                            <>
                                <Form.Item>
                                    <Input placeholder="Email"  value={formData.email}  onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)
                                    }}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input.Password placeholder="Password"  value={formData.password}  onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)}} />
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Name" value={formData.name} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "name", i.currentTarget.value)}}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Surname" value={formData.surname} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "surname", i.currentTarget.value)}}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Document Identity" value={formData.documentIdentity} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "documentIdentity", i.currentTarget.value)}}/>

                                </Form.Item>


                                <Form.Item>
                                    <Row>
                                        <Col span={16}></Col>
                                        <Col span={8}><Button type="primary" onClick={() => setCurrentStep(2)} style={{ backgroundColor: 'black', borderColor: 'black', width: '100%' }}>NEXT<RightOutlined /></Button></Col>
                                    </Row>

                                </Form.Item>
                            </>
                        ) : ( // Sección 2
                            <>

                                <Form.Item>
                                    <Input placeholder="Document Number" value={formData.documentNumber} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "documentNumber", i.currentTarget.value)}}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Country" value={formData.country} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "country", i.currentTarget.value)}}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Address" value={formData.address} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "address", i.currentTarget.value)}}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Postal Code" value={formData.postalCode} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "postalCode", i.currentTarget.value)}}/>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="Birthday year" value={formData.birthday} onChange={(i) => {
                                        modifyStateProperty(formData, setFormData, "birthday", i.currentTarget.value)}}/>
                                </Form.Item>
                                <Form.Item>
                                    <Row>
                                    <Col span={16}></Col>
                                    <Col span={8}><Button type="primary" onClick={() => setCurrentStep(1)} style={{ backgroundColor: 'black', borderColor: 'black' , width: '100%'}}><LeftOutlined />PREVIOUS</Button></Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" style={{ width: '100%' }} onClick={clickCreate}>Create User</Button>
                                </Form.Item>

                            </>
                        )}
                        {/* Botón para alternar secciones en el formulario */}

                    </Form>
                </Card>
            </Col>
        </Row>
    );

}

export default CreateUserComponent;