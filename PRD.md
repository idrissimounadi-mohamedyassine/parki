# PRD — Parki (Plateforme de Location de Parkings)

## 1) Overview
**Parki** est une plateforme qui permet aux conducteurs au Maroc de **trouver, réserver et payer** des places de parking rapidement, tout en permettant aux **propriétaires** de rentabiliser leurs espaces.

L’expérience est conçue pour inclure un flux opérationnel de type “accès sans friction” via une intégration **caméra/ANPR** (Raspberry Pi / OpenCV) en support des étapes d’**entrée (check-in)** et **sortie (checkout)**.

---

## 2) Problem Statement
1. **Recherche & incertitude** : les conducteurs perdent du temps à chercher une place et manquent de visibilité sur la disponibilité et le prix.
2. **Monétisation & gestion** : les propriétaires ont besoin d’un système simple pour publier leurs parkings et suivre les réservations.
3. **Accès physique** : les tickets / contrôles manuels sont lents et sujets à erreur.
4. **Paiement & confirmation** : la confirmation doit être fiable, traçable et déclenchée de manière automatisée.

---

## 3) Goals & Success Metrics
### 3.1 Objectifs Conducteurs
- Trouver des parkings proches en quelques secondes.
- Réserver des créneaux et payer via **Stripe** avec un parcours fluide.
- Recevoir une confirmation exploitable pour l’accès (QR code / statut réservation).

**KPIs**
- Taux de conversion : *recherche → réservation → paiement confirmé*.
- Taux de succès des paiements (webhooks Stripe).
- Temps moyen pour finaliser le paiement et obtenir la confirmation.

### 3.2 Objectifs Propriétaires
- Créer et gérer facilement des annonces de parkings.
- Suivre les réservations et les revenus.
- Opérer check-in/check-out selon le parcours caméra.

**KPIs**
- Adoption : nombre d’utilisateurs “owner” actifs.
- Nombre de parkings créés.
- Revenue agrégé et volume de réservations sur la période.

### 3.3 Objectifs Système
- Intégrité des données de réservation (pas de chevauchement d’un même parking pour les réservations confirmées).
- Paiement “source of truth” via webhook Stripe.
- Sécurité : JWT, rate limiting, sanitization, Helmet, protection API caméra.

---

## 4) Target Users
1. **Driver (conducteur)**
   - Recherche & réservation.
   - Paiement Stripe.
   - Accès via confirmation.
   - Laisser un avis après complétion.
2. **Owner (propriétaire)**
   - Publier des parkings.
   - Gérer les réservations.
   - Suivre revenus / stats.
3. **Admin**
   - Accès stats plateforme.

---

## 5) User Journeys (MVP)
### 5.1 Conducteur : Find → Book → Pay → Access
1. Rechercher les parkings (par ville ou via coordonnées lat/lng).
2. Choisir un parking et saisir une fenêtre de réservation (+ plaque).
3. Créer la réservation (statut initial : pending).
4. Lancer le paiement (Stripe Checkout).
5. À réception webhook Stripe :
   - statut réservation passe à **confirmed**
   - `paymentStatus` passe à **paid**
   - QR code généré + email de confirmation.
6. À l’entrée : caméra/ANPR appelle `/api/camera/entry`.
7. À la sortie : caméra/ANPR appelle `/api/camera/exit`.

### 5.2 Propriétaire : List → Manage → Operate
1. Connexion (JWT).
2. Création d’un parking (titre, adresse, ville, type, prix/heure, location, images, features).
3. Consultation des réservations de ses parkings.
4. Déclenchement opérationnel possible (checkin/checkout) via endpoints propriétaires/admin.

### 5.3 Avis
- L’utilisateur peut laisser un avis sur un parking après réservation complétée.
- Les avis sont consultables publiquement par parking.

---

## 6) Core Features & Requirements
### 6.1 Geo Search & Filtering (Back-end)
- Liste parkings avec filtres : `city`, `type`, `minPrice`, `maxPrice`, `sort`.
- Recherche proche : `/api/parkings/nearby` via `lat`, `lng`, `dist`.
- Index MongoDB géospatial : `2dsphere` sur `Parking.location`.

