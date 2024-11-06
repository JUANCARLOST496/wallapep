import { useState, useEffect } from "react";
import { Table } from 'antd';
import { timestampToString } from "../../Utils/UtilsDates";

let ListMyTransactionsComponent = () => {
    let [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getMyTransactions();
    }, []);

    // Nueva función para obtener el título del producto basado en productId
    let getProductTitle = async (productId) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + productId,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();
            return jsonData.title; // Obtiene el título del producto
        } else {
            console.error("Error fetching product title");
            return null;
        }
    };

    let getMyTransactions = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/own/",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            }
        );

        if (response.ok) {
            let jsonData = await response.json();

            // Mapear las transacciones con los títulos de los productos
            let transactionsWithProductTitles = await Promise.all(jsonData.map(async (transaction) => {
                transaction.key = transaction.id;
                transaction.productTitle = await getProductTitle(transaction.productId); // Obtener y asignar el título del producto
                return transaction;
            }));

            setTransactions(transactionsWithProductTitles);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    let columns = [
        {
            title: "Transaction ID",
            dataIndex: "id",
        },
        {
            title: "Buyer ID",
            dataIndex: "buyerId"
        },
        {
            title: "Product Title",
            dataIndex: "productTitle" // Columna para el título del producto
        },
        {
            title: "Product Price (€)",
            dataIndex: "productPrice",
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (date) => timestampToString(date)
        }
    ];

    return (
        <Table columns={columns} dataSource={transactions}></Table>
    );
};

export default ListMyTransactionsComponent;