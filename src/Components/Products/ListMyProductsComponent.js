import { useState, useEffect } from "react";
import { Table, Space, Typography, Row, Col, Card, Statistic } from 'antd';
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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

    // Cálculo de estadísticas
    const getTotalPrice = () => {
        return products.reduce((acc, product) => acc + (product.price || 0), 0);
    };

    const getSoldProductsCount = () => {
        return products.filter(p => p.buyerId).length;
    };

    const getTotalEarnings = () => {
        return products
            .filter(p => p.buyerId)
            .reduce((acc, product) => acc + (product.price || 0), 0);
    };

    const columns = [
        {
            title: <div style={{ textAlign: 'center' }}>Title</div>,
            dataIndex: "title",
            ellipsis: true,
            responsive: ['sm'],
            render: (text) => <Text style={{ fontSize: '16px', fontWeight: '500', paddingLeft: '8px', paddingRight: '8px' }}>{text}</Text>,
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: <div style={{ textAlign: 'center' }}>Description</div>,
            dataIndex: "description",
            ellipsis: true,
            responsive: ['md'],
            render: (text) => <Text style={{ fontSize: '15px', paddingLeft: '12px', paddingRight: '12px' }}>{text}</Text>,
        },
        {
            title: <div style={{ textAlign: 'center' }}>Price (€)</div>,
            dataIndex: "price",
            responsive: ['sm'],
            align: 'right',
            render: (price) => <Text strong style={{ fontSize: '16px' }}>{price}</Text>,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: <div style={{ textAlign: 'center' }}>Date</div>,
            dataIndex: "date",
            align: 'right',
            responsive: ['md'],
            render: (date) => <Text style={{ fontSize: '15px', paddingLeft: '12px', paddingRight: '12px' }}>{timestampToString(date)}</Text>,
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: <div style={{ textAlign: 'center' }}>State of sale</div>,
            dataIndex: "buyerId",
            key: "estadoVenta",
            filters: [
                { text: 'Sold', value: true },
                { text: 'Unsold', value: false },
            ],
            onFilter: (value, record) => Boolean(record.buyerId) === value,
            render: (buyerId) =>
                buyerId ? (
                    <Text strong style={{ color: 'green' }}>sold</Text>
                ) : (
                    <Text strong style={{ color: 'red' }}>unsold</Text>
                ),
            align: 'center',
        },
        {
            title: <div style={{ textAlign: 'center' }}>Buyer</div>,
            dataIndex: [],
            responsive: ['sm'],
            render: (product) =>
                product.buyerId ? (
                    <Link to={`/SProfile/${product.buyerId}`} style={{ fontSize: '15px', paddingLeft: '12px', paddingRight: '12px' }}>{product.buyerName}</Link>
                ) : (
                    <Text>-</Text>
                ),
        },
        {
            title: <div style={{ textAlign: 'center' }}>Actions</div>,
    dataIndex: "id",
    render: (id, product) =>
        !product.buyerId ? (
            // Si el producto no está vendido, mostramos las acciones de "Editar" y "Eliminar"
            <Space size="middle">
                <Link to={`/products/edit/${id}`} style={{ fontSize: '16px' }}>
                    <EditOutlined /> Edit
                </Link>
                <a onClick={() => deleteProduct(id)} style={{ fontSize: '16px', color: 'red' }}>
                    <DeleteOutlined /> Delete
                </a>
            </Space>
        ) : (
            // Si el producto está vendido, mostramos el mensaje
            <Text style={{ color: 'grey' }}>
                Sold, no longer possible to edit or delete
            </Text>
        ),
        },
    ];
    

    return (
        <div>

            {/* Estadísticas */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={8}>
                    <Card bordered={false} style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                        <Statistic
                            title="Product List"
                            value={products.length}
                            valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                        <Statistic
                            title="Sales"
                            value={getSoldProductsCount()}
                            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                        <Statistic
                            title="Earnings"
                            value={getTotalEarnings().toFixed(2)}
                            prefix="€"  
                            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Tabla de productos */}
            <Table
                columns={columns}
                dataSource={products}
                pagination={{ pageSize: 15 }}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered={true}
                style={{ fontSize: '14px' }}
                rowClassName={() => 'custom-row'}
            />
        </div>
    );
};

export default ListMyProductsComponent;








