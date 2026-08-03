import JSZip from "jszip";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SECTION_RE =
  /^(experiencia|experience|educaci[oó]n|estudios|formaci[oó]n|habilidades|skills|competencias|resumen|perfil\s+profesional|objetivo|idiomas|certificaciones|contacto|proyectos)(:)?\s*$/i;

function isBullet(line: string) {
  return /^[-•●▪◦*]\s+/.test(line) || /^\d+[.)]\s+/.test(line);
}

function paragraph(opts: {
  text: string;
  style?: string;
  bold?: boolean;
  size?: number; // half-points (24 = 12pt)
  bullet?: boolean;
}): string {
  const sz = opts.size ?? 22;
  const t = escapeXml(opts.text || " ");
  const rPr = `<w:rPr>
    <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
    <w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>
    ${opts.bold ? "<w:b/>" : ""}
  </w:rPr>`;
  const pPr = `<w:pPr>
    ${opts.style ? `<w:pStyle w:val="${opts.style}"/>` : ""}
    ${
      opts.bullet
        ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>`
        : ""
    }
    <w:spacing w:after="80" w:line="276" w:lineRule="auto"/>
  </w:pPr>`;
  return `<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
}

function toStyledBody(plainText: string): string {
  const lines = plainText.replace(/\r\n/g, "\n").split("\n");
  const parts: string[] = [];
  let firstContent = true;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      parts.push(`<w:p><w:pPr><w:spacing w:after="60"/></w:pPr></w:p>`);
      continue;
    }

    if (firstContent && trimmed.length < 80 && !SECTION_RE.test(trimmed) && !isBullet(trimmed)) {
      parts.push(paragraph({ text: trimmed, style: "Heading1", bold: true, size: 32 }));
      firstContent = false;
      continue;
    }
    firstContent = false;

    if (SECTION_RE.test(trimmed)) {
      parts.push(
        paragraph({
          text: trimmed.replace(/:$/, "").toUpperCase(),
          style: "Heading2",
          bold: true,
          size: 24,
        })
      );
      continue;
    }

    if (isBullet(trimmed)) {
      const text = trimmed.replace(/^[-•●▪◦*]\s+/, "").replace(/^\d+[.)]\s+/, "");
      parts.push(paragraph({ text, bullet: true, size: 21 }));
      continue;
    }

    parts.push(paragraph({ text: trimmed, size: 21 }));
  }

  return parts.join("");
}

/**
 * DOCX con estilos Word (Calibri, H1/H2, viñetas, márgenes ATS-friendly).
 */
export async function buildCvDocx(plainText: string, meta?: { title?: string }): Promise<Blob> {
  const zip = new JSZip();
  const body = toStyledBody(plainText.trim() || " ");

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
</Types>`
  );

  zip.folder("_rels")?.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  const word = zip.folder("word");
  word?.folder("_rels")?.file(
    "document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`
  );

  word?.file(
    "styles.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:sz w:val="22"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="0" w:after="120"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="1F1630"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="200" w:after="80"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="5B21B6"/></w:rPr>
  </w:style>
</w:styles>`
  );

  word?.file(
    "numbering.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="•"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`
  );

  word?.file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${meta?.title ? paragraph({ text: meta.title, style: "Heading1", bold: true, size: 28 }) : ""}
    ${body}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720"/>
    </w:sectPr>
  </w:body>
</w:document>`
  );

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
