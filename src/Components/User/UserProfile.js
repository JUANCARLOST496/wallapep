import { useEffect, useState } from 'react';
import { Card, Typography, List, Divider, Row, Col } from 'antd';
import { UserOutlined, ShoppingCartOutlined, FileDoneOutlined, DollarOutlined, UserAddOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [sellerTransactions, setSellerTransactions] = useState([]);
  const [buyerTransactions, setBuyerTransactions] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);

  const userId = localStorage.getItem('userId'); // Lee el userId del localStorage

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) setApiKey(storedApiKey);
  }, []);

  useEffect(() => {
    if (!userId || !apiKey) return;

    const headers = {
      'Content-Type': 'application/json',
      'apiKey': apiKey.trim(),
    };

    // Datos de usuario
    fetch(`http://localhost:4000/users/${userId}`, { headers })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Error al obtener el usuario:", err));

    // Transacciones como vendedor
    fetch(`http://localhost:4000/transactions/public?sellerId=${userId}`, { headers })
      .then(res => res.json())
      .then(async (data) => {
        const txs = await Promise.all(data.map(async (tx) => {
          try {
            const res = await fetch(`http://localhost:4000/products/${tx.productId}`, { headers });
            const product = await res.json();
            return { ...tx, product };
          } catch (err) {
            console.error("Error producto vendedor:", err);
            return { ...tx, product: null };
          }
        }));
        setSellerTransactions(txs);
      })
      .catch(err => console.error("Error transacciones vendedor:", err));

    // Transacciones como comprador
    fetch(`http://localhost:4000/transactions/public?buyerId=${userId}`, { headers })
      .then(res => res.json())
      .then(async (data) => {
        const txs = await Promise.all(data.map(async (tx) => {
          try {
            const res = await fetch(`http://localhost:4000/products/${tx.productId}`, { headers });
            const product = await res.json();
            return { ...tx, product };
          } catch (err) {
            console.error("Error producto comprador:", err);
            return { ...tx, product: null };
          }
        }));
        setBuyerTransactions(txs);
      })
      .catch(err => console.error("Error transacciones comprador:", err));

    // Productos vendidos
    fetch(`http://localhost:4000/products?sellerId=${userId}`, { headers })
      .then(res => res.json())
      .then(data => setSoldProducts(data))
      .catch(err => console.error("Error al obtener productos vendidos:", err));

  }, [userId, apiKey]);

  return (
    <Card title="Perfil del Usuario" style={{ maxWidth: '100%', margin: '2rem auto' }}>
      {userId ? (
        <>
          {user ? (
            <Row gutter={16} style={{ marginBottom: '1rem' }}>
              <Col span={8}>
                <Title level={4}><UserOutlined style={{ color: '#1890ff' }} /> {user.name || 'Nombre no disponible'}</Title>
                <Paragraph><ShoppingCartOutlined style={{ color: '#52c41a' }} /> {user.email}</Paragraph>
              </Col>
            </Row>
          ) : (
            <Paragraph>Cargando usuario...</Paragraph>
          )}

          <Divider />
          <Row gutter={16}>
            <Col span={8}>
              <Title level={5}><FileDoneOutlined style={{ color: '#ff4d4f' }} /> Transacciones como vendedor:</Title>
              {sellerTransactions.length > 0 ? (
                <List
                  bordered
                  dataSource={sellerTransactions}
                  renderItem={(item) => (
                    <List.Item>
                      <strong>{item.title}</strong>
                      <br />
                      {item.product ? (
                        <>
                          <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{item.product.price}€</span>
                        </>
                      ) : (
                        <em>Producto no disponible</em>
                      )}
                    </List.Item>
                  )}
                />
              ) : (
                <Paragraph>No hay transacciones como vendedor.</Paragraph>
              )}
            </Col>

            <Col span={8}>
              <Title level={5}><ShoppingCartOutlined style={{ color: '#fa8c16' }} /> Transacciones como comprador:</Title>
              {buyerTransactions.length > 0 ? (
                <List
                  bordered
                  dataSource={buyerTransactions}
                  renderItem={(item) => (
                    <List.Item>
                      <strong>{item.title}</strong>
                      <br />
                      {item.product ? (
                        <>
                          <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{item.product.price}€</span>
                        </>
                      ) : (
                        <em>Producto no disponible</em>
                      )}
                    </List.Item>
                  )}
                />
              ) : (
                <Paragraph>No hay transacciones como comprador.</Paragraph>
              )}
            </Col>

            <Col span={8}>
              <Title level={5}><DollarOutlined style={{ color: '#34a853' }} /> Productos vendidos:</Title>
              {soldProducts.length > 0 ? (
                <List
                  bordered
                  dataSource={soldProducts}
                  renderItem={(product) => (
                    <List.Item>
                      <strong>{product.title}</strong> — 
                      <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{product.price}€</span>
                      <br />
                      <UserAddOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> Comprador: {product.buyerName} ({product.buyerEmail})
                      <br />
                      <FileTextOutlined style={{ color: '#fa8c16', marginRight: 8 }} /> {product.description} — 
                      <CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} /> {new Date(product.date).toLocaleString()}
                    </List.Item>
                  )}
                />
              ) : (
                <Paragraph>No has vendido productos aún.</Paragraph>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <Paragraph>No se encontró el ID del usuario en el almacenamiento.</Paragraph>
      )}
    </Card>
  );
};

export default UserProfile;



