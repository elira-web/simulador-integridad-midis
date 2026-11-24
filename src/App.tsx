// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

/**
 * ============================================================================
 * SIMULADOR DE CASOS DE INTEGRIDAD MIDIS (v3.0 - ARCHIVO ÚNICO AUTOCONTENIDO)
 * ============================================================================
 * Taller Virtual: Integridad en la gestión pública para la entrega de servicios
 * Público objetivo: Servidores y directivos de Gobiernos Regionales y Locales
 * Puntaje total: 20.0 puntos (12 preguntas en 3 casos territoriales)
 * ============================================================================
 */

const APP_VERSION = 'v3.0';

const BRAND_PRESETS = {
  midisClasico: {
    id: 'midisClasico',
    name: 'Institucional Midis (Rojo y Gris)',
    primary: '#D91023',
    secondary: '#334155',
    accent: '#0F766E',
    softBg: '#FEF2F2',
  },
  azulEstado: {
    id: 'azulEstado',
    name: 'Gestión Pública (Azul Institucional)',
    primary: '#1E3A8A',
    secondary: '#1E293B',
    accent: '#0369A1',
    softBg: '#EFF6FF',
  },
  verdeTerritorial: {
    id: 'verdeTerritorial',
    name: 'Articulación Territorial (Verde)',
    primary: '#065F46',
    secondary: '#1F2937',
    accent: '#B45309',
    softBg: '#ECFDF5',
  },
};

const STORAGE_KEYS = {
  COHORT: 'midis_sim_cohort_v3',
  ACTIVE_PARTICIPANT_ID: 'midis_sim_active_id_v3',
  CONFIG: 'midis_sim_config_v3',
};

const LEGACY_KEYS = [
  'midis_sim_cohort',
  'midis_sim_cohort_v1',
  'midis_sim_cohort_v2',
  'midis_sim_active_session_v2',
];

const DEFAULT_CONFIG = {
  entityTitle: 'Simulador de Casos de Integridad Midis',
  workshopSubtitle: 'Taller Virtual: Integridad en la gestión pública para la entrega de servicios',
  brandPreset: 'midisClasico',
  customLogoDataUrl: '',
  instructorUser: 'docente.midis',
  instructorPass: 'Integridad2026',
  passingThreshold: 14.0,
  minJustificationChars: 25,
};

/**
 * Emblema institucional del Midis:
 * 1) Prioriza el logotipo cargado desde Configuración Docente (DataURL).
 * 2) Luego intenta cargar desde /public (/logo-midis.png, /MIDIS.png, /MIDIS (1).png).
 * 3) Como respaldo final renderiza el emblema vectorial sin recortes.
 */
