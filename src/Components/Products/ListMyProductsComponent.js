import { useState, useEffect } from "react";
import { Table, Space, Typography } from 'antd';
import { Link } from "react-router-dom";
import { timestampToString } from "../../Utils/UtilsDates";

const ListMyProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const { Text } = Typography;

    useEffect(() => {
        getMyProducts();
    }, []);

    const deleteProduct = async (id) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products/${id}`,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            const jsonData = await response.json();
            if (jsonData.deleted) {
                const productsAfterDelete = products.filter(p => p.id !== id);
                setProducts(productsAfterDelete);
            }
        } else {
            const responseBody = await response.json();
            const serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    const getMyProducts = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/products/own/`,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            const jsonData = await response.json();
            jsonData.forEach(product => {
                product.key = product.id;
            });
            setProducts(jsonData);
        } else {
            const responseBody = await response.json();
            const serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            responsive: ['md'],
            render: (text) => <Text style={{ fontSize: '12px' }}>{text}</Text>,
        },
        {
            title: "Seller Id",
            dataIndex: "sellerId",
            responsive: ['lg'],
            render: (text) => <Text style={{ fontSize: '12px' }}>{text}</Text>,
        },
        {
            title: "Title",
            dataIndex: "title",
            ellipsis: true,
            responsive: ['sm'],
            render: (text) => <Text style={{ fontSize: '12px', fontWeight: '500' }}>{text}</Text>,
        },
        {
            title: "Description",
            dataIndex: "description",
            ellipsis: true,
            responsive: ['md'],
            render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>,
        },
        {
            title: "Price (€)",
            dataIndex: "price",
            responsive: ['sm'],
            render: (price) => <Text strong style={{ fontSize: '12px' }}>{price}</Text>,
        },
        {
            title: "Date",
            dataIndex: "date",
            responsive: ['md'],
            render: (date) => <Text style={{ fontSize: '11px' }}>{timestampToString(date)}</Text>,
        },
        {
            title: "Buyer",
            dataIndex: [],
            responsive: ['sm'],
            render: (product) =>
                <Link to={`/user/${product.buyerId}`} style={{ fontSize: '11px' }}>{product.buyerEmail}</Link>
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (id) =>
                <Space direction="vertical" size="small">
                    <Link to={`/products/edit/${id}`} style={{ fontSize: '11px' }}>Edit</Link>
                    <Link to="#" onClick={() => deleteProduct(id)} style={{ fontSize: '11px' }}>Delete</Link>
                </Space>
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={products}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
            size="small"
            style={{ fontSize: '12px' }}
            rowClassName={() => 'custom-row'}
        />
    );
};

export default ListMyProductsComponent;
