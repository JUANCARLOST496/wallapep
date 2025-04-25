import { useState, useEffect } from "react";
import { Table, Space, Typography, Row, Col, Card, Statistic } from 'antd';
import { timestampToString } from "../../Utils/UtilsDates";

const ListMyProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const { Text } = Typography;
    const currentUserId = localStorage.getItem("userId"); // <-- Aquí obtenemos el userId desde el localStorage

    useEffect(() => {
        getMyProducts();
    }, []);


    const getMyProducts = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/own/`, {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

    
        if (response.ok) {
            const jsonData = await response.json();
            jsonData.forEach(product => {
                product.key = product.id;
            });
            setProducts(jsonData);
            console.log("Productos recibidos:");
            console.table(jsonData);
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
            title: <div style={{ textAlign: 'center' }}>Status</div>,
            key: "estadosale",
            filters: [
                { text: 'purchase', value: 'purchase' },
                { text: 'sale', value: 'sale' },
            ],
            onFilter: (value, record) => {
                if (value == 'purchase') return record.buyerId == currentUserId;
                if (value == 'sale') return record.sellerId == currentUserId && record.buyerId;
                return true;
            },
            render: (_, record) => {
                const buyerId = parseInt(record.buyerId);
                const sellerId = parseInt(record.sellerId);
                
                // Agregamos más console.log para ver las evaluaciones de las condiciones
                console.log("buyerId:", buyerId, "sellerId:", sellerId, "currentUserId:", currentUserId);
            
                if (buyerId == currentUserId) {
                    console.log("purchase: El buyerId coincide con el currentUserId");
                    return <Text strong style={{ color: 'red' }}>purchase</Text>;
                } else if (sellerId == currentUserId && buyerId) {
                    console.log("sale: El sellerId coincide con el currentUserId y hay un buyerId");
                    return <Text strong style={{ color: 'green' }}>sale</Text>;
                } else {
                    console.log("Estado no encontrado");
                    return <Text type="secondary">—</Text>;
                }
            },
            
            align: 'center',
        }
    ];

    return (
        <div>
            {/* Estadísticas */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={6}>
                    <Card bordered={false} style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                        <Statistic
                            title="N.º de purchases"
                            value={products.filter(p => p.buyerId == currentUserId).length}
                            valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                        <Statistic
                            title="Total purchases"
                            value={products
                                .filter(p => p.buyerId == currentUserId)
                                .reduce((acc, product) => acc + (product.price || 0), 0)
                                .toFixed(2)}
                            prefix="€"
                            valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                        <Statistic
                            title="N.º de sales"
                            value={products.filter(p => p.sellerId == currentUserId && p.buyerId).length}
                            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} style={{ backgroundColor: '#f7f7f7', textAlign: 'center' }}>
                        <Statistic
                            title="Total sales"
                            value={products
                                .filter(p => p.sellerId == currentUserId && p.buyerId)
                                .reduce((acc, product) => acc + (product.price || 0), 0)
                                .toFixed(2)}
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