function MidisLogoBadge({ customLogo, className = 'h-12' }) {
  const candidates = useMemo(() => {
    const list = [];
    if (customLogo && customLogo.trim() !== '') {
      list.push(customLogo);
    }
    ['/logo-midis.png', '/MIDIS.png', '/MIDIS (1).png'].forEach((path) => {
      if (!list.includes(path)) list.push(path);
    });
    return list;
  }, [customLogo]);

  const [candidateIdx, setCandidateIdx] = useState(0);

  useEffect(() => {
    setCandidateIdx(0);
  }, [customLogo]);

  const currentSrc = candidates[candidateIdx];

  if (currentSrc) {
    return (
      <img
        src={currentSrc}
        alt="Ministerio de Desarrollo e Inclusión Social - PERÚ"
        onError={() => setCandidateIdx((prev) => prev + 1)}
        className={`${className} w-auto max-w-[330px] object-contain select-none`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 650 125"
      className={`${className} w-auto max-w-[330px] select-none`}
      role="img"
      aria-label="República del Perú - Ministerio de Desarrollo e Inclusión Social"
    >
      <rect x="0" y="0" width="126" height="125" fill="#FFFFFF" />
      <text
        x="63"
        y="17"
        textAnchor="middle"
        fill="#1E293B"
        fontSize="9.5"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="0.6"
      >
        REPÚBLICA DEL PERÚ
      </text>
      <ellipse cx="63" cy="31" rx="14" ry="6.5" fill="none" stroke="#15803D" strokeWidth="4.2" />
      <path d="M23 36 L43 44 L43 96 L27 89 Z" fill="#D91023" />
      <path d="M25 56 L43 62 L43 72 L26 66 Z" fill="#FFFFFF" />
      <path d="M103 36 L83 44 L83 96 L99 89 Z" fill="#D91023" />
      <path d="M101 56 L83 62 L83 72 L100 66 Z" fill="#FFFFFF" />
      <path
        d="M42 43 H84 V75 C84 93 63 105 63 105 C63 105 42 93 42 75 Z"
        fill="#FFFFFF"
        stroke="#CA8A04"
        strokeWidth="2.5"
      />
      <rect x="44.5" y="45.5" width="17.5" height="23" fill="#38BDF8" />
      <path
        d="M50 66 L51 57 L55 56 L57 49 L59 50 L58 57 L57 66"
        stroke="#92400E"
        strokeWidth="2.2"
        fill="none"
      />
      <rect x="64" y="45.5" width="17.5" height="23" fill="#FFFFFF" />
      <line x1="72.5" y1="66" x2="72.5" y2="54" stroke="#78350F" strokeWidth="2" />
      <circle cx="72.5" cy="52" r="5.5" fill="#15803D" />
      <path
        d="M44.5 70.5 H81.5 V75 C81.5 90 63 101 63 101 C63 101 44.5 90 44.5 75 Z"
        fill="#D91023"
      />
      <path d="M51 83 C56 76 69 76 74 82 C69 87 57 88 51 83 Z" fill="#FACC15" />
      <path d="M56 105 L63 114 L70 105 Z" fill="#D91023" />

      <rect x="126" y="0" width="5" height="125" fill="#FFFFFF" />
      <rect x="131" y="0" width="118" height="125" fill="#E30613" />
      <text
        x="190"
        y="76"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="38"
        fontWeight="500"
        fontFamily="Calibri, 'Segoe UI', Arial, sans-serif"
        letterSpacing="1"
      >
        PERÚ
      </text>

      <rect x="249" y="0" width="5" height="125" fill="#FFFFFF" />
      <rect x="254" y="0" width="396" height="125" fill="#575756" />
      <text
        x="275"
        y="55"
        fill="#FFFFFF"
        fontSize="32"
        fontWeight="400"
        fontFamily="Calibri, 'Segoe UI', Arial, sans-serif"
      >
        Ministerio de Desarrollo
      </text>
      <text
        x="275"
        y="95"
        fill="#FFFFFF"
        fontSize="32"
        fontWeight="400"
        fontFamily="Calibri, 'Segoe UI', Arial, sans-serif"
      >
        e Inclusión Social
      </text>
    </svg>
  );
}

/**
 * ============================================================================
 * BANCO DE CASOS TERRITORIALES MIDIS (3 CASOS · 12 PREGUNTAS · 20.0 PUNTOS)
 * ============================================================================
 */
const CASES_DATA = [
  {
    id: 'case-1',
    number: 1,
    title: 'Focalización territorial sin favoritismos',
    role: 'Gerente de Desarrollo Social – Municipalidad Distrital',
    normativeFocus:
      'Ley N° 31564 (Conflicto de Intereses) · Ley N° 27815 (Código de Ética) · Sistema Nacional de Focalización (Sinafo)',
    contextSummary:
      'La Municipalidad Distrital ejecuta el barrido focalizado de hogares para actualizar la Clasificación Socioeconómica (CSE) en el Padrón General de Hogares (PGH) del Midis. Se presentan tres tensiones críticas en un plazo de 48 horas.',
    narrativeBlocks: [
      {
        label: 'Situación A – Proceso de contratación del equipo de empadronadores:',
        text: 'Usted preside el comité de selección que evaluará a 18 postulantes para plazas temporales de empadronadores. Al revisar la lista de aptos, advierte que una de las postulantes es prima hermana de su cónyuge (tercer grado de afinidad). Ella cumple con los requisitos mínimos del perfil y obtuvo el segundo mejor puntaje en la evaluación curricular.',
      },
      {
        label: 'Situación B – Solicitud vecinal y escrito formal:',
        text: 'La presidenta de la junta vecinal del sector norte presenta un escrito solicitando formalmente que usted sea apartado del comité por considerar que existe vínculo familiar con una postulante, mientras que su jefe inmediato (Gerente Municipal) le pide verbalmente "no retrasar el cronograma porque el Midis exige metas esta semana".',
      },
      {
        label: 'Situación C – Presión política sobre el padrón:',
        text: 'Esa misma tarde, un regidor distrital ingresa a su despacho sin registro de visita y le solicita priorizar e incluir directamente en el padrón de elegibles de Pensión 65 a su tío adulto mayor, alegando que "vive solo y apoyó en la campaña", pidiéndole que firme una constancia excepcional de vulnerabilidad.',
      },
    ],
    questions: [
      {
        id: 'c1-q1',
        code: 'Pregunta 1.1',
        points: 1.5,
        competency: 'Gestión de Conflictos de Intereses',
        prompt:
          'Respecto al concurso de empadronadores temporales donde participa la prima hermana de su cónyuge, ¿cómo debe diagnosticar técnicamente la situación antes de suscribir el acta de resultados?',
        options: [
          {
            id: 'A',
            text: 'No existe impedimento ni conflicto porque la postulante cumple con los requisitos técnicos y la plaza es temporal por locación de servicios.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. La temporalidad del contrato o el cumplimiento del perfil no eliminan el conflicto de intereses; el parentesco hasta el cuarto grado de consanguinidad y segundo de afinidad (y el vínculo familiar cercano en general) compromete la imparcialidad objetiva del comité.',
          },
          {
            id: 'B',
            text: 'Existe un conflicto de intereses objetivo que afecta la imparcialidad del proceso de selección, independientemente de los méritos curriculares de la postulante.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Excelente criterio! Conforme a la Ley N° 27815 (deber de neutralidad y prohibición de mantener intereses en conflicto) y la Ley N° 31564, la sola existencia del vínculo familiar en un proceso donde usted decide compromete la imparcialidad institucional.',
          },
          {
            id: 'C',
            text: 'Solo habría conflicto de intereses si la postulante resultara ganadora y usted firmara su contrato directamente, pero no durante la etapa de evaluación.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Parcialmente erróneo. El conflicto de intereses surge desde el momento en que el servidor participa en la deliberación o evaluación donde interviene un familiar, no únicamente al suscribir el contrato.',
          },
        ],
        rubricHint:
          'Sustente por qué el vínculo familiar compromete la imparcialidad y neutralidad en el comité de selección.',
      },
      {
        id: 'c1-q2',
        code: 'Pregunta 1.2',
        points: 1.5,
        competency: 'Mecanismos Preventivos: Excusación vs. Recusación',
        prompt:
          'Ante el parentesco detectado con la postulante y el escrito presentado por la presidenta de la junta vecinal, ¿qué mecanismo preventivo de gestión de conflictos de intereses corresponde activar de inmediato?',
        options: [
          {
            id: 'A',
            text: 'Continuar en el comité dejando constancia en el acta de que usted se abstendrá de votar únicamente cuando se evalúe a su familiar.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Insuficiente. Permanecer en el comité genera sospecha legítima de influencia sobre los demás miembros. La norma exige apartarse íntegramente del conocimiento del procedimiento.',
          },
          {
            id: 'B',
            text: 'Presentar una recusación contra usted mismo ante el Órgano de Control Institucional (OCI) para que suspenda el concurso por 30 días.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. La recusación es la facultad que ejercen los terceros o ciudadanos para solicitar la separación de un servidor; cuando el propio servidor se aparta voluntariamente por escrito ante su superior, la figura técnica es la excusación (abstención).',
          },
          {
            id: 'C',
            text: 'Formular su excusación (abstención) por escrito ante el Gerente Municipal antes de cualquier deliberación, solicitando su reemplazo en el comité, sin perjuicio de tramitar el escrito vecinal de recusación.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Correcto! La excusación es el deber activo del servidor de apartarse por escrito ante su superior jerárquico apenas advierte el conflicto, mientras que la recusación es el derecho ejercido por terceros (la junta vecinal).',
          },
        ],
        rubricHint:
          'Explique la diferencia entre excusación (deber del servidor) y recusación (derecho de terceros) y ante quién se tramita.',
      },
      {
        id: 'c1-q3',
        code: 'Pregunta 1.3',
        points: 1.5,
        competency: 'Transparencia y Registro de Visitas / Gestión de Intereses',
        prompt:
          'Frente a la visita sin registro del regidor distrital y su pedido de priorizar el expediente de su tío adulto mayor fuera de los criterios técnicos del Sinafo, ¿qué actuación íntegra debe ejecutar?',
        options: [
          {
            id: 'A',
            text: 'Recibir el expediente del tío del regidor por cortesía institucional y pedir al equipo de empadronadores que lo visite primero para evitar fricciones con el Concejo Municipal.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Priorizar un expediente por influencia política vulnera el principio de igualdad de trato, la neutralidad y las reglas técnicas del Sistema Nacional de Focalización (Sinafo).',
          },
          {
            id: 'B',
            text: 'Rechazar el pedido informal, exigir que la reunión se asiente en el Registro de Visitas en Línea / Gestión de Intereses indicando el motivo real, y encauzar al ciudadano por la mesa de partes regular de la Unidad Local de Empadronamiento (ULE).',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Excelente decisión! Toda gestión de intereses o visita de autoridad debe quedar trazada en el Registro de Visitas (Ley N° 28024 y normas de integridad), y toda solicitud de focalización sigue el conducto regular de la ULE.',
          },
          {
            id: 'C',
            text: 'Emitir una constancia provisional de vulnerabilidad condicionada a que posteriormente la ULE realice la verificación domiciliaria.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Emitir constancias sin verificación técnica previa constituye falsedad administrativa y adulteración de los filtros de elegibilidad de los programas sociales del Midis.',
          },
        ],
        rubricHint:
          'Indique cómo garantizar la trazabilidad de la visita del regidor y el respeto al procedimiento técnico de la ULE.',
      },
      {
        id: 'c1-q4',
        code: 'Pregunta 1.4',
        points: 2.0,
        competency: 'Articulación Territorial y Prevención de Riesgos en Focalización',
        prompt:
          '¿Cómo debe articular con la Unidad Territorial del Midis para cumplir el plazo de cierre de brechas sin comprometer la calidad e integridad de la Clasificación Socioeconómica (CSE)?',
        options: [
          {
            id: 'A',
            text: 'Remitir fichas socioeconómicas llenadas en gabinete con datos referenciales del año anterior para cumplir la meta porcentual y corregirlas después.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Grave infracción ética y funcional. El llenado en gabinete sin visita domiciliaria real adultera el Padrón General de Hogares y genera responsabilidades administrativas y penales.',
          },
          {
            id: 'B',
            text: 'Solicitar a la Unidad Territorial del Midis que asuma directamente el empadronamiento distrital mientras la municipalidad resuelve sus problemas administrativos.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Inadecuado. La operatividad de la Unidad Local de Empadronamiento (ULE) es competencia municipal; trasladar la responsabilidad sin plan de contingencia paraliza el servicio al ciudadano.',
          },
          {
            id: 'C',
            text: 'Comunicar formalmente a la Unidad Territorial del Midis el cronograma reprogramado tras la recomposición transparente del comité, implementando supervisión cruzada en campo y control de calidad muestral de las fichas.',
            score: 2.0,
            isCorrect: true,
            feedback:
              '¡Sobresaliente! Combina transparencia intergubernamental con control preventivo en campo, asegurando que las metas territoriales se alcancen con datos fidedignos.',
          },
        ],
        rubricHint:
          'Detalle qué medidas de control de calidad y coordinación interinstitucional aseguran metas limpias ante el Midis.',
      },
    ],
  },
  {
    id: 'case-2',
    number: 2,
    title: 'Custodia de recursos alimentarios y contratación transparente',
    role: 'Jefe de la Oficina de Abastecimiento y Almacén – Gobierno Regional',
    normativeFocus:
      'Ley N° 27815 (Uso Adecuado de Bienes del Estado y Probidad) · Directiva N° 001-2022-MIDIS (Anexo 2: Pautas en Contrataciones)',
    contextSummary:
      'Durante la atención de una emergencia alimentaria y la ejecución del Programa de Complementación Alimentaria (PCA), se detectan irregularidades en el almacén central y en un proceso de adquisición de conservas y menestras.',
    narrativeBlocks: [
      {
        label: 'Situación A – Uso de bienes y custodia en almacén:',
        text: 'Al realizar un arqueo inopinado en el almacén de alimentos destinados a comedores populares, descubre que un coordinador operativo autorizó trasladar 45 sacos de arroz y cajas de aceite en una camioneta institucional hacia un local comunal vinculado a una asociación privada que organiza un evento benéfico este fin de semana, bajo el argumento de que "luego serán repuestos con una donación".',
      },
      {
        label: 'Situación B – Señales de alerta en contratación pública:',
        text: 'Paralelamente, en el comité de selección para adquirir nuevos lotes de alimentos, el área usuaria propone modificar las especificaciones técnicas a último momento para exigir una certificación de envase que solo cumple un único proveedor local, cuyo gerente general fue consultor de la misma gerencia hace cuatro meses.',
      },
      {
        label: 'Situación C – Ofrecimiento de dádiva encubierta:',
        text: 'Al salir de la oficina, el representante de dicho proveedor lo aborda en el estacionamiento y le entrega una caja cerrada con productos gourmet y una tarjeta de invitación a un almuerzo corporativo "para explicarle las bondades técnicas de su ficha de producto".',
      },
    ],
    questions: [
      {
        id: 'c2-q1',
        code: 'Pregunta 2.1',
        points: 1.5,
        competency: 'Custodia y Uso Adecuado de Bienes del Estado',
        prompt:
          'Respecto al traslado de los 45 sacos de arroz y cajas de aceite en una camioneta oficial hacia un evento privado con promesa de reposición posterior, ¿cuál es la calificación ética y jurídica correcta?',
        options: [
          {
            id: 'A',
            text: 'Es una falta leve subsanable siempre que el coordinador firme un vale de préstamo y reponga exactamente la misma cantidad y marca antes del cierre mensual.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Los bienes públicos destinados a programas sociales son intangibles para fines ajenos al servicio; no existe la figura del "préstamo" ni de la reposición posterior de alimentos del Estado.',
          },
          {
            id: 'B',
            text: 'Constituye una infracción grave al deber de uso adecuado de los bienes del Estado (Ley N° 27815) y un presunto delito de peculado de uso/apropiación, exigiendo la inmovilización y recuperación inmediata de los bienes y el reporte formal.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Correcto! Conforme al Art. 7 numeral 5 de la Ley N° 27815 y su Reglamento, los bienes públicos bajo custodia solo pueden emplearse para los fines institucionales asignados. Debe levantarse acta, recuperar el lote de inmediato y reportar los hechos.',
          },
          {
            id: 'C',
            text: 'Solo es sancionable si el evento privado cobra entrada; si es gratuito para vecinos de la región, se considera proyección social válida.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. La gratuidad del evento externo no legitima desviar alimentos asignados al padrón oficial de comedores populares ni usar vehículos estatales fuera de comisión oficial.',
          },
        ],
        rubricHint:
          'Fundamente por qué los alimentos de programas sociales no admiten préstamo ni desvío y qué acción inmediata debe tomar.',
      },
      {
        id: 'c2-q2',
        code: 'Pregunta 2.2',
        points: 1.5,
        competency: 'Detección de Banderas Rojas en Contrataciones Públicas',
        prompt:
          'Sobre la modificación de último momento de las especificaciones técnicas que favorece a una empresa dirigida por un exconsultor de la misma gerencia (hace 4 meses), ¿qué irregularidades se configuran según las pautas de integridad en contrataciones?',
        options: [
          {
            id: 'A',
            text: 'Direccionamiento de especificaciones técnicas y riesgo de impedimento/conflicto de intereses por puerta giratoria reciente, debiendo observar y devolver el requerimiento para estandarizarlo.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Excelente diagnóstico! El Anexo 2 de la Directiva N° 001-2022-MIDIS tipifica expresamente la adecuación o manipulación de especificaciones técnicas para favorecer a un proveedor específico y el otorgamiento/influencia a favor de empresas vinculadas a exservidores o consultores con impedimento.',
          },
          {
            id: 'B',
            text: 'No existe impedimento porque los exconsultores por locación de servicios no están sujetos a restricciones ni periodos de carencia tras culminar su orden.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Tanto la normativa de contrataciones del Estado como la Ley N° 31564 (prevención de conflictos de intereses en ingreso, ejercicio y salida) regulan impedimentos y restricciones respecto a información privilegiada y vínculos recientes.',
          },
          {
            id: 'C',
            text: 'Corresponde aprobar las bases tal como las envió el área usuaria porque Abastecimiento no tiene competencia para cuestionar criterios técnicos de envases.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Erróneo. El órgano encargado de las contrataciones y el comité tienen el deber de verificar la pluralidad de postores y la libre concurrencia antes de aprobar las bases.',
          },
        ],
        rubricHint:
          'Identifique las dos alertas de corrupción presentes (direccionamiento técnico y vínculo reciente del exconsultor).',
      },
      {
        id: 'c2-q3',
        code: 'Pregunta 2.3',
        points: 1.5,
        competency: 'Prohibición de Ventajas Indebidas y Dádivas',
        prompt:
          'Frente a la entrega de la caja de productos gourmet y la invitación a almorzar por parte del representante del proveedor en el estacionamiento, ¿cómo debe proceder?',
        options: [
          {
            id: 'A',
            text: 'Aceptar únicamente la caja para compartirla con todo el personal de la oficina de Abastecimiento y rechazar el almuerzo para mantener la objetividad.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. El Art. 8 numeral 2 de la Ley N° 27815 prohíbe terminantemente obtener o procurar beneficios o ventajas indebidas, para sí o para otros, mediante el uso de su cargo.',
          },
          {
            id: 'B',
            text: 'Rechazar de plano tanto el obsequio como la invitación fuera de sede institucional, dejar constancia escrita del incidente ante la Oficina de Integridad Institucional y comunicar al proveedor que toda consulta técnica se realiza exclusivamente por la plataforma oficial del procedimiento.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Correcto! La política de integridad exige cero tolerancia frente a dádivas o atenciones de postores, dejando constancia documentada del intento de acercamiento informal.',
          },
          {
            id: 'C',
            text: 'Asistir al almuerzo pagando su propio consumo para escuchar la explicación técnica del proveedor en igualdad de condiciones.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Riesgoso e improcedente. Reunirse privadamente con un postor en curso rompe la transparencia y el trato igualitario; toda aclaración técnica debe ser pública y formal en el expediente.',
          },
        ],
        rubricHint:
          'Explique el fundamento ético para rechazar dádivas y cómo canalizar consultas técnicas de proveedores.',
      },
      {
        id: 'c2-q4',
        code: 'Pregunta 2.4',
        points: 2.0,
        competency: 'Trazabilidad y Control Preventivo de la Cadena de Suministro',
        prompt:
          '¿Qué medida estructural debe implementar en la gestión de almacenes y entregas para evitar que se repitan desvíos de alimentos destinados a población vulnerable?',
        options: [
          {
            id: 'A',
            text: 'Restringir el acceso al almacén únicamente al coordinador operativo para que exista un solo responsable verbal del inventario.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Concentrar el control en una sola persona sin segregación de funciones ni doble verificación incrementa el riesgo de desvío y encubrimiento.',
          },
          {
            id: 'B',
            text: 'Implementar guías de remisión correlativas vinculadas al padrón de comedores, control de salida con doble firma (Almacén + Desarrollo Social), bitácora GPS de vehículos y publicación periódica de actas de entrega.',
            score: 2.0,
            isCorrect: true,
            feedback:
              '¡Excelente propuesta preventiva! La segregación de funciones, la trazabilidad documental y el control ciudadano blindan la entrega efectiva de alimentos a los usuarios finales.',
          },
          {
            id: 'C',
            text: 'Realizar un único inventario anual al cierre del ejercicio fiscal para no interrumpir la distribución diaria.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Insuficiente. Un inventario anual detecta las pérdidas demasiado tarde; se requieren controles concurrentes e inopinados en cada despacho.',
          },
        ],
        rubricHint:
          'Mencione al menos dos controles concretos de segregación de funciones o trazabilidad de entregas.',
      },
    ],
  },
  {
    id: 'case-3',
    number: 3,
    title: 'Gestión de denuncias y protección efectiva al denunciante',
    role: 'Oficial de Integridad / Responsable de Atención de Denuncias',
    normativeFocus:
      'D. Leg. N° 1327 y D.S. N° 010-2017-JUS · Directiva N° 001-2022-MIDIS (Versión N° 02, R.M. N° 157-2026-MIDIS)',
    contextSummary:
      'Una servidora contratada bajo régimen CAS en una oficina desconcentrada acude a su despacho visiblemente afectada para denunciar que su coordinador zonal exige cobros indebidos a gestores locales a cambio de acelerar expedientes de subvenciones.',
    narrativeBlocks: [
      {
        label: 'Situación A – Temor a represalias y pedido de reserva:',
        text: 'La servidora entrega audios y capturas de mensajes que evidencian el presunto cobro indebido. Sin embargo, señala que su contrato CAS vence en 12 días y que el coordinador denunciado es quien firma su informe de conformidad y renovación. Solicita que nadie sepa su nombre y pide protección laboral inmediata.',
      },
      {
        label: 'Situación B – Presión interna para conocer la identidad:',
        text: 'Dos horas después de ingresada la denuncia, el Jefe de la Oficina de Recursos Humanos y el Jefe de la Unidad Zonal le envían un correo institucional solicitando "con carácter de muy urgente el nombre de la persona que presentó la queja para pedirle descargos y evaluar el clima laboral".',
      },
      {
        label: 'Situación C – Derivación y seguimiento del expediente:',
        text: 'Verificados los requisitos mínimos de la denuncia y las evidencias adjuntas, corresponde determinar la ruta de derivación institucional y las obligaciones de seguimiento para evitar la impunidad.',
      },
    ],
    questions: [
      {
        id: 'c3-q1',
        code: 'Pregunta 3.1',
        points: 1.5,
        competency: 'Garantía Inmediata de Reserva de Identidad',
        prompt:
          'Respecto a la solicitud de reserva de identidad formulada por la servidora denunciante, ¿qué regla procedimental rige según el D. Leg. N° 1327 y la Directiva N° 001-2022-MIDIS (V.02)?',
        options: [
          {
            id: 'A',
            text: 'La reserva de identidad requiere primero una evaluación de verosimilitud de 5 días hábiles y opinión previa de Asesoría Jurídica antes de asignar un código.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Conforme al numeral 7.5.2 de la Directiva N° 001-2022-MIDIS (V.02) y el D.S. N° 010-2017-JUS, la revisión de requisitos de procedencia NO aplica para la reserva de identidad: esta se otorga de manera inmediata una vez solicitada.',
          },
          {
            id: 'B',
            text: 'La reserva de identidad se otorga de manera inmediata apenas es solicitada, asignando un código cifrado único que protege la identidad del denunciante en todas las etapas y derivaciones del expediente.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Exacto! La reserva de identidad es automática e inmediata, materializándose mediante el código cifrado administrado exclusivamente por la Oficina de Integridad Institucional (o máxima autoridad administrativa).',
          },
          {
            id: 'C',
            text: 'La reserva de identidad solo protege el nombre del denunciante frente a ciudadanos externos, pero debe revelarse internamente a Recursos Humanos y a la Secretaría Técnica PAD.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Grave error. Ninguna unidad orgánica (ni siquiera RR.HH. o la STPAD) puede conocer la identidad del denunciante protegido; toda actuación se tramita exclusivamente con el código cifrado.',
          },
        ],
        rubricHint:
          'Indique cuándo se otorga la reserva de identidad y mediante qué instrumento técnico se materializa.',
      },
      {
        id: 'c3-q2',
        code: 'Pregunta 3.2',
        points: 1.5,
        competency: 'Medidas de Protección Laboral frente a Represalias',
        prompt:
          'Dado que el contrato CAS de la denunciante vence en 12 días y depende de la conformidad del coordinador denunciado, ¿qué medida de protección laboral corresponde gestionar con urgencia?',
        options: [
          {
            id: 'A',
            text: 'Esperar a que venza su contrato CAS para recién otorgarle una carta de recomendación y evitar que el denunciado sospeche.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Permitir la no renovación arbitraria de un contrato CAS como represalia por denunciar corrupción vulnera el deber de protección del Estado.',
          },
          {
            id: 'B',
            text: 'Disponer/gestionar ante Recursos Humanos las medidas de protección laboral (traslado temporal del denunciado o de la denunciante con su consentimiento, y suspensión de la facultad del denunciado para evaluar su desempeño o decidir sobre la renovación de su contrato CAS) manteniendo el código cifrado.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Excelente! El D.S. N° 010-2017-JUS contempla expresamente la prohibición de hostilización y la protección frente a la no renovación contractual por represalia, apartando al denunciado de cualquier decisión laboral sobre la denunciante.',
          },
          {
            id: 'C',
            text: 'Trasladar unilateralmente a la denunciante a una sede rural lejana sin consultarle, como medida de seguridad preventiva.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Erróneo. El traslado o rotación del denunciante nunca puede desmejorar sus condiciones laborales ni aplicarse sin su consentimiento expreso, pues equivaldría a una represalia encubierta.',
          },
        ],
        rubricHint:
          'Explique cómo neutralizar el riesgo de no renovación contractual sin afectar los derechos de la denunciante.',
      },
      {
        id: 'c3-q3',
        code: 'Pregunta 3.3',
        points: 1.5,
        competency: 'Deber de Confidencialidad frente a Requerimientos Internos',
        prompt:
          '¿Cómo debe responder al correo urgente del Jefe de Recursos Humanos y del Jefe de la Unidad Zonal que exigen conocer el nombre de la denunciante?',
        options: [
          {
            id: 'A',
            text: 'Denegar formalmente la entrega de la identidad invocando el principio de reserva (D. Leg. N° 1327 y Directiva N° 001-2022-MIDIS), advirtiendo que cualquier intento de identificar o tomar represalias contra el denunciante constituye falta administrativa disciplinaria grave.',
            score: 1.5,
            isCorrect: true,
            feedback:
              '¡Correcto! El deber de reserva es oponible a cualquier funcionario o directivo de la entidad. Revelar o indagar la identidad del denunciante acarrea responsabilidad administrativa disciplinaria.',
          },
          {
            id: 'B',
            text: 'Comunicar el nombre verbalmente solo al Jefe de Recursos Humanos bajo compromiso de confidencialidad para que pueda tramitar el desplazamiento.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. La reserva de identidad no admite revelaciones verbales ni excepciones informales entre jefaturas.',
          },
          {
            id: 'C',
            text: 'No responder el correo para evitar dejar rastro escrito de que existe una denuncia en trámite.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Inadecuado. Se debe responder formalmente reafirmando la reserva legal y dejando advertencia escrita sobre la prohibición de represalias.',
          },
        ],
        rubricHint:
          'Señale las consecuencias legales de vulnerar la reserva de identidad y cómo responder institucionalmente.',
      },
      {
        id: 'c3-q4',
        code: 'Pregunta 3.4',
        points: 2.0,
        competency: 'Derivación Competente y Seguimiento Obligatorio',
        prompt:
          'Calificada la denuncia por presuntos cobros indebidos con evidencias documentales, ¿a qué órganos competentes debe derivarse y qué obligación conserva la Oficina de Integridad Institucional?',
        options: [
          {
            id: 'A',
            text: 'Derivar únicamente al jefe inmediato del coordinador denunciado para que le llame la atención por escrito y archivar el expediente en Integridad.',
            score: 0.0,
            isCorrect: false,
            feedback:
              'Incorrecto. Los actos de corrupción no se resuelven con llamadas de atención internas ni agotan su trámite sin derivación a los órganos disciplinarios, de control y procuraduría.',
          },
          {
            id: 'B',
            text: 'Derivar los actuados (con código cifrado) a la Secretaría Técnica del PAD (STPAD), al Órgano de Control Institucional (OCI) y a la Procuraduría Pública (PP) por los indicios penales, notificando al denunciante en 1 día hábil y realizando seguimiento activo hasta la resolución final del caso.',
            score: 2.0,
            isCorrect: true,
            feedback:
              '¡Respuesta impecable! Conforme al numeral 7.4 de la Directiva N° 001-2022-MIDIS (V.02), la derivación a STPAD, OCI y PP se notifica al denunciante en un plazo máximo de 1 día hábil y NO agota la obligación de Integridad de realizar seguimiento hasta el resultado final.',
          },
          {
            id: 'C',
            text: 'Remitir el expediente exclusivamente al Ministerio Público y cerrar el caso en la entidad hasta que exista sentencia judicial firme en 3 o 4 años.',
            score: 0.5,
            isCorrect: false,
            feedback:
              'Parcialmente erróneo. La responsabilidad administrativa disciplinaria (STPAD) es autónoma de la vía penal y debe tramitarse en paralelo sin esperar sentencia judicial.',
          },
        ],
        rubricHint:
          'Mencione los órganos receptores (STPAD, OCI, PP), el plazo de notificación al denunciante (1 día hábil) y el deber de seguimiento.',
      },
    ],
  },
];

/**
 * Datos de demostración opcionales (solo se cargan si el docente presiona "Cargar Demo")
 */
const DEMO_COHORT = [
  {
    id: 'demo-part-1',
    name: 'Elena Quispe Huamán',
    dni: '42891563',
    email: 'equispe@munisanta.gob.pe',
    consent: true,
    startedAt: '2026-11-23T09:10:00.000Z',
    completedAt: '2026-11-23T09:34:00.000Z',
    answers: {
      'c1-q1': { optionId: 'B', justification: 'Existe un conflicto de intereses objetivo por el parentesco por afinidad con la prima hermana del cónyuge dentro del comité que presido, por lo que corresponde actuar preventivamente.', score: 1.5, timestamp: '2026-11-23T09:12:00.000Z' },
      'c1-q2': { optionId: 'C', justification: 'Debo presentar mi excusación formal por escrito ante mi superior jerárquico y solicitar la designación de un reemplazo en el comité, diferenciándolo de la recusación vecinal.', score: 1.5, timestamp: '2026-11-23T09:14:00.000Z' },
      'c1-q3': { optionId: 'B', justification: 'Toda visita de autoridad debe quedar en el Registro de Visitas y el trámite de focalización debe seguir el conducto regular de la ULE sin privilegios políticos.', score: 1.5, timestamp: '2026-11-23T09:16:00.000Z' },
      'c1-q4': { optionId: 'C', justification: 'Coordinar con la Unidad Territorial del Midis un cronograma transparente y control de calidad en campo garantiza el cumplimiento de metas sin adulterar fichas.', score: 2.0, timestamp: '2026-11-23T09:18:00.000Z' },
      'c2-q1': { optionId: 'B', justification: 'Los alimentos de programas sociales son intangibles y su desvío vulnera el deber de uso adecuado de bienes del Estado establecido en la Ley 27815.', score: 1.5, timestamp: '2026-11-23T09:20:00.000Z' },
      'c2-q2': { optionId: 'A', justification: 'Se advierte direccionamiento técnico de especificaciones y riesgo de impedimento por vínculo reciente de exconsultor conforme a las pautas de contratación.', score: 1.5, timestamp: '2026-11-23T09:22:00.000Z' },
      'c2-q3': { optionId: 'B', justification: 'Está prohibido aceptar dádivas o invitaciones privadas de postores; se debe rechazar, reportar a Integridad y canalizar consultas por la vía oficial.', score: 1.5, timestamp: '2026-11-23T09:24:00.000Z' },
      'c2-q4': { optionId: 'B', justification: 'La segregación de funciones con doble firma, guías correlativas y monitoreo GPS evita el desvío de recursos alimentarios.', score: 2.0, timestamp: '2026-11-23T09:26:00.000Z' },
      'c3-q1': { optionId: 'B', justification: 'La reserva de identidad es inmediata y automática mediante código cifrado, sin requerir evaluación previa de procedencia.', score: 1.5, timestamp: '2026-11-23T09:28:00.000Z' },
      'c3-q2': { optionId: 'B', justification: 'Corresponde activar protección laboral para evitar represalias en la renovación del contrato CAS y apartar al denunciado de su evaluación.', score: 1.5, timestamp: '2026-11-23T09:30:00.000Z' },
      'c3-q3': { optionId: 'A', justification: 'El principio de reserva impide revelar el nombre del denunciante a cualquier jefatura interna, bajo responsabilidad disciplinaria.', score: 1.5, timestamp: '2026-11-23T09:32:00.000Z' },
      'c3-q4': { optionId: 'B', justification: 'Se deriva con código cifrado a STPAD, OCI y Procuraduría Pública, notificando en 1 día hábil y manteniendo seguimiento activo.', score: 2.0, timestamp: '2026-11-23T09:34:00.000Z' },
    },
  },
  {
    id: 'demo-part-2',
    name: 'Carlos Mendoza Paredes',
    dni: '40512398',
    email: 'cmendoza@regionjunin.gob.pe',
    consent: true,
    startedAt: '2026-11-23T09:15:00.000Z',
    completedAt: '2026-11-23T09:41:00.000Z',
    answers: {
      'c1-q1': { optionId: 'B', justification: 'El parentesco dentro del comité genera un conflicto de intereses objetivo que exige apartarse para proteger la imparcialidad.', score: 1.5, timestamp: '2026-11-23T09:17:00.000Z' },
      'c1-q2': { optionId: 'A', justification: 'Puedo quedarme en el comité y abstenerme solo al momento de calificar a mi familiar para no retrasar el proceso.', score: 0.5, timestamp: '2026-11-23T09:19:00.000Z' },
      'c1-q3': { optionId: 'B', justification: 'Se debe registrar la visita del regidor y derivar el pedido al procedimiento regular de la ULE.', score: 1.5, timestamp: '2026-11-23T09:21:00.000Z' },
      'c1-q4': { optionId: 'C', justification: 'Coordinar con el Midis la supervisión cruzada en campo asegura que los datos del padrón sean reales.', score: 2.0, timestamp: '2026-11-23T09:23:00.000Z' },
      'c2-q1': { optionId: 'B', justification: 'Los bienes del almacén son intangibles y no pueden prestarse a eventos privados aunque prometan devolverlos.', score: 1.5, timestamp: '2026-11-23T09:25:00.000Z' },
      'c2-q2': { optionId: 'A', justification: 'Modificar especificaciones para favorecer a un exconsultor constituye direccionamiento y conflicto de intereses.', score: 1.5, timestamp: '2026-11-23T09:27:00.000Z' },
      'c2-q3': { optionId: 'C', justification: 'Si pago mi propio almuerzo puedo escuchar su explicación técnica sin comprometer mi decisión.', score: 0.5, timestamp: '2026-11-23T09:29:00.000Z' },
      'c2-q4': { optionId: 'B', justification: 'Implementar guías correlativas y doble firma entre almacén y desarrollo social evita pérdidas.', score: 2.0, timestamp: '2026-11-23T09:31:00.000Z' },
      'c3-q1': { optionId: 'B', justification: 'La reserva de identidad es inmediata mediante código cifrado.', score: 1.5, timestamp: '2026-11-23T09:33:00.000Z' },
      'c3-q2': { optionId: 'B', justification: 'Se debe proteger la continuidad laboral del denunciante frente a represalias en su contrato CAS.', score: 1.5, timestamp: '2026-11-23T09:36:00.000Z' },
      'c3-q3': { optionId: 'A', justification: 'No se puede revelar la identidad del denunciante a Recursos Humanos ni a la jefatura zonal.', score: 1.5, timestamp: '2026-11-23T09:38:00.000Z' },
      'c3-q4': { optionId: 'B', justification: 'Derivar a STPAD, OCI y Procuraduría Pública y hacer seguimiento hasta el cierre del caso.', score: 2.0, timestamp: '2026-11-23T09:41:00.000Z' },
    },
  },
];

/**
 * ============================================================================
 * UTILIDADES DE PERSISTENCIA, CÁLCULO ADAPTATIVO Y EXPORTACIÓN
 * ============================================================================
 */
const storageService = {
  clearLegacyStorage: () => {
    try {
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch {}
  },
  loadCohort: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COHORT);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error leyendo cohorte local:', e);
    }
    return [];
  },
  saveCohort: (cohort) => {
    try {
      localStorage.setItem(STORAGE_KEYS.COHORT, JSON.stringify(cohort));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  },
  loadActiveId: () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PARTICIPANT_ID) || null;
    } catch {
      return null;
    }
  },
  saveActiveId: (id) => {
    try {
      if (id) localStorage.setItem(STORAGE_KEYS.ACTIVE_PARTICIPANT_ID, id);
      else localStorage.removeItem(STORAGE_KEYS.ACTIVE_PARTICIPANT_ID);
    } catch {}
  },
  loadConfig: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch {}
    return DEFAULT_CONFIG;
  },
  saveConfig: (cfg) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
      return true;
    } catch (e) {
      console.error('Error al guardar configuración:', e);
      return false;
    }
  },
};

