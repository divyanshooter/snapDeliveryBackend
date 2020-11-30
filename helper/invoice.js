let footerPosition;
function generateHeader(doc) {
  doc
    .image("./helper/logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("SnapDelivery", 110, 57)
    .fontSize(10)
    .text("SnapDelivery", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New Delhi", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice._id, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(
      formatDate(new Date(invoice.orderPlaced)),
      150,
      customerInformationTop + 15
    )
    .text("Total Price Paid:", 50, customerInformationTop + 30)
    .text(formatCurrency(invoice.totalPrice), 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(invoice.userId.fullName, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.userId.address, 300, customerInformationTop + 15)
    .text(
      invoice.userId.city + ", " + invoice.userId.state + ", " + "India",
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}
function generateRestaurantInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Restaurant Detail", 50, 300);

  generateHr(doc, 330);

  const customerInformationTop = 345;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Name:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.restaurantId.fullName, 150, customerInformationTop)
    .font("Helvetica")
    .text("Mobile Number:", 50, customerInformationTop + 15)
    .font("Helvetica")
    .text(invoice.restaurantId.mobileNumber, 150, customerInformationTop + 15)
    .font("Helvetica")
    .text("Address:", 50, customerInformationTop + 30)
    .font("Helvetica")
    .text(invoice.restaurantId.address, 150, customerInformationTop + 30)
    .text(
      invoice.restaurantId.city +
        ", " +
        invoice.restaurantId.state +
        ", " +
        "India",
      150,
      customerInformationTop + 45
    )
    .moveDown();

  generateHr(doc, 405);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 445;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.order.length; i++) {
    const item = invoice.order[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.name,
      item.description,
      formatCurrency(item.price),
      item.qty,
      formatCurrency(item.price * item.qty)
    );

    generateHr(doc, position + 20);
  }

  const totalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    totalPosition,
    "",
    "",
    "Total",
    "",
    formatCurrency(invoice.totalPrice)
  );
  footerPosition = totalPosition + 30;
}

function generateFooter(doc) {
  doc.fontSize(10).text(" Thank you for your Order.", 50, footerPosition, {
    align: "center",
    width: 500,
  });
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(price) {
  return "Rs. " + price.toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return day + "/" + month + "/" + year;
}

module.exports = {
  generateHeader,
  generateCustomerInformation,
  generateRestaurantInformation,
  generateInvoiceTable,
  generateFooter,
};
