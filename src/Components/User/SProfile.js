import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Typography, List, Row, Col, Tag, Button,
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const SProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [sellerTransactions, setSellerTransactions] = useState([]);
  const [buyerTransactions, setBuyerTransactions] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) setApiKey(storedApiKey);
  }, []);

  useEffect(() => {
    if (!id || !apiKey) return;

    const headers = {
      'Content-Type': 'application/json',
      'apiKey': apiKey.trim(),
    };

    fetch(`http://localhost:4000/users/${id}`, { headers })
      .then(res => res.json())
      .then(setUser)
      .catch(err => console.error("Error al obtener el usuario:", err));

    fetch(`http://localhost:4000/transactions/public?sellerId=${id}`, { headers })
      .then(res => res.json())
      .then(async (data) => {
        const txs = await Promise.all(data.map(async (tx) => {
          try {
            const res = await fetch(`http://localhost:4000/products/${tx.productId}`, { headers });
            const product = await res.json();
            return { ...tx, product };
          } catch {
            return { ...tx, product: null };
          }
        }));
        setSellerTransactions(txs);
      });

    fetch(`http://localhost:4000/transactions/public?buyerId=${id}`, { headers })
      .then(res => res.json())
      .then(async (data) => {
        const txs = await Promise.all(data.map(async (tx) => {
          try {
            const res = await fetch(`http://localhost:4000/products/${tx.productId}`, { headers });
            const product = await res.json();
            return { ...tx, product };
          } catch {
            return { ...tx, product: null };
          }
        }));
        setBuyerTransactions(txs);
      });

    fetch(`http://localhost:4000/products?sellerId=${id}`, { headers })
      .then(res => res.json())
      .then((products) => {
        // Ordenar los productos por precio de menor a mayor
        const sortedProducts = products.sort((a, b) => a.price - b.price);
        setSoldProducts(sortedProducts);
      })
      .catch(err => console.error("Error Sales:", err));
  }, [id, apiKey]);

  return (
    <div style={{ padding: '2rem' }}>
      <Card title={<span style={{ fontSize: '25px', fontWeight: 'bold' }}>Profile</span>} style={{ marginBottom: '1.5rem' }}>
        {user ? (
          <>
            <Title level={4}>
              <UserOutlined style={{ color: '#722ed1' }} /> {user.name || 'Nombre no disponible'}
            </Title>
            <Paragraph>{user.email}</Paragraph>
          </>
        ) : (
          <Paragraph>Cargando usuario...</Paragraph>
        )}
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card title={<><DollarCircleOutlined style={{ color: '#fa8c16' }} /> Sold products</>}>
            {sellerTransactions.length > 0 ? (
              <List
                size="small"
                dataSource={sellerTransactions}
                renderItem={(item) => (
                  <List.Item>
                    <strong>{item.title}</strong><br />
                    {item.product ? (
                      <Tag color="green">${item.product.price}</Tag>
                    ) : (
                      <Tag color="red">Producto no disponible</Tag>
                    )}
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph>No hay transacciones como vendedor.</Paragraph>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={<><ShoppingCartOutlined style={{ color: '#13c2c2' }} /> Purchased products</>}>
            {buyerTransactions.length > 0 ? (
              <List
                size="small"
                dataSource={buyerTransactions}
                renderItem={(item) => (
                  <List.Item>
                    <strong>{item.title}</strong><br />
                    {item.product ? (
                      <Tag color="blue">${item.product.price}</Tag>
                    ) : (
                      <Tag color="red">Producto no disponible</Tag>
                    )}
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph>No hay transacciones como comprador.</Paragraph>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={<><CheckCircleOutlined style={{ color: '#52c41a' }} /> For sale</>}>
            {soldProducts.length > 0 ? (
              <List
                size="small"
                dataSource={soldProducts}
                renderItem={(product) => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div style={{ flex: 1 }}>
                        <strong>{product.title}</strong>
                        <br />
                        <Tag color="cyan">{new Date(product.date).toLocaleString()}</Tag>
                        {/* Vendedor */}
                        <br />
                        {/* Comprador como subtítulo en gris */}
                        {product.buyerEmail && (
                          <>
                            <h4 style={{ color: '#808080', margin: 0 }}>Buyer:</h4>
                            <a href={`/SProfile/${product.buyerId}`} style={{ color: '#1890ff' }}>
                              {product.buyerEmail}
                            </a>
                          </>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: '10px' }}>
                        {product.buyerEmail ? (
                          <Tag color="gold" style={{ whiteSpace: 'nowrap' }}>
                            ${product.price}
                          </Tag>
                        ) : (
                          <Tag color="red" style={{ whiteSpace: 'nowrap' }}>
                            Unsold
                          </Tag>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph>No has vendido productos aún.</Paragraph>
            )}
          </Card>
        </Col>
      </Row>

      {/* Botón al final de la página */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ color: '#888', fontSize: '16px' }}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default SProfile;




