import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Card, List, Typography} from "antd";

let UserProfileComponent = () => {
    const { userId } = useParams(); // Para obtener el ID del usuario desde la URL
    const [userData, setUserData] = useState(null);
    const [userTransactions, setUserTransactions] = useState([]);
    const [userProducts, setUserProducts] = useState([]);

    useEffect(() => {
        fetchUserProfile();
        fetchUserTransactions();
        fetchUserProducts();
    }, []);

    const fetchUserProfile = async () => {
        let response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${userId}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );
        if (response.ok) {
            let jsonData = await response.json();
            setUserData(jsonData);
        }
    };

    const fetchUserTransactions = async () => {
        let response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?sellerId=${userId}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );
        if (response.ok) {
            let jsonData = await response.json();
            setUserTransactions(jsonData);
        }
    };

    const fetchUserProducts = async () => {
        let response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products?sellerId=${userId}`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );
        if (response.ok) {
            let jsonData = await response.json();
            setUserProducts(jsonData);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{padding: '20px'}}>

            <Card title={`${userData?.name}'s Profile`} style={{marginBottom: '20px'}}>
                <Typography.Paragraph>Name: {userData?.name}</Typography.Paragraph>
                <Typography.Paragraph>Email: {userData?.email}</Typography.Paragraph>

            </Card>

            {/* Transacciones del Usuario */}
            <Card title="Transactions" style={{marginBottom: '20px'}}>
                <List
                    bordered
                    dataSource={userTransactions}
                    renderItem={transaction => (
                        <List.Item key={transaction.id}>
                            <Typography.Text>
                                Transaction ID: {transaction.id} - Price: €{transaction.productPrice}
                            </Typography.Text>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Productos en Venta del Usuario */}
            <Card title="Products for Sale">
                <List
                    bordered
                    dataSource={userProducts}
                    renderItem={product => (
                        <List.Item key={product.id}>
                            <Typography.Text>
                                Product: {product.title} - Price: €{product.price}
                            </Typography.Text>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default UserProfileComponent;