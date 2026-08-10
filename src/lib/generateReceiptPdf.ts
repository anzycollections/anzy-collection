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

// Convertit une image publique (ex: /logo.png) en base64, pour pouvoir
// l'intégrer dans le PDF (jsPDF ne peut pas charger une URL directement).
async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateOrderReceiptPdf(order: OrderForReceipt) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 18;
  let y = 20;

  // --- En-tête avec logo ---
  const logoBase64 = await loadImageAsBase64("/logo.png");
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", marginX, y, 22, 22);
    } catch {
      // Si le logo ne peut pas être intégré (format non supporté), on continue sans bloquer.
    }
  }

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(44, 34, 36); // #2C2224
  doc.text("ANZY COLLECTION", marginX + 28, y + 9);

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(232, 141, 158); // #E88D9E
  doc.text("MAISON DE BEAUTÉ & GAINES", marginX + 28, y + 15);

  doc.setTextColor(120, 120, 120);
  doc.text("Reçu de commande", pageWidth - marginX, y + 5, { align: "right" });
  doc.text(`N° ${order.id}`, pageWidth - marginX, y + 10, { align: "right" });
  doc.text(new Date(order.createdAt).toLocaleString("fr-FR"), pageWidth - marginX, y + 15, { align: "right" });

  y += 30;
  doc.setDrawColor(232, 141, 158);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 10;

  // --- Informations client ---
  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.setTextColor(44, 34, 36);
  doc.text("CLIENTE", marginX, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(order.customerName, marginX, y); y += 5;
  doc.text(order.customerPhone, marginX, y); y += 5;
  if (order.customerEmail) { doc.text(order.customerEmail, marginX, y); y += 5; }
  doc.text(`${order.customerAddress}, ${order.customerCity} (${order.customerCountry})`, marginX, y);
  y += 12;

  // --- Tableau des articles ---
  doc.setFont("courier", "bold");
  doc.setFontSize(9);
  doc.setTextColor(44, 34, 36);
  doc.text("ARTICLE", marginX, y);
  doc.text("QTÉ", pageWidth - marginX - 55, y, { align: "right" });
  doc.text("PRIX", pageWidth - marginX, y, { align: "right" });
  y += 3;
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  order.items.forEach((item) => {
    const label = item.varianteName ? `${item.productName} (${item.varianteName})` : item.productName;
    doc.text(label, marginX, y, { maxWidth: pageWidth - marginX * 2 - 70 });
    doc.text(String(item.quantity), pageWidth - marginX - 55, y, { align: "right" });
    doc.text(`${(item.price * item.quantity).toLocaleString()} ${order.currency}`, pageWidth - marginX, y, { align: "right" });
    y += 7;
  });

  y += 3;
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Livraison (${order.shippingMethod})`, marginX, y);
  doc.text(`${Number(order.shippingCost).toLocaleString()} ${order.currency}`, pageWidth - marginX, y, { align: "right" });
  y += 9;

  doc.setFont("courier", "bold");
  doc.setFontSize(13);
  doc.setTextColor(44, 34, 36);
  doc.text("TOTAL", marginX, y);
  doc.text(`${Number(order.total).toLocaleString()} ${order.currency}`, pageWidth - marginX, y, { align: "right" });
  y += 12;

  // --- Paiement ---
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const paymentLabel = order.paymentMethod === "mobile_money"
    ? "Paiement : Mobile Money"
    : `Paiement : ${order.paymentOperator} (Réf. ${order.paymentReference})`;
  doc.text(paymentLabel, marginX, y);
  y += 15;

  // --- Pied de page ---
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.setTextColor(232, 141, 158);
  doc.text("Merci pour votre confiance ✨", pageWidth / 2, y, { align: "center" });

  doc.save(`recu-anzy-${order.id}.pdf`);
}
