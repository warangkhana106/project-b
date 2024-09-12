const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createInvoice(data, filePath) {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the document to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Add Company Logo - Centered and adjusted size
  const logoPath = path.join(__dirname, 'logo.png'); // Path to the logo image
  if (fs.existsSync(logoPath)) {
    const logoWidth = 150; // Adjust the width as needed
    const logoX = (doc.page.width - logoWidth) / 2; // Center the logo
    doc.image(logoPath, logoX, 50, { width: logoWidth }) // Adjust the position if necessary
       .moveDown(4); // Increased spacing after the logo
  }

  // Company information
  doc.fontSize(20)
  .moveDown(1.5)
     .text('Games Zone', { align: 'center' })
     .fontSize(10)
     .text('Sakhonakon City, 47000', { align: 'center' })
     .text('Phone: (085) 555-5555', { align: 'center' })
     .moveDown(2);

  // Invoice Title
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown(1.5);

  // Customer Information
  const startY = doc.y; // Store the current Y-coordinate
  doc.fontSize(12)
     .text(`Customer Name: ${data.customerName}`, 50, startY)
     .text(`Customer Email: ${data.customerEmail}`, 50, startY + 15)
     .text(`Order ID: ${data.orderId}`, 50, startY + 30)
     .text(`Order Date: ${data.orderDate}`, 50, startY + 45)
     .moveDown(1.5);

  // Horizontal line
  doc.moveTo(50, startY + 60)
     .lineTo(550, startY + 60)
     .stroke();

  // Table Header
  doc.fontSize(12).text('Item', 50, startY + 70)
     .text('Quantity', 250, startY + 70)
     .text('Price', 400, startY + 70, { align: 'right' })
     .moveDown();

  // Horizontal line
  doc.moveTo(50, startY + 90)
     .lineTo(550, startY + 90)
     .stroke();

  // Table rows
  let y = startY + 100;
  data.game.forEach(item => {
    doc.fontSize(12)
       .text(item.name, 50, y)
       .text(item.quantity, 250, y)
       .text(item.price, 400, y, { align: 'right' })
    y += 20;
  });

  // Total
  doc.moveTo(50, y + 10)
     .lineTo(550, y + 10)
     .stroke();

  doc.fontSize(12)
     .text('Total', 50, y + 20)
     .text(data.total, 400, y + 20, { align: 'right' });

  // Footer - Positioned at the bottom of the page
  doc.fontSize(10)
     .text('Thank you for your business!', 50, 780, { align: 'center', width: 500 });

  doc.end();
}

module.exports = { createInvoice };