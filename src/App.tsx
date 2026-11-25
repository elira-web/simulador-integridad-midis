import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronRight,
  ChevronLeft,
  FileText,
  Download,
  Users,
  BarChart3,
  Settings,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  Cloud,
  CloudOff,
  Upload,
  KeyRound,
  Eye,
  EyeOff,
  ClipboardCheck,
  ArrowRight,
  Database,
  Trash2,
  RotateCcw,
} from 'lucide-react';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

interface RubricCriteria {
  expectedConcepts: string[];
  normativeReference: string;
  keyActorsAndDeadlines: string;
  socraticPromptCorrect: string;
  socraticPromptIncorrect: string;
  complementSummary: string;
}

interface CaseQuestion {
  id: string;
  number: string;
  caseId: number;
  prompt: string;
  options: QuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  points: number;
  focusArea: string;
  rubric: RubricCriteria;
}

interface CaseScenario {
  id: number;
  code: string;
  title: string;
  axis: string;
  governmentLevel: string;
  protagonistRole: string;
  secondaryActors: string[];
  paragraphs: string[];
  criticalDilemma: string;
  questions: CaseQuestion[];
}

interface AnswerRecord {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  justification: string;
  isCorrect: boolean;
  pointsEarned: number;
  answeredAt: string;
  feedback: {
    recognition: string;
    complement: string;
    socraticQuestion: string;
    normativeReference: string;
  };
}

interface ParticipantRecord {
  id: string;
  fullName: string;
  dni: string;
  email: string;
  consent: boolean;
  startedAt: string;
  completedAt: string | null;
  answers: Record<string, AnswerRecord>;
  totalScore: number;
  case1Score: number;
  case2Score: number;
  case3Score: number;
  level: string;
}

interface AppConfig {
  institutionName: string;
  workshopTitle: string;
  customLogoDataUrl: string | null;
  googleSheetsUrl: string;
  teacherUser: string;
  teacherPass: string;
}

// ============================================================================
// CONFIGURACIÓN INICIAL (URL ACTIVA DE GOOGLE APPS SCRIPT FIJADA EN v5.0.1)
// ============================================================================

const STORAGE_KEYS = {
  COHORT: 'midis_integridad_cohort_v5',
  LEGACY_COHORT: 'midis_integridad_cohort_v4',
  ACTIVE_SESSION: 'midis_integridad_active_v5',
  LEGACY_ACTIVE_SESSION: 'midis_integridad_active_v4',
  CONFIG: 'midis_integridad_config_v5',
};

const FIXED_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyeRNHGfIVNwAVlSj6IRuLusmsoMPx-JlFcWXRuo-vkd59SFmnPdCW2_5LgnUFYl4oL3A/exec';

const DEFAULT_CONFIG: AppConfig = {
  institutionName: 'Ministerio de Desarrollo e Inclusión Social (MIDIS)',
  workshopTitle: 'Integridad en la gestión pública para la entrega de servicios',
  customLogoDataUrl: null,
  googleSheetsUrl: FIXED_APPS_SCRIPT_URL,
  teacherUser: 'docente.midis',
  teacherPass: 'Integridad2026',
};

// ============================================================================
// CASOS VALIDADOS E INTACTOS (12 PREGUNTAS = 20.0 PUNTOS EXACTOS)
// ============================================================================

