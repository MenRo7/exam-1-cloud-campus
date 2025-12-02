// backend/controllers/adminController.js
const axios = require('axios');
const Order = require('../models/Order'); // Modèle pour les commandes
const Product = require('../models/Product'); // Modèle pour les produits

// Récupérer toutes les commandes
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};

// Changer l'état d'une commande
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await Order.findByIdAndUpdate(id, { status });

    // Notification optionnelle
    try {
      await axios.post('http://localhost:3001/notify', {
        message: `Le statut de la commande ${id} a été mis à jour en "${status}".`,
      });
    } catch (notifyError) {
      console.log('Service de notification non disponible');
    }

    res.json({ message: `Statut de la commande ${id} mis à jour` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de mise à jour du statut de la commande' });
  }
};

// Valider une commande
exports.validateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndUpdate(id, { status: 'Validée' });

    // Notification optionnelle
    try {
      await axios.post('http://localhost:3001/notify', {
        message: `La commande ${id} a été validée.`,
      });
    } catch (notifyError) {
      console.log('Service de notification non disponible');
    }

    res.json({ message: `Commande ${id} validée` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation de la commande' });
  }
};

// Récupérer tous les produits
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
};

// Mettre à jour le stock d'un produit
exports.updateProductStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    await Product.findByIdAndUpdate(id, { stock });

    // Notification optionnelle
    try {
      await axios.post('http://localhost:3001/notify', {
        message: `Le stock du produit ${id} a été mis à jour à ${stock}.`,
      });
    } catch (notifyError) {
      console.log('Service de notification non disponible');
    }

    res.json({ message: `Stock du produit ${id} mis à jour` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du stock du produit' });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  const { name, price, stock, description } = req.body;

  // Validation des champs
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: 'Nom, prix et stock sont requis.' });
  }

  if (price <= 0) {
    return res.status(400).json({ message: 'Le prix doit être supérieur à 0.' });
  }

  if (stock < 0) {
    return res.status(400).json({ message: 'Le stock ne peut pas être négatif.' });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      stock,
      description: description || ''
    });

    await newProduct.save();

    // Notification optionnelle (ne bloque pas si le service n'est pas disponible)
    try {
      await axios.post('http://localhost:3001/notify', {
        message: `Un nouveau produit "${name}" a été ajouté avec un stock de ${stock}.`,
      });
    } catch (notifyError) {
      console.log('Service de notification non disponible');
    }

    res.status(201).json({
      message: 'Produit créé avec succès',
      product: newProduct
    });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur lors de la création du produit' });
  }
};
