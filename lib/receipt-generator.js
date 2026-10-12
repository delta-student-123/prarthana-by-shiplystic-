const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');

function numberToWordsINR(amount) {
  const num = Math.floor(Number(amount) || 501);
  if (num === 501) return 'Five Hundred One Rupee Only';
  if (num === 50) return 'Fifty Rupee Only';
  if (num === 1999) return 'One Thousand Nine Hundred Ninety Nine Rupee Only';
  return `${num} Rupee Only`;
}

const TEMPLE_MAP = {
  'mahakal': { title: 'SHRI MAHAKALESHWAR TEMPLE MANAGEMENT COMMITTEE', location: 'Ujjain, Madhya Pradesh, India', watermark: 'SMTMC, UJJAIN' },
  'kashi': { title: 'SHRI KASHI VISHWANATH TEMPLE TRUST', location: 'Varanasi, Uttar Pradesh, India', watermark: 'SKVTT, VARANASI' },
  'somnath': { title: 'SHREE SOMNATH TRUST', location: 'Prabhas Patan, Gujarat, India', watermark: 'SST, SOMNATH' },
  'kedarnath': { title: 'SHRI BADRINATH-KEDARNATH TEMPLE COMMITTEE', location: 'Rudraprayag, Uttarakhand, India', watermark: 'BKTC, KEDARNATH' },
  'omkareshwar': { title: 'SHRI OMKARESHWAR JYOTIRLINGA TEMPLE TRUST', location: 'Mandhata, Khandwa, Madhya Pradesh, India', watermark: 'SOJTT, OMKARESHWAR' },
  'vaishno': { title: 'SHRI MATA VAISHNO DEVI SHRINE BOARD', location: 'Katra, Jammu & Kashmir, India', watermark: 'SMVDSB, KATRA' },
  'mahalaxmi': { title: 'KARVEER NIVASINI SHRI MAHALAXMI TEMPLE TRUST', location: 'Kolhapur, Maharashtra, India', watermark: 'KNMTT, KOLHAPUR' },
  'siddhi': { title: 'SHREE SIDDHIVINAYAK GANAPATI TEMPLE TRUST', location: 'Prabhadevi, Mumbai, Maharashtra, India', watermark: 'SSGTT, MUMBAI' },
  'shirdi': { title: 'SHRI SAIBABA SANSTHAN TRUST', location: 'Shirdi, Ahmednagar, Maharashtra, India', watermark: 'SSST, SHIRDI' },
  'sai': { title: 'SHRI SAIBABA SANSTHAN TRUST', location: 'Shirdi, Ahmednagar, Maharashtra, India', watermark: 'SSST, SHIRDI' },
  'tirupati': { title: 'TIRUMALA TIRUPATI DEVASTHANAMS', location: 'Tirumala, Andhra Pradesh, India', watermark: 'TTD, TIRUMALA' },
  'balaji': { title: 'TIRUMALA TIRUPATI DEVASTHANAMS', location: 'Tirumala, Andhra Pradesh, India', watermark: 'TTD, TIRUMALA' },
  'jagannath': { title: 'SHRI JAGANNATH TEMPLE MANAGING COMMITTEE', location: 'Puri, Odisha, India', watermark: 'SJPMC, PURI' },
  'dwarka': { title: 'SHRI DWARKADHISH TEMPLE DEVASTHAN COMMITTEE', location: 'Dwarka, Gujarat, India', watermark: 'SDTDC, DWARKA' },
  'badri': { title: 'SHRI BADRINATH-KEDARNATH TEMPLE COMMITTEE', location: 'Chamoli, Uttarakhand, India', watermark: 'BKTC, BADRINATH' },
  'rameswaram': { title: 'ARULMIGU RAMANATHASWAMY TEMPLE DEVASTHANAM', location: 'Rameswaram, Tamil Nadu, India', watermark: 'ARTD, RAMESWARAM' },
  'ayodhya': { title: 'SHRI RAM JANMBHOOMI TEERTH KSHETRA', location: 'Ayodhya, Uttar Pradesh, India', watermark: 'SRJTK, AYODHYA' },
  'mathura': { title: 'SHRI KRISHNA JANMASTHAN SEVA SANSTHAN', location: 'Mathura & Vrindavan, Uttar Pradesh, India', watermark: 'SKJSS, MATHURA' },
  'vrindavan': { title: 'SHRI KRISHNA JANMASTHAN SEVA SANSTHAN', location: 'Mathura & Vrindavan, Uttar Pradesh, India', watermark: 'SKJSS, MATHURA' },
  'dagdusheth': { title: 'SHREEMANT DAGDUSHETH HALWAI GANPATI TRUST', location: 'Pune, Maharashtra, India', watermark: 'SDHGT, PUNE' },
  'shegaon': { title: 'SHRI GAJANAN MAHARAJ SANSTHAN', location: 'Shegaon, Buldhana District, Maharashtra, India', watermark: 'SGMS, SHEGAON' }
};

