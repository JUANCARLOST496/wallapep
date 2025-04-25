import { useEffect, useState } from 'react';
import { Card, Typography, List, Divider, Row, Col } from 'antd';
import { UserOutlined, WalletOutlined, FileDoneOutlined, MailOutlined, DollarOutlined, ShoppingCartOutlined} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [sellerTransactions, setSellerTransactions] = useState([]);
  const [buyerTransactions, setBuyerTransactions] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [buyerNames, setBuyerNames] = useState({});
  const [sellerNames, setSellerNames] = useState({});

  const userId = localStorage.getItem('userId');

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

    fetch(`http://localhost:4000/users/${userId}`, { headers })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Error al obtener el usuario:", err));

    fetch(`http://localhost:4000/transactions/public?sellerId=${userId}`, { headers })
      .then(res => res.json())
      .then(async (data) => {
        const txs = await Promise.all(data.map(async (tx) => {
          try {
            const resProduct = await fetch(`http://localhost:4000/products/${tx.productId}`, { headers });
            const product = await resProduct.json();
            return { ...tx, product };
          } catch (err) {
            console.error("Error producto vendedor:", err);
            return { ...tx, product: null };
          }
        }));
        setSellerTransactions(txs);
      })
      .catch(err => console.error("Error transacciones vendedor:", err));

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

    fetch(`http://localhost:4000/products?sellerId=${userId}`, { headers })
      .then(res => res.json())
      .then(data => setSoldProducts(data))
      .catch(err => console.error("Error al obtener Sales:", err));

  }, [userId, apiKey]);

  useEffect(() => {
    const fetchBuyerNames = async () => {
      const uniqueBuyerIds = [...new Set(sellerTransactions.map(t => t.buyerId))];
      const names = {};
      await Promise.all(
        uniqueBuyerIds.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:4000/users/${id}`);
            const data = await res.json();
            names[id] = data.name;
          } catch (err) {
            names[id] = 'Desconocido';
          }
        })
      );
      setBuyerNames(names);
    };

    if (sellerTransactions.length > 0) {
      fetchBuyerNames();
    }
  }, [sellerTransactions]);

  useEffect(() => {
    const fetchSellerNames = async () => {
      const uniqueSellerIds = [...new Set(buyerTransactions.map(t => t.sellerId))];
      const names = {};
      await Promise.all(
        uniqueSellerIds.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:4000/users/${id}`);
            const data = await res.json();
            names[id] = data.name;
          } catch (err) {
            names[id] = 'Desconocido';
          }
        })
      );
      setSellerNames(names);
    };

    if (buyerTransactions.length > 0) {
      fetchSellerNames();
    }
  }, [buyerTransactions]);

  const totalSold = sellerTransactions.reduce((total, transaction) => total + (transaction.product ? 1 : 0), 0);
  const totalBought = buyerTransactions.reduce((total, transaction) => total + (transaction.product ? 1 : 0), 0);
  const totalSoldPrice = sellerTransactions.reduce((total, transaction) => total + (transaction.product ? transaction.product.price : 0), 0);
  const totalBoughtPrice = buyerTransactions.reduce((total, transaction) => total + (transaction.product ? transaction.product.price : 0), 0);

  return (
    <Card
      title={
        <Title level={1} style={{ fontSize: '30px', padding: '1rem' }}>
          Profile
        </Title>
      }
      style={{ maxWidth: '100%', margin: '2rem auto' }}
    >
      {userId ? (
        <>
          {user ? (
            <Row gutter={16} style={{ marginBottom: '1rem' }} >
              <Col span={8}>
                <Title level={4}><UserOutlined style={{ color: '#1890ff' }} /> {user.name || 'Nombre no disponible'}</Title>
                <Paragraph><MailOutlined style={{ color: '#808080' }} /> {user.email}</Paragraph>
              </Col>
            </Row>
          ) : (
            <Paragraph>Cargando usuario...</Paragraph>
          )}

          <Divider />
          <Row gutter={16} justify="left">
  <Col span={8}>
    <Title level={5}><DollarOutlined style={{ color: '#52c41a' }} /> Sold products</Title>
    {sellerTransactions.length > 0 ? (
      <List
        bordered
        dataSource={[...sellerTransactions].sort((a, b) => (a.product?.price ?? 0) - (b.product?.price ?? 0))}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <strong style={{ fontSize: '16px' }}>{item.title}</strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ color: '#595959' }}>
                <strong>Buyer:</strong> <a href={`http://localhost:3000/SProfile/${item.buyerId}`}>{buyerNames[item.buyerId] || 'Cargando...'}</a>
                </span>
                {item.product ? (
                  <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {item.product.price}€
                  </span>
                ) : (
                  <em>Producto no disponible</em>
                )}
              </div>
            </div>
          </List.Item>
        )}
      />
    ) : (
      <Paragraph>No hay transacciones como vendedor.</Paragraph>
    )}
  </Col>

  <Col span={8}>
    <Title level={5}><ShoppingCartOutlined style={{ color: '#ff4d4f' }} /> Purchased products</Title>
    {buyerTransactions.length > 0 ? (
      <List
        bordered
        dataSource={[...buyerTransactions].sort((a, b) => (a.product?.price ?? 0) - (b.product?.price ?? 0))}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <strong style={{ fontSize: '16px' }}>{item.title}</strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ color: '#595959' }}>
                <strong>Seller:</strong> <a href={`http://localhost:3000/SProfile/${item.sellerId}`}>{sellerNames[item.sellerId] || 'Cargando...'}</a>
                </span>
                {item.product ? (
                  <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {item.product.price}€
                  </span>
                ) : (
                  <em>Producto no disponible</em>
                )}
              </div>
            </div>
          </List.Item>
        )}
      />
    ) : (
      <Paragraph>No hay transacciones como comprador.</Paragraph>
    )}
  </Col>

  <Col span={8}>
  <Title level={5}><DollarOutlined style={{ color: '#34a853' }} /> Products Sales</Title>
  {soldProducts.length > 0 ? (
    <List
      bordered
      dataSource={[...soldProducts].sort((a, b) => a.price - b.price)}
      renderItem={(product) => {
        const formattedDate = new Date(product.date).toLocaleDateString('es-ES');
        return (
          <List.Item>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong>{product.title}</strong>
                <br />
                {product.description}
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  Date: {formattedDate}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#1890ff', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                  {product.price}€
                </div>
                {(!product.buyerEmail || product.buyerEmail.trim() === '') && (
                  <div style={{ color: 'red', fontWeight: 'bold' }}>Unsold</div>
                )}
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  ) : (
    <Paragraph>No has vendido productos aún.</Paragraph>
  )}
</Col>


</Row>




          

          <Divider />
          <Row gutter={16} justify="left">
  <Col span={10}>
    <Card 
      title={
        <span style={{ fontSize: '18px' }}>
          <DollarOutlined style={{ fontSize: '20px', color: '#52c41a', marginRight: '8px' }} />
          Sales
        </span>
      }
      bordered 
      style={{
        backgroundColor: '#f6ffed',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ fontSize: '17px', paddingBottom: '6px' }}><strong>Number of products Sold:</strong></td>
            <td style={{ fontSize: '17px', paddingBottom: '6px', textAlign: 'right' }}>{totalSold}</td>
          </tr>
          <tr>
            <td style={{ fontSize: '17px' }}><strong>Total Selled:</strong></td>
            <td style={{ fontSize: '17px', textAlign: 'right' }}>{totalSoldPrice}€</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </Col>

  <Col span={10}>
    <Card 
      title={
        <span style={{ fontSize: '18px' }}>
          <ShoppingCartOutlined style={{ fontSize: '20px', color: '#ff4d4f', marginRight: '8px' }} />
          Purchases
        </span>
      } 
      bordered 
      style={{
        backgroundColor: '#fff1f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ fontSize: '17px', paddingBottom: '6px' }}><strong>Number of products buyed:</strong></td>
            <td style={{ fontSize: '17px', paddingBottom: '6px', textAlign: 'right' }}>{totalBought}</td>
          </tr>
          <tr>
            <td style={{ fontSize: '17px' }}><strong>Total buyed:</strong></td>
            <td style={{ fontSize: '17px', textAlign: 'right' }}>{totalBoughtPrice}€</td>
          </tr>
        </tbody>
      </table>
    </Card>
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