function computeParticipantMetrics(participant, passingThreshold = 14.0) {
  const answers = participant?.answers || {};
  let totalScore = 0;
  let answeredCount = 0;
  const caseBreakdown = CASES_DATA.map((c) => {
    let caseScore = 0;
    let caseMax = 0;
    let caseAnswered = 0;
    c.questions.forEach((q) => {
      caseMax += q.points;
      const ans = answers[q.id];
      if (ans) {
        caseScore += Number(ans.score || 0);
        caseAnswered += 1;
        answeredCount += 1;
      }
    });
    totalScore += caseScore;
    return {
      caseId: c.id,
      number: c.number,
      title: c.title,
      role: c.role,
      score: Number(caseScore.toFixed(2)),
      max: Number(caseMax.toFixed(2)),
      answered: caseAnswered,
      totalQuestions: c.questions.length,
      percentage: caseMax > 0 ? Math.round((caseScore / caseMax) * 100) : 0,
    };
  });

  const roundedTotal = Number(totalScore.toFixed(2));
  const passed = roundedTotal >= passingThreshold;

  let profileTitle = 'En Proceso de Consolidación Ética';
  let profileBadgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  let profileSummary =
    'Demuestra sensibilidad frente a dilemas públicos, pero requiere afianzar la aplicación oportuna de los mecanismos preventivos formales (excusación escrita, trazabilidad documental y reserva inmediata de identidad).';

  if (roundedTotal >= 17.0) {
    profileTitle = 'Referente Ético Territorial';
    profileBadgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    profileSummary =
      'Evidencia dominio sobresaliente del Modelo de Integridad Pública, anticipando conflictos de intereses, resguardando los bienes destinados a población vulnerable y garantizando protección efectiva al denunciante.';
  } else if (roundedTotal >= passingThreshold) {
    profileTitle = 'Gestor Público Preventivo';
    profileBadgeColor = 'bg-sky-100 text-sky-900 border-sky-300';
    profileSummary =
      'Aplica criterios sólidos de probidad y neutralidad en la toma de decisiones territoriales, con oportunidades puntuales de mejora en la formalización de controles preventivos.';
  } else if (roundedTotal < 10.0) {
    profileTitle = 'Alerta de Riesgo Operativo';
    profileBadgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
    profileSummary =
      'Se identifican decisiones que exponen a la entidad y al servidor a riesgos administrativos, civiles o penales por informalidad en la gestión de conflictos, custodia de bienes o reserva de denuncias.';
  }

  const recommendations = [];
  const actionPlan = [];

  caseBreakdown.forEach((cb) => {
    if (cb.number === 1) {
      if (cb.percentage < 80) {
        recommendations.push(
          'Reforzar la distinción operativa entre excusación (deber activo del servidor ante su superior) y recusación (derecho de terceros), así como el registro obligatorio de visitas de autoridades.'
        );
        actionPlan.push({
          horizon: 'Inmediato (7 días)',
          dimension: 'Focalización y Conflictos de Intereses',
          action:
            'Implementar formato estándar de declaración de ausencia de conflicto de intereses para comités de selección y verificar el uso del Registro de Visitas en Línea.',
          evidence: 'Actas de comité con declaración jurada y reporte semanal de visitas.',
        });
      } else {
        actionPlan.push({
          horizon: 'Sostenimiento (30 días)',
          dimension: 'Focalización y Conflictos de Intereses',
          action:
            'Replicar protocolos de control de calidad muestral en campo con la Unidad Local de Empadronamiento (ULE) y la Unidad Territorial del Midis.',
          evidence: 'Informe de supervisión cruzada del Padrón General de Hogares.',
        });
      }
    }
    if (cb.number === 2) {
      if (cb.percentage < 80) {
        recommendations.push(
          'Aplicar tolerancia cero frente a préstamos o desvíos de alimentos de programas sociales y observar de oficio cualquier modificación de especificaciones técnicas que restrinja la pluralidad de postores.'
        );
        actionPlan.push({
          horizon: 'Inmediato (7 días)',
          dimension: 'Custodia de Recursos y Contrataciones',
          action:
            'Instaurar doble firma obligatoria (Almacén + Desarrollo Social) en guías de salida de alimentos y checklist de banderas rojas en requerimientos.',
          evidence: 'Guías de remisión auditadas y checklist adjunto a expedientes de compra.',
        });
      } else {
        actionPlan.push({
          horizon: 'Sostenimiento (30 días)',
          dimension: 'Custodia de Recursos y Contrataciones',
          action:
            'Incorporar el Anexo 2 de pautas para denunciar actos de corrupción en todas las bases y órdenes de compra/servicio.',
          evidence: 'Bases administrativas publicadas con cláusula e instructivo anticorrupción.',
        });
      }
    }
    if (cb.number === 3) {
      if (cb.percentage < 80) {
        recommendations.push(
          'Garantizar que la reserva de identidad mediante código cifrado se otorgue de forma inmediata sin filtros previos y coordinar medidas de protección laboral ante vencimientos contractuales.'
        );
        actionPlan.push({
          horizon: 'Inmediato (7 días)',
          dimension: 'Canal de Denuncias y Protección al Denunciante',
          action:
            'Socializar la Directiva N° 001-2022-MIDIS (Versión N° 02) y el flujo de derivación con código cifrado hacia STPAD, OCI y Procuraduría Pública.',
          evidence: 'Constancia de difusión interna y matriz de seguimiento de denuncias.',
        });
      } else {
        actionPlan.push({
          horizon: 'Sostenimiento (30 días)',
          dimension: 'Canal de Denuncias y Protección al Denunciante',
          action:
            'Auditar el cumplimiento del plazo de 1 día hábil para notificar al denunciante la derivación de su caso y el seguimiento trimestral.',
          evidence: 'Tablero de control de plazos y reportes de seguimiento de integridad.',
        });
      }
    }
  });

  if (recommendations.length === 0) {
    recommendations.push(
      'Mantener el estándar de excelencia ética demostrado, liderando espacios de réplica con equipos operativos de la ULE, almacenes y comités de selección.'
    );
  }

  return {
    totalScore: roundedTotal,
    maxScore: 20.0,
    answeredCount,
    totalQuestions: 12,
    isComplete: answeredCount === 12,
    passed,
    caseBreakdown,
    profileTitle,
    profileBadgeColor,
    profileSummary,
    recommendations,
    actionPlan,
  };
}