const CASES_DATA: CaseScenario[] = [
  {
    id: 1,
    code: 'CASO 1',
    title: 'Focalización bajo presión y vínculos cercanos en territorio',
    axis: 'Gestión preventiva de conflictos de intereses y transparencia en la toma de decisiones',
    governmentLevel: 'Gobierno Local (Municipalidad Distrital) en articulación con Unidad Territorial (UT) del MIDIS (Pensión 65 y Contigo)',
    protagonistRole: 'Jefe/a de la Unidad Local de Empadronamiento (ULE) y Enlace Municipal de Pensión 65 y Contigo',
    secondaryActors: [
      'Coordinador/a Territorial de la UT del MIDIS',
      'Gerente de Desarrollo Social (superior inmediato)',
      'Regidor distrital',
      'Postulante a empadronador/a (prima hermana del cónyuge)',
      'Presidente/a de junta vecinal',
    ],
    paragraphs: [
      'En el marco de una campaña extraordinaria de cierre de brechas para actualizar la Clasificación Socioeconómica (CSE) e incorporar nuevos usuarios a los programas nacionales Pensión 65 y Contigo tras una emergencia climática, te desempeñas como Jefe/a de la Unidad Local de Empadronamiento (ULE) y Enlace Municipal en una municipalidad distrital. Por delegación formal, presides el comité de selección de empadronadores temporales y validas el lote prioritario de hogares que será remitido a la Unidad Territorial (UT) del MIDIS antes del corte quincenal.',
      'Al iniciar la etapa de evaluación curricular y revisión de expedientes, detectas tres situaciones críticas de manera simultánea. En primer lugar, adviertes que una de las postulantes con mayor puntaje técnico en la convocatoria para empadronadores de campo es prima hermana de tu cónyuge, con quien mantienes trato familiar frecuente en actividades sociales de la localidad.',
      'En segundo lugar, un regidor distrital acude sin cita ni registro previo a tu oficina para exigirte de manera verbal que priorices y valides de inmediato el expediente de Clasificación Socioeconómica de su tío directo, argumentando que "es una persona adulta mayor en situación vulnerable y el Concejo Municipal fiscalizará la celeridad de tu gestión".',
      'En tercer lugar, el presidente de una junta vecinal presenta un escrito formal por mesa de partes cuestionando la imparcialidad del proceso de contratación de empadronadores debido al vínculo de parentesco con la postulante, exigiendo tu separación inmediata de la conducción del comité y la suspensión de la remisión del padrón a la UT del MIDIS.',
      'Frente a este escenario, tu dilema crítico consiste en garantizar la imparcialidad, objetividad y legalidad tanto en la selección del personal de campo como en la validación de potenciales usuarios de los Programas Sociales, activando oportunamente los mecanismos preventivos de gestión de conflictos de intereses sin paralizar el cronograma territorial acordado con el MIDIS.',
    ],
    criticalDilemma:
      'Garantizar la imparcialidad y legalidad en la contratación de personal de campo y en la validación de potenciales usuarios de los PPSS frente a vínculos familiares y presiones políticas locales, activando oportunamente los mecanismos de prevención del conflicto de intereses sin paralizar el cronograma acordado con la UT del MIDIS.',
    questions: [
      {
        id: '1.1',
        number: '1.1',
        caseId: 1,
        focusArea: 'Diagnóstico del conflicto de intereses',
        points: 1.5,
        correctOption: 'B',
        prompt:
          'Desde el enfoque preventivo de integridad pública, ¿cómo se califican técnicamente las situaciones descritas respecto a la postulante vinculada por afinidad y al pedido del regidor distrital?',
        options: [
          {
            id: 'A',
            text: 'No existe conflicto de intereses mientras no se firme el contrato ni se apruebe la Clasificación Socioeconómica, pues solo habría infracción si se demuestra un pago o beneficio económico.',
          },
          {
            id: 'B',
            text: 'Se configura un conflicto de intereses (real/potencial en la evaluación de la pariente por afinidad y aparente ante la ciudadanía) donde el interés particular colisiona con el deber funcional de imparcialidad, aun antes de consumarse un beneficio.',
          },
          {
            id: 'C',
            text: 'Únicamente existe conflicto de intereses en el pedido del regidor por tratarse de una autoridad electa, mientras que el caso de la postulante se resuelve con una declaración verbal de neutralidad.',
          },
          {
            id: 'D',
            text: 'Ambas situaciones constituyen delitos consumados de colusión agravada que obligan a anular toda la campaña de empadronamiento en el distrito.',
          },
        ],
        rubric: {
          expectedConcepts: ['interés particular', 'deber funcional', 'imparcialidad', 'real', 'potencial', 'aparente', 'prevención'],
          normativeReference: 'Ley N° 27815 (Ley del Código de Ética de la Función Pública), Ley N° 31227 (DJI) y Guía de Gestión de Conflictos de Intereses - OII MIDIS',
          keyActorsAndDeadlines: 'Jefe/a de ULE, comité de selección, prevención antes de la emisión del acto',
          socraticPromptCorrect:
            'Has identificado correctamente la colisión estructural entre interés particular y deber funcional. Si el dirigente vecinal percibe parcialidad aunque aún no hayas firmado el acta final, ¿por qué gestionar la dimensión "aparente" del conflicto resulta igual de determinante para la legitimidad de los padrones de Pensión 65 y Contigo?',
          socraticPromptIncorrect:
            'Revisa el argumento que redactaste: el conflicto de intereses no requiere que exista un delito consumado ni un beneficio económico efectivo, sino la sola existencia de una situación objetiva que pueda comprometer la imparcialidad. ¿Qué riesgo institucional asumes si participas en la evaluación de una pariente por afinidad esperando a que "no pase nada"?',
          complementSummary:
            'El conflicto de intereses es una situación estructural donde los intereses personales, familiares o de terceros colisionan con el deber funcional de velar por el interés público, afectando la imparcialidad (real, potencial o aparente) sin necesidad de que se consume un acto ilícito.',
        },
      },
      {
        id: '1.2',
        number: '1.2',
        caseId: 1,
        focusArea: 'Activación de excusación vs. recusación',
        points: 1.5,
        correctOption: 'C',
        prompt:
          'Ante el vínculo familiar con la postulante a empadronadora y el escrito presentado por el presidente de la junta vecinal, ¿qué mecanismo preventivo corresponde activar de inmediato?',
        options: [
          {
            id: 'A',
            text: 'Continuar presidiendo la evaluación de todos los postulantes dejando constancia en el acta final de que se calificó con estricta objetividad, para evitar retrasos administrativos.',
          },
          {
            id: 'B',
            text: 'Esperar a que el presidente de la junta vecinal formalice una denuncia penal ante el Ministerio Público antes de apartarse del comité de selección.',
          },
          {
            id: 'C',
            text: 'Presentar de inmediato tu excusación (abstención) formal por escrito ante el Gerente de Desarrollo Social (superior inmediato) para apartarte de la evaluación de dicho expediente y tramitar tu reemplazo, diferenciándola de la recusación formulada por el tercero.',
          },
          {
            id: 'D',
            text: 'Descalificar automáticamente a la postulante sin evaluar su expediente técnico para demostrar transparencia frente a la junta vecinal.',
          },
        ],
        rubric: {
          expectedConcepts: ['excusación', 'abstención', 'recusación', 'superior inmediato', 'reemplazo', 'legalidad'],
          normativeReference: 'Art. 99 del TUO de la Ley N° 27444 (causales de abstención) y Lineamientos de Gestión de Conflicto de Intereses - MIDIS',
          keyActorsAndDeadlines: 'Jefe/a ULE -> Gerente de Desarrollo Social (superior inmediato) de forma inmediata antes de calificar',
          socraticPromptCorrect:
            'Excelente distinción entre el deber propio de excusación y la recusación planteada por terceros. En tu sustento, ¿qué ocurriría con la validez jurídica de la contratación de los demás empadronadores si hubieras esperado a que prosperara una recusación en lugar de abstenerte de oficio?',
          socraticPromptIncorrect:
            'Analiza tu justificación: descalificar arbitrariamente a una postulante o seguir evaluándola compromete la legalidad del acto administrativo. ¿Cuál es la diferencia operativa entre que el propio servidor solicite su excusación ante su superior y que un ciudadano interponga una recusación?',
          complementSummary:
            'La excusación (abstención) es el deber primario del servidor de apartarse oportunamente comunicándolo a su superior inmediato para que designe un reemplazo; la recusación es el derecho de terceros a exigir dicha separación cuando el servidor omite abstenerse.',
        },
      },
      {
        id: '1.3',
        number: '1.3',
        caseId: 1,
        focusArea: 'Neutralidad y registro de visitas',
        points: 1.5,
        correctOption: 'B',
        prompt:
          '¿Qué medidas preventivas de transparencia institucional debes aplicar frente a la visita informal del regidor distrital y la gestión del comité?',
        options: [
          {
            id: 'A',
            text: 'Atender el pedido del regidor de manera reservada para evitar conflictos políticos con el Concejo Municipal, evaluando el expediente de su tío por canales internos.',
          },
          {
            id: 'B',
            text: 'Exigir y consignar la audiencia en el Registro de Visitas en Línea / Agendas Oficiales detallando el motivo de la gestión, rechazar cualquier priorización ajena a los criterios técnicos del Sisfho y verificar la Declaración Jurada de Intereses (DJI).',
          },
          {
            id: 'C',
            text: 'Suspender temporalmente el ingreso de solicitudes de Clasificación Socioeconómica (CSE) en todo el distrito hasta que culmine el periodo de fiscalización del regidor.',
          },
          {
            id: 'D',
            text: 'Remitir el expediente del tío del regidor directamente a la UT del MIDIS con una nota indicando que fue recomendado por una autoridad electa.',
          },
        ],
        rubric: {
          expectedConcepts: ['Registro de Visitas', 'Agendas Oficiales', 'Declaración Jurada de Intereses', 'DJI', 'Sisfho', 'neutralidad', 'trazabilidad'],
          normativeReference: 'Ley N° 28024 (Gestión de Intereses), D.S. N° 120-2019-PCM (Registro de Visitas en Línea) y Ley N° 31227 (DJI)',
          keyActorsAndDeadlines: 'Registro inmediato de la visita, evaluación estricta según directiva Sisfho',
          socraticPromptCorrect:
            'Has articulado correctamente trazabilidad y neutralidad técnica. Pensando en la sostenibilidad de tu decisión, ¿de qué manera el Registro de Visitas en Línea y la DJI te protegen personalmente si posteriormente el regidor cuestiona tu negativa en sesión de Concejo?',
          socraticPromptIncorrect:
            'Observa lo que planteaste en tu sustento: cualquier gestión no registrada o concesión frente a una autoridad electa vulnera el principio de neutralidad e igualdad de trato en el Sisfho. ¿Qué herramienta obligatoria permite dejar trazabilidad pública de una gestión de intereses en una entidad municipal?',
          complementSummary:
            'Toda gestión realizada por autoridades o terceros debe consignarse en el Registro de Visitas en Línea / Agendas Oficiales, manteniendo estricta neutralidad técnica bajo los criterios objetivos del Sisfho y verificando la Declaración Jurada de Intereses (DJI).',
        },
      },
      {
        id: '1.4',
        number: '1.4',
        caseId: 1,
        focusArea: 'Articulación con la Unidad Territorial del Midis',
        points: 2.0,
        correctOption: 'C',
        prompt:
          '¿Cómo debes articular con el/la Coordinador/a Territorial de la UT del MIDIS para cumplir el plazo de cierre de brechas sin comprometer la integridad del proceso?',
        options: [
          {
            id: 'A',
            text: 'Devolver todos los expedientes del distrito a la UT del MIDIS para que el ministerio asuma íntegramente el empadronamiento local y libere de responsabilidad a la municipalidad.',
          },
          {
            id: 'B',
            text: 'Enviar el padrón completo incluyendo el expediente recomendado por el regidor, pidiendo verbalmente al Coordinador Territorial del MIDIS que lo filtre en Lima.',
          },
          {
            id: 'C',
            text: 'Comunicar formalmente a la UT del MIDIS la abstención parcial tramitada respecto al expediente en conflicto y el reemplazo designado, asegurando la continuidad y asistencia técnica para validar dentro del plazo el resto del padrón bajo criterios objetivos.',
          },
          {
            id: 'D',
            text: 'Postergar indefinidamente la entrega del lote prioritario de hogares hasta que concluya una auditoría integral de la Contraloría General de la República.',
          },
        ],
        rubric: {
          expectedConcepts: ['abstención parcial', 'reemplazo', 'continuidad del servicio', 'asistencia técnica', 'Unidad Territorial', 'articulación'],
          normativeReference: 'Directiva del Sisfho, principios de continuidad del servicio público y articulación intergubernamental MIDIS - Gobiernos Locales',
          keyActorsAndDeadlines: 'Jefe/a ULE + Gerencia de Desarrollo Social + Coordinador/a Territorial UT MIDIS antes del corte quincenal',
          socraticPromptCorrect:
            'Tu respuesta equilibra rigor ético y adaptabilidad operativa en territorio. ¿Cómo aseguras que la ciudadanía y la junta vecinal conozcan esta medida de abstención parcial para recuperar la confianza sin afectar a los hogares vulnerables que esperan Pensión 65 o Contigo?',
          socraticPromptIncorrect:
            'Reflexiona sobre el impacto de tu elección en los usuarios: paralizar todo el padrón o trasladar indebidamente la función municipal perjudica el derecho de personas en pobreza extrema. ¿Cómo se puede aislar únicamente el expediente con conflicto sin detener la atención territorial junto con la UT del MIDIS?',
          complementSummary:
            'La adaptabilidad ética exige aislar el acto específico en conflicto mediante abstención parcial y reemplazo formal, comunicándolo a la UT del MIDIS para sostener la asistencia técnica y la entrega oportuna del resto del padrón a la población vulnerable.',
        },
      },
    ],
  },
  {
    id: 2,
    code: 'CASO 2',
    title: 'Uso de recursos en custodia y transparencia en la entrega alimentaria',
    axis: 'Transparencia en el manejo de recursos públicos, uso adecuado de bienes en custodia y límites frente a órdenes ilegales',
    governmentLevel: 'Gobierno Local (Municipalidad Provincial) en articulación con GORE y equipo territorial del MIDIS (PCA y Ollas Comunes)',
    protagonistRole: 'Subgerente/a de Programas Sociales y Complementación Alimentaria de una Municipalidad Provincial',
    secondaryActors: [
      'Gerente Municipal (funcionario de confianza y superior inmediato)',
      'Representante de empresa proveedora de alimentos del PCA',
      'Presidenta de red de ollas comunes',
      'Especialista de la Gerencia Regional de Desarrollo Social (GORE)',
      'Gestor/a territorial del MIDIS',
    ],
    paragraphs: [
      'En tu calidad de Subgerente/a de Programas Sociales y Complementación Alimentaria de una municipalidad provincial, administras el almacén central donde se custodia un importante lote de alimentos no perecibles adquiridos con transferencia presupuestal para el Programa de Complementación Alimentaria (PCA) y ollas comunes, además de dos camionetas asignadas exclusivamente a la supervisión alimentaria.',
      'A dos semanas de realizarse una actividad proselitista de alcance provincial, el Gerente Municipal (tu superior inmediato) te convoca a su despacho y te ordena de manera verbal disponer de las dos camionetas institucionales y retirar 150 canastas de alimentos del almacén del PCA para repartirlas este fin de semana en una "jornada cívica" organizada por una agrupación política local, señalando que "igual se entrega a población pobre y así aceleramos la ejecución presupuestal".',
      'Ese mismo día, el representante de una empresa proveedora —cuya última entrega de conservas y menestras tiene observaciones técnicas pendientes por calidad y retraso— se acerca a tu oficina y ofrece cubrir "los gastos de combustible y viáticos de tu equipo supervisor durante todo el mes" a cambio de que suscribas el acta de conformidad sin aplicar las penalidades contractuales.',
      'Paralelamente, la presidenta de una red de ollas comunes ingresa por mesa de partes una solicitud formal pidiendo el cronograma actualizado de distribución, los criterios técnicos de asignación y el saldo real de stock en almacén, manifestando preocupación por rumores de presunto desvío de raciones hacia actividades ajenas al padrón de organizaciones sociales de base.',
      'Tu dilema crítico consiste en resistir una orden superior orientada al proselitismo político con recursos alimentarios en custodia, rechazar un ofrecimiento de ventaja indebida en la cadena de suministro y garantizar transparencia activa hacia las organizaciones sociales de base en articulación con el GORE y el MIDIS.',
    ],
    criticalDilemma:
      'Resistir una orden superior orientada al proselitismo político con recursos alimentarios en custodia, rechazar un ofrecimiento de ventaja indebida en la cadena de suministro y garantizar transparencia activa hacia las organizaciones sociales de base en coordinación con el GORE y el MIDIS.',
    questions: [
      {
        id: '2.1',
        number: '2.1',
        caseId: 2,
        focusArea: 'Identificación de prohibiciones éticas',
        points: 1.5,
        correctOption: 'B',
        prompt:
          'De acuerdo con la Ley del Código de Ética de la Función Pública, ¿qué prohibiciones éticas específicas se configuran en la disposición de camionetas/canastas para la jornada cívica y en el ofrecimiento del proveedor?',
        options: [
          {
            id: 'A',
            text: 'Ninguna infracción grave, siempre que las canastas se entreguen a personas de bajos recursos y el combustible ofrecido por el proveedor se utilice en labores oficiales de supervisión.',
          },
          {
            id: 'B',
            text: 'Realizar actividades de proselitismo político mediante el uso de bienes públicos o de terceros destinados a programas sociales bajo custodia, y obtener o procurar ventajas o beneficios indebidos para sí o para otros.',
          },
          {
            id: 'C',
            text: 'Únicamente una falta leve de control patrimonial por no contar con papeleta de salida vehicular, sin responsabilidad ética sobre los alimentos en custodia.',
          },
          {
            id: 'D',
            text: 'Infracción exclusiva del proveedor privado, dado que los bienes del PCA pertenecen al MIDIS y no están sujetos al régimen ético de los servidores municipales.',
          },
        ],
        rubric: {
          expectedConcepts: ['proselitismo político', 'ventajas indebidas', 'bienes en custodia', 'uso adecuado de bienes', 'Ley 27815'],
          normativeReference: 'Art. 7 (Deber de Uso Adecuado de los Bienes del Estado) y Art. 8 nums. 2 y 3 (Prohibiciones Éticas) de la Ley N° 27815',
          keyActorsAndDeadlines: 'Subgerente/a de Programas Sociales, Gerente Municipal, proveedor PCA',
          socraticPromptCorrect:
            'Has identificado con precisión las prohibiciones éticas y la tutela sobre bienes en custodia. ¿Por qué la norma protege tanto los bienes patrimoniales propios de la municipalidad (camionetas) como los alimentos destinados a beneficiarios de programas sociales (canastas)?',
          socraticPromptIncorrect:
            'Revisa tu sustento a la luz de la Ley N° 27815: el fin asistencial aparente ("entregar a población pobre") jamás legitima el uso partidario de bienes públicos ni aceptar pagos de un proveedor. ¿Qué ocurre con la neutralidad del Estado cuando recursos del PCA se vinculan a una agrupación política?',
          complementSummary:
            'La Ley N° 27815 prohíbe expresamente el proselitismo político utilizando bienes públicos o asignados a programas sociales bajo custodia, así como obtener o procurar ventajas indebidas (combustible/viáticos) para omitir penalidades contractuales.',
        },
      },
      {
        id: '2.2',
        number: '2.2',
        caseId: 2,
        focusArea: 'Límites del deber de obediencia ante orden ilegal',
        points: 1.5,
        correctOption: 'C',
        prompt:
          'Frente a la instrucción verbal del Gerente Municipal de retirar las 150 canastas y usar las camionetas para la jornada cívica, ¿cuál es la conducta legal y éticamente exigible?',
        options: [
          {
            id: 'A',
            text: 'Cumplir la orden por principio de obediencia jerárquica, solicitando únicamente que el Gerente Municipal envíe un mensaje de texto confirmando la instrucción.',
          },
          {
            id: 'B',
            text: 'Entregar solo la mitad de las canastas (75 unidades) para reducir el riesgo presupuestal y mantener una buena relación laboral con la Gerencia Municipal.',
          },
          {
            id: 'C',
            text: 'Negarse a ejecutar la orden por constituir una ilegalidad manifiesta y desvío de recursos públicos, dejar constancia escrita de la negativa motivada y poner el hecho en conocimiento de la instancia competente / Órgano de Control Institucional (OCI).',
          },
          {
            id: 'D',
            text: 'Solicitar vacaciones inmediatas sin dejar instrucción alguna en el almacén para que el encargado de logística decida si entrega o no los bienes.',
          },
        ],
        rubric: {
          expectedConcepts: ['obediencia debida', 'ilegalidad manifiesta', 'negativa escrita', 'OCI', 'órgano de control', 'responsabilidad solidaria'],
          normativeReference: 'Art. 6 num. 6 (Lealtad y Obediencia — excepción ante arbitrariedad o ilegalidad manifiesta) de la Ley N° 27815 y Ley del Sistema Nacional de Control',
          keyActorsAndDeadlines: 'Negativa inmediata antes del retiro de bienes + comunicación formal al OCI / Oficina de Integridad',
          socraticPromptCorrect:
            'Has delimitado correctamente la frontera entre obediencia jerárquica y legalidad. En la práctica municipal, ¿qué elementos concretos debe contener tu documento de negativa escrita para acreditar tu diligencia y protegerte de una eventual represalia administrativa?',
          socraticPromptIncorrect:
            'Analiza el riesgo de tu respuesta: el deber de obediencia jerárquica cesa por mandato expreso de la ley cuando la orden es manifiestamente ilegal. Si ejecutas una orden verbal ilícita, ¿quién responde administrativamente y penalmente por la salida firmada del almacén?',
          complementSummary:
            'El deber de lealtad y obediencia no ampara órdenes manifiestamente ilegales ni arbitrarias; el servidor debe negarse formalmente por escrito y reportar el hecho al Órgano de Control Institucional (OCI) o instancia de integridad.',
        },
      },
      {
        id: '2.3',
        number: '2.3',
        caseId: 2,
        focusArea: 'Transparencia activa y firmeza contractual',
        points: 1.5,
        correctOption: 'B',
        prompt:
          '¿Qué acciones inmediatas corresponden frente al requerimiento presentado por la presidenta de la red de ollas comunes y frente al ofrecimiento del proveedor?',
        options: [
          {
            id: 'A',
            text: 'Reservar la información de stocks hasta fin de año para evitar reclamos vecinales y aceptar el apoyo de combustible del proveedor mediante un acta interna de donación.',
          },
          {
            id: 'B',
            text: 'Entregar información fidedigna, completa y oportuna sobre el stock, cronograma y criterios de distribución a la organización social; mantener las observaciones técnicas y penalidades al proveedor; y denunciar el intento de soborno.',
          },
          {
            id: 'C',
            text: 'Responder a la olla común que solicite la información directamente al MIDIS en Lima y otorgar al proveedor una ampliación verbal de plazo sin penalidad.',
          },
          {
            id: 'D',
            text: 'Publicar únicamente el monto total presupuestado en el portal municipal sin detallar el saldo físico del almacén ni los criterios de reparto.',
          },
        ],
        rubric: {
          expectedConcepts: ['transparencia activa', 'información fidedigna', 'penalidades', 'observaciones técnicas', 'reporte de soborno', 'ollas comunes'],
          normativeReference: 'Art. 7 num. 2 (Transparencia) de la Ley N° 27815, TUO de la Ley de Transparencia y Acceso a la Información Pública y Ley de Contrataciones del Estado',
          keyActorsAndDeadlines: 'Respuesta oportuna dentro del plazo de acceso a la información (10 días hábiles) + reporte inmediato del intento de soborno',
          socraticPromptCorrect:
            'Has conectado transparencia activa con integridad en abastecimiento. ¿De qué manera la publicación abierta de stocks y cronogramas hacia las ollas comunes actúa como un candado preventivo frente a futuros intentos de desvío político?',
          socraticPromptIncorrect:
            'Revisa tu sustento: ocultar saldos de almacén alimenta la desconfianza social y facilita el desvío de recursos, mientras que condonar penalidades a cambio de beneficios configura cohecho. ¿Qué deber ético exige brindar información fidedigna y oportuna a las organizaciones usuarias?',
          complementSummary:
            'La transparencia activa obliga a entregar información fidedigna, completa y oportuna sobre stocks y criterios de distribución a las ollas comunes, manteniendo con firmeza las observaciones contractuales y denunciando todo intento de soborno.',
        },
      },
      {
        id: '2.4',
        number: '2.4',
        caseId: 2,
        focusArea: 'Articulación multinivel y vigilancia ciudadana',
        points: 2.0,
        correctOption: 'C',
        prompt:
          '¿Cómo debes articular con la Gerencia Regional de Desarrollo Social (GORE) y el equipo territorial del MIDIS para asegurar la entrega íntegra de las raciones en territorio?',
        options: [
          {
            id: 'A',
            text: 'Ejecutar la entrega únicamente con personal de confianza de la alcaldía, excluyendo a los comités de vigilancia para agilizar la distribución.',
          },
          {
            id: 'B',
            text: 'Inmovilizar el almacén durante tres meses hasta que el GORE asuma la administración directa de los comedores populares de la provincia.',
          },
          {
            id: 'C',
            text: 'Activar el comité de gestión y monitoreo conjunto con participación de los comités de vigilancia ciudadana de las ollas comunes, el especialista del GORE y el gestor territorial del MIDIS para auditar el padrón de entrega y la trazabilidad del almacén.',
          },
          {
            id: 'D',
            text: 'Distribuir los alimentos sin padrón nominal en plazas públicas para demostrar que no existe favoritismo hacia ninguna organización.',
          },
        ],
        rubric: {
          expectedConcepts: ['comité de gestión', 'vigilancia ciudadana', 'trazabilidad', 'padrón de entrega', 'GORE', 'MIDIS', 'control social'],
          normativeReference: 'Normativa de gestión del PCA y Ollas Comunes (MIDIS), mecanismos de vigilancia ciudadana y articulación multinivel GORE - GL - MIDIS',
          keyActorsAndDeadlines: 'Subgerencia GL + Comités de Vigilancia + Especialista GORE + Gestor Territorial MIDIS antes de la distribución',
          socraticPromptCorrect:
            'Excelente enfoque de gobernanza colaborativa y control social. Si detectaras que alguna olla común tiene observaciones en su padrón durante la verificación conjunta, ¿cómo coordinarías su subsanación sin dejar desatendidas a las familias en inseguridad alimentaria?',
          socraticPromptIncorrect:
            'Reflexiona sobre el rol del control social y la articulación multinivel: repartir sin padrón o sin veeduría ciudadana elimina la trazabilidad del gasto público. ¿Qué actores territoriales (comités de vigilancia, GORE y MIDIS) deben concurrir para blindar la entrega de raciones?',
          complementSummary:
            'La articulación multinivel (GL–GORE–MIDIS) junto con los comités de vigilancia ciudadana permite auditar el padrón de beneficiarios y asegurar la trazabilidad física del almacén hasta la entrega efectiva a cada olla común.',
        },
      },
    ],
  },
  {
    id: 3,
    code: 'CASO 3',
    title: 'Filtración de denuncias, reserva de identidad y protección laboral en la articulación regional',
    axis: 'Canales de denuncia, principio de reserva, medidas de protección al denunciante y articulación interinstitucional',
    governmentLevel: 'Gobierno Regional (Gerencia/Dirección Regional de Desarrollo e Inclusión Social) en articulación con UT de Cuna Más y Juntos (MIDIS)',
    protagonistRole: 'Gerente/a o Director/a Regional de Desarrollo e Inclusión Social de un Gobierno Regional (GORE), copresidente/a de la IAR',
    secondaryActors: [
      'Especialista social regional (contrato temporal próximo a vencer)',
      'Jefe/a de Equipo Territorial del GORE (denunciado y jefe inmediato)',
      'Jefes/as de las Unidades Territoriales de Cuna Más y Juntos del MIDIS',
      'Jefe/a de la Oficina General de Recursos Humanos (OGRH)',
      'Periodista local',
    ],
    paragraphs: [
      'Como Gerente/a o Director/a Regional de Desarrollo e Inclusión Social de un Gobierno Regional (GORE) y copresidente/a de la Instancia de Articulación Regional (IAR), conduces una sesión descentralizada para monitorear el paquete integrado de Desarrollo Infantil Temprano (DIT) en articulación directa con las Unidades Territoriales de los programas nacionales Cuna Más y Juntos del MIDIS.',
      'Al término de la jornada, una especialista social del GORE —que articula en campo con acompañantes técnicos de Cuna Más y gestores locales de Juntos— te entrega en estricta reserva un sobre cerrado que contiene audios y actas adulteradas. Las evidencias muestran que un coordinador territorial de un Programa Nacional del MIDIS y un jefe de equipo del GORE cobran "cupos" económicos y condicionan el acceso de familias usuarias.',
      'La especialista solicita expresamente reserva de identidad y medidas de protección laboral, explicando que su contrato temporal vence en diez días calendario y que su jefe inmediato (precisamente el jefe de equipo denunciado) ya le anunció verbalmente que no renovará su vínculo. Además, manifiesta temor a represalias porque semanas atrás otro servidor reportó una alerta similar que fue tramitada como una simple queja administrativa sin reserva, exponiendo su identidad.',
      'Al día siguiente por la mañana, un periodista local ingresa una solicitud formal de acceso a la información pública requiriendo copia íntegra de todas las denuncias recibidas durante la sesión de la IAR, así como los nombres de los denunciantes y servidores involucrados.',
      'Tu dilema crítico consiste en canalizar la denuncia cumpliendo estrictamente los plazos perentorios y reglas de confidencialidad entre el GORE y el MIDIS, activar medidas de protección laboral efectivas frente a represalias contractuales y denegar legalmente la divulgación de información reservada sin interrumpir el servicio a las familias de Cuna Más y Juntos.',
    ],
    criticalDilemma:
      'Canalizar la denuncia cumpliendo estrictamente los plazos y reglas de confidencialidad entre el GORE y el MIDIS, activar medidas de protección laboral efectivas frente a represalias contractuales y denegar legalmente la divulgación de información reservada sin interrumpir el servicio a las familias de Cuna Más y Juntos.',
    questions: [
      {
        id: '3.1',
        number: '3.1',
        caseId: 3,
        focusArea: 'Diferenciación entre queja y denuncia de corrupción',
        points: 1.5,
        correctOption: 'B',
        prompt:
          'Según la Directiva N° 001-2022-MIDIS (Versión 02) y el marco nacional de integridad, ¿por qué fue erróneo tramitar el caso previo como queja administrativa y cuál es la vía correcta para la denuncia actual?',
        options: [
          {
            id: 'A',
            text: 'Porque toda comunicación ciudadana debe tramitarse primero mediante el Libro de Reclamaciones y solo si no hay respuesta en 30 días pasa a integridad.',
          },
          {
            id: 'B',
            text: 'Porque la queja responde a defectos de tramitación administrativa, mientras que el cobro de cupos presenta fundamento (indicios razonables) y materialidad (afectación al servicio y vínculo funcional), debiendo canalizarse como denuncia de corrupción ante la Oficina de Integridad Institucional (OII) / Plataforma Digital Única de Denuncias del Ciudadano.',
          },
          {
            id: 'C',
            text: 'Porque las denuncias que involucran a personal de programas sociales del MIDIS solo pueden presentarse presencialmente en la sede central de Lima.',
          },
          {
            id: 'D',
            text: 'Porque antes de admitir una denuncia con audios debe notificarse al jefe denunciado para que ejerza su derecho de descargo previo.',
          },
        ],
        rubric: {
          expectedConcepts: ['queja por defecto de tramitación', 'denuncia de corrupción', 'fundamento', 'materialidad', 'Oficina de Integridad Institucional', 'Plataforma Digital Única'],
          normativeReference: 'Directiva N° 001-2022-MIDIS (Versión 02, aprobada por R.M. N° 157-2026-MIDIS) y D. Leg. N° 1327',
          keyActorsAndDeadlines: 'Canalización inmediata hacia OII / Plataforma Digital Única de Denuncias del Ciudadano sin notificar al denunciado',
          socraticPromptCorrect:
            'Has diferenciado con rigor la queja administrativa de la denuncia de corrupción bajo los criterios de fundamento y materialidad. ¿Qué consecuencias directas sobre la protección del denunciante se generan cuando una alerta de corrupción se deriva erróneamente como queja ordinaria?',
          socraticPromptIncorrect:
            'Revisa tu argumento: notificar previamente al denunciado o tramitar un cobro de cupos como simple queja por defecto de tramitación destruye la reserva de identidad. ¿Qué dos criterios técnicos de la Directiva N° 001-2022-MIDIS distinguen una denuncia por presunto acto de corrupción?',
          complementSummary:
            'A diferencia de la queja por defecto de tramitación, la denuncia por presuntos actos de corrupción se caracteriza por contar con fundamento (indicios razonables) y materialidad (afectación al servicio/vínculo funcional), canalizándose reservadamente ante la OII o la Plataforma Digital Única de Denuncias del Ciudadano.',
        },
      },
      {
        id: '3.2',
        number: '3.2',
        caseId: 3,
        focusArea: 'Flujo de derivación, plazo (1 día hábil) y código cifrado',
        points: 1.5,
        correctOption: 'A',
        prompt:
          '¿Cuál es el procedimiento y plazo obligatorio para remitir la denuncia recibida en territorio hacia las instancias competentes del MIDIS/Programa Nacional y del GORE?',
        options: [
          {
            id: 'A',
            text: 'Remitirla en un plazo máximo de un (1) día hábil, en sobre cerrado confidencial o medio digital seguro, a la OII del Programa Nacional/MIDIS y a la instancia de integridad/STPAD regional, asignando un código cifrado para proteger la identidad.',
          },
          {
            id: 'B',
            text: 'Ingresarla por Mesa de Partes ordinaria escaneando todos los documentos en el sistema de trámite documentario abierto del GORE dentro de los 15 días hábiles siguientes.',
          },
          {
            id: 'C',
            text: 'Convocar a una reunión extraordinaria de todos los miembros de la IAR para leer los documentos y votar si corresponde remitirlos al MIDIS.',
          },
          {
            id: 'D',
            text: 'Conservar el sobre cerrado en el despacho regional hasta que culmine el año fiscal para consolidarlo en el informe anual de gestión.',
          },
        ],
        rubric: {
          expectedConcepts: ['un (1) día hábil', '1 día hábil', 'sobre cerrado confidencial', 'código cifrado', 'OII', 'STPAD', 'SISPAD'],
          normativeReference: 'Directiva N° 001-2022-MIDIS (Versión 02 — plazos de derivación territorial en 1 día hábil y codificación cifrada)',
          keyActorsAndDeadlines: 'Plazo máximo de 1 día hábil hacia OII / STPAD con código cifrado (antes de evaluación de requisitos en 2 días hábiles)',
          socraticPromptCorrect:
            'Has precisado el plazo perentorio de 1 día hábil y el uso del código cifrado. ¿Por qué la sustitución inmediata del nombre por un código cifrado antes del registro en el SISPAD es indispensable cuando la denuncia involucra tanto a personal del GORE como de un Programa Nacional del MIDIS?',
          socraticPromptIncorrect:
            'Analiza el riesgo operativo de tu respuesta: cualquier demora o ingreso por trámite abierto expone la identidad de la denunciante en horas. ¿Cuál es el plazo máximo en días hábiles establecido para remitir una denuncia recibida en territorio y qué mecanismo sustituye los datos personales del denunciante?',
          complementSummary:
            'Toda denuncia recibida en territorio debe remitirse en un plazo máximo de un (1) día hábil —en sobre cerrado confidencial o canal digital seguro— a la OII del Programa Nacional/MIDIS y a la instancia competente, asignando un código cifrado que resguarde la identidad.',
        },
      },
      {
        id: '3.3',
        number: '3.3',
        caseId: 3,
        focusArea: 'Protección laboral y reserva ante solicitud de prensa',
        points: 2.0,
        correctOption: 'B',
        prompt:
          '¿Qué medidas de protección laboral corresponden a la especialista denunciante (cuyo contrato vence en 10 días) y cómo debes responder a la solicitud de acceso a la información del periodista?',
        options: [
          {
            id: 'A',
            text: 'Esperar a que venza su contrato para evitar interferir en la autonomía del jefe denunciado y entregar al periodista una versión resumida con los cargos de los involucrados.',
          },
          {
            id: 'B',
            text: 'Gestionar la renovación de la relación contractual ante la anunciada no-renovación por represalia (y/o el traslado temporal o exoneración del denunciado), y denegar totalmente la solicitud del periodista invocando la excepción legal de confidencialidad.',
          },
          {
            id: 'C',
            text: 'Trasladar a la especialista a un puesto de menor nivel remunerativo para alejarla del conflicto y publicar los audios en el portal de transparencia.',
          },
          {
            id: 'D',
            text: 'Conceder al periodista acceso solo a los nombres de los funcionarios denunciados manteniendo en reserva únicamente el nombre de la especialista.',
          },
        ],
        rubric: {
          expectedConcepts: ['renovación de la relación contractual', 'represalia', 'D. Leg. 1327', 'D.S. 010-2017-JUS', 'denegar', 'confidencial', 'art. 17.3', 'Ley de Transparencia'],
          normativeReference: 'Art. 6 del Reglamento del D. Leg. N° 1327 (D.S. N° 010-2017-JUS) y Art. 17 num. 3 del TUO de la Ley N° 27806 (Ley de Transparencia)',
          keyActorsAndDeadlines: 'Solicitud inmediata antes del vencimiento de los 10 días + denegatoria motivada al periodista dentro del plazo legal',
          socraticPromptCorrect:
            'Has aplicado con precisión tanto el catálogo de protección laboral del D.S. N° 010-2017-JUS como la excepción del art. 17.3 del TUO de la Ley de Transparencia. ¿Por qué la denegatoria al periodista debe abarcar tanto la identidad del denunciante como el contenido mismo de la denuncia en curso?',
          socraticPromptIncorrect:
            'Revisa tu justificación: permitir que venza un contrato como represalia disuade futuras denuncias, y entregar información parcial a la prensa vulnera el principio de reserva previsto en el art. 17.3 del TUO de la Ley de Transparencia. ¿Qué medida específica contempla el Reglamento del D. Leg. N° 1327 ante una no-renovación contractual por represalia?',
          complementSummary:
            'El Reglamento del D. Leg. N° 1327 contempla la renovación de la relación contractual ante una no-renovación por represalia (además del traslado o exoneración del denunciado), mientras que el art. 17.3 del TUO de la Ley de Transparencia obliga a denegar el acceso periodístico por carácter confidencial.',
        },
      },
      {
        id: '3.4',
        number: '3.4',
        caseId: 3,
        focusArea: 'Articulación interna y reorganización con Cuna Más y Juntos',
        points: 2.0,
        correctOption: 'A',
        prompt:
          '¿Cómo debes coordinar internamente (OGRH y STPAD) y con los/as Jefes/as de las Unidades Territoriales de Cuna Más y Juntos para ejecutar la protección y sostener la atención en campo?',
        options: [
          {
            id: 'A',
            text: 'Solicitar el informe de viabilidad operativa a OGRH (plazo de 1 día hábil para requerirlo y 3 días hábiles para emitirlo), activar la protección de oficio en la STPAD y redistribuir temporalmente las rutas de acompañamiento familiar con las UT de Cuna Más y Juntos sin revelar el motivo al entorno operativo.',
          },
          {
            id: 'B',
            text: 'Comunicar en asamblea a todos los acompañantes técnicos de Cuna Más y gestores de Juntos el nombre de la denunciante para que le brinden respaldo solidario en campo.',
          },
          {
            id: 'C',
            text: 'Suspender por 60 días las visitas domiciliarias de Cuna Más y el pago de incentivos de Juntos en la provincia hasta que concluya el proceso disciplinario.',
          },
          {
            id: 'D',
            text: 'Dejar que el propio jefe de equipo denunciado firme el informe de viabilidad operativa de Recursos Humanos por ser el jefe directo de la especialista.',
          },
        ],
        rubric: {
          expectedConcepts: ['OGRH', 'viabilidad operativa', '1 día hábil', '3 días hábiles', 'STPAD', 'protección de oficio', 'redistribuir rutas', 'Cuna Más', 'Juntos'],
          normativeReference: 'Directiva N° 001-2022-MIDIS (articulación OII–OGRH–STPAD: 1 día hábil requerimiento / 3 días hábiles informe) y Reglamento del D. Leg. N° 1327',
          keyActorsAndDeadlines: 'OII/Integridad -> OGRH (1 día hábil) -> Informe OGRH (3 días hábiles) + STPAD + UT Cuna Más y Juntos',
          socraticPromptCorrect:
            'Has integrado de manera ejemplar los plazos internos entre Integridad, OGRH y STPAD con la continuidad del paquete DIT en territorio. ¿Cómo garantizarías que la redistribución temporal de rutas entre Cuna Más y Juntos no genere sospechas ni exponga indirectamente a la especialista denunciante?',
          socraticPromptIncorrect:
            'Reflexiona sobre la articulación institucional en tu sustento: divulgar el motivo en campo rompe la reserva y paralizar Cuna Más o Juntos castiga a las familias usuarias. ¿Qué plazos rigen entre Integridad y OGRH (1 día hábil / 3 días hábiles) y cómo se reorganiza el servicio sin revelar la denuncia?',
          complementSummary:
            'La articulación efectiva exige requerir en 1 día hábil el informe de viabilidad operativa a OGRH (que debe emitirlo en 3 días hábiles), asegurar la reserva de oficio en la STPAD y reorganizar las rutas de Cuna Más y Juntos sin revelar el motivo al entorno operativo.',
        },
      },
    ],
  },
];

