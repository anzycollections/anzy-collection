import jsPDF from "jspdf";

interface OrderItem {
  productName: string;
  varianteName?: string;
  quantity: number;
  price: number;
}

interface OrderForReceipt {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  customerCountry: string;
  items: OrderItem[];
  shippingMethod: string;
  shippingCost: string;
  paymentMethod: string;
  paymentOperator: string;
  paymentReference: string;
  total: string;
  currency: string;
  createdAt: string;
}

// Couleurs de la marque, reprises telles quelles du site.
const DARK: [number, number, number] = [44, 34, 36]; // #2C2224
const PINK: [number, number, number] = [232, 141, 158]; // #E88D9E
const GREY: [number, number, number] = [140, 140, 140];
const LIGHT_LINE: [number, number, number] = [230, 224, 220];
const CREAM: [number, number, number] = [250, 247, 245]; // #FAF7F5

export async function generateOrderReceiptPdf(order: OrderForReceipt) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2;
  let y = 24;

  // --- En-tête : uniquement le logo texte du site, pas d'image ---
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...DARK);
  doc.text("ANZY COLLECTION", pageWidth / 2, y, { align: "center", charSpace: 0.5 });

  y += 6;
  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...PINK);
  doc.text("M A I S O N   D E   B E A U T É   &   G A I N E S", pageWidth / 2, y, { align: "center" });

  y += 10;
  doc.setDrawColor(...PINK);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 12, y, pageWidth / 2 + 12, y);

  y += 12;
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text("REÇU DE COMMANDE", pageWidth / 2, y, { align: "center" });
  y += 5;
  doc.text(`N° ${order.id}`, pageWidth / 2, y, { align: "center" });
  y += 5;
  doc.text(new Date(order.createdAt).toLocaleString("fr-FR"), pageWidth / 2, y, { align: "center" });

  y += 14;

  // --- Cliente (bloc vertical, centré, aéré) ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text(order.customerName, pageWidth / 2, y, { align: "center" });
  y += 5.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GREY);
  doc.text(order.customerPhone, pageWidth / 2, y, { align: "center" });
  y += 5;
  if (order.customerEmail) {
    doc.text(order.customerEmail, pageWidth / 2, y, { align: "center" });
    y += 5;
  }
  const addressLines = doc.splitTextToSize(
    `${order.customerAddress}, ${order.customerCity} (${order.customerCountry})`,
    contentWidth - 20
  );
  doc.text(addressLines, pageWidth / 2, y, { align: "center" });
  y += addressLines.length * 4.5 + 10;

  doc.setDrawColor(...LIGHT_LINE);
  doc.setLineWidth(0.3);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 12;

  // --- Articles : un bloc vertical par article, jamais de chevauchement
  // possible même si le nom (avec sa variante) est long et passe à la ligne. ---
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  doc.text("ARTICLES", marginX, y);
  y += 8;

  order.items.forEach((item, idx) => {
    const label = item.varianteName ? `${item.productName} (${item.varianteName})` : item.productName;
    const nameLines = doc.splitTextToSize(label, contentWidth - 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...DARK);
    doc.text(nameLines, marginX, y);
    y += nameLines.length * 5;

    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(`Qté ${item.quantity}`, marginX, y);
    doc.setFont("courier", "bold");
    doc.setTextColor(...DARK);
    doc.text(
      `${(item.price * item.quantity).toLocaleString()} ${order.currency}`,
      pageWidth - marginX,
      y,
      { align: "right" }
    );
    y += 8;

    if (idx < order.items.length - 1) {
      doc.setDrawColor(...LIGHT_LINE);
      doc.setLineWidth(0.2);
      doc.line(marginX, y - 3, pageWidth - marginX, y - 3);
      y += 2;
    }
  });

  y += 4;
  doc.setDrawColor(...LIGHT_LINE);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 9;

  // --- Livraison ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...GREY);
  doc.text(`Livraison (${order.shippingMethod})`, marginX, y);
  doc.text(`${Number(order.shippingCost).toLocaleString()} ${order.currency}`, pageWidth - marginX, y, { align: "right" });
  y += 12;

  // --- Total : encadré arrondi, façon carte du site ---
  const boxHeight = 18;
  doc.setFillColor(...CREAM);
  doc.roundedRect(marginX, y, contentWidth, boxHeight, 3, 3, "F");
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text("TOTAL", marginX + 8, y + boxHeight / 2 + 1.5);
  doc.setFontSize(14);
  doc.text(
    `${Number(order.total).toLocaleString()} ${order.currency}`,
    pageWidth - marginX - 8,
    y + boxHeight / 2 + 1.5,
    { align: "right" }
  );
  y += boxHeight + 12;

  // --- Paiement ---
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const paymentLabel = order.paymentMethod === "mobile_money"
    ? "Paiement : Mobile Money"
    : `Paiement : ${order.paymentOperator} (Réf. ${order.paymentReference})`;
  doc.text(paymentLabel, pageWidth / 2, y, { align: "center" });
  y += 20;

  // --- Pied de page ---
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(...PINK);
  doc.text("Merci pour votre confiance ✨", pageWidth / 2, y, { align: "center" });

  doc.save(`recu-anzy-${order.id}.pdf`);
}