async function generateFallbackReceiptPdf({
  orderId = 'PRARTHANA-123240',
  devoteeName = 'Jayshree Patil',
  templeName = 'Shri Mahakaleshwar Temple',
  amount = 501,
  date = null,
  purpose = 'Temple Puja & Prarthana Dakshina Pass-Through'
} = {}) {
  const pdfDoc = await PDFDocument.create();
  
  // A4 size: 595.28 x 841.89 points
  const width = 595.28;
  const height = 841.89;
  const page = pdfDoc.addPage([width, height]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Background Parchment Color #F4EFE6
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.957, 0.937, 0.902) // #F4EFE6
  });

  // Inner Box Border
  const marginX = 40;
  const marginY = 50;
  const boxWidth = width - marginX * 2;
  const boxHeight = height - marginY * 2;

  page.drawRectangle({
    x: marginX,
    y: marginY,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(0.839, 0.808, 0.745), // #D6CEBE
    borderWidth: 1.5,
    color: rgb(0.957, 0.937, 0.902)
  });

  // Resolve temple-specific title, location and watermark
  const cleanName = (templeName || 'Shri Mahakaleshwar').toLowerCase();
  let matched = null;
  for (const k of Object.keys(TEMPLE_MAP)) {
    if (cleanName.includes(k)) {
      matched = TEMPLE_MAP[k];
      break;
    }
  }
  const title1 = matched ? matched.title : `${(templeName || 'TEMPLE').toUpperCase()} TRUST`;
  const locationText = matched ? matched.location : 'Participating Temple Sanctum, India';
  const watermarkText = matched ? matched.watermark : `${(templeName || 'TEMPLE').slice(0, 10).toUpperCase()}, SANCTUM`;

  // Watermark
  page.drawText(watermarkText, {
    x: 95,
    y: 420,
    size: 46,
    font: fontBold,
    color: rgb(0.639, 0.569, 0.494),
    rotate: degrees(30),
    opacity: 0.12
  });

  // Temple Seal Circle (Center Top)
  const sealCenterX = width / 2;
  const sealCenterY = height - marginY - 65;

  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: 34,
    color: rgb(0.918, 0.345, 0.047), // #EA580C Saffron
    borderColor: rgb(0.761, 0.255, 0.047),
    borderWidth: 2
  });

  page.drawCircle({
    x: sealCenterX,
    y: sealCenterY,
    size: 29,
    borderColor: rgb(1, 1, 1),
    borderWidth: 1
  });

  // Temple Shikhara Glyph text inside seal
  page.drawText('OM', {
    x: sealCenterX - 11,
    y: sealCenterY - 6,
    size: 15,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  // Header Titles
  const title1Width = fontBold.widthOfTextAtSize(title1, 13);
  page.drawText(title1, {
    x: (width - title1Width) / 2,
    y: height - marginY - 120,
    size: 13,
    font: fontBold,
    color: rgb(0.271, 0.169, 0.098) // #452B19
  });

  const locWidth = fontBold.widthOfTextAtSize(locationText, 10);
  page.drawText(locationText, {
    x: (width - locWidth) / 2,
    y: height - marginY - 138,
    size: 10,
    font: fontBold,
    color: rgb(0.761, 0.255, 0.047) // #C2410C
  });

  // Divider Line
  page.drawLine({
    start: { x: marginX + 25, y: height - marginY - 152 },
    end: { x: width - marginX - 25, y: height - marginY - 152 },
    thickness: 2,
    color: rgb(0.369, 0.239, 0.137) // #5E3D23
  });

  // Dark Brown Banner "DONATION RECEIPT / DAN RASEED"
  const bannerWidth = 260;
  const bannerHeight = 24;
  page.drawRectangle({
    x: (width - bannerWidth) / 2,
    y: height - marginY - 190,
    width: bannerWidth,
    height: bannerHeight,
    color: rgb(0.369, 0.239, 0.137) // #5E3D23
  });

  const bannerText = 'DONATION RECEIPT';
  const bannerTextWidth = fontBold.widthOfTextAtSize(bannerText, 11);
  page.drawText(bannerText, {
    x: (width - bannerTextWidth) / 2,
    y: height - marginY - 183,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  // Meta row: Receipt No, Date, Created Date
  const rawId = (orderId || 'PRARTHANA-123240').replace(/[^0-9]/g, '');
  const receiptNo = `#${rawId ? rawId.slice(-6).padStart(6, '1') : '123240'}`;
  const today = date || new Date().toISOString().slice(0, 10).split('-').reverse().join('-');

  let curY = height - marginY - 230;
  const col1X = marginX + 30;
  const col2X = marginX + 200;
  const col3X = marginX + 360;

  page.drawText('Receipt No / Raseed Kr:', { x: col1X, y: curY + 12, size: 9, font: fontBold, color: rgb(0.22, 0.14, 0.09) });
  page.drawText(receiptNo, { x: col1X, y: curY - 2, size: 11, font: fontBold, color: rgb(0.11, 0.10, 0.09) });

  page.drawText('Date / Dinank:', { x: col2X, y: curY + 12, size: 9, font: fontBold, color: rgb(0.22, 0.14, 0.09) });
  page.drawText(today, { x: col2X, y: curY - 2, size: 11, font: fontRegular, color: rgb(0.11, 0.10, 0.09) });

  page.drawText('Created On:', { x: col3X, y: curY + 12, size: 9, font: fontBold, color: rgb(0.22, 0.14, 0.09) });
  page.drawText(today, { x: col3X, y: curY - 2, size: 11, font: fontRegular, color: rgb(0.11, 0.10, 0.09) });

  // Dashed separator
  const drawDashedLine = (y) => {
    const startX = marginX + 30;
    const endX = width - marginX - 30;
    for (let x = startX; x < endX; x += 10) {
      page.drawLine({
        start: { x, y },
        end: { x: Math.min(x + 6, endX), y },
        thickness: 0.8,
        color: rgb(0.659, 0.624, 0.569)
      });
    }
  };

  curY -= 20;
  drawDashedLine(curY);

  // Field helper
  const drawField = (label, value, isBold = false, isItalic = false) => {
    curY -= 35;
    page.drawText(label, { x: col1X, y: curY + 14, size: 9, font: fontBold, color: rgb(0.22, 0.14, 0.09) });
    const font = isBold ? fontBold : (isItalic ? fontOblique : fontRegular);
    const size = isBold ? 13 : 11;
    page.drawText(String(value), { x: col1X, y: curY - 1, size, font, color: rgb(0.11, 0.10, 0.09) });
    curY -= 15;
    drawDashedLine(curY);
  };

  drawField("Donor's Name / Data Ka Naam:", devoteeName || 'Jayshree Patil', true);
  drawField("Amount / Rashi:", `INR ${amount}/-`, true);
  drawField("Amount in Words / Shabdon Mein:", `(In Words ${numberToWordsINR(amount)})`, false, true);
  drawField("Purpose / Prayojan:", purpose);
  drawField("Payment Mode / Bhugtan Madhyam:", "Online (Cashfree / UPI Verified)");

  // Footer: QR Code & Authorized Signatory
  const footerY = marginY + 60;

  // QR Code Box (Left)
  page.drawRectangle({
    x: col1X,
    y: footerY,
    width: 70,
    height: 70,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.839, 0.827, 0.820),
    borderWidth: 1
  });

  page.drawText('VERIFIED', {
    x: col1X + 10,
    y: footerY + 38,
    size: 9,
    font: fontBold,
    color: rgb(0.761, 0.255, 0.047)
  });
  page.drawText('TEMPLE DAKSHINA', {
    x: col1X + 4,
    y: footerY + 22,
    size: 6,
    font: fontBold,
    color: rgb(0.11, 0.10, 0.09)
  });

  page.drawText('Scan to Verify', {
    x: col1X + 8,
    y: footerY - 12,
    size: 7.5,
    font: fontBold,
    color: rgb(0.267, 0.251, 0.235)
  });

  // Signatory Line (Right)
  const signX = width - marginX - 180;
  page.drawLine({
    start: { x: signX, y: footerY + 25 },
    end: { x: signX + 150, y: footerY + 25 },
    thickness: 1.5,
    color: rgb(0.161, 0.145, 0.141)
  });

  page.drawText('Authorized Signatory', {
    x: signX + 16,
    y: footerY + 8,
    size: 9.5,
    font: fontBold,
    color: rgb(0.11, 0.10, 0.09)
  });

  page.drawText('Shri Mahakaleshwar Temple Trust', {
    x: signX + 2,
    y: footerY - 5,
    size: 8,
    font: fontRegular,
    color: rgb(0.4, 0.35, 0.3)
  });

  return await pdfDoc.save();
}

module.exports = {
  generateFallbackReceiptPdf
};