function generatePrintableReportHtml(participant, metrics, config) {
  const preset = BRAND_PRESETS[config.brandPreset] || BRAND_PRESETS.midisClasico;
  const nowStr = new Date().toLocaleString('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const primaryLogo =
    config.customLogoDataUrl && config.customLogoDataUrl.trim() !== ''
      ? config.customLogoDataUrl
      : `${window.location.origin}/logo-midis.png`;

  const logoBlock = `<img src="${primaryLogo}" onerror="this.onerror=null;this.src='${window.location.origin}/MIDIS.png';" alt="Logo Midis" style="height:54px; width:auto; max-width:310px; object-fit:contain;" />`;

  const caseRowsHtml = metrics.caseBreakdown
    .map(
      (cb) => `
      <tr>
        <td style="padding:8px 10px; border:1px solid #cbd5e1; font-weight:600;">Caso ${cb.number}: ${cb.title}</td>
        <td style="padding:8px 10px; border:1px solid #cbd5e1; color:#475569;">${cb.role}</td>
        <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:700;">${cb.score.toFixed(1)} / ${cb.max.toFixed(1)}</td>
        <td style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center;">${cb.percentage}%</td>
      </tr>`
    )
    .join('');

  const detailHtml = CASES_DATA.map((c) => {
    const qItems = c.questions
      .map((q) => {
        const ans = participant.answers?.[q.id];
        const selectedOpt = c.questions
          .find((item) => item.id === q.id)
          ?.options.find((o) => o.id === ans?.optionId);
        const correctOpt = q.options.find((o) => o.isCorrect);
        return `
          <div style="margin-bottom:10px; padding:10px; border:1px solid #e2e8f0; border-left:4px solid ${
            ans?.score === q.points ? '#059669' : ans?.score > 0 ? '#d97706' : '#dc2626'
          }; border-radius:6px; background:#f8fafc; page-break-inside:avoid;">
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:#1e293b; margin-bottom:4px;">
              <span>${q.code} · ${q.competency}</span>
              <span>Puntaje: ${(ans?.score ?? 0).toFixed(1)} / ${q.points.toFixed(1)} pts</span>
            </div>
            <div style="font-size:12px; color:#334155; margin-bottom:6px;"><strong>Situación:</strong> ${q.prompt}</div>
            <div style="font-size:12px; color:#0f172a; margin-bottom:4px;"><strong>Decisión elegida (${ans?.optionId || '-'}):</strong> ${selectedOpt?.text || 'Sin responder'}</div>
            ${
              selectedOpt?.id !== correctOpt?.id
                ? `<div style="font-size:11.5px; color:#065f46; margin-bottom:4px;"><strong>Alternativa óptima (${correctOpt?.id}):</strong> ${correctOpt?.text}</div>`
                : ''
            }
            <div style="font-size:11.5px; color:#334155; background:#ffffff; padding:6px 8px; border-radius:4px; border:1px dashed #cbd5e1;">
              <strong>Sustento del participante:</strong> "${ans?.justification || 'No registrado'}"
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div style="margin-top:16px;">
        <h3 style="font-size:14px; color:${preset.primary}; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin-bottom:8px;">
          Caso ${c.number}: ${c.title} (${c.role})
        </h3>
        ${qItems}
      </div>
    `;
  }).join('');

  const actionRowsHtml = metrics.actionPlan
    .map(
      (ap) => `
      <tr>
        <td style="padding:7px 9px; border:1px solid #cbd5e1; font-weight:600; white-space:nowrap;">${ap.horizon}</td>
        <td style="padding:7px 9px; border:1px solid #cbd5e1; font-weight:600;">${ap.dimension}</td>
        <td style="padding:7px 9px; border:1px solid #cbd5e1;">${ap.action}</td>
        <td style="padding:7px 9px; border:1px solid #cbd5e1; color:#475569;">${ap.evidence}</td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Reporte Integral de Integridad - ${participant.name}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 24px; line-height: 1.45; }
        @media print {
          body { margin: 12mm; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fef3c7; border:1px solid #f59e0b; padding:10px 14px; border-radius:8px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:13px; color:#92400e;"><strong>Vista previa de impresión:</strong> Seleccione "Guardar como PDF" en el cuadro de diálogo de su navegador.</span>
        <button onclick="window.print()" style="background:${preset.primary}; color:#fff; border:none; padding:8px 14px; border-radius:6px; font-weight:700; cursor:pointer;">Imprimir / Guardar PDF</button>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid ${preset.primary}; padding-bottom:12px; margin-bottom:16px;">
        <div>${logoBlock}</div>
        <div style="text-align:right;">
          <div style="font-size:16px; font-weight:800; color:#0f172a;">${config.entityTitle}</div>
          <div style="font-size:12px; color:#475569;">${config.workshopSubtitle}</div>
          <div style="font-size:11px; color:#64748b; margin-top:2px;">Emitido el: ${nowStr}</div>
        </div>
      </div>

      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:${preset.primary}; margin-bottom:6px;">1. Identificación del Participante</div>
        <table style="width:100%; font-size:12.5px; border-collapse:collapse;">
          <tr>
            <td style="padding:3px 0;"><strong>Participante:</strong> ${participant.name}</td>
            <td style="padding:3px 0;"><strong>DNI:</strong> ${participant.dni}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;"><strong>Correo electrónico:</strong> ${participant.email}</td>
            <td style="padding:3px 0;"><strong>Estado de evaluación:</strong> ${metrics.isComplete ? 'Completado (12/12 preguntas)' : `Parcial (${metrics.answeredCount}/12 preguntas)`}</td>
          </tr>
        </table>
      </div>

      <div style="display:flex; gap:14px; margin-bottom:16px;">
        <div style="flex:1; background:${metrics.passed ? '#ecfdf5' : '#fffbeb'}; border:1px solid ${metrics.passed ? '#6ee7b7' : '#fcd34d'}; border-radius:8px; padding:14px; text-align:center;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:#475569;">Calificación Final</div>
          <div style="font-size:28px; font-weight:900; color:${metrics.passed ? '#065f46' : '#b45309'}; margin:4px 0;">${metrics.totalScore.toFixed(1)} <span style="font-size:14px; font-weight:600;">/ 20.0 pts</span></div>
          <div style="font-size:12px; font-weight:700; color:${metrics.passed ? '#047857' : '#b45309'};">
            ${metrics.passed ? 'APROBADO (Supera umbral mínimo)' : 'REQUIERE REFORZAMIENTO PREVENTIVO'}
          </div>
        </div>
        <div style="flex:2; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:14px;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:${preset.primary};">2. Diagnóstico de Perfil Ético</div>
          <div style="font-size:16px; font-weight:800; color:#0f172a; margin:4px 0;">${metrics.profileTitle}</div>
          <div style="font-size:12px; color:#334155;">${metrics.profileSummary}</div>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:${preset.primary}; margin-bottom:6px;">3. Desempeño por Caso Territorial</div>
        <table style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead>
            <tr style="background:#e2e8f0; color:#0f172a;">
              <th style="padding:8px 10px; border:1px solid #cbd5e1; text-align:left;">Caso</th>
              <th style="padding:8px 10px; border:1px solid #cbd5e1; text-align:left;">Rol Asumido</th>
              <th style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center;">Puntaje</th>
              <th style="padding:8px 10px; border:1px solid #cbd5e1; text-align:center;">Logro</th>
            </tr>
          </thead>
          <tbody>${caseRowsHtml}</tbody>
        </table>
      </div>

      <div style="margin-bottom:16px; page-break-inside:avoid;">
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:${preset.primary}; margin-bottom:6px;">4. Recomendaciones Personalizadas y Plan de Acción Territorial</div>
        <ul style="font-size:12px; color:#334155; margin:0 0 10px 18px; padding:0;">
          ${metrics.recommendations.map((r) => `<li style="margin-bottom:4px;">${r}</li>`).join('')}
        </ul>
        <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
          <thead>
            <tr style="background:#e2e8f0; color:#0f172a;">
              <th style="padding:7px 9px; border:1px solid #cbd5e1; text-align:left;">Plazo</th>
              <th style="padding:7px 9px; border:1px solid #cbd5e1; text-align:left;">Dimensión</th>
              <th style="padding:7px 9px; border:1px solid #cbd5e1; text-align:left;">Acción Preventiva Comprometida</th>
              <th style="padding:7px 9px; border:1px solid #cbd5e1; text-align:left;">Evidencia Verificable</th>
            </tr>
          </thead>
          <tbody>${actionRowsHtml}</tbody>
        </table>
      </div>

      <div>
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:${preset.primary}; margin-bottom:4px;">5. Trazabilidad de Decisiones y Sustentos Escritos</div>
        ${detailHtml}
      </div>

      <div style="margin-top:20px; padding-top:10px; border-top:1px solid #cbd5e1; font-size:10.5px; color:#64748b; text-align:center;">
        Documento generado por el Simulador Pedagógico de Integridad Pública – Ministerio de Desarrollo e Inclusión Social (Midis).
      </div>
    </body>
    </html>
  `;
}

function downloadCsvCohort(cohort, passingThreshold) {
  const headers = [
    'Participante',
    'DNI',
    'Correo',
    'Estado',
    'Preguntas_Respondidas',
    'Caso_1_Puntaje',
    'Caso_2_Puntaje',
    'Caso_3_Puntaje',
    'Puntaje_Total_20',
    'Perfil_Adaptativo',
    'Fecha_Inicio',
  ];

  const rows = cohort.map((p) => {
    const m = computeParticipantMetrics(p, passingThreshold);
    return [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.dni || ''}"`,
      `"${p.email || ''}"`,
      m.isComplete ? 'Completado' : 'En progreso',
      `${m.answeredCount}/12`,
      m.caseBreakdown[0]?.score.toFixed(1) || '0.0',
      m.caseBreakdown[1]?.score.toFixed(1) || '0.0',
      m.caseBreakdown[2]?.score.toFixed(1) || '0.0',
      m.totalScore.toFixed(1),
      `"${m.profileTitle}"`,
      `"${p.startedAt ? new Date(p.startedAt).toLocaleString('es-PE') : ''}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `Resultados_Taller_Integridad_Midis_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * ============================================================================
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * ============================================================================
 */
export default function App() {
  const [config, setConfig] = useState(() => storageService.loadConfig());
  const [cohort, setCohort] = useState(() => {
    storageService.clearLegacyStorage();
    return storageService.loadCohort();
  });
  const [activeParticipantId, setActiveParticipantId] = useState(() =>
    storageService.loadActiveId()
  );

  const [viewMode, setViewMode] = useState('participant');
  const [projectorMode, setProjectorMode] = useState(false);

  const [showInstructorLogin, setShowInstructorLogin] = useState(false);
  const [isInstructorAuthenticated, setIsInstructorAuthenticated] = useState(false);
  const [loginUserInput, setLoginUserInput] = useState('');
  const [loginPassInput, setLoginPassInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    consent: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [showFinalSummary, setShowFinalSummary] = useState(false);

  const [draftSelections, setDraftSelections] = useState({});
  const [draftJustifications, setDraftJustifications] = useState({});
  const [questionWarnings, setQuestionWarnings] = useState({});
  const [unlockedStepByCase, setUnlockedStepByCase] = useState({ 0: 0, 1: 0, 2: 0 });

  const [instructorTab, setInstructorTab] = useState('results');
  const [selectedInspectId, setSelectedInspectId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [logoStatusMessage, setLogoStatusMessage] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);

  const preset = BRAND_PRESETS[config.brandPreset] || BRAND_PRESETS.midisClasico;

  useEffect(() => {
    storageService.saveCohort(cohort);
  }, [cohort]);

  useEffect(() => {
    storageService.saveActiveId(activeParticipantId);
  }, [activeParticipantId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (isInstructorAuthenticated) {
          setViewMode((prev) => (prev === 'instructor' ? 'participant' : 'instructor'));
        } else {
          setShowInstructorLogin(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInstructorAuthenticated]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? '' : prev));
    }, 4200);
  };

  const activeParticipant = useMemo(
    () => cohort.find((p) => p.id === activeParticipantId) || null,
    [cohort, activeParticipantId]
  );

  const activeMetrics = useMemo(
    () =>
      activeParticipant
        ? computeParticipantMetrics(activeParticipant, config.passingThreshold)
        : null,
    [activeParticipant, config.passingThreshold]
  );

  useEffect(() => {
    if (!activeParticipant) return;
    setUnlockedStepByCase((prev) => {
      const next = { ...prev };
      CASES_DATA.forEach((c, cIdx) => {
        let highestUnlocked = 0;
        c.questions.forEach((q, qIdx) => {
          if (activeParticipant.answers?.[q.id]) {
            highestUnlocked = Math.min(c.questions.length - 1, qIdx + 1);
          }
        });
        next[cIdx] = Math.max(prev[cIdx] || 0, highestUnlocked);
      });
      return next;
    });
  }, [activeParticipant]);

  const handleStartSimulation = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 5) {
      errors.name = 'Ingrese sus nombres y apellidos completos.';
    }
    if (!/^\d{8}$/.test(formData.dni.trim())) {
      errors.dni = 'El DNI debe contener exactamente 8 dígitos numéricos.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Ingrese un correo electrónico válido.';
    }
    if (!formData.consent) {
      errors.consent = 'Debe aceptar el registro local de sus datos para iniciar.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const existing = cohort.find((p) => p.dni === formData.dni.trim());
    if (existing) {
      setActiveParticipantId(existing.id);
      setActiveCaseIndex(0);
      setShowFinalSummary(false);
      showToast(`Sesión recuperada para ${existing.name}.`);
      return;
    }

    const newParticipant = {
      id: `part-${Date.now()}`,
      name: formData.name.trim(),
      dni: formData.dni.trim(),
      email: formData.email.trim().toLowerCase(),
      consent: true,
      startedAt: new Date().toISOString(),
      completedAt: null,
      answers: {},
    };

    setCohort((prev) => [newParticipant, ...prev]);
    setActiveParticipantId(newParticipant.id);
    setActiveCaseIndex(0);
    setShowFinalSummary(false);
    setUnlockedStepByCase({ 0: 0, 1: 0, 2: 0 });
    showToast('Registro completado. ¡Éxitos en la resolución de los 3 casos!');
  };

  const handleConfirmQuestion = (caseIdx, question, qIdx) => {
    if (!activeParticipant) return;
    if (activeParticipant.answers?.[question.id]) return;

    const chosenOptionId = draftSelections[question.id];
    const justification = (draftJustifications[question.id] || '').trim();

    if (!chosenOptionId) {
      setQuestionWarnings((prev) => ({
        ...prev,
        [question.id]: 'Seleccione una alternativa (A, B o C) antes de confirmar su decisión.',
      }));
      return;
    }

    if (justification.length < config.minJustificationChars) {
      setQuestionWarnings((prev) => ({
        ...prev,
        [question.id]: `Redacte un sustento normativo/ético de al menos ${config.minJustificationChars} caracteres (actual: ${justification.length}).`,
      }));
      return;
    }

    setQuestionWarnings((prev) => ({ ...prev, [question.id]: '' }));

    const selectedObj = question.options.find((o) => o.id === chosenOptionId);
    const earnedScore = selectedObj ? selectedObj.score : 0;

    setCohort((prev) =>
      prev.map((p) => {
        if (p.id !== activeParticipant.id) return p;
        const updatedAnswers = {
          ...(p.answers || {}),
          [question.id]: {
            optionId: chosenOptionId,
            justification,
            score: earnedScore,
            timestamp: new Date().toISOString(),
          },
        };
        const totalAnswered = Object.keys(updatedAnswers).length;
        return {
          ...p,
          answers: updatedAnswers,
          completedAt: totalAnswered === 12 ? new Date().toISOString() : p.completedAt,
        };
      })
    );

    const totalQuestionsInCase = CASES_DATA[caseIdx].questions.length;
    if (qIdx + 1 < totalQuestionsInCase) {
      setUnlockedStepByCase((prev) => ({
        ...prev,
        [caseIdx]: Math.max(prev[caseIdx] || 0, qIdx + 1),
      }));
    }

    showToast(`Respuesta registrada: +${earnedScore.toFixed(1)} pts.`);
  };

  const handleOpenPrintableReport = (participant) => {
    const metrics = computeParticipantMetrics(participant, config.passingThreshold);
    const html = generatePrintableReportHtml(participant, metrics, config);
    const win = window.open('', '_blank', 'width=960,height=800');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    } else {
      showToast('Permita las ventanas emergentes en su navegador para generar el PDF.');
    }
  };

  const handleInstructorLoginSubmit = (e) => {
    e.preventDefault();
    if (
      loginUserInput.trim() === config.instructorUser &&
      loginPassInput === config.instructorPass
    ) {
      setIsInstructorAuthenticated(true);
      setShowInstructorLogin(false);
      setViewMode('instructor');
      setLoginUserInput('');
      setLoginPassInput('');
      setLoginError('');
      showToast('Acceso docente verificado correctamente.');
    } else {
      setLoginError('Usuario o clave docente incorrectos.');
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 650;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const optimizedDataUrl = canvas.toDataURL('image/png', 0.92);

        const nextConfig = { ...config, customLogoDataUrl: optimizedDataUrl };
        const saved = storageService.saveConfig(nextConfig);
        if (saved) {
          setConfig(nextConfig);
          setLogoStatusMessage(
            `Logotipo cargado y guardado (${canvas.width}×${canvas.height} px).`
          );
          showToast('Logotipo institucional actualizado correctamente.');
        } else {
          setLogoStatusMessage(
            'Error: el archivo supera la capacidad de memoria local. Intente con una imagen más ligera.'
          );
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleResetPlatform = () => {
    setConfirmModal({
      title: 'Reiniciar Plataforma y Limpiar Registros',
      message:
        'Esta acción eliminará todos los registros de participantes almacenados en este navegador y dejará la tabla en 0 registros. ¿Desea continuar?',
      confirmLabel: 'Sí, limpiar todo (0 registros)',
      danger: true,
      onConfirm: () => {
        storageService.clearLegacyStorage();
        localStorage.removeItem(STORAGE_KEYS.COHORT);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_PARTICIPANT_ID);
        setCohort([]);
        setActiveParticipantId(null);
        setSelectedInspectId(null);
        setCompareIds([]);
        setActiveCaseIndex(0);
        setShowFinalSummary(false);
        setDraftSelections({});
        setDraftJustifications({});
        setUnlockedStepByCase({ 0: 0, 1: 0, 2: 0 });
        setFormData({ name: '', dni: '', email: '', consent: false });
        setConfirmModal(null);
        showToast('Plataforma reiniciada. Tabla en 0 registros.');
      },
    });
  };

  const handleRestoreDemo = () => {
    setCohort(DEMO_COHORT);
    setSelectedInspectId(DEMO_COHORT[0].id);
    showToast('Datos de demostración cargados en la Vista Docente.');
  };

  const handleDeleteSingleParticipant = (participantToDelete) => {
    setConfirmModal({
      title: 'Eliminar Registro de Participante',
      message: `¿Está seguro de eliminar permanentemente el registro de ${participantToDelete.name} (DNI ${participantToDelete.dni})?`,
      confirmLabel: 'Sí, eliminar registro',
      danger: true,
      onConfirm: () => {
        setCohort((prev) => prev.filter((item) => item.id !== participantToDelete.id));
        if (activeParticipantId === participantToDelete.id) {
          setActiveParticipantId(null);
        }
        if (selectedInspectId === participantToDelete.id) {
          setSelectedInspectId(null);
        }
        setCompareIds((prev) => prev.filter((id) => id !== participantToDelete.id));
        setConfirmModal(null);
        showToast('Registro eliminado correctamente.');
      },
    });
  };

  const handleExitParticipantSession = () => {
    setActiveParticipantId(null);
    setShowFinalSummary(false);
    setActiveCaseIndex(0);
    setFormData({ name: '', dni: '', email: '', consent: false });
    showToast('Sesión finalizada. Listo para un nuevo participante.');
  };

  const rootTextSize = projectorMode ? 'text-base md:text-lg' : 'text-sm md:text-[15px]';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${rootTextSize}`}>
      {/* Barra superior de notificación (Toast) */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 max-w-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 rounded-lg text-white font-semibold text-sm ${
                  confirmModal.danger
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de autenticación docente */}
      {showInstructorLogin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Acceso Vista Docente</h3>
              <button
                type="button"
                onClick={() => {
                  setShowInstructorLogin(false);
                  setLoginError('');
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ingrese sus credenciales institucionales para acceder al panel de monitoreo y
              configuración.
            </p>
            <form onSubmit={handleInstructorLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Usuario docente
                </label>
                <input
                  type="text"
                  value={loginUserInput}
                  onChange={(e) => setLoginUserInput(e.target.value)}
                  placeholder="docente.midis"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clave de acceso
                </label>
                <input
                  type="password"
                  value={loginPassInput}
                  onChange={(e) => setLoginPassInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              {loginError && (
                <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                  {loginError}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInstructorLogin(false);
                    setLoginError('');
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: preset.primary }}
                  className="px-4 py-2 rounded-lg text-white text-sm font-bold hover:opacity-95"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CABECERA INSTITUCIONAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              onDoubleClick={() => {
                if (isInstructorAuthenticated) {
                  setViewMode((prev) => (prev === 'instructor' ? 'participant' : 'instructor'));
                } else {
                  setShowInstructorLogin(true);
                }
              }}
              title="Ministerio de Desarrollo e Inclusión Social"
              className="cursor-pointer shrink-0"
            >
              <MidisLogoBadge
                customLogo={config.customLogoDataUrl}
                className="h-10 sm:h-12 md:h-[52px]"
              />
            </div>
            <div className="hidden sm:block border-l border-slate-200 pl-4">
              <h1 className="font-extrabold text-slate-900 text-base md:text-lg leading-tight">
                {config.entityTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">{config.workshopSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setProjectorMode((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 ${
                projectorMode
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>🖥️</span>
              <span>{projectorMode ? 'Proyector Activo' : 'Modo Proyector'}</span>
            </button>

            {isInstructorAuthenticated && (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('participant')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    viewMode === 'participant'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vista Participante
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('instructor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'instructor'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Vista Docente</span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-200 text-slate-800">
                    {cohort.length}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* ====================================================================
            1. VISTA PARTICIPANTE
           ==================================================================== */}
        {viewMode === 'participant' && (
          <>
            {/* A. PANTALLA DE BIENVENIDA E IDENTIFICACIÓN */}
            {!activeParticipant && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                  <span
                    style={{ backgroundColor: preset.softBg, color: preset.primary }}
                    className="inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wide mb-4"
                  >
                    Juego de Roles Territorial · 20 Puntos
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4">
                    Toma de decisiones éticas en la entrega de servicios sociales
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Bienvenido/a al simulador práctico del{' '}
                    <strong className="text-slate-900">
                      Ministerio de Desarrollo e Inclusión Social (Midis)
                    </strong>
                    . Asumirá tres roles directivos y operativos en gobiernos locales y regionales
                    para resolver situaciones críticas de focalización, custodia de recursos
                    alimentarios y protección al denunciante.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">Reglas del simulador:</h3>
                    <ol className="space-y-2.5 text-slate-700 text-sm">
                      <li className="flex items-start gap-2.5">
                        <span className="font-extrabold text-emerald-700">1.</span>
                        <span>
                          <strong>Intento único por pregunta y avance progresivo:</strong> Cada
                          pregunta se habilita únicamente después de responder y calificar la
                          anterior (12 preguntas que suman <strong>20.0 puntos</strong>). Requiere
                          redactar un sustento abierto obligatorio antes de calificar.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="font-extrabold text-emerald-700">2.</span>
                        <span>
                          <strong>Reporte integral y plan de acción:</strong> Al concluir los 3
                          casos obtendrá su perfil adaptativo, recomendaciones y plan de acción
                          territorial descargable en <strong>PDF</strong>.
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
                    Identificación del Participante
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Complete sus datos para registrar su progreso de forma automática en este
                    navegador.
                  </p>

                  <form onSubmit={handleStartSimulation} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nombre completo del participante <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej. Ana María Paredes Quispe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      {formErrors.name && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          DNI (8 dígitos) <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={8}
                          value={formData.dni}
                          onChange={(e) =>
                            setFormData({ ...formData, dni: e.target.value.replace(/\D/g, '') })
                          }
                          placeholder="Ej. 45891234"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        {formErrors.dni && (
                          <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.dni}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Correo electrónico <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="nombre@entidad.gob.pe"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                        {formErrors.email && (
                          <p className="text-xs text-rose-600 font-semibold mt-1">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-1 rounded border-slate-300 text-red-600 focus:ring-red-600"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          <strong>Aviso de privacidad y consentimiento:</strong> Autorizo que mi
                          nombre, DNI y correo electrónico se guarden automáticamente de forma local
                          en este navegador para registrar mi progreso y se incluyan en los reportes
                          individuales (PDF) y consolidados del taller (Excel/CSV).
                        </span>
                      </label>
                      {formErrors.consent && (
                        <p className="text-xs text-rose-600 font-semibold mt-1.5">
                          {formErrors.consent}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      style={{ backgroundColor: preset.primary }}
                      className="w-full py-3.5 px-6 rounded-xl text-white font-extrabold text-sm md:text-base shadow-sm hover:opacity-95 transition cursor-pointer"
                    >
                      Iniciar Simulador de Casos
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* B. ESPACIO DE TRABAJO DEL PARTICIPANTE */}
            {activeParticipant && activeMetrics && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-base md:text-lg">
                        {activeParticipant.