const DEMO_COHORT: ParticipantRecord[] = [
  {
    id: 'demo-elena-quispe',
    fullName: 'Elena Quispe Huamán (Demo)',
    dni: '42891034',
    email: 'equispe@munidistrital.gob.pe',
    consent: true,
    startedAt: new Date(Date.now() - 1800000).toISOString(),
    completedAt: new Date(Date.now() - 300000).toISOString(),
    answers: {},
    totalScore: 18.5,
    case1Score: 6.5,
    case2Score: 5.0,
    case3Score: 7.0,
    level: 'Destacado (Liderazgo Ético Territorial)',
  },
  {
    id: 'demo-carlos-mendoza',
    fullName: 'Carlos Mendoza Ríos (Demo)',
    dni: '40512879',
    email: 'cmendoza@region.gob.pe',
    consent: true,
    startedAt: new Date(Date.now() - 2400000).toISOString(),
    completedAt: new Date(Date.now() - 600000).toISOString(),
    answers: {},
    totalScore: 14.5,
    case1Score: 5.0,
    case2Score: 4.5,
    case3Score: 5.0,
    level: 'Satisfactorio (Criterio Preventivo Consolidado)',
  },
];

// ============================================================================
// FUNCIONES AUXILIARES (TIEMPO, SANEAMIENTO SEGURO, VALIDACIÓN, MOTOR SOCRÁTICO)
// ============================================================================

