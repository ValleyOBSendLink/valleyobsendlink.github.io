import { PDFDocument, PDFString } from "pdf-lib";

const createPageLinkAnnotation = (page, uri, rect) => {
  return page.doc.context.register(
    page.doc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: rect,
      Border: [0, 0, 0],
      C: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(uri),
      },
    })
  );
};

async function createReceipt({
  receiptID,
  date,
  receivedBy,
  amount,
  paymentMethod,
  files = [],
}) {
  const formPdfBytes = await fetch("/Receipt.pdf").then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  let page = pdfDoc.getPage(0);
  const form = await pdfDoc.getForm();

  let receiptIDFeild = form.getTextField("Card");
  let dateField = form.getTextField("data");
  let amountField = form.getTextField("Amount");
  let nameField = form.getTextField("Received From");
  let checkField = form.getTextField("Check");
  let creditCardField = form.getTextField("Receipt ID");

  receiptIDFeild.setText(receiptID);
  let date_ = new Date(date);
  dateField.setText(
    `${date_.getMonth() + 1}/${date_.getDate()}/${date_.getFullYear()}`
  );
  nameField.setText(receivedBy);
  amountField.setText(amount);

  if (paymentMethod.includes("Card")) {
    creditCardField.setText(paymentMethod.replace("Debit/Credit Card #", ""));
  }

  if (paymentMethod.includes("Check")) {
    checkField.setText(paymentMethod.replace("Check #", ""));
  }

  receiptIDFeild.enableReadOnly();
  dateField.enableReadOnly();
  amountField.enableReadOnly();
  nameField.enableReadOnly();
  checkField.enableReadOnly();
  creditCardField.enableReadOnly();

  let paymentType = "Cash";

  if (paymentMethod.includes("Card")) {
    paymentType = "Card";
  }

  if (paymentMethod.includes("Check")) {
    paymentType = "Check";
  }

  let items = [
    {
      str: "Cash",
      dir: "ltr",
      width: 26.454,
      height: 12,
      transform: [12, 0, 0, 12, 179.976, 370.9799999999999],
      fontName: "g_d1_f1",
      hasEOL: true,
    },
    {
      str: "Check",
      dir: "ltr",
      width: 33.07920000000001,
      height: 12,
      transform: [12, 0, 0, 12, 179.976, 349.6199999999999],
      fontName: "g_d1_f1",
      hasEOL: true,
    },
    {
      str: "Credit/Debit Card",
      dir: "ltr",
      width: 96.18,
      height: 12,
      transform: [12, 0, 0, 12, 180, 328.1999999999999],
      fontName: "g_d1_f1",
      hasEOL: true,
    },
  ];

  items.forEach((item) => {
    if (item.str.includes(paymentType)) return;

    page.drawLine({
      start: {
        x: item.transform[4],
        y: item.transform[5],
      },
      end: {
        x: item.transform[4] + item.width,
        y: item.transform[5] + item.height / 2,
      },
      thickness: 0.75,
      opacity: 0.75,
    });
  });

  for (let i = 0; i < files.length; i++) {
    const { type, bytes, imgType } = files[i];

    if (type == "img") {
      let img;
      if (imgType == "png") img = await pdfDoc.embedPng(bytes);
      else img = await pdfDoc.embedJpg(bytes);

      const { width, height } = img.scale(0.5);
      const page = pdfDoc.addPage([width + 100, height + 100]);
      page.drawImage(img, {
        x: 50,
        y: 50,
        width: width,
        height: height,
      });
    }

    if (type == "pdf") {
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }
  }

  pdfDoc.setAuthor("ValleyOb Gyn");
  pdfDoc.setSubject("Receipt");
  pdfDoc.setTitle(`Receipt ${receiptID}`);
  pdfDoc.setProducer("ValleyOb Gyn");
  pdfDoc.setCreator("ValleyOb Gyn");
  pdfDoc.setCreationDate(new Date());

  return await pdfDoc.save();
}

export default createReceipt;
