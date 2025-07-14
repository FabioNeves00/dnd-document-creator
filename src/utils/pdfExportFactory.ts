import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";
import type { Component } from "../types";
import { getImageDataUrl } from "./imageUtils";

// Tamanho A4 em pontos (paisagem): 842 x 595
const A4_WIDTH = 842;
const A4_HEIGHT = 595;

export const exportCanvasToPDF = async (
  components: Component[]
): Promise<void> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Fundo branco
  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
    color: rgb(1, 1, 1),
  });

  for (const comp of components) {
    const x = Number(comp.x) || 0;
    // pdf-lib: origem no canto inferior esquerdo
    const y = A4_HEIGHT - (Number(comp.y) || 0) - (Number(comp.height) || 32);
    const w = Number(comp.width) || 120;
    const h = Number(comp.height) || 32;
    switch (comp.type) {
      case "textbox":
      case "textarea":
      case "input":
        drawTextComponent(page, font, comp, x, y, w, h);
        break;
      case "button":
        drawButtonComponent(page, font, comp, x, y, w, h);
        break;
      case "image":
        await drawImageComponent(pdfDoc, page, comp, x, y, w, h);
        break;
      default:
        drawDefaultComponent(page, font, comp, x, y, w, h);
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "documento.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function drawTextComponent(
  page: PDFPage,
  font: PDFFont,
  comp: Component,
  x: number,
  y: number,
  w: number,
  h: number
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color: rgbHex(comp.backgroundColor || "#181c23"),
    borderColor: rgb(0.176, 0.212, 0.274), // #2d3646
    borderWidth: 1,
  });
  page.drawText(comp.content || "", {
    x: x + 8,
    y: y + h / 2 - 7,
    size: 14,
    font,
    color: rgbHex(comp.textColor || "#ffffff"),
    maxWidth: w - 16,
  });
}

function drawButtonComponent(
  page: PDFPage,
  font: PDFFont,
  comp: Component,
  x: number,
  y: number,
  w: number,
  h: number
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color: rgbHex(comp.backgroundColor || "#2563eb"),
    borderColor: rgb(0.176, 0.212, 0.274),
    borderWidth: 1,
  });
  page.drawText(comp.content || "Botão", {
    x: x + w / 2 - font.widthOfTextAtSize(comp.content || "Botão", 14) / 2,
    y: y + h / 2 - 7,
    size: 14,
    font,
    color: rgbHex(comp.textColor || "#ffffff"),
    maxWidth: w - 16,
  });
}

async function drawImageComponent(
  pdfDoc: PDFDocument,
  page: PDFPage,
  comp: Component,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (comp.content) {
    try {
      const imgData = await getImageDataUrl(comp.content);
      let image;
      if (imgData.startsWith("data:image/png")) {
        image = await pdfDoc.embedPng(imgData);
      } else {
        image = await pdfDoc.embedJpg(imgData);
      }
      page.drawImage(image, {
        x,
        y,
        width: w,
        height: h,
      });
    } catch {
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: rgb(0.267, 0.267, 0.267),
      });
      page.drawText("Imagem não carregada", {
        x: x + 8,
        y: y + h / 2 - 7,
        size: 12,
        color: rgb(1, 1, 1),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      });
    }
  } else {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: rgb(0.267, 0.267, 0.267),
    });
    page.drawText("Sem imagem", {
      x: x + 8,
      y: y + h / 2 - 7,
      size: 12,
      color: rgb(1, 1, 1),
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    });
  }
}

function drawDefaultComponent(
  page: PDFPage,
  font: PDFFont,
  comp: Component,
  x: number,
  y: number,
  w: number,
  h: number
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color: rgbHex(comp.backgroundColor || "#181c23"),
    borderColor: rgb(1, 1, 1),
    borderWidth: 1,
  });
  page.drawText(comp.type, {
    x: x + 8,
    y: y + h / 2 - 7,
    size: 12,
    font,
    color: rgb(1, 1, 1),
  });
}

// Utilitário para converter hex para rgb do pdf-lib
function rgbHex(hex: string) {
  // Remove # se existir
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(hex, 16);
  return rgb(
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  );
}
