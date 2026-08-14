const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const wraps = [
  ["src/app/outplacement/networking/page.tsx", "networking-crm", "NetworkingTool"],
  ["src/app/outplacement/oferta/page.tsx", "negociacion-oferta", "OfertaTool"],
  ["src/app/outplacement/assessment/page.tsx", "rumbo-riasec", "AssessmentTool"],
  ["src/app/outplacement/filtro/page.tsx", "filtro-telefonico", "FiltroTool"],
  ["src/app/outplacement/entrevista/page.tsx", "entrevistas-star", "EntrevistaTool"],
  ["src/app/outplacement/portfolio/page.tsx", "portfolio-star", "PortfolioTool"],
  ["src/app/outplacement/remoto/page.tsx", "remoto-bilingue", "RemotoTool"],
  ["src/app/outplacement/career-brief/page.tsx", "career-brief", "CareerBriefTool"],
  ["src/app/outplacement/90-dias/page.tsx", "primeros-90-dias", "Dias90Tool"],
  ["src/app/outplacement/segunda-carrera/page.tsx", "segunda-carrera", "SegundaCarreraTool"],
  ["src/app/outplacement/video-entrevista/page.tsx", "video-mock", "VideoTool"],
  ["src/app/herramientas/linkedin/page.tsx", "linkedin-opt", "LinkedInTool"],
  ["src/app/herramientas/carta/page.tsx", "carta-postulacion", "CartaTool"],
  ["src/app/herramientas/plantilla/page.tsx", "plantilla-cv-ats", "PlantillaTool"],
  ["src/app/herramientas/entrevistas/page.tsx", "banco-entrevistas-tool", "EntrevistasBankTool"],
  ["src/app/herramientas/salario/page.tsx", "bandas-salario", "SalarioTool"],
  ["src/app/herramientas/cultura/page.tsx", "cultura-oferta", "CulturaTool"],
];

for (const [rel, courseId, inner] of wraps) {
  const f = path.join(root, rel);
  let s = fs.readFileSync(f, "utf8");
  if (s.includes("CourseWithTool")) {
    console.log("skip", rel);
    continue;
  }
  if (!/^["']use client["']/.test(s.trimStart())) {
    s = '"use client";\n\n' + s;
  }
  const importBlock =
    'import { CourseWithTool } from "@/components/CourseWithTool";\n' +
    'import { toolCourseById } from "@/lib/courses/toolCourses";\n';
  s = s.replace(/(["']use client["'];\s*)/, `$1\n${importBlock}`);
  s = s.replace(/export default function \w+/, `function ${inner}`);
  s += `\n\nexport default function Page() {\n  const course = toolCourseById("${courseId}");\n  if (!course) return null;\n  return (\n    <CourseWithTool course={course}>\n      <${inner} />\n    </CourseWithTool>\n  );\n}\n`;
  fs.writeFileSync(f, s);
  console.log("ok", rel);
}
