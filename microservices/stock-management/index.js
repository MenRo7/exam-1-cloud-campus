const express = require('express');
const app = express();
const PORT = 4003;

app.use(express.json());

app.post('/update-stock', (req, res) => {
    const { productId, quantity } = req.body;
    console.log(`Mise à jour du stock: Produit ${productId}, Quantité ${quantity}`);
    res.send(`Stock mis à jour pour le produit de ID : ${productId}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'stock-management',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(PORT, () => console.log(`Service de gestion des stocks sur le port ${PORT}`));
