// Dictionnaire des textes FIXES de l'interface (boutons, libellés...) — pas
// ceux qui viennent de la base de données (produits, catégories, etc.), qui
// sont déjà traduits automatiquement ailleurs (voir src/lib/translate.ts).
// Ce fichier est la SOURCE en français ; les autres langues sont générées
// automatiquement via /api/ui-strings, qui traduit ces valeurs et les met
// en cache — exactement comme pour le reste du site.
export const UI_STRINGS: Record<string, string> = {
  // Catalogue
  "catalog.label": "Notre sélection",
  "catalog.title": "Le Catalogue",
  "catalog.gridView": "Affichage en grille",
  "catalog.listView": "Affichage en liste",
  "catalog.allItems": "Tous les articles",
  "catalog.empty": "Aucun article disponible dans cette catégorie pour le moment.",

  // Pièces Iconiques
  "featured.label": "Sélection Anzy",
  "featured.title": "Pièces Iconiques",
  "featured.subtitle": "Les incontournables plébiscités par nos clientes pour sublimer vos courbes.",
  "featured.badge": "Iconique",

  // Carte produit
  "product.defaultBadge": "Nouveauté",
  "product.imageComing": "Image à venir",
  "product.startingFrom": "À partir de",
  "product.colorLabel": "Couleur",
  "product.sizeLabel": "Taille",
  "product.discover": "Découvrir la pièce",

  // Tiroir produit
  "product.back": "Retour",
  "product.close": "Fermer",
  "product.stockLowPrefix": "Plus que",
  "product.stockLowSuffix": "en stock",
  "product.available": "Disponible",
  "product.outOfStock": "Rupture de stock",
  "product.quantity": "Quantité",
  "product.description": "Description",
  "product.defaultDescription": "Conçue pour garantir un maintien subtil et invisible sous vos tenues, alliant aisance et raffinement.",
  "product.readMore": "Lire la suite",
  "product.readLess": "Réduire",
  "product.reviews": "Avis",
  "product.giveReview": "Donnez votre avis",
  "product.closeForm": "Fermer",
  "product.yourRating": "Votre note",
  "product.yourName": "Votre prénom",
  "product.namePlaceholder": "Ex : Fatima",
  "product.yourReview": "Votre avis",
  "product.reviewPlaceholder": "Qu'avez-vous pensé de ce produit ?",
  "product.sending": "Envoi...",
  "product.sendReview": "Envoyer mon avis",
  "product.loadingReviews": "Chargement des avis...",
  "product.noReviews": "Aucun avis pour ce produit pour le moment.",
  "product.reviewThanks": "Merci ! Votre avis a été envoyé et est en attente de modération.",
  "product.reviewError": "Une erreur est survenue lors de l'envoi de votre avis.",
  "product.soldOut": "Épuisé",
  "product.updateCart": "Mettre à jour",
  "product.addToCart": "Ajouter au panier",

  // Sélecteur de variantes
  "variant.genericChoice": "Choix de la variante",
  "variant.colorAxis": "Couleur",

  // En-tête
  "header.cart": "Panier",

  // Pied de page
  "footer.tagline": "Maison de Beauté & Gaines",
  "footer.collection": "Collection",
  "footer.admin": "Administration",
  "footer.backToTop": "Haut",

  // Panier
  "cart.label": "Votre sélection",
  "cart.title": "Mon Panier",
  "cart.empty": "Panier vide",
  "cart.subtotal": "Sous-total articles",
  "cart.shippingFees": "Frais de livraison",
  "cart.totalFinal": "Total final",
  "cart.checkout": "Commander",
  "cart.clear": "Vider le panier",
  "cart.remove": "Supprimer",
  "cart.article": "Article",

  // Livraison (panier)
  "shipping.country": "Pays de livraison",
  "shipping.mode": "Mode de livraison",
  "country.benin": "Bénin",
  "country.burkinaFaso": "Burkina Faso",
  "country.capVert": "Cap-Vert",
  "country.coteIvoire": "Côte d'Ivoire",
  "country.gambie": "Gambie",
  "country.ghana": "Ghana",
  "country.guinee": "Guinée",
  "country.guineeBissau": "Guinée-Bissau",
  "country.liberia": "Liberia",
  "country.mali": "Mali",
  "country.mauritanie": "Mauritanie",
  "country.niger": "Niger",
  "country.nigeria": "Nigeria",
  "country.senegal": "Sénégal",
  "country.sierraLeone": "Sierra Leone",
  "country.togo": "Togo",
  "country.autre": "Autre",

  // Commande - étape 1 (coordonnées)
  "checkout.step1Title": "1. Vos coordonnées",
  "checkout.fullName": "Nom complet",
  "checkout.email": "Email",
  "checkout.phone": "Téléphone / WhatsApp",
  "checkout.address": "Adresse de livraison",
  "checkout.city": "Ville",
  "checkout.chooseCountry": "-- Choisissez votre pays --",
  "checkout.shippingLabel": "Livraison",
  "checkout.comment": "Note / Commentaire (optionnel)",
  "checkout.commentPlaceholder": "Précisions sur votre commande...",

  // Commande - résumé
  "checkout.orderSummary": "Résumé de la commande",
  "checkout.qty": "Qté",
  "checkout.subtotal": "Sous-total",
  "checkout.delivery": "Livraison",
  "checkout.toCalculate": "À calculer",
  "checkout.total": "Total",
  "checkout.submitting": "Transmission en cours...",
  "checkout.submit": "Transmettre ma commande",
  "checkout.disclaimer": "En transmettant votre commande, vous confirmez vos informations. Aucun paiement automatique n'est prélevé en ligne.",

  // Commande - étape 2 (paiement)
  "checkout.step2Title": "2. Paiement",
  "checkout.mobileMoney": "Mobile Money",
  "checkout.transfer": "Transfert",
  "checkout.mobileMoneyInfoTitle": "Coordonnées de paiement Mobile Money",
  "checkout.name": "Nom",
  "checkout.firstNames": "Prénoms",
  "checkout.number": "Numéro",
  "checkout.mobileMoneyWarning": "Assurez-vous que votre opérateur permette ce type de transaction avant tout envoi.",
  "checkout.receiptPhoto": "Photo du reçu",
  "checkout.receiptPreviewAlt": "Aperçu du reçu",
  "checkout.transferService": "Service de transfert",
  "checkout.transferInstructions": "Instructions de transfert",
  "checkout.recipient": "Destinataire",
  "checkout.transferNameWarning": "Le nom doit être saisi exactement comme ci-dessus (dans cet ordre) lors du transfert en agence.",
  "checkout.mtcnCode": "Code MTCN",
  "checkout.format": "Format",
  "checkout.digits8": "8 chiffres",
  "checkout.digits10": "10 chiffres",
  "checkout.digits13": "13 chiffres",

  // Commande - page
  "checkout.emptyCartTitle": "Votre panier est vide",
  "checkout.emptyCartSubtitle": "Ajoutez des pièces pour continuer.",
  "checkout.missingFields": "Veuillez remplir tous les champs obligatoires et fournir le justificatif.",

  // Commande - confirmation
  "checkout.orderTransmitted": "Commande transmise",
  "checkout.orderSuccessMessage": "Votre commande a été transmise avec succès sur notre canal de traitement. Votre récapitulatif est ouvert sur WhatsApp. Notre équipe validera votre dossier sous 24 heures.",
  "checkout.pendingStatus": "Statut : En attente de confirmation",
  "checkout.backToShop": "Retour à la boutique",
};
