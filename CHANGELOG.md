# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### E28 - Sécurité (2025-12-02)

#### Ajouté
- Fichier `.env.example` avec template de configuration
- Fichier `backend/.gitignore` pour protéger les fichiers sensibles
- Protection contre les injections NoSQL avec `express-mongo-sanitize`
- Protection contre les attaques XSS avec `xss-clean`
- Validation stricte des entrées avec `express-validator`
- Validation avancée sur les routes d'authentification (login/register)
- JWT_EXPIRATION configuré à 24h dans .env
- Variable ALLOWED_ORIGINS pour CORS

#### Modifié
- JWT_SECRET régénéré avec 128 caractères (au lieu de 64)
- Validation du mot de passe: minimum 8 caractères + majuscule + minuscule + chiffre
- Validation de l'username: 3-30 caractères, alphanumérique uniquement
- Validation de l'email avec normalisation
- Gestion des erreurs de validation dans authController

#### Sécurisé
- `.env` ajouté au `.gitignore`
- Sanitization automatique des entrées utilisateur
- Messages d'erreur de validation détaillés
- Logs des tentatives de connexion/inscription invalides

---

### E27 - Corrections de bugs (2025-12-02)

#### Corrigé
- **Bug critique**: Erreur 500 lors de la création de commande due à l'enum `shippingMethod` avec valeurs dupliquées
- **Bug critique**: Valeurs par défaut `null` dans CartContext causant des erreurs de validation
- **Bug**: Champ `description` obligatoire dans le modèle Product
- **Bug**: Stock non décrémenté après création de commande
- **Bug**: Fonction `deleteOrder` non implémentée
- **Bug**: Fonction `getOrders` sans gestion d'erreurs
- **Bug**: Fonction `validateOrder` non implémentée
- **Bug**: Panier visible pour utilisateurs non connectés
- **Bug**: Rôle non supprimé du localStorage lors du logout
- **Bug**: URL de notification codée en dur
- **Bug**: Services de notification bloquant les opérations admin
- **Bug**: Fonction `getProducts` sans gestion d'erreurs
- **Bug**: Validation manquante sur login (backend et frontend)
- **Bug**: Validation manquante sur register (email, password, username unique)
- **Bug**: Routes admin incorrectes dans `adminApi.js`
- **Bug**: Port MongoDB sur 27018 au lieu de 27017
- **Bug**: Route Cart non protégée

#### Ajouté
- Route `/api/admin` dans `server.js`
- Fonction `createProduct` pour créer des produits depuis l'interface admin
- Route `/my-orders` pour récupérer les commandes d'un utilisateur
- Fonction `getUserOrders` dans `orderController`
- Lien Admin dans la navbar (visible uniquement pour les admins)
- Vérification du stock avant création de commande
- Décrémentation atomique du stock avec `$inc`
- Messages d'erreur si stock insuffisant
- Validations complètes côté backend et frontend
- Formulaire de création de produit dans l'interface admin
- Protection de la route Cart avec `ProtectedRoute`

#### Modifié
- Enum `shippingMethod` simplifié: `['colissimo', 'chronopost']`
- Valeurs par défaut CartContext: `shippingMethod: "colissimo"`, `paymentMethod: "Carte bancaire"`
- Champ `description` du modèle Product: `required: false, default: ''`
- Routes admin corrigées: `/admin/orders`, `/admin/products`
- Port MongoDB: `27017:27017` dans `docker-compose.yml`
- URL gateway utilise `process.env.GATEWAY_URL`
- Notifications encapsulées dans try-catch pour ne pas bloquer les opérations

---

## Fonctionnalités initiales

### Backend
- Authentification JWT avec bcrypt
- Gestion des utilisateurs (User model)
- Gestion des produits (Product model)
- Gestion des commandes (Order model)
- Middleware d'authentification et vérification admin
- Rate limiting (API générale et authentification)
- Helmet pour headers HTTP sécurisés
- CORS configuré
- Logging avec Winston
- MongoDB avec Mongoose

### Frontend
- Interface React avec React Router
- Pages: Login, Register, ProductList, Cart, Order, Admin
- Contexte panier (CartContext)
- Authentification avec localStorage
- Interface admin pour gérer commandes et produits
- Formulaires de livraison et paiement

### Infrastructure
- Docker Compose avec services: backend, frontend, mongo, notifications, gateway
- Variables d'environnement
- Logging des erreurs et audit
