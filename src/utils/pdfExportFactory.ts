import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";
import type { Component, TextComponent } from "../types";
import { getImageDataUrl } from "./imageUtils";

// Tamanho A4 em pontos (paisagem): 842 x 595
const A4_HEIGHT = 1123;
const A4_WIDTH = 794;

export const exportCanvasToPDF = async (
  components: Component[]
): Promise<void> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique
  );
  const helveticaBoldOblique = await pdfDoc.embedFont(
    StandardFonts.HelveticaBoldOblique
  );

  // Fundo branco
  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
    color: rgb(1, 1, 1),
  });

  // Encontrar o menor y do canvas para alinhar tudo no topo do PDF
  const minY = Math.min(...components.map((c) => Number(c.y) || 0));

  for (const comp of components) {
    const x = Number(comp.x) || 0;
    const w = Number(comp.width) || 120;
    const h = Number(comp.height) || 32;
    const y_canvas = (Number(comp.y) || 0) - minY;
    const y = A4_HEIGHT - y_canvas - h; // Corrigido para sistema do PDF
    switch (comp.type) {
      case "textarea":
        drawTextComponent(
          page,
          { helvetica, helveticaBold, helveticaOblique, helveticaBoldOblique },
          comp,
          x,
          y,
          w,
          h
        );
        break;
      case "image":
        await drawImageComponent(pdfDoc, page, comp, x, y, w, h);
        break;
      default:
        drawDefaultComponent(page, helvetica, comp, x, y, w, h);
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

// Utilitário para quebrar texto em linhas que caibam no maxWidth
function breakTextIntoLines(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
) {
  if (!text) return [""];
  const lines: string[] = [];
  const paragraphs = text.split(/\n/);
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    let currentLine = words[0] || "";
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = font.widthOfTextAtSize(currentLine + " " + word, size);
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    // Quebra palavras longas demais
    while (font.widthOfTextAtSize(currentLine, size) > maxWidth) {
      let cut = currentLine.length;
      while (
        cut > 0 &&
        font.widthOfTextAtSize(currentLine.slice(0, cut), size) > maxWidth
      ) {
        cut--;
      }
      if (cut === 0) break; // não quebra infinito
      lines.push(currentLine.slice(0, cut));
      currentLine = currentLine.slice(cut);
    }
    lines.push(currentLine);
  }
  return lines;
}

function isTextComponent(comp: Component): comp is TextComponent {
  return comp.type === "textarea";
}

function getFont(
  fonts: {
    helvetica: PDFFont;
    helveticaBold: PDFFont;
    helveticaOblique: PDFFont;
    helveticaBoldOblique: PDFFont;
  },
  comp: TextComponent
): PDFFont {
  const isBold = comp.fontWeight === "bold";
  const isItalic = comp.fontStyle === "italic";

  if (isBold && isItalic) return fonts.helveticaBoldOblique;
  if (isBold) return fonts.helveticaBold;
  if (isItalic) return fonts.helveticaOblique;
  return fonts.helvetica;
}

function drawTextComponent(
  page: PDFPage,
  fonts: {
    helvetica: PDFFont;
    helveticaBold: PDFFont;
    helveticaOblique: PDFFont;
    helveticaBoldOblique: PDFFont;
  },
  comp: Component,
  x: number,
  y: number,
  w: number,
  h: number
) {
  if (!isTextComponent(comp)) return;

  // Desenhar fundo
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color:
      comp.backgroundColor && comp.backgroundColor !== "transparent"
        ? rgbHex(comp.backgroundColor)
        : rgb(1, 1, 1),
  });

  const font = getFont(fonts, comp);
  const fontSize = comp.fontSize || 16;
  const maxWidth = w - 16;
  const lines = breakTextIntoLines(
    comp.content || "",
    font,
    fontSize,
    maxWidth
  );

  const padding = 8;
  const lineHeight = fontSize * 1.2;
  const totalTextHeight = lines.length * lineHeight;

  // Calcular posição Y baseada no alinhamento vertical
  let startY: number;
  switch (comp.verticalAlign) {
    case "middle":
      startY = y + h / 2 + totalTextHeight / 2 - lineHeight;
      break;
    case "bottom":
      startY = y + totalTextHeight;
      break;
    default: // top
      startY = y + h - padding - fontSize;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineWidth = font.widthOfTextAtSize(line, fontSize);

    // Calcular posição X baseada no alinhamento
    let textX: number;
    switch (comp.textAlign) {
      case "center":
        textX = x + w / 2 - lineWidth / 2;
        break;
      case "right":
        textX = x + w - padding - lineWidth;
        break;
      case "justify":
        // Para texto justificado, mantemos alinhado à esquerda no PDF
        // (justificação real seria mais complexa)
        textX = x + padding;
        break;
      default: // left
        textX = x + padding;
    }

    page.drawText(line, {
      x: Math.max(x + padding, textX),
      y: startY - i * lineHeight,
      size: fontSize,
      font,
      color: rgbHex(comp.textColor || "#000000"),
      maxWidth,
    });

    // Desenhar sublinhado se necessário
    if (comp.textDecoration === "underline") {
      const underlineY = startY - i * lineHeight - 2;
      page.drawLine({
        start: { x: textX, y: underlineY },
        end: { x: textX + lineWidth, y: underlineY },
        thickness: 1,
        color: rgbHex(comp.textColor || "#000000"),
      });
    }
  }
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
      } else if (
        imgData.startsWith("data:image/jpeg") ||
        imgData.startsWith("data:image/jpg")
      ) {
        image = await pdfDoc.embedJpg(imgData);
      } else {
        throw new Error(
          "Formato de imagem não suportado para PDF: " + imgData.slice(0, 30)
        );
      }
      // Ajuste object-fit: contain
      const imgWidth = image.width;
      const imgHeight = image.height;
      const containerRatio = w / h;
      const imgRatio = imgWidth / imgHeight;
      let drawWidth = w;
      let drawHeight = h;
      if (imgRatio > containerRatio) {
        // Imagem é mais larga que o container
        drawWidth = w;
        drawHeight = w / imgRatio;
      } else {
        // Imagem é mais alta que o container
        drawHeight = h;
        drawWidth = h * imgRatio;
      }
      const offsetX = x + (w - drawWidth) / 2;
      const offsetY = y + (h - drawHeight) / 2;
      page.drawImage(image, {
        x: offsetX,
        y: offsetY,
        width: drawWidth,
        height: drawHeight,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        "Erro ao embutir imagem no PDF:",
        err,
        comp.content?.slice(0, 100)
      );
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
    color:
      comp.backgroundColor && comp.backgroundColor !== "transparent"
        ? rgbHex(comp.backgroundColor)
        : rgb(1, 1, 1),
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