const formatTimestamp = (iso?: string | null): string => {
  if (!iso) return 'En curso';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d
    .toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '');
};

const countValidSpanishWords = (text: string): number => {
  const tokens = text
    .trim()
    .split(/\s+/)
    .map((t: string) => t.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, ''))
    .filter((t: string) => t.length >= 2 && /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(t));
  return tokens.length;
};

const computePerformanceLevel = (score: number): string => {
  if (score >= 17) return 'Destacado (Liderazgo Ético Territorial)';
  if (score >= 13) return 'Satisfactorio (Criterio Preventivo Consolidado)';
  if (score >= 10) return 'En Proceso (Requiere Refuerzo Normativo)';
  return 'Inicial (Atención Prioritaria en Integridad)';
};

const normalizeParticipantRecord = (raw: unknown): ParticipantRecord | null => {
  if (!raw || typeof raw !== 'object') return null;

  const candidate =
    'rawRecord' in raw &&
    (raw as { rawRecord?: unknown }).rawRecord &&
    typeof (raw as { rawRecord?: unknown }).rawRecord === 'object'
      ? (raw as { rawRecord: Record<string, unknown> }).rawRecord
      : (raw as Record<string, unknown>);

  const id = String(candidate.id ?? '').trim();
  const fullName = String(candidate.fullName ?? candidate.Participante ?? '').trim();
  const dni = String(candidate.dni ?? candidate.DNI ?? '')
    .replace(/^'/, '')
    .trim();

  if (!id && !dni && !fullName) return null;

  const rawAnswers = candidate.answers;
  const safeAnswers: Record<string, AnswerRecord> = {};
  if (rawAnswers && typeof rawAnswers === 'object' && !Array.isArray(rawAnswers)) {
    Object.entries(rawAnswers as Record<string, unknown>).forEach(([key, val]) => {
      if (val && typeof val === 'object') {
        const a = val as Record<string, unknown>;
        const fb =
          a.feedback && typeof a.feedback === 'object'
            ? (a.feedback as Record<string, unknown>)
            : {};
        safeAnswers[key] = {
          questionId: String(a.questionId ?? key),
          selectedOption: (['A', 'B', 'C', 'D'].includes(String(a.selectedOption))
            ? String(a.selectedOption)
            : 'A') as 'A' | 'B' | 'C' | 'D',
          justification: String(a.justification ?? ''),
          isCorrect: Boolean(a.isCorrect),
          pointsEarned: Number(a.pointsEarned) || 0,
          answeredAt: String(a.answeredAt ?? ''),
          feedback: {
            recognition: String(fb.recognition ?? ''),
            complement: String(fb.complement ?? ''),
            socraticQuestion: String(fb.socraticQuestion ?? ''),
            normativeReference: String(fb.normativeReference ?? ''),
          },
        };
      }
    });
  }

  const case1Score = Number(candidate.case1Score ?? candidate.case1 ?? candidate.Caso_1_Pts) || 0;
  const case2Score = Number(candidate.case2Score ?? candidate.case2 ?? candidate.Caso_2_Pts) || 0;
  const case3Score = Number(candidate.case3Score ?? candidate.case3 ?? candidate.Caso_3_Pts) || 0;
  const rawTotal = Number(candidate.totalScore ?? candidate.total ?? candidate.Total_20_Pts);
  const totalScore = Number.isFinite(rawTotal)
    ? Number(rawTotal.toFixed(1))
    : Number((case1Score + case2Score + case3Score).toFixed(1));

  const answeredCount = Object.keys(safeAnswers).length;
  const startedAt = String(candidate.startedAt ?? new Date().toISOString());
  const rawCompleted = candidate.completedAt;
  const completedAt =
    rawCompleted && rawCompleted !== 'En curso' ? String(rawCompleted) : null;

  return {
    id: id || `${dni || 'part'}-${startedAt}`,
    fullName: fullName || 'Participante sin nombre',
    dni: dni || '--------',
    email: String(candidate.email ?? candidate.Correo_Electronico ?? ''),
    consent: candidate.consent !== false,
    startedAt,
    completedAt,
    answers: safeAnswers,
    totalScore,
    case1Score: Number(case1Score.toFixed(1)),
    case2Score: Number(case2Score.toFixed(1)),
    case3Score: Number(case3Score.toFixed(1)),
    level: String(
      candidate.level ??
        (answeredCount > 0 ? computePerformanceLevel(totalScore) : 'En curso')
    ),
  };
};

const evaluateSocraticFeedback = (
  question: CaseQuestion,
  selectedOption: 'A' | 'B' | 'C' | 'D',
  justification: string
) => {
  const isCorrect = selectedOption === question.correctOption;
  const pointsEarned = isCorrect ? question.points : 0;
  const lowerJust = justification.toLowerCase();

  const matchedConcepts = question.rubric.expectedConcepts.filter((c: string) =>
    lowerJust.includes(c.toLowerCase())
  );

  const recognition = isCorrect
    ? matchedConcepts.length > 0
      ? `Elección correcta (+${question.points.toFixed(1)} pts). Tu sustento incorpora conceptos clave de la rúbrica como "${matchedConcepts.slice(0, 3).join('", "')}", demostrando criterio preventivo alineado al objetivo del taller.`
      : `Elección correcta (+${question.points.toFixed(1)} pts). Has seleccionado la ruta de actuación ética y operativa adecuada frente al dilema planteado en territorio.`
    : matchedConcepts.length > 0
      ? `Alternativa incorrecta (0.0 pts; clave esperada: ${question.correctOption}). Aunque en tu sustento mencionas "${matchedConcepts.slice(0, 2).join('" y "')}", la opción elegida conlleva un riesgo operativo o normativo en la gestión del servicio.`
      : `Alternativa incorrecta (0.0 pts; clave esperada: ${question.correctOption}). Tu argumento prioriza una salida que compromete la imparcialidad, la trazabilidad o la reserva exigida en la función pública.`;

  const complement = `${question.rubric.complementSummary} Base aplicable: ${question.rubric.normativeReference} (${question.rubric.keyActorsAndDeadlines}).`;

  const socraticQuestion = isCorrect
    ? question.rubric.socraticPromptCorrect
    : question.rubric.socraticPromptIncorrect;

  return {
    isCorrect,
    pointsEarned,
    feedback: {
      recognition,
      complement,
      socraticQuestion,
      normativeReference: question.rubric.normativeReference,
    },
  };
};

// ============================================================================
// GENERADOR NATIVO DE DESCARGA DIRECTA PDF EN PC (SIN POPUPS NI DEPENDENCIAS)
// ============================================================================

const encodeWinAnsiBytes = (text: string): number[] => {
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code === 0x28 || code === 0x29 || code === 0x5c) {
      bytes.push(0x5c, code);
    } else if (code >= 0x20 && code <= 0x7e) {
      bytes.push(code);
    } else if (code >= 0xa0 && code <= 0xff) {
      bytes.push(code);
    } else if (code === 0x2014) {
      bytes.push(0x97);
    } else if (code === 0x2013) {
      bytes.push(0x96);
    } else if (code === 0x201c || code === 0x201d) {
      bytes.push(0x22);
    } else if (code === 0x2018 || code === 0x2019) {
      bytes.push(0x27);
    } else if (code === 0x2022) {
      bytes.push(0x95);
    } else {
      bytes.push(0x3f);
    }
  }
  return bytes;
};

