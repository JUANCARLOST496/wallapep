import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import EditProductComponent from "./Components/Products/EditProductComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";
import CreateProductComponent from "./Components/Products/CreateProductComponent";
import ListMyProductsComponent from "./Components/Products/ListMyProductsComponent";
import ListMyTransactionsComponent from "./Components/Products/ListMyTransactionsComponent";
import {Route, Routes, Link, useNavigate, useLocation } from "react-router-dom"
import {Layout, Menu, Avatar, Typography, Col, Row, notification } from 'antd';
import {
    AreaChartOutlined,
    CreditCardOutlined,
    FireOutlined,
    LoginOutlined,
    LogoutOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    FormOutlined
} from '@ant-design/icons';
import {useEffect, useState} from "react";
import MainPage from "./main";
import UserProfile from "./Components/User/UserProfile";
import SProfile from "./Components/User/SProfile";


let App = () => {
    const [api, contextHolder] = notification.useNotification();

    let navigate = useNavigate();
    let location = useLocation();
    let [login, setLogin] = useState(false);
    const [sellerId, setSellerId] = useState(null);
    // for not using Layout.Header, Layout.Footer, etc...
    let {Header, Content, Footer} = Layout;

    useEffect(() => {
        checkAll();
        getMyTransactions();
    }, [])


    let getMyTransactions = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/own/",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            // Asigna el sellerId de la primera transacción (o ajusta según tu lógica)
            if (jsonData.length > 0) {
                setSellerId(jsonData[0].sellerId);
                
            }
        }
    };

    // Función para manejar el clic en el avatar
    const handleAvatarClick = () => {
        if (sellerId) {
            console.log("Seller ID en clic:", sellerId);
        }
    };


    let checkAll = async () => {
        let isActive = await checkLoginIsActive()
        checkUserAccess(isActive)
    }

    const openNotification = (placement, text, type) => {
        api[type]({
            message: 'Notification',
            description: text,
            placement,
        });
    };

    let checkLoginIsActive = async () => {
        if (localStorage.getItem("apiKey") == null) {
            setLogin(false);
            return;
        }

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/isActiveApiKey",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        if (response.ok) {
            let jsonData = await response.json();
            setLogin(jsonData.activeApiKey)

            if (!jsonData.activeApiKey){
                navigate("/login")
            }
            return(jsonData.activeApiKey)
        } else {
            setLogin(false)
            navigate("/login")
            return (false)
        }
    }

    let checkUserAccess= async (isActive) => {
        let href = location.pathname
        if (!isActive && !["/","/login","/register"].includes(href) ){
            navigate("/login")
        }
    }

    let disconnect = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/disconnect",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        localStorage.removeItem("apiKey");
        setLogin(false)
        navigate("/login")
    }


    const {Text} = Typography;
    return (
        <Layout className="layout" style={{minHeight: "100vh"}}>
            {contextHolder}
            <Header>
                <Row>
                    <Col xs= {18} sm={19} md={20} lg={21} xl = {22}>
                        {!login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo",
                                    label: (
                                        <Link to="/">
                                            <img src="/logo.png" width="40" height="40" alt="Logo" style={{ marginRight: '20px' }}/>

                                        </Link>
                                    )},
                                {key: "menuLogin", icon: <LoginOutlined/>, label: <Link to="/login">Login</Link>},
                                {key: "menuRegister", icon:<FormOutlined />,label: <Link to="/register">Register</Link>},
                            ]}>
                            </Menu>
                        }

                        {login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo",
                                    label: (
                                <Link to="/">
                                <img src="/logo.png" width="40" height="40" alt="Logo" style={{ marginRight: '20px' }}/>
                                </Link>
                                )},
                                {key: "menuProducts", icon: <ShoppingOutlined style={{ fontSize: '20px' }}/> , label: <Link to="/products">Products for Sale</Link>},
                                {key: "menuMyProduct",icon: <ShoppingCartOutlined style={{ fontSize: '20px' }}/>, label: <Link to="/products/own">My Products for Sale</Link> },
                                {key: "menuCreateProduct",icon: <FireOutlined style={{ fontSize: '20px' }}/> , label: <Link to="/products/create">Upload Product</Link> },
                                {key: "menuTransactions",  icon: <CreditCardOutlined  style={{ fontSize: '20px' }}/> ,label:<Link to="/transactions/own">My Transactions</Link> },
                                {key: "menuDisconnect", icon: <LogoutOutlined  style={{ fontSize: '20px' }}/>, label: <Link to="#" onClick={disconnect}>Disconnect</Link>},
                            ]}>
                            </Menu>
                        }
                    </Col>

                    <Col xs= {6} sm={5} md = {4}  lg = {3} xl = {2}
                         style={{display: 'flex', flexDirection: 'row-reverse' }} >
                        { login ? (
                            <Link to={`/profile/${sellerId}`} onClick={handleAvatarClick}>
                                <Avatar size="large" style={{ backgroundColor: "#ff0000", verticalAlign: 'middle' }}>
                                    {localStorage.getItem("email").charAt(0)}
                                </Avatar>
                            </Link>
                        ) : (
                            <Link to="/login"> <Text style={{ color:"#ffffff" }}></Text></Link>
                        )}
                    </Col>

                </Row>
            </Header>
            <Content style={{padding: "20px 50px"}}>
                <div className="site-layout-content">
                    <Routes>
                        <Route path="/" element={
                           <MainPage/>
                        }/>
                        <Route path="/register" element={
                            <CreateUserComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/login"  element={
                            <LoginFormComponent setLogin={setLogin} openNotification={openNotification}/>
                        }/>
                        <Route path="/products" element={
                            <ListProductsComponent/>
                        }/>
                        <Route path="/products/edit/:id" element={
                            <EditProductComponent/>
                        }/>
                        <Route path="/products/:id" element={
                            <DetailsProductComponent/>
                        }/>
                        <Route path="/products/create" element={
                            <CreateProductComponent />
                        }></Route>
                        <Route path="/products/own" element={
                            <ListMyProductsComponent />
                        }></Route>
                        <Route path="/transactions/own" element={
                            <ListMyTransactionsComponent />
                        }></Route>
                        <Route path="/profile/:id" element={
                            <UserProfile />
                        }></Route>
                        <Route path="/SProfile/:id" element={
                            <SProfile />
                        }></Route>
                    </Routes>
                </div>
            </Content>

            <Footer style={{textAlign: "center"}}> Wallapep </Footer>
        </Layout>
)
}

export default App;