### 6.2 Parking Listings (Back-end)
Champs principaux :
- owner, title, description, address
- city (Casablanca, Rabat, Fès, Marrakech, Tanger)
- type (rue, garage, sous-sol)
- pricePerHour (MAD)
- images[]
- features[] (camera, electric, covered, guarded, 24/7)
- location { type: Point, coordinates: [lng, lat] }
- status (available/limited/full)

### 6.3 Booking Workflow
- Création réservation :
  - vérifie l’existence du parking
  - empêche conflits sur les créneaux pour les réservations confirmées
  - calcule un prix estimé (`totalPrice`)
  - envoie un email “en attente de paiement”
- Annulation réservation :
  - autorisation : propriétaire de la réservation uniquement
  - remboursement estimé selon temps avant début :
    - > 24h : 100%
    - > 2h : 50%
    - sinon : 0%

### 6.4 Payment Workflow (Stripe)
- Création session Checkout :
  - endpoint protégé JWT : `/api/payments/create-checkout-session`
  - produit Stripe : total estimé + intervalle de dates
- Webhook Stripe :
  - endpoint raw body : `/api/payments/webhook`
  - sur `checkout.session.completed` :
    - `status` → **confirmed**
    - `paymentStatus` → **paid**
    - `paymentIntentId` stocké
    - `qrCode` généré
    - email de confirmation envoyé

### 6.5 Camera/ANPR Integration (Check-in / Check-out)
Endpoints protégés par API key caméra (`x-api-key`) :
- `/api/camera/entry` :
  - payload attendu : `{ plate, parkingId }`
  - recherche réservation correspondante (plate + parking + status confirmed)
  - déclenche `checkinBooking` :
    - `checkinTime` positionné
    - `status` → **in-progress**
- `/api/camera/exit` :
  - payload attendu : `{ plate, parkingId }`
  - recherche réservation (plate + parking + status in-progress)
  - déclenche `checkoutBooking` :
    - `checkoutTime`
    - calcule prix réel selon durée
    - `status` → **completed**
    - création PaymentIntent pour le prix réel (extension opérationnelle)

### 6.6 Reviews
- Ajout avis :
  - route protégée JWT : `/api/reviews`
  - contrainte : user doit avoir une réservation du parking (status completed / ou plus flexible en dev)
- Lecture avis :
  - public : `/api/reviews/parking/:parkingId`

### 6.7 Owner/Admin Analytics
- Owner stats : `/api/stats/owner`
  - agrégation des revenus et volume sur parkings owned
- Admin stats : `/api/stats/admin`
  - totals (bookings, users, revenue) 

---

## 7) Roles & Permissions
- Auth via JWT.
- Autorisation par rôle :
  - owner/admin : création parkings, déclenchements checkin/checkout manuels, stats owner.
  - admin : stats admin.
  - driver : création booking/cancel booking sur ses propres réservations.
- Accès caméra : API key caméra requise.

---

## 8) Non-Functional Requirements
- Sécurité : Helmet, rate limiting, Mongo sanitize, validation/sanitization côté controllers/routes.
- Fiabilité paiement : webhook Stripe comme source de vérité.
- Performance :
  - pagination sur liste parkings
  - indexation géospatiale
- Observabilité : morgan en mode dev.

---

## 9) Out of Scope (MVP boundaries)
- Pricing dynamique avancé / coupons promotionnels.
- Gestion multi-sites / permissions staff plus fines.
- Reconciliation complète capture/receipt cycle au checkout “exit” (présent de façon partielle côté code).
- Fraud/identity verification avancée.

---

## 10) Assumptions
- Variables d’environnement Stripe, MongoDB, JWT, CAMERA_API_KEY et CLIENT_URL sont configurées.
- MongoDB gère l’index géospatial.
- Le pipeline caméra envoie `plate` et `parkingId` conformes aux attentes.

---

## 11) Glossary
- **Booking** : réservation d’un créneau avec plaque.
- **Check-in** : entrée véhicule → statut **in-progress**.
- **Check-out** : sortie véhicule → statut **completed**, calcul prix réel.
- **QR Code** : code généré après confirmation paiement (webhook) pour l’accès.