const wrapPdfLine = (text: string, maxChars: number): string[] => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const words = clean.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ' ' + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

const downloadDirectPdfReport = (
  participant: ParticipantRecord,
  config: AppConfig
): void => {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 44;
  const contentWidth = pageWidth - marginX * 2;
  const topMargin = 46;
  const bottomMargin = 48;

  const pagesOps: number[][] = [[]];
  let currentY = pageHeight - topMargin;

  const pushOps = (cmd: string) => {
    const target = pagesOps[pagesOps.length - 1];
    for (let i = 0; i < cmd.length; i++) {
      target.push(cmd.charCodeAt(i) & 0xff);
    }
    target.push(0x0a);
  };

  const pushTextOp = (
    text: string,
    x: number,
    y: number,
    fontKey: 'F1' | 'F2',
    fontSize: number,
    rgb: [number, number, number] = [0.06, 0.09, 0.16]
  ) => {
    const target = pagesOps[pagesOps.length - 1];
    const prefix = `BT /${fontKey} ${fontSize.toFixed(1)} Tf ${rgb[0].toFixed(3)} ${rgb[1].toFixed(3)} ${rgb[2].toFixed(3)} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (`;
    for (let i = 0; i < prefix.length; i++) {
      target.push(prefix.charCodeAt(i) & 0xff);
    }
    const encoded = encodeWinAnsiBytes(text);
    for (let i = 0; i < encoded.length; i++) {
      target.push(encoded[i]);
    }
    const suffix = ') Tj ET\n';
    for (let i = 0; i < suffix.length; i++) {
      target.push(suffix.charCodeAt(i) & 0xff);
    }
  };

  const ensureSpace = (neededHeight: number) => {
    if (currentY - neededHeight < bottomMargin) {
      pagesOps.push([]);
      currentY = pageHeight - topMargin;
    }
  };

  const drawWrappedBlock = (
    text: string,
    options: {
      fontKey?: 'F1' | 'F2';
      fontSize?: number;
      lineHeight?: number;
      indentX?: number;
      rgb?: [number, number, number];
      maxChars?: number;
    } = {}
  ) => {
    const fontKey = options.fontKey ?? 'F1';
    const fontSize = options.fontSize ?? 9.5;
    const lineHeight = options.lineHeight ?? fontSize + 3.5;
    const indentX = options.indentX ?? 0;
    const rgb = options.rgb ?? [0.12, 0.16, 0.23];
    const maxChars =
      options.maxChars ?? Math.max(30, Math.floor((contentWidth - indentX) / (fontSize * 0.51)));

    const lines = wrapPdfLine(text, maxChars);
    for (const line of lines) {
      ensureSpace(lineHeight);
      pushTextOp(line, marginX + indentX, currentY, fontKey, fontSize, rgb);
      currentY -= lineHeight;
    }
  };

  const bannerHeight = 36;
  const bannerY = currentY - bannerHeight + 10;

  pushOps(`0.98 0.98 0.99 rg ${marginX} ${bannerY} 72 ${bannerHeight} re f`);
  pushOps(`0.75 0.78 0.82 RG 0.6 w ${marginX} ${bannerY} 72 ${bannerHeight} re S`);
  pushTextOp('REPUBLICA', marginX + 13, bannerY + 21, 'F2', 7.2, [0.1, 0.13, 0.18]);
  pushTextOp('DEL PERU', marginX + 16, bannerY + 11, 'F2', 7.2, [0.1, 0.13, 0.18]);

  pushOps(`0.851 0.063 0.137 rg ${marginX + 72} ${bannerY} 54 ${bannerHeight} re f`);
  pushTextOp('PERÚ', marginX + 83, bannerY + 13, 'F2', 12.5, [1, 1, 1]);

  pushOps(`0.341 0.341 0.337 rg ${marginX + 126} ${bannerY} 144 ${bannerHeight} re f`);
  pushTextOp('Ministerio de Desarrollo', marginX + 134, bannerY + 21, 'F2', 8.5, [1, 1, 1]);
  pushTextOp('e Inclusión Social', marginX + 134, bannerY + 10, 'F2', 8.5, [1, 1, 1]);

  pushTextOp('TALLER VIRTUAL DE INTEGRIDAD PÚBLICA', marginX + 282, bannerY + 23, 'F2', 8.2, [0.75, 0.08, 0.15]);
  const titleLines = wrapPdfLine(config.workshopTitle, 42);
  titleLines.slice(0, 2).forEach((tLine: string, idx: number) => {
    pushTextOp(tLine, marginX + 282, bannerY + 12 - idx * 10, 'F2', 8.5, [0.08, 0.11, 0.17]);
  });

  currentY = bannerY - 12;
  pushOps(`0.851 0.063 0.137 RG 1.5 w ${marginX} ${currentY} m ${pageWidth - marginX} ${currentY} l S`);
  currentY -= 18;

  const cardHeight = 86;
  const cardY = currentY - cardHeight + 8;
  pushOps(`0.97 0.98 0.99 rg ${marginX} ${cardY} ${contentWidth} ${cardHeight} re f`);
  pushOps(`0.80 0.84 0.88 RG 0.8 w ${marginX} ${cardY} ${contentWidth} ${cardHeight} re S`);

  pushTextOp('REPORTE INTEGRAL DE DESEMPEÑO Y PLAN DE ACCIÓN', marginX + 12, cardY + 69, 'F2', 10.5, [0.06, 0.09, 0.16]);
  pushTextOp(`Participante: ${participant.fullName}`, marginX + 12, cardY + 53, 'F2', 9, [0.1, 0.14, 0.2]);
  pushTextOp(`DNI: ${participant.dni}`, marginX + 330, cardY + 53, 'F2', 9, [0.1, 0.14, 0.2]);
  pushTextOp(`Correo: ${participant.email}`, marginX + 12, cardY + 39, 'F1', 8.8, [0.2, 0.25, 0.33]);
  pushTextOp(
    `Calificación Final: ${participant.totalScore.toFixed(1)} / 20.0 pts`,
    marginX + 330,
    cardY + 39,
    'F2',
    9.5,
    [0.75, 0.08, 0.15]
  );
  pushTextOp(
    `Ingreso: ${formatTimestamp(participant.startedAt)}   |   Fin: ${formatTimestamp(participant.completedAt)}`,
    marginX + 12,
    cardY + 25,
    'F1',
    8.5,
    [0.25, 0.3, 0.38]
  );
  pushTextOp(`Nivel alcanzado: ${participant.level}`, marginX + 12, cardY + 11, 'F2', 8.8, [0.06, 0.35, 0.2]);

  currentY = cardY - 14;

  pushTextOp(
    `Desglose por Caso:   Caso 1: ${participant.case1Score.toFixed(1)} / 6.5 pts   |   Caso 2: ${participant.case2Score.toFixed(1)} / 6.5 pts   |   Caso 3: ${participant.case3Score.toFixed(1)} / 7.0 pts`,
    marginX,
    currentY,
    'F2',
    9,
    [0.12, 0.16, 0.23]
  );
  currentY -= 18;

  for (const scenario of CASES_DATA) {
    ensureSpace(34);
    const headerBarY = currentY - 14;
    pushOps(`0.118 0.161 0.231 rg ${marginX} ${headerBarY} ${contentWidth} 20 re f`);
    const caseHeader = `${scenario.code}: ${scenario.title}`.slice(0, 88);
    pushTextOp(caseHeader, marginX + 8, headerBarY + 6, 'F2', 9.2, [1, 1, 1]);
    currentY = headerBarY - 12;

    for (const q of scenario.questions) {
      const ans = participant.answers[q.id];
      ensureSpace(68);

      const statusLabel = ans
        ? `${ans.pointsEarned.toFixed(1)} / ${q.points.toFixed(1)} pts (${ans.isCorrect ? 'CORRECTA' : 'INCORRECTA'})`
        : `0.0 / ${q.points.toFixed(1)} pts (PENDIENTE)`;
      const statusColor: [number, number, number] = ans
        ? ans.isCorrect
          ? [0.06, 0.45, 0.22]
          : [0.75, 0.1, 0.15]
        : [0.4, 0.45, 0.52];

      pushTextOp(`Pregunta ${q.number} - ${q.focusArea}`, marginX, currentY, 'F2', 9.2, [0.06, 0.09, 0.16]);
      pushTextOp(statusLabel, marginX + 345, currentY, 'F2', 8.5, statusColor);
      currentY -= 13;

      drawWrappedBlock(`Consigna: ${q.prompt}`, {
        fontKey: 'F1',
        fontSize: 8.6,
        indentX: 6,
        rgb: [0.22, 0.27, 0.35],
      });

      if (ans) {
        drawWrappedBlock(
          `Alternativa elegida: ${ans.selectedOption}   |   Clave esperada: ${q.correctOption}`,
          {
            fontKey: 'F2',
            fontSize: 8.6,
            indentX: 6,
            rgb: [0.08, 0.11, 0.17],
          }
        );
        drawWrappedBlock(`Sustento del participante: ${ans.justification}`, {
          fontKey: 'F1',
          fontSize: 8.5,
          indentX: 6,
          rgb: [0.15, 0.2, 0.28],
        });
        drawWrappedBlock(
          `Retroalimentación y base normativa: ${ans.feedback.recognition} ${ans.feedback.complement}`,
          {
            fontKey: 'F1',
            fontSize: 8.4,
            indentX: 6,
            rgb: [0.18, 0.24, 0.32],
          }
        );
      } else {
        drawWrappedBlock('Sin respuesta registrada aún.', {
          fontKey: 'F1',
          fontSize: 8.5,
          indentX: 6,
          rgb: [0.45, 0.5, 0.56],
        });
      }

      currentY -= 4;
      pushOps(`0.88 0.90 0.93 RG 0.5 w ${marginX} ${currentY} m ${pageWidth - marginX} ${currentY} l S`);
      currentY -= 11;
    }
  }

  ensureSpace(88);
  currentY -= 4;
  pushTextOp(
    'COMPROMISOS Y PLAN DE ACCIÓN TERRITORIAL RECOMENDADO',
    marginX,
    currentY,
    'F2',
    9.8,
    [0.08, 0.22, 0.52]
  );
  currentY -= 14;

  const commitments = [
    '1. Conflictos de intereses: Activar oportunamente la excusación escrita ante el superior inmediato, verificar la DJI y consignar audiencias en el Registro de Visitas en Línea.',
    '2. Transparencia y custodia de recursos: Rechazar por escrito cualquier orden manifiestamente ilegal o proselitista, reportar intentos de soborno y articular comités de vigilancia con GORE y MIDIS.',
    '3. Canales de denuncia y protección: Derivar denuncias en máximo 1 día hábil con código cifrado hacia la OII/STPAD, aplicar medidas de protección laboral (D.S. N° 010-2017-JUS) y resguardar la confidencialidad (Art. 17.3 TUO Ley de Transparencia).',
  ];

  for (const item of commitments) {
    drawWrappedBlock(item, {
      fontKey: 'F1',
      fontSize: 8.6,
      indentX: 4,
      rgb: [0.1, 0.14, 0.2],
    });
    currentY -= 2;
  }

  const totalPages = pagesOps.length;
  pagesOps.forEach((_: number[], idx: number) => {
    const target = pagesOps[idx];
    const footerStr = `${config.institutionName} - Reporte Oficial del Taller   |   Página ${idx + 1} de ${totalPages}`;
    const prefix = `BT /F1 7.8 Tf 0.42 0.46 0.53 rg ${marginX.toFixed(2)} 24.00 Td (`;
    for (let i = 0; i < prefix.length; i++) target.push(prefix.charCodeAt(i) & 0xff);
    const enc = encodeWinAnsiBytes(footerStr);
    for (let i = 0; i < enc.length; i++) target.push(enc[i]);
    const suffix = ') Tj ET\n';
    for (let i = 0; i < suffix.length; i++) target.push(suffix.charCodeAt(i) & 0xff);
  });

  const pdfBytes: number[] = [];
  const appendAscii = (s: string) => {
    for (let i = 0; i < s.length; i++) pdfBytes.push(s.charCodeAt(i) & 0xff);
  };
  const appendBytes = (arr: number[]) => {
    for (let i = 0; i < arr.length; i++) pdfBytes.push(arr[i]);
  };

  appendAscii('%PDF-1.4\n');
  const offsets: number[] = [0];

  const startObj = (objNum: number) => {
    offsets[objNum] = pdfBytes.length;
    appendAscii(`${objNum} 0 obj\n`);
  };

  startObj(1);
  appendAscii('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  startObj(3);
  appendAscii('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n');

  startObj(4);
  appendAscii('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n');

  const pageObjNumbers: number[] = [];
  let nextObjNum = 5;

  for (const streamBytes of pagesOps) {
    const pageObj = nextObjNum++;
    const contentObj = nextObjNum++;
    pageObjNumbers.push(pageObj);

    startObj(pageObj);
    appendAscii(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObj} 0 R >>\nendobj\n`
    );

    startObj(contentObj);
    appendAscii(`<< /Length ${streamBytes.length} >>\nstream\n`);
    appendBytes(streamBytes);
    appendAscii('\nendstream\nendobj\n');
  }

  startObj(2);
  appendAscii(
    `<< /Type /Pages /Kids [${pageObjNumbers.map((n: number) => `${n} 0 R`).join(' ')}] /Count ${pageObjNumbers.length} >>\nendobj\n`
  );

  const xrefStart = pdfBytes.length;
  appendAscii(`xref\n0 ${nextObjNum}\n`);
  appendAscii('0000000000 65535 f \n');
  for (let i = 1; i < nextObjNum; i++) {
    const offStr = String(offsets[i]).padStart(10, '0');
    appendAscii(`${offStr} 00000 n \n`);
  }

  appendAscii(
    `trailer\n<< /Size ${nextObjNum} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  );

  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeDni = (participant.dni || 'Participante').replace(/[^a-zA-Z0-9_-]/g, '');
  link.href = url;
  link.download = `Reporte_Integral_MIDIS_${safeDni}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

// ============================================================================
// ESCUDO DE PROTECCIÓN CONTRA PANTALLA EN BLANCO EN VISTA DOCENTE
// ============================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onExit: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class TeacherErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
          <div className="bg-white border border-rose-200 rounded-2xl max-w-md w-full p-6 shadow-sm space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
            <h2 className="text-base font-bold text-slate-900">
              Se detectó un dato incompatible al renderizar el panel
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              La aplicación evitó el cierre visual de la página. Puedes recargar la vista o volver al simulador.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Reintentar vista docente
              </button>
              <button
                type="button"
                onClick={this.props.onExit}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium"
              >
                Volver al simulador
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// EMBLEMA OFICIAL DEL MIDIS (SOPORTE PNG SIN RECORTES + RESPALDO VECTORIAL)
// ============================================================================

interface MidisEmblemProps {
  customLogoUrl?: string | null;
  onDoubleClick?: () => void;
  compact?: boolean;
}

const MidisOfficialEmblem: React.FC<MidisEmblemProps> = ({
  customLogoUrl,
  onDoubleClick,
  compact = false,
}) => {
  const candidateSources = useMemo(() => {
    const list: string[] = [];
    if (customLogoUrl) list.push(customLogoUrl);
    list.push('./logo-midis.png', '/logo-midis.png', './MIDIS.png', '/MIDIS.png', './MIDIS (1).png');
    return list;
  }, [customLogoUrl]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [useVectorFallback, setUseVectorFallback] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setUseVectorFallback(false);
  }, [customLogoUrl]);

  const handleImageError = () => {
    if (sourceIndex + 1 < candidateSources.length) {
      setSourceIndex((prev: number) => prev + 1);
    } else {
      setUseVectorFallback(true);
    }
  };

  if (!useVectorFallback) {
    return (
      <div
        onDoubleClick={onDoubleClick}
        title="Ministerio de Desarrollo e Inclusión Social"
        className="inline-flex items-center bg-white rounded-md border border-slate-200 px-2 py-1 shadow-xs select-none cursor-pointer"
      >
        <img
          src={candidateSources[sourceIndex]}
          alt="Ministerio de Desarrollo e Inclusión Social - MIDIS"
          onError={handleImageError}
          className={`${compact ? 'h-10' : 'h-12 sm:h-14'} w-auto max-w-[270px] object-contain`}
        />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={onDoubleClick}
      title="Ministerio de Desarrollo e Inclusión Social"
      className="inline-flex items-stretch rounded-sm overflow-hidden border border-slate-300 shadow-xs select-none cursor-pointer bg-white"
      style={{ height: compact ? '44px' : '54px' }}
    >
      <div className="flex flex-col items-center justify-center bg-white px-2.5 py-1 border-r border-slate-200">
        <span className="text-[6.5px] font-bold tracking-wider text-slate-800 leading-none mb-0.5">
          REPÚBLICA DEL PERÚ
        </span>
        <svg viewBox="0 0 48 44" className="w-7 h-7" aria-hidden="true">
          <path d="M10 10 C6 16, 6 28, 12 34" stroke="#15803d" strokeWidth="2.5" fill="none" />
          <path d="M38 10 C42 16, 42 28, 36 34" stroke="#15803d" strokeWidth="2.5" fill="none" />
          <circle cx="24" cy="6" r="3.5" fill="#16a34a" />
          <path
            d="M14 11 H34 V24 C34 31, 24 37, 24 37 C24 37, 14 31, 14 24 Z"
            fill="#ffffff"
            stroke="#b91c1c"
            strokeWidth="2"
          />
          <rect x="15.5" y="12.5" width="8.5" height="9.5" fill="#38bdf8" />
          <rect x="24" y="12.5" width="8.5" height="9.5" fill="#ffffff" />
          <path d="M15.5 22 H32.5 V25 C32.5 30, 24 35, 24 35 C24 35, 15.5 30, 15.5 25 Z" fill="#dc2626" />
          <circle cx="24" cy="27.5" r="2.2" fill="#facc15" />
        </svg>
      </div>

      <div className="flex items-center justify-center bg-[#D91023] px-3.5">
        <span className="text-white font-extrabold tracking-wide text-base sm:text-lg leading-none">
          PERÚ
        </span>
      </div>

      <div className="flex flex-col justify-center bg-[#575756] px-3.5 py-1 text-left">
        <span className="text-white font-semibold text-[11px] sm:text-xs leading-tight whitespace-nowrap">
          Ministerio de Desarrollo
        </span>
        <span className="text-white font-semibold text-[11px] sm:text-xs leading-tight whitespace-nowrap">
          e Inclusión Social
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN (v5.0.1)
// ============================================================================

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validUrl =
          typeof parsed.googleSheetsUrl === 'string' &&
          parsed.googleSheetsUrl.trim().startsWith('https://script.google.com/')
            ? parsed.googleSheetsUrl.trim()
            : FIXED_APPS_SCRIPT_URL;
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          googleSheetsUrl: validUrl,
        };
      }
    } catch {
      // Ignorar error de lectura
    }
    return DEFAULT_CONFIG;
  });

  const [cohort, setCohort] = useState<ParticipantRecord[]>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEYS.COHORT) ??
        localStorage.getItem(STORAGE_KEYS.LEGACY_COHORT);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .map((rawItem: unknown) => normalizeParticipantRecord(rawItem))
            .filter(
              (item: ParticipantRecord | null): item is ParticipantRecord => item !== null
            );
        }
      }
    } catch {
      // Ignorar error
    }
    return [];
  });

  const [activeSession, setActiveSession] = useState<ParticipantRecord | null>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION) ??
        localStorage.getItem(STORAGE_KEYS.LEGACY_ACTIVE_SESSION);
      if (saved) {
        return normalizeParticipantRecord(JSON.parse(saved));
      }
    } catch {
      // Ignorar error
    }
    return null;
  });

  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState('');

  const allQuestions = useMemo(
    () => CASES_DATA.flatMap((c: CaseScenario) => c.questions),
    []
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    if (activeSession) {
      const answeredCount = Object.keys(activeSession.answers).length;
      return Math.min(answeredCount, 11);
    }
    return 0;
  });

  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [justificationText, setJustificationText] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [showIntegralReportModal, setShowIntegralReportModal] = useState(false);

  const [closingCountdown, setClosingCountdown] = useState<number | null>(null);

  const feedbackPanelRef = useRef<HTMLDivElement | null>(null);

  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState(false);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [loginUserInput, setLoginUserInput] = useState('');
  const [loginPassInput, setLoginPassInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [teacherTab, setTeacherTab] = useState<'resultados' | 'configuracion'>('resultados');

  const [sheetsStatus, setSheetsStatus] = useState<'idle' | 'syncing' | 'connected' | 'error'>('idle');
  const [sheetsStatusMessage, setSheetsStatusMessage] = useState('');
  const [sheetsUrlDraft, setSheetsUrlDraft] = useState(config.googleSheetsUrl);
  const [teacherUserDraft, setTeacherUserDraft] = useState(config.teacherUser);
  const [teacherPassDraft, setTeacherPassDraft] = useState(config.teacherPass);
  const [configSavedNotice, setConfigSavedNotice] = useState('');

  const isSyncingRef = useRef(false);

  const isSheetsConfigured = useMemo(() => {
    const url = (config.googleSheetsUrl || '').trim();
    return url.startsWith('https://') && !url.includes('PEGA_AQUI_TU_URL');
  }, [config.googleSheetsUrl]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch {
      // Ignorar
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COHORT, JSON.stringify(cohort));
    } catch {
      // Ignorar
    }
  }, [cohort]);

  useEffect(() => {
    try {
      if (activeSession) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      }
    } catch {
      // Ignorar
    }
  }, [activeSession]);

  useEffect(() => {
    if (closingCountdown === null) return;

    if (closingCountdown <= 0) {
      setClosingCountdown(null);
      try {
        window.close();
      } catch {
        // Bloqueado por política de seguridad del navegador
      }
      setShowIntegralReportModal(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setClosingCountdown((prev: number | null) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [closingCountdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (isTeacherAuthenticated) {
          setIsTeacherAuthenticated(false);
        } else {
          setIsTeacherLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTeacherAuthenticated]);

  const currentQuestion = allQuestions[currentQuestionIndex] || allQuestions[0];
  const currentCase =
    CASES_DATA.find((c: CaseScenario) => c.id === currentQuestion.caseId) || CASES_DATA[0];
  const existingAnswer = activeSession ? activeSession.answers[currentQuestion.id] : undefined;

  useEffect(() => {
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedOption);
      setJustificationText(existingAnswer.justification);
    } else {
      setSelectedOption(null);
      setJustificationText('');
    }
  }, [currentQuestion.id, existingAnswer]);

  // ============================================================================
  // CONECTOR CON GOOGLE SHEETS (CON TIMEOUT DE 8s Y CONTROL ANTI-BUCLE)
  // ============================================================================

  const pushParticipantToSheets = async (record: ParticipantRecord) => {
    if (!isSheetsConfigured) return;
    const answeredCount = Object.keys(record.answers).length;
    const payload = {
      action: 'upsert',
      row: {
        id: record.id,
        fullName: record.fullName,
        dni: record.dni,
        email: record.email,
        startedAtFormatted: formatTimestamp(record.startedAt),
        completedAtFormatted: record.completedAt ? formatTimestamp(record.completedAt) : 'En curso',
        progress: `${answeredCount} / 12`,
        status: answeredCount >= 12 ? 'Completado' : 'En curso',
        case1: Number(record.case1Score.toFixed(1)),
        case2: Number(record.case2Score.toFixed(1)),
        case3: Number(record.case3Score.toFixed(1)),
        total: Number(record.totalScore.toFixed(1)),
        level: record.level,
        rawRecord: record,
      },
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      await fetch(config.googleSheetsUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch {
      // Respaldo silencioso
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const pullCohortFromSheets = async (overrideUrl?: string) => {
    if (isSyncingRef.current) return;

    const targetUrl = (overrideUrl ?? config.googleSheetsUrl).trim();
    if (!targetUrl.startsWith('https://') || targetUrl.includes('PEGA_AQUI_TU_URL')) {
      setSheetsStatus('idle');
      setSheetsStatusMessage('Modo local activo (sin URL de Google Sheets configurada).');
      return;
    }

    isSyncingRef.current = true;
    setSheetsStatus('syncing');
    setSheetsStatusMessage('Sincronizando registros con Google Sheets...');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const separator = targetUrl.includes('?') ? '&' : '?';
      const response = await fetch(`${targetUrl}${separator}t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { status?: string; records?: unknown[]; rows?: unknown[] } =
        await response.json();
      const rawList: unknown[] | null = Array.isArray(data?.records)
        ? data.records
        : Array.isArray(data?.rows)
          ? data.rows
          : null;

      if (data && data.status === 'ok' && rawList !== null) {
        const remoteRecords: ParticipantRecord[] = rawList
          .map((rawItem: unknown) => normalizeParticipantRecord(rawItem))
          .filter(
            (item: ParticipantRecord | null): item is ParticipantRecord => item !== null
          );

        setCohort((prevLocal: ParticipantRecord[]) => {
          const mergedMap = new Map<string, ParticipantRecord>();
          prevLocal.forEach((item: ParticipantRecord) => mergedMap.set(item.id, item));
          remoteRecords.forEach((item: ParticipantRecord) => {
            mergedMap.set(item.id, item);
          });
          return Array.from(mergedMap.values());
        });

        setSheetsStatus('connected');
        setSheetsStatusMessage(`Google Sheets Conectado (${remoteRecords.length} registros en nube).`);
      } else {
        setSheetsStatus('error');
        setSheetsStatusMessage('Respuesta inesperada de Google Apps Script.');
      }
    } catch (err: unknown) {
      setSheetsStatus('error');
      const isAbort = err instanceof Error && err.name === 'AbortError';
      setSheetsStatusMessage(
        isAbort
          ? 'Tiempo de espera agotado (8s). Pulsa "Sincronizar Sheets" para reintentar.'
          : 'No se pudo conectar con Google Sheets. Verifica acceso ("Cualquier persona").'
      );
    } finally {
      window.clearTimeout(timeoutId);
      isSyncingRef.current = false;
    }
  };

  useEffect(() => {
    if (isTeacherAuthenticated && isSheetsConfigured) {
      pullCohortFromSheets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacherAuthenticated]);

  // ============================================================================
  // MANEJADORES DEL PARTICIPANTE
  // ============================================================================

  const handleStartSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = fullName.trim();
    const cleanDni = dni.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 4) {
      setFormError('Ingresa tu nombre completo (mínimo 4 caracteres).');
      return;
    }
    if (!/^\d{8}$/.test(cleanDni)) {
      setFormError('El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError('Ingresa un correo electrónico institucional o personal válido.');
      return;
    }
    if (!consent) {
      setFormError('Debes aceptar el consentimiento de registro para iniciar el taller.');
      return;
    }

    const nowIso = new Date().toISOString();
    const newRecord: ParticipantRecord = {
      id: `${cleanDni}-${Date.now()}`,
      fullName: cleanName,
      dni: cleanDni,
      email: cleanEmail,
      consent: true,
      startedAt: nowIso,
      completedAt: null,
      answers: {},
      totalScore: 0,
      case1Score: 0,
      case2Score: 0,
      case3Score: 0,
      level: 'En curso',
    };

    setActiveSession(newRecord);
    setCohort((prev: ParticipantRecord[]) => [
      newRecord,
      ...prev.filter((p: ParticipantRecord) => p.id !== newRecord.id),
    ]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setJustificationText('');

    void pushParticipantToSheets(newRecord);
  };

  const validWordCount = useMemo(
    () => countValidSpanishWords(justificationText),
    [justificationText]
  );

  const canGradeCurrentQuestion =
    Boolean(activeSession) &&
    !existingAnswer &&
    !isGrading &&
    selectedOption !== null &&
    validWordCount >= 10;

  const handleGradeCurrentQuestion = async () => {
    if (!activeSession || !selectedOption || existingAnswer || validWordCount < 10) return;

    setIsGrading(true);

    await new Promise((resolve) => setTimeout(resolve, 380));

    const evaluation = evaluateSocraticFeedback(
      currentQuestion,
      selectedOption,
      justificationText.trim()
    );

    const newAnswer: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOption,
      justification: justificationText.trim(),
      isCorrect: evaluation.isCorrect,
      pointsEarned: evaluation.pointsEarned,
      answeredAt: new Date().toISOString(),
      feedback: evaluation.feedback,
    };

    const updatedAnswers: Record<string, AnswerRecord> = {
      ...activeSession.answers,
      [currentQuestion.id]: newAnswer,
    };

    const calcCaseScore = (caseId: number) =>
      CASES_DATA.find((c: CaseScenario) => c.id === caseId)!.questions.reduce(
        (acc: number, q: CaseQuestion) => acc + (updatedAnswers[q.id]?.pointsEarned || 0),
        0
      );

    const case1Score = calcCaseScore(1);
    const case2Score = calcCaseScore(2);
    const case3Score = calcCaseScore(3);
    const totalScore = Number((case1Score + case2Score + case3Score).toFixed(1));
    const answeredCount = Object.keys(updatedAnswers).length;
    const isFinished = answeredCount >= 12;

    const updatedRecord: ParticipantRecord = {
      ...activeSession,
      answers: updatedAnswers,
      case1Score,
      case2Score,
      case3Score,
      totalScore,
      completedAt: isFinished ? activeSession.completedAt || new Date().toISOString() : null,
      level: computePerformanceLevel(totalScore),
    };

    setActiveSession(updatedRecord);
    setCohort((prev: ParticipantRecord[]) => {
      const exists = prev.some((p: ParticipantRecord) => p.id === updatedRecord.id);
      if (exists) {
        return prev.map((p: ParticipantRecord) => (p.id === updatedRecord.id ? updatedRecord : p));
      }
      return [updatedRecord, ...prev];
    });

    void pushParticipantToSheets(updatedRecord);

    setIsGrading(false);

    setTimeout(() => {
      feedbackPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleAdvanceNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setClosingCountdown(null);
      setShowIntegralReportModal(true);
    }
  };

  const handleDownloadDirectPdf = (record: ParticipantRecord, startAutoCloseCountdown = false) => {
    downloadDirectPdfReport(record, config);
    if (startAutoCloseCountdown) {
      setClosingCountdown(10);
    }
  };

  // ============================================================================
  // MANEJADORES DE VISTA DOCENTE
  // ============================================================================

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (
      loginUserInput.trim() === config.teacherUser &&
      loginPassInput === config.teacherPass
    ) {
      setIsTeacherAuthenticated(true);
      setIsTeacherLoginOpen(false);
      setLoginUserInput('');
      setLoginPassInput('');
    } else {
      setLoginError('Usuario o contraseña institucional incorrectos.');
    }
  };

  const handleExportExcelCsv = () => {
    const headers = [
      'Participante',
      'DNI',
      'Correo Electrónico',
      'Hora de ingreso',
      'Hora de fin',
      'Progreso',
      'Caso 1 (6.5 pts)',
      'Caso 2 (6.5 pts)',
      'Caso 3 (7.0 pts)',
      'Puntaje Total (20 pts)',
      'Nivel de Desempeño',
      ...allQuestions.flatMap((q: CaseQuestion) => [
        `P${q.number} Respuesta`,
        `P${q.number} Puntos`,
        `P${q.number} Sustento`,
      ]),
    ];

    const escapeCsv = (val: unknown) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = cohort.map((p: ParticipantRecord) => {
      const answeredCount = Object.keys(p.answers || {}).length;
      return [
        p.fullName,
        `="${p.dni}"`,
        p.email,
        formatTimestamp(p.startedAt),
        p.completedAt ? formatTimestamp(p.completedAt) : 'En curso',
        `${answeredCount} / 12`,
        (Number(p.case1Score) || 0).toFixed(1),
        (Number(p.case2Score) || 0).toFixed(1),
        (Number(p.case3Score) || 0).toFixed(1),
        (Number(p.totalScore) || 0).toFixed(1),
        p.level,
        ...allQuestions.flatMap((q: CaseQuestion) => {
          const ans = p.answers?.[q.id];
          return ans
            ? [ans.selectedOption, (Number(ans.pointsEarned) || 0).toFixed(1), ans.justification]
            : ['-', '0.0', ''];
        }),
      ]
        .map(escapeCsv)
        .join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resultados_Integridad_MIDIS_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetPlatform = async () => {
    const confirmed = window.confirm(
      '¿Confirmas reiniciar la plataforma? Se limpiarán todos los registros locales y de Google Sheets dejando la tabla en 0 participantes.'
    );
    if (!confirmed) return;

    setCohort([]);
    setActiveSession(null);
    localStorage.removeItem(STORAGE_KEYS.COHORT);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_COHORT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_ACTIVE_SESSION);

    if (isSheetsConfigured) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);
      try {
        await fetch(config.googleSheetsUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'clear' }),
          signal: controller.signal,
        });
        setSheetsStatus('connected');
        setSheetsStatusMessage('Plataforma y Google Sheets reiniciados a 0 participantes.');
      } catch {
        setSheetsStatusMessage('Tabla local reiniciada. Verifica limpieza manual en Google Sheets.');
      } finally {
        window.clearTimeout(timeoutId);
      }
    }
  };

  const handleRestoreDemo = () => {
    setCohort(DEMO_COHORT);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxHeight = 140;
        const scale = Math.min(1, maxHeight / img.height);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const optimizedDataUrl = canvas.toDataURL('image/png', 0.92);
          setConfig((prev: AppConfig) => ({ ...prev, customLogoDataUrl: optimizedDataUrl }));
          setConfigSavedNotice('Logotipo institucional optimizado y guardado correctamente.');
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInstitutionSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppConfig = {
      ...config,
      googleSheetsUrl: sheetsUrlDraft.trim() || FIXED_APPS_SCRIPT_URL,
      teacherUser: teacherUserDraft.trim() || DEFAULT_CONFIG.teacherUser,
      teacherPass: teacherPassDraft || DEFAULT_CONFIG.teacherPass,
    };
    setConfig(updated);
    setConfigSavedNotice('Configuración guardada correctamente.');
    if (
      updated.googleSheetsUrl.startsWith('https://') &&
      !updated.googleSheetsUrl.includes('PEGA_AQUI_TU_URL')
    ) {
      await pullCohortFromSheets(updated.googleSheetsUrl);
    }
    setTimeout(() => setConfigSavedNotice(''), 4000);
  };

  // ============================================================================
  // RENDERIZADO: VISTA DOCENTE
  // ============================================================================

  if (isTeacherAuthenticated) {
    const safeCohort = Array.isArray(cohort) ? cohort : [];
    const completedCount = safeCohort.filter(
      (p: ParticipantRecord) => Object.keys(p.answers || {}).length >= 12
    ).length;
    const averageScore =
      safeCohort.length > 0
        ? safeCohort.reduce(
            (sum: number, p: ParticipantRecord) => sum + (Number(p.totalScore) || 0),
            0
          ) / safeCohort.length
        : 0;

    return (
      <TeacherErrorBoundary onExit={() => setIsTeacherAuthenticated(false)}>
        <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
          <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MidisOfficialEmblem customLogoUrl={config.customLogoDataUrl} compact />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                      Panel Docente / Facilitador
                    </span>
                    {isSheetsConfigured ? (
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          sheetsStatus === 'connected'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : sheetsStatus === 'syncing'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700'
                              : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}
                      >
                        <Cloud className="w-3.5 h-3.5" />
                        {sheetsStatus === 'connected'
                          ? 'Google Sheets Conectado'
                          : sheetsStatus === 'syncing'
                            ? 'Sincronizando...'
                            : 'Revisar conexión Sheets'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        <CloudOff className="w-3.5 h-3.5" />
                        Modo Local
                      </span>
                    )}
                  </div>
                  <h1 className="text-sm sm:text-base font-bold mt-1">{config.workshopTitle}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTeacherTab('resultados')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition ${
                    teacherTab === 'resultados'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Resultados ({safeCohort.length})
                </button>
                <button
                  onClick={() => setTeacherTab('configuracion')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 transition ${
                    teacherTab === 'configuracion'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Configuración y Marca
                </button>
                <button
                  onClick={() => setIsTeacherAuthenticated(false)}
                  className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-1">
            {teacherTab === 'resultados' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                      <span>Participantes Registrados</span>
                      <Users className="w-4 h-4 text-slate-700" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {safeCohort.length}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {completedCount} completaron las 12 preguntas
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                      <span>Promedio General (Base 20)</span>
                      <Award className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {averageScore.toFixed(1)}{' '}
                      <span className="text-sm font-normal text-slate-500">/ 20.0 pts</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Evaluación automática ponderada
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                      <span>Estado de Base de Datos</span>
                      <Database className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-sm font-bold text-slate-800 mt-1.5">
                      {sheetsStatusMessage ||
                        (isSheetsConfigured ? 'Listo para sincronizar' : 'Almacenamiento local')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Sincronización controlada con Google Sheets
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => pullCohortFromSheets()}
                      disabled={!isSheetsConfigured || sheetsStatus === 'syncing'}
                      className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white flex items-center gap-1.5 transition"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${sheetsStatus === 'syncing' ? 'animate-spin' : ''}`}
                      />
                      Sincronizar Sheets
                    </button>

                    <button
                      onClick={handleExportExcelCsv}
                      disabled={safeCohort.length === 0}
                      className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white flex items-center gap-1.5 transition"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Excel (CSV)
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleRestoreDemo}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar Demo
                    </button>
                    <button
                      onClick={handleResetPlatform}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Reiniciar Plataforma
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                      Resultados por Participante
                    </h2>
                    <span className="text-xs text-slate-500">
                      Incluye marcas de tiempo de ingreso y culminación
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600">
                          <th className="py-3 px-3">Participante</th>
                          <th className="py-3 px-3">DNI</th>
                          <th className="py-3 px-3">Hora de ingreso</th>
                          <th className="py-3 px-3">Hora de fin</th>
                          <th className="py-3 px-3">Progreso</th>
                          <th className="py-3 px-3 text-right">C1</th>
                          <th className="py-3 px-3 text-right">C2</th>
                          <th className="py-3 px-3 text-right">C3</th>
                          <th className="py-3 px-3 text-right">Total / 20</th>
                          <th className="py-3 px-3 text-center">Reporte</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                        {safeCohort.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-10 px-4 text-center text-slate-500">
                              No hay participantes registrados aún (0 registros). Comparte el enlace
                              del simulador o presiona <strong>Sincronizar Sheets</strong>.
                            </td>
                          </tr>
                        ) : (
                          safeCohort.map((p: ParticipantRecord) => {
                            const answered = Object.keys(p.answers || {}).length;
                            return (
                              <tr key={p.id} className="hover:bg-slate-50">
                                <td className="py-3 px-3">
                                  <div className="font-semibold text-slate-900">{p.fullName}</div>
                                  <div className="text-xs text-slate-500">{p.email}</div>
                                </td>
                                <td className="py-3 px-3 font-mono text-xs text-slate-700">
                                  {p.dni}
                                </td>
                                <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">
                                  {formatTimestamp(p.startedAt)}
                                </td>
                                <td className="py-3 px-3 text-xs whitespace-nowrap">
                                  {p.completedAt ? (
                                    <span className="text-slate-700 font-medium">
                                      {formatTimestamp(p.completedAt)}
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 font-medium">En curso</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-xs font-medium">
                                  <span
                                    className={`px-2 py-0.5 rounded-full ${
                                      answered >= 12
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {answered} / 12
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right text-xs">
                                  {(Number(p.case1Score) || 0).toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-right text-xs">
                                  {(Number(p.case2Score) || 0).toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-right text-xs">
                                  {(Number(p.case3Score) || 0).toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                                  {(Number(p.totalScore) || 0).toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <button
                                    onClick={() => handleDownloadDirectPdf(p, false)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    PDF
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Configuración Institucional, Marca y Conexión Google Sheets
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Personaliza el logotipo oficial, las credenciales docentes y la URL de
                    sincronización en nube.
                  </p>
                </div>

                {configSavedNotice && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {configSavedNotice}
                  </div>
                )}

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                  <div className="text-xs font-bold uppercase text-slate-700">
                    Logotipo Institucional Actual
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <MidisOfficialEmblem customLogoUrl={config.customLogoDataUrl} />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        Subir PNG/JPG oficial
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                      {config.customLogoDataUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev: AppConfig) => ({ ...prev, customLogoDataUrl: null }))
                          }
                          className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Usar emblema base
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveInstitutionSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL de Aplicación Web de Google Apps Script (/exec)
                    </label>
                    <input
                      type="text"
                      value={sheetsUrlDraft}
                      onChange={(e) => setSheetsUrlDraft(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Usuario Docente
                      </label>
                      <input
                        type="text"
                        value={teacherUserDraft}
                        onChange={(e) => setTeacherUserDraft(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Clave Docente
                      </label>
                      <input
                        type="text"
                        value={teacherPassDraft}
                        onChange={(e) => setTeacherPassDraft(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
                  >
                    Guardar configuración y probar conexión
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </TeacherErrorBoundary>
    );
  }

  // ============================================================================
  // RENDERIZADO: VISTA PARTICIPANTE
  // ============================================================================

  const answeredCount = activeSession ? Object.keys(activeSession.answers).length : 0;
  const maxUnlockedIndex = Math.min(answeredCount, allQuestions.length - 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MidisOfficialEmblem
              customLogoUrl={config.customLogoDataUrl}
              onDoubleClick={() => setIsTeacherLoginOpen(true)}
            />
            <div className="border-l border-slate-200 pl-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-red-700">
                Taller Virtual de Integridad Pública
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {config.workshopTitle}
              </h1>
            </div>
          </div>

          {activeSession && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>
                  Puntaje acumulado ({answeredCount}/12): {activeSession.totalScore.toFixed(1)} /
                  20.0 pts
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDownloadDirectPdf(activeSession, false)}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Ver Reporte Integral
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex-1">
        {!activeSession ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                Simulador de Toma de Decisiones Éticas en Territorio
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Identificación del Participante
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Completa tus datos para iniciar el análisis de los 3 casos prácticos articulados
                con los servicios y Programas Sociales del MIDIS.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-red-600 shrink-0" />
                    Regla 1: Intento único y avance secuencial
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Cada una de las 12 preguntas admite un solo intento puntuable (20.0 pts en
                    total), requiere sustento obligatorio y desbloquea la siguiente pregunta al
                    calificarse.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    Regla 2: Retroalimentación y reporte integral
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Recibirás retroalimentación socrática inmediata por cada decisión y podrás
                    descargar tu Reporte Integral en PDF con recomendaciones territoriales.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleStartSimulation} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. María Elena Torres Quispe"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      DNI (8 dígitos) *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={8}
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      placeholder="Ej. 45891234"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@entidad.gob.pe"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Autorizo el registro de mis respuestas, puntaje y marcas horarias con fines
                    académicos y de seguimiento del taller virtual del MIDIS.
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition"
                >
                  Iniciar Simulador de Casos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="text-xs font-bold text-slate-700">
                  Progreso secuencial: {answeredCount} de 12 preguntas calificadas
                </div>
                <div className="text-xs text-slate-500">
                  Pregunta actual: <strong className="text-slate-900">{currentQuestion.number}</strong>{' '}
                  ({currentQuestion.points.toFixed(1)} pts)
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {allQuestions.map((q: CaseQuestion, idx: number) => {
                  const ans = activeSession.answers[q.id];
                  const isUnlocked = idx <= maxUnlockedIndex;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => isUnlocked && setCurrentQuestionIndex(idx)}
                      title={
                        isUnlocked
                          ? `Pregunta ${q.number}${ans ? ` (${ans.pointsEarned.toFixed(1)} pts)` : ''}`
                          : 'Bloqueada: responde primero la pregunta anterior'
                      }
                      className={`py-1.5 px-1 rounded-lg text-xs font-bold border flex items-center justify-center gap-1 transition ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-red-500/40'
                          : ans
                            ? ans.isCorrect
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                            : isUnlocked
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      {!isUnlocked && <Lock className="w-3 h-3" />}
                      <span>{q.number}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-red-600 text-white">
                    {currentCase.code}
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5">
                    {currentCase.title}
                  </h2>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 max-w-md">
                  <strong>Rol protagonista:</strong> {currentCase.protagonistRole}
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                {currentCase.paragraphs.map((paragraph: string, pIdx: number) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold">
                    Pregunta {currentQuestion.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {currentQuestion.focusArea}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                  Valor: {currentQuestion.points.toFixed(1)} pts (Intento único)
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion.prompt}
              </h3>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt: QuestionOption) => {
                  const isSelected = selectedOption === opt.id;
                  const isAnswered = Boolean(existingAnswer);
                  const isRightKey = opt.id === currentQuestion.correctOption;

                  let optionStyle =
                    'border-slate-200 bg-white hover:border-slate-400 text-slate-800';
                  if (isAnswered) {
                    if (isRightKey) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950';
                    } else if (isSelected && !isRightKey) {
                      optionStyle = 'border-rose-500 bg-rose-50/80 text-rose-950';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50 text-slate-500 opacity-75';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-red-600 bg-red-50/60 text-slate-950 ring-1 ring-red-600';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnswered || isGrading}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${optionStyle}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                          isAnswered && isRightKey
                            ? 'bg-emerald-600 text-white'
                            : isAnswered && isSelected && !isRightKey
                              ? 'bg-rose-600 text-white'
                              : isSelected
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed flex-1">{opt.text}</span>
                      {isAnswered && isRightKey && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isSelected && !isRightKey && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800">
                    Sustento técnico-normativo de tu decisión (obligatorio para calificar) *
                  </label>
                  <span
                    className={`text-xs font-semibold ${
                      validWordCount >= 10 ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {validWordCount} palabras válidas (mínimo 10)
                  </span>
                </div>
                <textarea
                  rows={3}
                  disabled={Boolean(existingAnswer) || isGrading}
                  value={justificationText}
                  onChange={(e) => setJustificationText(e.target.value)}
                  placeholder="Redacta con tus propias palabras el fundamento ético, normativo y operativo de tu elección (mínimo 10 palabras reales en español)..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-slate-100 disabled:text-slate-700"
                />
              </div>

              {!existingAnswer && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev: number) => Math.max(0, prev - 1))}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs sm:text-sm font-medium text-slate-700 inline-flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <button
                    type="button"
                    disabled={!canGradeCurrentQuestion}
                    onClick={handleGradeCurrentQuestion}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500 text-white text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2 transition"
                  >
                    {isGrading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Evaluando sustento técnico-normativo y generando retroalimentación...
                      </>
                    ) : (
                      <>
                        Calificar decisión y recibir retroalimentación
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {existingAnswer && (
                <div
                  ref={feedbackPanelRef}
                  className={`rounded-2xl border-2 p-5 space-y-4 ${
                    existingAnswer.isCorrect
                      ? 'border-emerald-300 bg-emerald-50/70'
                      : 'border-amber-300 bg-amber-50/70'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      {existingAnswer.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-700" />
                      )}
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        Retroalimentación Socrática y Normativa
                      </h4>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        existingAnswer.isCorrect
                          ? 'bg-emerald-700 text-white'
                          : 'bg-rose-700 text-white'
                      }`}
                    >
                      Puntaje obtenido: +{existingAnswer.pointsEarned.toFixed(1)} /{' '}
                      {currentQuestion.points.toFixed(1)} pts
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <div className="bg-white/90 rounded-xl p-3.5 border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1">
                        1. Valoración de tu decisión y sustento:
                      </div>
                      <p>{existingAnswer.feedback.recognition}</p>
                    </div>

                    <div className="bg-white/90 rounded-xl p-3.5 border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-red-600" />
                        2. Complemento técnico-normativo (Rúbrica):
                      </div>
                      <p>{existingAnswer.feedback.complement}</p>
                    </div>

                    <div className="bg-slate-900 text-white rounded-xl p-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                        3. Pregunta Socrática de Profundización
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {existingAnswer.feedback.socraticQuestion}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev: number) => Math.max(0, prev - 1))}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs sm:text-sm font-medium text-slate-700 inline-flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Pregunta anterior
                    </button>

                    <button
                      type="button"
                      onClick={handleAdvanceNextQuestion}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2 transition"
                    >
                      {currentQuestionIndex < allQuestions.length - 1 ? (
                        <>
                          Siguiente pregunta
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Finalizar y ver Reporte Integral
                          <Award className="w-4 h-4 text-amber-400" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {showIntegralReportModal && activeSession && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-700">
              <Award className="w-7 h-7" />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  ¡Simulador Completado!
                </h3>
                <p className="text-xs text-slate-500">
                  Resultados registrados correctamente en el sistema del taller.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Participante:</span>
                <strong className="text-slate-900">{activeSession.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Calificación final:</span>
                <strong className="text-red-700 text-base">
                  {activeSession.totalScore.toFixed(1)} / 20.0 pts
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nivel alcanzado:</span>
                <strong className="text-slate-900 text-xs">{activeSession.level}</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                <span>Ingreso: {formatTimestamp(activeSession.startedAt)}</span>
                <span>Fin: {formatTimestamp(activeSession.completedAt)}</span>
              </div>
            </div>

            {closingCountdown !== null && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Reporte PDF descargado en tu equipo.
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-mono">
                    {closingCountdown}s
                  </span>
                </div>
                <p className="text-xs text-emerald-800">
                  Finalizando ventana en <strong>{closingCountdown} segundos</strong> y regresando
                  al simulador...
                </p>
                <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-1000 ease-linear"
                    style={{ width: `${(closingCountdown / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setClosingCountdown(null);
                  setShowIntegralReportModal(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {closingCountdown !== null ? 'Regresar ahora al simulador' : 'Revisar respuestas'}
              </button>
              <button
                type="button"
                onClick={() => handleDownloadDirectPdf(activeSession, true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Descargar Reporte Integral (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {isTeacherLoginOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900 text-base">Acceso Vista Docente</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTeacherLoginOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleTeacherLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={loginUserInput}
                  onChange={(e) => setLoginUserInput(e.target.value)}
                  placeholder="docente.midis"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={loginPassInput}
                    onChange={(e) => setLoginPassInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((prev: boolean) => !prev)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition"
              >
                Ingresar al Panel Docente
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{config.institutionName} — Taller Virtual de Integridad Pública</span>
          </div>
          <button
            type="button"
            onClick={() => setIsTeacherLoginOpen(true)}
            className="text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 transition"
            title="Acceso facilitador (Alt + D)"
          >
            <Lock className="w-3 h-3" />
            <span>Docente</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
