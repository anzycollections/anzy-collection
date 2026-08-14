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
};
