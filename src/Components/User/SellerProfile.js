import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // ✅ Importa useParams
import { Card, Typography, List, Divider } from 'antd';

const { Title, Paragraph } = Typography;

const SellerProfile = () => {
  const { id } = useParams(); // ✅ Extrae el id de la URL
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

    // Datos de usuario
    fetch(`http://localhost:4000/users/${id}`, { headers })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Error al obtener el usuario:", err));

    // Transacciones como vendedor
    fetch(`http://localhost:4000/transactions/public?sellerId=${id}`, { headers })
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
    fetch(`http://localhost:4000/transactions/public?buyerId=${id}`, { headers })
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
    fetch(`http://localhost:4000/products?sellerId=${id}`, { headers })
      .then(res => res.json())
      .then(data => setSoldProducts(data))
      .catch(err => console.error("Error al obtener productos vendidos:", err));

  }, [id, apiKey]);

  return (
    <Card title="Perfil del Usuario" style={{ maxWidth: 800, margin: '2rem auto' }}>
      {id ? (
        <>
          {user ? (
            <>
              <Title level={4}>👤 {user.name || 'Nombre no disponible'}</Title>
              <Paragraph>📧 {user.email}</Paragraph>
            </>
          ) : (
            <Paragraph>Cargando usuario...</Paragraph>
          )}

          <Divider />
          <Title level={5}>🧾 Transacciones como vendedor:</Title>
          {sellerTransactions.length > 0 ? (
            <List
              bordered
              dataSource={sellerTransactions}
              renderItem={(item) => (
                <List.Item>
                  <strong>{item.title}</strong> — Comprador ID: {item.buyerId}
                  <br />
                  {item.product ? (
                    <>
                      🛍 {item.product.name} — 💰 ${item.product.price}
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

          <Divider />
          <Title level={5}>🛒 Transacciones como comprador:</Title>
          {buyerTransactions.length > 0 ? (
            <List
              bordered
              dataSource={buyerTransactions}
              renderItem={(item) => (
                <List.Item>
                  <strong>{item.title}</strong> — Vendedor ID: {item.sellerId}
                  <br />
                  {item.product ? (
                    <>
                      🛍 {item.product.name} — 💰 ${item.product.price}
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

          <Divider />
          <Title level={5}>📦 Productos vendidos:</Title>
          {soldProducts.length > 0 ? (
            <List
              bordered
              dataSource={soldProducts}
              renderItem={(product) => (
                <List.Item>
                  <strong>{product.title}</strong> — 💵 ${product.price}
                  <br />
                  👤 Comprador: {product.buyerName} ({product.buyerEmail})
                  <br />
                  🗂 {product.description} — 📅 {new Date(product.date).toLocaleString()}
                </List.Item>
              )}
            />
          ) : (
            <Paragraph>No has vendido productos aún.</Paragraph>
          )}
        </>
      ) : (
        <Paragraph>No se encontró el ID del usuario en la URL.</Paragraph>
      )}
    </Card>
  );
};

export default SellerProfile;