import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShieldCheck,
  UserCheck,
  FileText,
  Award,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  ArrowRight,
  RotateCcw,
  Download,
  Printer,
  BarChart3,
  Settings,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Clock,
  LogOut,
  Users,
  Sparkles,
  Upload,
  Check,
  Eye,
  X,
  RefreshCw,
  Database,
} from 'lucide-react';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

interface OptionItem {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

interface RubricCriteria {
  keywords: string[];
  deepeningQuestion: string;
  remediationQuestion: string;
  normativeBasis: string;
}

interface QuestionItem {
  id: string;
  number: string;
  title: string;
  prompt: string;
  points: number;
  correctOption: 'A' | 'B' | 'C' | 'D';
  options: OptionItem[];
  rubric: RubricCriteria;
}

interface CaseStudy {
  id: string;
  number: number;
  title: string;
  theme: string;
  governmentLevel: string;
  articulation: string;
  protagonistRole: string;
  secondaryActors: string[];
  scenario: string[];
  criticalDilemma: string;
  maxPoints: number;
  questions: QuestionItem[];
}

interface AnswerRecord {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  justification: string;
  isCorrect: boolean;
  pointsEarned: number;
  socraticFeedback: string;
  answeredAt: string;
}

interface ParticipantRecord {
  id: string;
  fullName: string;
  dni: string;
  email: string;
  startedAt: string;
  completedAt: string | null;
  answers: Record<string, AnswerRecord>;
}

interface AppConfig {
  workshopTitle: string;
  institutionName: string;
  customLogoDataUrl: string;
  teacherUsername: string;
  teacherPassword: string;
  googleSheetsUrl: string;
}

// ============================================================================
// CONSTANTES DE CONFIGURACIÓN Y ALMACENAMIENTO
// ============================================================================

const STORAGE_KEYS = {
  COHORT: 'midis_sim_cohort_v3',
  ACTIVE_ID: 'midis_sim_active_id_v3',
  CONFIG: 'midis_sim_config_v3',
};

const LEGACY_KEYS = [
  'midis_sim_cohort_v1',
  'midis_sim_cohort_v2',
  'midis_sim_active_session_v1',
  'midis_sim_active_session_v2',
  'midis_sim_config_v1',
  'midis_sim_config_v2',
];

const DEFAULT_CONFIG: AppConfig = {
  workshopTitle: 'Integridad en la gestión pública para la entrega de servicios',
  institutionName: 'Ministerio de Desarrollo e Inclusión Social (MIDIS)',
  customLogoDataUrl: './logo-midis.png',
  teacherUsername: 'docente.midis',
  teacherPassword: 'Integridad2026',
  // REEMPLAZA EL TEXTO ENTRE COMILLAS CON TU URL /exec DE GOOGLE APPS SCRIPT:
  googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbyeRNHGfIVNwAVlSj6IRuLusmsoMPx-JlFcWXRuo-vkd59SFmnPdCW2_5LgnUFYl4oL3A/exec',
};

// ============================================================================
// UTILIDADES DE FORMATO Y ANÁLISIS SOCRÁTICO
// ============================================================================

const formatTimestamp = (iso?: string | null): string => {
  if (!iso) return 'En curso';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
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

const isValidSheetsUrl = (url?: string): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('https://script.google.com/') &&
    !trimmed.includes('PEGA_AQUI')
  );
};

const analyzeJustificationSocratic = (
  question: QuestionItem,
  isCorrect: boolean,
  justification: string
): string => {
  const normalized = justification.toLowerCase();
  const matchedKeywords = question.rubric.keywords.filter((kw) =>
    normalized.includes(kw.toLowerCase())
  );
  const missingKeywords = question.rubric.keywords.filter(
    (kw) => !normalized.includes(kw.toLowerCase())
  );

  if (isCorrect) {
    if (matchedKeywords.length >= 2) {
      return `Tu sustento incorpora elementos clave de la normativa (${matchedKeywords
        .slice(0, 2)
        .join(', ')}). Para profundizar tu análisis en territorio: ${
        question.rubric.deepeningQuestion
      }`;
    }
    const hintConcept =
      missingKeywords.length > 0
        ? `conceptos como "${missingKeywords[0]}"`
        : 'los plazos y actores responsables';
    return `La alternativa elegida es correcta, pero tu argumentación podría fortalecerse integrando ${hintConcept}. Reflexiona: ${question.rubric.deepeningQuestion}`;
  }

  return `Analicemos el argumento que planteaste a la luz del marco de integridad: ${question.rubric.remediationQuestion}`;
};

// ============================================================================
// BANCO DE 3 CASOS Y 12 PREGUNTAS VALIDADAS (TOTAL: 20.0 PUNTOS)
// ============================================================================

const CASES_DATA: CaseStudy[] = [
  {
    id: 'case-1',
    number: 1,
    title: 'Focalización bajo presión y vínculos cercanos en territorio',
    theme: 'Gestión preventiva de conflictos de intereses y transparencia en la toma de decisiones',
    governmentLevel: 'Gobierno Local (Municipalidad Distrital)',
    articulation: 'Unidad Territorial (UT) del MIDIS — Programas Pensión 65 y Contigo',
    protagonistRole:
      'Jefe/a de la Unidad Local de Empadronamiento (ULE) y Enlace Municipal de Pensión 65 y Contigo',
    secondaryActors: [
      'Coordinador/a Territorial de la UT del MIDIS',
      'Gerente de Desarrollo Social (superior inmediato)',
      'Regidor distrital',
      'Postulante a empadronador/a (prima hermana de tu cónyuge)',
      'Presidente/a de una junta vecinal',
    ],
    scenario: [
      'En el marco de una campaña extraordinaria de cierre de brechas para actualizar la Clasificación Socioeconómica (CSE) e incorporar nuevos usuarios a Pensión 65 y Contigo tras una emergencia climática, presides el comité de selección de empadronadores temporales y validas el lote prioritario de hogares que remitirás a la UT del MIDIS.',
      'Al revisar los expedientes, detectas tres situaciones simultáneas: (1) Una de las postulantes con mayor puntaje técnico es prima hermana de tu cónyuge; (2) Un regidor distrital acude sin registro previo a tu oficina para exigir que se priorice el expediente de su tío directo antes del cierre de corte de la UT del MIDIS; y (3) El presidente de una junta vecinal presenta un escrito cuestionando la imparcialidad del proceso por el parentesco con la postulante y exige separarte de la ULE.',
    ],
    criticalDilemma:
      'Garantizar la imparcialidad y legalidad en la contratación de personal de campo y en la validación de potenciales usuarios de los PPSS frente a vínculos familiares y presiones políticas locales, activando oportunamente los mecanismos de prevención del conflicto de intereses sin paralizar el cronograma acordado con la UT del MIDIS.',
    maxPoints: 6.5,
    questions: [
      {
        id: 'q-1-1',
        number: '1.1',
        title: 'Diagnóstico del conflicto de intereses',
        prompt:
          '¿Cómo se califican técnicamente las situaciones descritas respecto a la postulante emparentada con tu cónyuge y la solicitud del regidor distrital sobre su tío?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'No existe conflicto de intereses mientras la postulante haya obtenido el mayor puntaje técnico por mérito propio y aún no se firme su contrato.',
          },
          {
            id: 'B',
            text: 'Existe un conflicto de intereses real en el comité de selección por el vínculo de afinidad con la postulante, y un riesgo de afectación a la imparcialidad por la injerencia del regidor, que exigen prevención antes de que se consume un beneficio indebido.',
          },
          {
            id: 'C',
            text: 'Solo existe un conflicto aparente causado por la queja del dirigente vecinal, el cual se resuelve publicando los puntajes finales en el mural municipal.',
          },
          {
            id: 'D',
            text: 'El conflicto únicamente se configura si el tío del regidor no cumple los requisitos socioeconómicos para ingresar a Pensión 65.',
          },
        ],
        rubric: {
          keywords: ['real', 'imparcialidad', 'parentesco', 'interés', 'prevención', 'deber'],
          deepeningQuestion:
            '¿Qué impacto institucional tendría en la legitimidad del padrón de Pensión 65 y Contigo si esperaras a que se firme el contrato para recién reportar el vínculo?',
          remediationQuestion:
            'Si un servidor evalúa a un familiar directo o por afinidad dentro de un comité que preside, ¿el conflicto depende de si el postulante tiene buen puntaje o de la estructura misma de decisión donde colisionan el deber funcional y el interés particular?',
          normativeBasis:
            'Guía de Gestión de Conflicto de Intereses (OII-MIDIS) y Art. 8.1 de la Ley N° 27815 (Prohibición de mantener intereses en conflicto).',
        },
      },
      {
        id: 'q-1-2',
        number: '1.2',
        title: 'Activación de excusación vs. recusación',
        prompt:
          'Ante el vínculo familiar con la postulante y el escrito presentado por el presidente de la junta vecinal exigiendo tu separación, ¿qué mecanismo preventivo corresponde activar de inmediato?',
        points: 1.5,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Esperar a que el dirigente vecinal formalice una denuncia penal antes de apartarse, para no retrasar la campaña de empadronamiento.',
          },
          {
            id: 'B',
            text: 'Rechazar el escrito del dirigente vecinal por no ser parte del comité y continuar evaluando a todos los postulantes con total normalidad.',
          },
          {
            id: 'C',
            text: 'Formular de oficio tu excusación escrita ante tu superior inmediato (Gerente de Desarrollo Social) para abstenerte de evaluar dicho expediente y tramitar tu reemplazo temporal, diferenciándola de la recusación planteada por el tercero.',
          },
          {
            id: 'D',
            text: 'Renunciar irrevocablemente a la jefatura de la ULE y devolver todo el presupuesto de la campaña a la UT del MIDIS.',
          },
        ],
        rubric: {
          keywords: ['excusación', 'abstención', 'recusación', 'superior', 'reemplazo'],
          deepeningQuestion:
            '¿Por qué la excusación oportuna del propio servidor protege mejor la validez del acto administrativo que esperar el trámite de una recusación externa?',
          remediationQuestion:
            'En la gestión preventiva de conflictos de intereses, ¿a quién corresponde el deber primario de apartarse cuando detecta un vínculo familiar: al propio servidor mediante excusación o solo cuando un tercero lo recusa?',
          normativeBasis:
            'Material Técnico OII-MIDIS (Excusación y Recusación) y Art. 99 del TUO de la Ley N° 27444 (Causales de abstención).',
        },
      },
      {
        id: 'q-1-3',
        number: '1.3',
        title: 'Neutralidad y trazabilidad frente a injerencias',
        prompt:
          '¿Qué medidas preventivas de transparencia institucional debes aplicar frente a la visita informal del regidor distrital y la gestión del proceso de focalización?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Atender el pedido del regidor de manera reservada para mantener buenas relaciones políticas con el Concejo Municipal, sin dejar constancia escrita.',
          },
          {
            id: 'B',
            text: 'Exigir el registro obligatorio de la audiencia en el Registro de Visitas en Línea / Agendas Oficiales, evaluar el expediente del hogar estrictamente según criterios técnicos del SISFOH y verificar la actualización de la Declaración Jurada de Intereses (DJI).',
          },
          {
            id: 'C',
            text: 'Exonerar de visita domiciliaria al tío del regidor por tratarse de una autoridad electa que da fe de su condición de pobreza.',
          },
          {
            id: 'D',
            text: 'Publicar en redes sociales los datos personales y el diagnóstico médico del tío del regidor para demostrar que no hubo favorecimiento.',
          },
        ],
        rubric: {
          keywords: ['visitas', 'registro', 'agendas', 'declaración', 'dji', 'trazabilidad', 'neutralidad'],
          deepeningQuestion:
            '¿De qué manera el Registro de Visitas en Línea y la Declaración Jurada de Intereses (Ley N° 31227) disuaden futuras presiones sobre los empadronadores en campo?',
          remediationQuestion:
            'Si una autoridad local acude sin registro a pedir la priorización de un familiar, ¿qué ocurre con la trazabilidad y la neutralidad del servicio si la reunión queda fuera de los mecanismos oficiales de transparencia?',
          normativeBasis:
            'Ley N° 31227 (Declaración Jurada de Intereses), Mecanismos de Registro de Visitas en Línea / Agendas Oficiales y Principio de Neutralidad (Ley N° 27815).',
        },
      },
      {
        id: 'q-1-4',
        number: '1.4',
        title: 'Articulación colaborativa con la Unidad Territorial del MIDIS',
        prompt:
          '¿Cómo debes articular con el/la Coordinador/a Territorial de la UT del MIDIS para cumplir el plazo de cierre de corte sin comprometer la ética ni afectar a las familias vulnerables?',
        points: 2.0,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Suspender todo el envío del lote de hogares de Pensión 65 y Contigo hasta el próximo trimestre mientras se resuelve la selección de empadronadores.',
          },
          {
            id: 'B',
            text: 'Enviar el padrón sin validar directamente a la UT del MIDIS para trasladarles la responsabilidad política de filtrar los expedientes observados.',
          },
          {
            id: 'C',
            text: 'Comunicar formalmente a la UT del MIDIS tu abstención parcial y la designación de tu reemplazo para el acto en conflicto, asegurando la continuidad de la validación técnica del resto del padrón con asistencia técnica de la UT.',
          },
          {
            id: 'D',
            text: 'Contratar directamente a la prima de tu cónyuge bajo recibos por honorarios sin pasar por el comité para acelerar el empadronamiento.',
          },
        ],
        rubric: {
          keywords: ['articulación', 'abstención', 'reemplazo', 'continuidad', 'asistencia', 'padrón'],
          deepeningQuestion:
            '¿Cómo equilibra esta decisión el principio de adaptabilidad operativa con el respeto irrestricto a las reglas de integridad en el cierre de brechas?',
          remediationQuestion:
            'Cuando surge un conflicto puntual en un expediente o postulante, ¿es ético paralizar toda la entrega de un programa social a población vulnerable o corresponde aislar el acto en conflicto mediante reemplazo y sostener el servicio?',
          normativeBasis:
            'Objetivo de Articulación Territorial MIDIS–GL y Deber de Responsabilidad y Continuidad del Servicio (Ley N° 27815).',
        },
      },
    ],
  },
  {
    id: 'case-2',
    number: 2,
    title: 'Uso de recursos en custodia y transparencia en la entrega alimentaria',
    theme: 'Transparencia en el manejo de recursos públicos, bienes en custodia y límites frente a órdenes ilegales',
    governmentLevel: 'Gobierno Local (Municipalidad Provincial)',
    articulation: 'Gerencia Regional de Desarrollo Social (GORE) y Equipo Territorial del MIDIS (PCA y Ollas Comunes)',
    protagonistRole:
      'Subgerente/a de Programas Sociales y Complementación Alimentaria de una Municipalidad Provincial',
    secondaryActors: [
      'Gerente Municipal (funcionario de confianza y superior inmediato)',
      'Representante de empresa proveedora de alimentos del PCA',
      'Presidenta de una red de ollas comunes',
      'Especialista de la Gerencia Regional de Desarrollo Social (GORE)',
      'Gestor/a territorial del MIDIS',
    ],
    scenario: [
      'Tras recibir una transferencia presupuestal para la atención alimentaria de comedores populares y ollas comunes, tu Subgerencia custodia en el almacén municipal un lote de alimentos no perecibles y administra dos camionetas asignadas exclusivamente a la supervisión del Programa de Complementación Alimentaria (PCA).',
      'A dos semanas de una actividad proselitista en la provincia, ocurren tres hechos críticos: (1) El Gerente Municipal te ordena verbalmente disponer de las dos camionetas y retirar 150 canastas del almacén del PCA para repartirlas en una "jornada cívica" organizada por una agrupación política local, argumentando que "igual se entrega a población pobre y agiliza la ejecución"; (2) Un proveedor con entregas observadas por calidad ofrece cubrir "gastos de combustible y viáticos del equipo supervisor" a cambio de que firmes la conformidad sin penalidades; y (3) La presidenta de una olla común solicita por mesa de partes el cronograma de distribución, criterios de asignación y stock disponible tras rumores de desvío de raciones.',
    ],
    criticalDilemma:
      'Resistir una orden superior orientada al proselitismo político con recursos alimentarios en custodia, rechazar un ofrecimiento de ventaja indebida en la cadena de suministro y garantizar transparencia activa hacia las organizaciones sociales de base en coordinación con el GORE y el MIDIS.',
    maxPoints: 6.5,
    questions: [
      {
        id: 'q-2-1',
        number: '2.1',
        title: 'Identificación de prohibiciones éticas y bienes protegidos',
        prompt:
          '¿Qué infracciones éticas se configuran en la disposición de camionetas y canastas para la jornada cívica política y en el ofrecimiento del proveedor?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'No hay infracción ética en el uso de las canastas si los asistentes a la jornada política son personas en situación de pobreza, solo una falta administrativa leve de almacén.',
          },
          {
            id: 'B',
            text: 'Se configuran las prohibiciones éticas de realizar proselitismo político utilizando bienes públicos o de terceros bajo custodia de la entidad y de obtener o procurar ventajas indebidas.',
          },
          {
            id: 'C',
            text: 'Aceptar el combustible del proveedor es válido como cooperación público-privada siempre que se rinda cuenta mediante boletas simples.',
          },
          {
            id: 'D',
            text: 'Los alimentos del PCA no califican como bienes del Estado mientras no sean distribuidos formalmente a los comedores populares.',
          },
        ],
        rubric: {
          keywords: ['proselitismo', 'custodia', 'ventaja', 'indebida', 'bienes', 'estado'],
          deepeningQuestion:
            '¿Por qué el Reglamento del Código de Ética (D.S. N° 033-2005-PCM) incluye expresamente los bienes de terceros bajo uso o custodia de la entidad dentro de la protección de los Bienes del Estado?',
          remediationQuestion:
            '¿Puede justificarse el desvío de raciones alimentarias hacia un evento partidario bajo el argumento de que "igual llega a población pobre"? ¿Qué prohibiciones del Art. 8 de la Ley N° 27815 se vulneran?',
          normativeBasis:
            'Art. 7.5 y Art. 8 (numerales 2 y 3) de la Ley N° 27815; Art. 3 del Reglamento aprobado por D.S. N° 033-2005-PCM.',
        },
      },
      {
        id: 'q-2-2',
        number: '2.2',
        title: 'Límites del deber de obediencia frente a orden ilegal',
        prompt:
          'Frente a la instrucción verbal del Gerente Municipal (tu superior inmediato) para entregar las 150 canastas y camionetas a la agrupación política, ¿cuál es la conducta exigible?',
        points: 1.5,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Cumplir la orden por el principio de jerarquía y obediencia debida, solicitando después que el Gerente Municipal regularice un memorando.',
          },
          {
            id: 'B',
            text: 'Entregar únicamente las camionetas para no indisponerse con el Gerente, pero retener las 150 canastas en el almacén.',
          },
          {
            id: 'C',
            text: 'Negarse a ejecutar la orden por constituir una arbitrariedad e ilegalidad manifiesta, dejar constancia escrita de la negativa y poner el hecho en conocimiento de la instancia superior / órgano de control competente.',
          },
          {
            id: 'D',
            text: 'Pedir vacaciones inmediatas para que otro funcionario asuma la firma de salida del almacén durante la jornada política.',
          },
        ],
        rubric: {
          keywords: ['obediencia', 'ilegal', 'arbitrariedad', 'constancia', 'conocimiento', 'control'],
          deepeningQuestion:
            '¿Qué responsabilidad administrativa, civil o penal asumiría el Subgerente si ejecuta una orden verbal manifiestamente ilegal alegando subordinación jerárquica?',
          remediationQuestion:
            'Según el Principio de Lealtad y Obediencia (Art. 6.6 de la Ley N° 27815), ¿el deber de obedecer al superior alcanza a órdenes que implican ilegalidad o desviación política de recursos?',
          normativeBasis:
            'Art. 6.6 (Principio de Lealtad y Obediencia) y Art. 10 (Obligación de comunicar transgresiones) de la Ley N° 27815.',
        },
      },
      {
        id: 'q-2-3',
        number: '2.3',
        title: 'Transparencia activa y firmeza contractual',
        prompt:
          '¿Qué acciones inmediatas corresponden frente al requerimiento presentado por la presidenta de la olla común y la oferta del proveedor observado?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Denegar la información a la olla común hasta que concluya el año fiscal y firmar la conformidad al proveedor para evitar desabastecimiento.',
          },
          {
            id: 'B',
            text: 'Entregar información fidedigna, completa y oportuna sobre stocks, cronogramas y criterios de distribución a la organización social; mantener las observaciones técnicas al proveedor y reportar el intento de soborno.',
          },
          {
            id: 'C',
            text: 'Entregar solo el cronograma verbalmente a la presidenta de la olla común y aplicar al proveedor una penalidad reducida a cambio de que retire su oferta.',
          },
          {
            id: 'D',
            text: 'Derivar el pedido de la olla común al Gerente Municipal para que decida qué datos pueden hacerse públicos.',
          },
        ],
        rubric: {
          keywords: ['transparencia', 'fidedigna', 'oportuna', 'penalidades', 'observaciones', 'reportar'],
          deepeningQuestion:
            '¿Cómo contribuye la entrega oportuna y verificable de saldos de almacén a desactivar rumores de desvío y fortalecer la confianza de las ollas comunes?',
          remediationQuestion:
            'Frente a una solicitud ciudadana sobre el stock de alimentos de programas sociales y un intento de soborno de un proveedor, ¿qué exige el Deber de Transparencia (Art. 7.2) y el Deber de Probidad?',
          normativeBasis:
            'Art. 6.2 (Probidad), Art. 7.2 (Transparencia) y Art. 8.2 (Prohibición de ventajas indebidas) de la Ley N° 27815.',
        },
      },
      {
        id: 'q-2-4',
        number: '2.4',
        title: 'Articulación multinivel y vigilancia ciudadana',
        prompt:
          '¿Cómo debes articular con la Gerencia Regional de Desarrollo Social (GORE) y el equipo territorial del MIDIS para blindar la entrega íntegra de las raciones en territorio?',
        points: 2.0,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Solicitar al MIDIS que asuma directamente el reparto puerta a puerta reemplazando a la municipalidad provincial.',
          },
          {
            id: 'B',
            text: 'Realizar la distribución en horario nocturno sin avisar a los comités de vigilancia para evitar interferencias políticas.',
          },
          {
            id: 'C',
            text: 'Activar el comité de gestión y monitoreo conjunto con participación de los comités de vigilancia ciudadana, el GORE y el equipo territorial del MIDIS para auditar el padrón de entrega y la trazabilidad del almacén.',
          },
          {
            id: 'D',
            text: 'Congelar la distribución de alimentos en toda la provincia hasta después del proceso electoral.',
          },
        ],
        rubric: {
          keywords: ['vigilancia', 'comité', 'trazabilidad', 'gore', 'midis', 'articulación'],
          deepeningQuestion:
            '¿Por qué la articulación simultánea entre control social (ollas comunes), Gobierno Regional y MIDIS genera un cerco preventivo más sólido que una acción aislada de gabinete?',
          remediationQuestion:
            'Para asegurar que los alimentos lleguen íntegros a sus destinatarios sin paralizar el servicio, ¿cómo debe integrarse la vigilancia ciudadana con la asistencia técnica del GORE y del MIDIS?',
          normativeBasis:
            'Modelos de Cogestión y Vigilancia Ciudadana del PCA / Ollas Comunes y Articulación Intergubernamental MIDIS–GORE–GL.',
        },
      },
    ],
  },
  {
    id: 'case-3',
    number: 3,
    title: 'Filtración de denuncias, reserva de identidad y protección laboral en la articulación regional',
    theme: 'Canales de denuncia, principio de reserva, medidas de protección al denunciante y articulación interinstitucional',
    governmentLevel: 'Gobierno Regional (Gerencia/Dirección Regional de Desarrollo e Inclusión Social)',
    articulation: 'Unidades Territoriales de Cuna Más y Juntos (MIDIS) en la Instancia de Articulación Regional (IAR)',
    protagonistRole:
      'Gerente/a o Director/a Regional de Desarrollo e Inclusión Social de un Gobierno Regional (GORE), copresidente/a de la IAR',
    secondaryActors: [
      'Especialista social regional (contratada bajo modalidad temporal con vínculo próximo a vencer)',
      'Jefe/a de Equipo Territorial del GORE (denunciado y jefe inmediato de la especialista)',
      'Jefes/as de las Unidades Territoriales de Cuna Más y Juntos del MIDIS',
      'Jefe/a de la Oficina General de Recursos Humanos (OGRH)',
      'Periodista local',
    ],
    scenario: [
      'Durante una sesión descentralizada de la Instancia de Articulación Regional (IAR) para monitorear el paquete integrado de Desarrollo Infantil Temprano (DIT), una especialista social del GORE que articula en campo con acompañantes técnicos de Cuna Más y gestores locales de Juntos te entrega en reserva un sobre cerrado con audios y actas adulteradas.',
      'Las pruebas evidencian que un coordinador territorial de un Programa Nacional del MIDIS y un jefe de equipo del GORE cobran "cupos" y condicionan el acceso de familias usuarias. La denunciante solicita reserva de identidad y medida de protección laboral, pues su contrato vence en diez días y su jefe (el denunciado) ya anunció que no lo renovará; además, teme represalias porque semanas atrás otro servidor presentó una alerta que fue tramitada como una simple queja administrativa sin reserva. Al día siguiente, un periodista ingresa una solicitud de acceso a la información pública pidiendo copia de todas las denuncias recibidas en la sesión y los nombres de los involucrados.',
    ],
    criticalDilemma:
      'Canalizar la denuncia cumpliendo estrictamente los plazos y reglas de confidencialidad entre el GORE y el MIDIS, activar medidas de protección laboral efectivas frente a represalias contractuales y denegar legalmente la divulgación de información reservada sin interrumpir el servicio a las familias de Cuna Más y Juntos.',
    maxPoints: 7.0,
    questions: [
      {
        id: 'q-3-1',
        number: '3.1',
        title: 'Diferenciación entre queja administrativa y denuncia de corrupción',
        prompt:
          '¿Por qué fue erróneo tramitar el caso previo como queja por defecto de tramitación y cuál es la vía correcta para la denuncia presentada hoy por la especialista?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Porque toda comunicación de un trabajador debe tramitarse primero como reclamo en el Libro de Reclamaciones antes de pasar a Integridad.',
          },
          {
            id: 'B',
            text: 'Porque los hechos describen un presunto acto de corrupción con indicios razonables de fundamento y materialidad (cobro de cupos y abuso de función), que debe canalizarse con reserva mediante la Oficina de Integridad Institucional (OII) / Plataforma Digital Única de Denuncias del Ciudadano.',
          },
          {
            id: 'C',
            text: 'Porque las quejas administrativas solo aplican a ciudadanos externos, mientras que los servidores públicos únicamente pueden denunciar ante la Fiscalía.',
          },
          {
            id: 'D',
            text: 'Porque el jefe inmediato denunciado debe emitir primero un informe de descargos antes de decidir si es queja o denuncia.',
          },
        ],
        rubric: {
          keywords: ['corrupción', 'fundamento', 'materialidad', 'integridad', 'oii', 'queja', 'reserva'],
          deepeningQuestion:
            '¿Qué consecuencia operativa y de riesgo para el denunciante se produce cuando una denuncia de corrupción se deriva erróneamente como queja por defecto de tramitación?',
          remediationQuestion:
            'Según la Directiva N° 001-2022-MIDIS (Versión 02), ¿qué diferencia una queja por defecto de tramitación de una denuncia por presunto acto de corrupción con fundamento y materialidad?',
          normativeBasis:
            'Directiva N° 001-2022-MIDIS (Versión 02, R.M. N° 157-2026-MIDIS) y Directiva N° 002-2023-PCM-SIP.',
        },
      },
      {
        id: 'q-3-2',
        number: '3.2',
        title: 'Flujo de derivación, plazo (1 día hábil) y código cifrado',
        prompt:
          '¿Cuál es el procedimiento y plazo obligatorio para remitir la denuncia recibida en territorio hacia las instancias competentes del MIDIS/Programa Nacional y del GORE?',
        points: 1.5,
        correctOption: 'A',
        options: [
          {
            id: 'A',
            text: 'Remitirla en un plazo máximo de un (1) día hábil, en sobre cerrado confidencial o medio digital seguro, a la OII del Programa Nacional/MIDIS y a la instancia de integridad/STPAD regional, asignando un código cifrado para proteger la identidad.',
          },
          {
            id: 'B',
            text: 'Conservar el expediente en la Gerencia Regional durante diez (10) días hábiles para realizar una investigación preliminar propia antes de informar al MIDIS.',
          },
          {
            id: 'C',
            text: 'Digitalizar los audios y enviarlos por correo institucional abierto con copia a todos los miembros de la IAR para garantizar transparencia.',
          },
          {
            id: 'D',
            text: 'Pedir a la especialista que vuelva a presentar su denuncia presencialmente en la Sede Central de Lima porque en territorio no se reciben sobres cerrados.',
          },
        ],
        rubric: {
          keywords: ['1', 'un', 'día', 'hábil', 'código', 'cifrado', 'confidencial', 'sobre'],
          deepeningQuestion:
            '¿Por qué la asignación inmediata del código cifrado y la remisión en 1 día hábil son críticas antes de iniciar la revisión de requisitos (2 días hábiles) y el registro en el SISPAD?',
          remediationQuestion:
            'De acuerdo con la Directiva N° 001-2022-MIDIS (Versión 02) y el D. Leg. N° 1327, ¿en qué plazo máximo debe remitirse una denuncia recibida en territorio y mediante qué mecanismo se resguarda la identidad?',
          normativeBasis:
            'Directiva N° 001-2022-MIDIS (Versión 02) y Art. 8.1 del Decreto Legislativo N° 1327.',
        },
      },
      {
        id: 'q-3-3',
        number: '3.3',
        title: 'Protección laboral y reserva ante solicitud de prensa',
        prompt:
          '¿Qué medidas de protección laboral corresponden a la especialista y cómo debes responder a la solicitud de acceso a la información pública presentada por el periodista?',
        points: 2.0,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Dejar que venza su contrato para evitar conflictos laborales y entregar al periodista una copia anonimizada de los audios por transparencia pública.',
          },
          {
            id: 'B',
            text: 'Gestionar la renovación de su relación contractual ante la anunciada no-renovación por represalia (y/o traslado temporal o exoneración del denunciado) y denegar la solicitud del periodista por tener carácter confidencial protegido por ley.',
          },
          {
            id: 'C',
            text: 'Trasladar a la denunciante a un puesto de menor nivel remunerativo para alejarla del jefe denunciado y confirmar al periodista solo los nombres de los investigados.',
          },
          {
            id: 'D',
            text: 'Entregar la información al periodista únicamente si firma un compromiso de no publicar el nombre de la denunciante.',
          },
        ],
        rubric: {
          keywords: ['renovación', 'contractual', 'denegar', 'confidencial', 'reserva', 'represalia', '1327'],
          deepeningQuestion:
            '¿Qué responsabilidad disciplinaria recae sobre el funcionario que divulga por negligencia o entrega por acceso a la información el contenido de una denuncia en trámite?',
          remediationQuestion:
            'Revisa el catálogo de medidas de protección laboral del Reglamento del D. Leg. N° 1327 (D.S. N° 010-2017-JUS) y el Art. 17.3 del TUO de la Ley de Transparencia: ¿procede entregar copias de denuncias a la prensa o permitir la no-renovación contractual por represalia?',
          normativeBasis:
            'D.S. N° 010-2017-JUS (Catálogo de medidas de protección laboral), Art. 6 del D. Leg. N° 1327 y Art. 17.3 del TUO de la Ley N° 27806.',
        },
      },
      {
        id: 'q-3-4',
        number: '3.4',
        title: 'Articulación interna y reorganización con Cuna Más y Juntos',
        prompt:
          '¿Cómo deben coordinar la Dirección Regional y las Unidades Territoriales de Cuna Más y Juntos para ejecutar la protección y sostener la atención de Desarrollo Infantil Temprano en campo?',
        points: 2.0,
        correctOption: 'A',
        options: [
          {
            id: 'A',
            text: 'Solicitar el informe de viabilidad operativa a OGRH (plazo de 1 día hábil para pedirlo y 3 días hábiles para emitirlo), activar la protección de oficio en la STPAD y redistribuir temporalmente las rutas de acompañamiento familiar entre los equipos de la IAR sin revelar el motivo al entorno operativo.',
          },
          {
            id: 'B',
            text: 'Convocar a una asamblea abierta con todos los acompañantes técnicos y gestores locales para explicarles quién denunció y por qué se reorganizan las rutas.',
          },
          {
            id: 'C',
            text: 'Suspender las visitas domiciliarias de Cuna Más y Juntos en el distrito involucrado durante los 30 días que dure la investigación disciplinaria.',
          },
          {
            id: 'D',
            text: 'Esperar a que la STPAD emita resolución de sanción firme antes de solicitar cualquier medida de viabilidad operativa a Recursos Humanos.',
          },
        ],
        rubric: {
          keywords: ['ogrh', 'viabilidad', '3', 'tres', 'días', 'stpad', 'rutas', 'oficio'],
          deepeningQuestion:
            '¿Por qué el cumplimiento estricto de los plazos internos (1 día hábil para solicitar viabilidad a OGRH, 3 días hábiles para su emisión y máximo 15 días hábiles para implementar la medida) es decisivo para evitar represalias consumadas?',
          remediationQuestion:
            'Considerando los plazos de la Directiva N° 001-2022-MIDIS (Versión 02) entre OII, OGRH y STPAD, ¿cómo se articula la protección urgente de la servidora sin revelar su identidad ni interrumpir el servicio a las familias de Cuna Más y Juntos?',
          normativeBasis:
            'Numeral 7.5 de la Directiva N° 001-2022-MIDIS (Plazos OII–OGRH–STPAD) y D.S. N° 010-2017-JUS (Protección de oficio).',
        },
      },
    ],
  },
];

// ============================================================================
// CÁLCULOS DE PUNTAJE Y SINCRONIZACIÓN CON GOOGLE SHEETS
// ============================================================================

const computeParticipantScores = (p: ParticipantRecord) => {
  const answeredCount = Object.keys(p.answers).length;
  const c1 = CASES_DATA[0].questions.reduce(
    (s, q) => s + (p.answers[q.id]?.pointsEarned || 0),
    0
  );
  const c2 = CASES_DATA[1].questions.reduce(
    (s, q) => s + (p.answers[q.id]?.pointsEarned || 0),
    0
  );
  const c3 = CASES_DATA[2].questions.reduce(
    (s, q) => s + (p.answers[q.id]?.pointsEarned || 0),
    0
  );
  const total = c1 + c2 + c3;
  const level =
    answeredCount < 12
      ? 'En progreso'
      : total >= 17
      ? 'Sobresaliente'
      : total >= 14
      ? 'Aprobado'
      : 'En proceso';

  return { answeredCount, c1, c2, c3, total, level };
};

const syncParticipantToGoogleSheets = async (
  participant: ParticipantRecord,
  sheetsUrl: string
): Promise<boolean> => {
  if (!isValidSheetsUrl(sheetsUrl)) return false;

  const { answeredCount, c1, c2, c3, total, level } = computeParticipantScores(participant);

  const payload = {
    action: 'upsert',
    row: {
      id: participant.id,
      fullName: participant.fullName,
      dni: participant.dni,
      email: participant.email,
      startedAtFormatted: formatTimestamp(participant.startedAt),
      completedAtFormatted: participant.completedAt
        ? formatTimestamp(participant.completedAt)
        : 'En curso',
      progress: `${answeredCount} / 12`,
      status: answeredCount >= 12 ? 'Finalizado' : 'En curso',
      case1: Number(c1.toFixed(1)),
      case2: Number(c2.toFixed(1)),
      case3: Number(c3.toFixed(1)),
      total: Number(total.toFixed(1)),
      level,
      rawRecord: participant,
    },
  };

  try {
    await fetch(sheetsUrl.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch {
    return false;
  }
};

const fetchCohortFromGoogleSheets = async (
  sheetsUrl: string
): Promise<ParticipantRecord[] | null> => {
  if (!isValidSheetsUrl(sheetsUrl)) return null;

  try {
    const response = await fetch(sheetsUrl.trim(), {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.status === 'ok' && Array.isArray(data.records)) {
      return data.records as ParticipantRecord[];
    }
    return null;
  } catch {
    return null;
  }
};

const clearGoogleSheetsData = async (sheetsUrl: string): Promise<boolean> => {
  if (!isValidSheetsUrl(sheetsUrl)) return false;
  try {
    await fetch(sheetsUrl.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'clear' }),
    });
    return true;
  } catch {
    return false;
  }
};

// ============================================================================
// SERVICIO DE PERSISTENCIA LOCAL (RESPALDO INMEDIATO)
// ============================================================================

const storageService = {
  cleanLegacy() {
    try {
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignorar errores de almacenamiento
    }
  },
  loadCohort(): ParticipantRecord[] {
    try {
      this.cleanLegacy();
      const raw = localStorage.getItem(STORAGE_KEYS.COHORT);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  saveCohort(cohort: ParticipantRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.COHORT, JSON.stringify(cohort));
    } catch {
      // Ignorar errores de cuota
    }
  },
  loadActiveId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    } catch {
      return null;
    }
  },
  saveActiveId(id: string | null) {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
      }
    } catch {
      // Ignorar
    }
  },
  loadConfig(): AppConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!raw) return DEFAULT_CONFIG;
      const saved = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...saved,
        googleSheetsUrl: isValidSheetsUrl(saved.googleSheetsUrl)
          ? saved.googleSheetsUrl
          : DEFAULT_CONFIG.googleSheetsUrl,
      };
    } catch {
      return DEFAULT_CONFIG;
    }
  },
  saveConfig(config: AppConfig): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      return true;
    } catch {
      return false;
    }
  },
};

// ============================================================================
// COMPONENTE DE EMBLEMA OFICIAL MIDIS (SIN RECORTES + RESPALDO VECTORIAL)
// ============================================================================

const MidisLogoBadge: React.FC<{
  customUrl?: string;
  onDoubleClick?: () => void;
}> = ({ customUrl, onDoubleClick }) => {
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (customUrl && customUrl.trim()) list.push(customUrl.trim());
    ['./logo-midis.png', '/logo-midis.png', './MIDIS.png'].forEach((path) => {
      if (!list.includes(path)) list.push(path);
    });
    return list;
  }, [customUrl]);

  const [idx, setIdx] = useState(0);
  const [useFallbackSvg, setUseFallbackSvg] = useState(false);

  useEffect(() => {
    setIdx(0);
    setUseFallbackSvg(false);
  }, [candidates]);

  const handleImgError = () => {
    if (idx + 1 < candidates.length) {
      setIdx((prev) => prev + 1);
    } else {
      setUseFallbackSvg(true);
    }
  };

  if (!useFallbackSvg && candidates[idx]) {
    return (
      <div
        onDoubleClick={onDoubleClick}
        className="flex items-center select-none cursor-pointer"
        title="Ministerio de Desarrollo e Inclusión Social"
      >
        <img
          src={candidates[idx]}
          alt="Logo Oficial MIDIS - Perú"
          onError={handleImgError}
          className="h-10 sm:h-12 md:h-[52px] w-auto max-w-[290px] object-contain"
        />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={onDoubleClick}
      className="flex items-center select-none cursor-pointer"
      title="Ministerio de Desarrollo e Inclusión Social"
    >
      <svg
        viewBox="0 0 520 100"
        className="h-10 sm:h-12 md:h-[52px] w-auto"
        role="img"
        aria-label="Logo Oficial Ministerio de Desarrollo e Inclusión Social"
      >
        <rect x="0" y="2" width="96" height="96" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <ellipse cx="48" cy="18" rx="14" ry="7" fill="none" stroke="#15803D" strokeWidth="4" />
        <polygon points="18,28 32,24 32,76 16,70" fill="#D91023" />
        <polygon points="22,28 28,26 28,74 21,71" fill="#FFFFFF" />
        <polygon points="78,28 64,24 64,76 80,70" fill="#D91023" />
        <polygon points="74,28 68,26 68,74 75,71" fill="#FFFFFF" />
        <path
          d="M28,28 H68 V56 C68,72 48,82 48,82 C48,82 28,72 28,56 Z"
          fill="#FFFFFF"
          stroke="#CA8A04"
          strokeWidth="2.5"
        />
        <rect x="30" y="30" width="18" height="22" fill="#38BDF8" />
        <ellipse cx="39" cy="43" rx="4" ry="6" fill="#B45309" />
        <rect x="48" y="30" width="18" height="22" fill="#FFFFFF" />
        <circle cx="57" cy="39" r="6" fill="#16A34A" />
        <rect x="56" y="43" width="2" height="7" fill="#78350F" />
        <path d="M30,52 H66 V56 C66,69 48,79 48,79 C48,79 30,69 30,56 Z" fill="#DC2626" />
        <path d="M37,61 Q48,57 59,64 Q49,70 37,61 Z" fill="#FACC15" />

        <rect x="96" y="2" width="5" height="96" fill="#FFFFFF" />
        <rect x="101" y="2" width="114" height="96" fill="#E30613" />
        <text
          x="158"
          y="61"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="800"
          fontSize="31"
          letterSpacing="1"
        >
          PERÚ
        </text>

        <rect x="215" y="2" width="5" height="96" fill="#FFFFFF" />
        <rect x="220" y="2" width="298" height="96" fill="#575756" />
        <text
          x="238"
          y="44"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="600"
          fontSize="21"
        >
          Ministerio de Desarrollo
        </text>
        <text
          x="238"
          y="72"
          fill="#FFFFFF"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="600"
          fontSize="21"
        >
          e Inclusión Social
        </text>
      </svg>
    </div>
  );
};

// ============================================================================
// GENERACIÓN DE REPORTE INTEGRAL EN PDF (VENTANA IMPRIMIBLE)
// ============================================================================

const generatePrintableReportHtml = (
  participant: ParticipantRecord,
  config: AppConfig
): string => {
  const answersList = Object.values(participant.answers);
  const totalScore = answersList.reduce((acc, a) => acc + a.pointsEarned, 0);
  const levelLabel =
    totalScore >= 17
      ? 'Sobresaliente — Liderazgo Ético y Articulación Efectiva'
      : totalScore >= 14
      ? 'Aprobado — Desempeño Competente en Integridad Pública'
      : 'En Proceso — Requiere Refuerzo Normativo y Preventivo';

  const caseBlocks = CASES_DATA.map((c) => {
    const caseScore = c.questions.reduce(
      (sum, q) => sum + (participant.answers[q.id]?.pointsEarned || 0),
      0
    );

    const qRows = c.questions
      .map((q) => {
        const ans = participant.answers[q.id];
        if (!ans) return '';
        const chosenOpt = q.options.find((o) => o.id === ans.selectedOption);
        const correctOpt = q.options.find((o) => o.id === q.correctOption);
        return `
          <div style="border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin-bottom:10px;background:#ffffff;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <strong style="color:#0f172a;font-size:13px;">Pregunta ${q.number}: ${q.title}</strong>
              <span style="padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;background:${
                ans.isCorrect ? '#dcfce7' : '#fee2e2'
              };color:${ans.isCorrect ? '#166534' : '#991b1b'};">
                ${ans.isCorrect ? 'Correcta' : 'Incorrecta'} (${ans.pointsEarned.toFixed(1)} / ${q.points.toFixed(1)} pts)
              </span>
            </div>
            <p style="margin:4px 0;font-size:12px;color:#334155;"><strong>Alternativa marcada (${ans.selectedOption}):</strong> ${
          chosenOpt?.text || ''
        }</p>
            ${
              !ans.isCorrect
                ? `<p style="margin:4px 0;font-size:12px;color:#166534;"><strong>Clave normativa (${q.correctOption}):</strong> ${
                    correctOpt?.text || ''
                  }</p>`
                : ''
            }
            <p style="margin:6px 0;font-size:12px;color:#1e293b;background:#f8fafc;padding:8px;border-left:3px solid #64748b;">
              <strong>Sustento del participante:</strong> "${ans.justification}"
            </p>
            <p style="margin:6px 0 0 0;font-size:11.5px;color:#1e3a8a;background:#eff6ff;padding:8px;border-radius:6px;">
              <strong>Guía Socrática y Base Legal:</strong> ${ans.socraticFeedback} <em>(${q.rubric.normativeBasis})</em>
            </p>
          </div>
        `;
      })
      .join('');

    return `
      <div style="margin-top:18px;">
        <div style="background:#1e293b;color:#ffffff;padding:8px 12px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:700;font-size:13.5px;">Caso ${c.number}: ${c.title}</span>
          <span style="font-size:12px;font-weight:700;">Puntaje: ${caseScore.toFixed(1)} / ${c.maxPoints.toFixed(1)} pts</span>
        </div>
        <div style="margin-top:8px;">${qRows}</div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Reporte Integral - ${participant.fullName}</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 24px; line-height: 1.45; }
        @media print {
          body { margin: 12px; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fef3c7;border:1px solid #f59e0b;padding:10px 14px;border-radius:8px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:13px;color:#92400e;"><strong>Vista previa de impresión:</strong> Selecciona "Guardar como PDF" en el cuadro de impresión.</span>
        <button onclick="window.print()" style="background:#b91c1c;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:700;cursor:pointer;">Imprimir / Guardar PDF</button>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #dc2626;padding-bottom:12px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="background:#e30613;color:#fff;font-weight:800;padding:10px 14px;font-size:18px;letter-spacing:1px;">PERÚ</div>
          <div style="background:#575756;color:#fff;padding:8px 14px;font-size:13px;font-weight:600;">
            Ministerio de Desarrollo<br/>e Inclusión Social
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#64748b;text-transform:uppercase;font-weight:700;">Reporte Integral de Desempeño</div>
          <div style="font-size:14px;font-weight:700;color:#0f172a;">${config.workshopTitle}</div>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12.5px;">
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;width:22%;"><strong>Participante:</strong></td>
          <td style="border:1px solid #cbd5e1;padding:8px;width:33%;">${participant.fullName}</td>
          <td style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;width:20%;"><strong>DNI:</strong></td>
          <td style="border:1px solid #cbd5e1;padding:8px;width:25%;">${participant.dni}</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;"><strong>Correo electrónico:</strong></td>
          <td style="border:1px solid #cbd5e1;padding:8px;">${participant.email}</td>
          <td style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;"><strong>Calificación Final:</strong></td>
          <td style="border:1px solid #cbd5e1;padding:8px;font-weight:700;color:#b91c1c;">${totalScore.toFixed(1)} / 20.0 pts</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;"><strong>Hora de ingreso:</strong></td>
          <td style="border:1px solid #cbd5e1;padding:8px;">${formatTimestamp(participant.startedAt)}</td>
          <td style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;"><strong>Hora de fin:</strong></td>
          <td style="border:1px solid #cbd5e1;padding:8px;">${formatTimestamp(participant.completedAt)}</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;"><strong>Nivel alcanzado:</strong></td>
          <td colspan="3" style="border:1px solid #cbd5e1;padding:8px;font-weight:700;">${levelLabel}</td>
        </tr>
      </table>

      ${caseBlocks}

      <div style="margin-top:20px;padding-top:10px;border-top:1px solid #cbd5e1;font-size:11px;color:#64748b;text-align:center;">
        Documento generado por el Simulador de Integridad en la Gestión Pública — ${config.institutionName}
      </div>
    </body>
    </html>
  `;
};

// ============================================================================
// COMPONENTE PRINCIPAL: APP
// ============================================================================

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => storageService.loadConfig());
  const [cohort, setCohort] = useState<ParticipantRecord[]>(() => storageService.loadCohort());
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(() =>
    storageService.loadActiveId()
  );

  // Estados de navegación y modales
  const [viewMode, setViewMode] = useState<'participant' | 'teacher'>('participant');
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados del formulario inicial de participante
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState('');

  // Estados del recorrido secuencial en el simulador
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [justificationText, setJustificationText] = useState('');
  const [questionError, setQuestionError] = useState('');

  // Estados de Vista Docente y Google Sheets
  const [teacherTab, setTeacherTab] = useState<'cohort' | 'matrix' | 'settings'>('cohort');
  const [selectedDetailParticipant, setSelectedDetailParticipant] =
    useState<ParticipantRecord | null>(null);
  const [draftConfig, setDraftConfig] = useState<AppConfig>(config);
  const [configSavedNotice, setConfigSavedNotice] = useState('');
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsSyncStatus, setSheetsSyncStatus] = useState<string>('');

  const sheetsConnected = useMemo(
    () => isValidSheetsUrl(config.googleSheetsUrl),
    [config.googleSheetsUrl]
  );

  const activeParticipant = useMemo(
    () => cohort.find((p) => p.id === activeParticipantId) || null,
    [cohort, activeParticipantId]
  );

  // Sincronizar registros desde Google Sheets hacia Vista Docente
  const handleRefreshFromGoogleSheets = useCallback(async () => {
    if (!isValidSheetsUrl(config.googleSheetsUrl)) {
      setSheetsSyncStatus('Configura la URL de Google Apps Script para sincronizar.');
      return;
    }
    setIsSyncingSheets(true);
    setSheetsSyncStatus('Consultando Google Sheets...');
    const remoteRecords = await fetchCohortFromGoogleSheets(config.googleSheetsUrl);
    if (remoteRecords) {
      setCohort((prevLocal) => {
        const mergedMap = new Map<string, ParticipantRecord>();
        prevLocal.forEach((p) => mergedMap.set(p.id, p));
        remoteRecords.forEach((remote) => {
          const existing = mergedMap.get(remote.id);
          if (
            !existing ||
            Object.keys(remote.answers || {}).length >=
              Object.keys(existing.answers || {}).length
          ) {
            mergedMap.set(remote.id, remote);
          }
        });
        const mergedList = Array.from(mergedMap.values()).sort((a, b) =>
          b.startedAt.localeCompare(a.startedAt)
        );
        storageService.saveCohort(mergedList);
        return mergedList;
      });
      setSheetsSyncStatus(
        `Sincronizado con Google Sheets (${formatTimestamp(new Date().toISOString())})`
      );
    } else {
      setSheetsSyncStatus('No se pudo leer Google Sheets. Verifica el permiso "Cualquier persona".');
    }
    setIsSyncingSheets(false);
  }, [config.googleSheetsUrl]);

  // Al entrar a Vista Docente, descargar automáticamente los registros de Google Sheets
  useEffect(() => {
    if (viewMode === 'teacher' && sheetsConnected) {
      handleRefreshFromGoogleSheets();
    }
  }, [viewMode, sheetsConnected, handleRefreshFromGoogleSheets]);

  // Atajo de teclado discreto Alt + D para abrir acceso docente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (viewMode === 'teacher') {
          setViewMode('participant');
        } else {
          setLoginError('');
          setShowTeacherLoginModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Sincronizar posición secuencial cuando hay participante activo
  useEffect(() => {
    if (!activeParticipant) return;
    let foundUnanswered = false;
    for (let cIdx = 0; cIdx < CASES_DATA.length; cIdx++) {
      const qs = CASES_DATA[cIdx].questions;
      for (let qIdx = 0; qIdx < qs.length; qIdx++) {
        if (!activeParticipant.answers[qs[qIdx].id]) {
          setActiveCaseIndex(cIdx);
          setActiveQuestionIndex(qIdx);
          foundUnanswered = true;
          break;
        }
      }
      if (foundUnanswered) break;
    }
    if (!foundUnanswered) {
      setActiveCaseIndex(CASES_DATA.length - 1);
      setActiveQuestionIndex(CASES_DATA[CASES_DATA.length - 1].questions.length - 1);
    }
  }, [activeParticipant?.id]);

  // ==========================================================================
  // MANEJADORES DE ACCIÓN DEL PARTICIPANTE
  // ==========================================================================

  const handleStartSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = fullName.trim();
    const cleanDni = dni.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 5) {
      setFormError('Ingresa tus nombres y apellidos completos.');
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
      setFormError('Debes aceptar la declaración de participación y uso académico.');
      return;
    }

    const nowIso = new Date().toISOString();
    const newParticipant: ParticipantRecord = {
      id: `part-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: cleanName,
      dni: cleanDni,
      email: cleanEmail,
      startedAt: nowIso,
      completedAt: null,
      answers: {},
    };

    const updatedCohort = [newParticipant, ...cohort];
    setCohort(updatedCohort);
    storageService.saveCohort(updatedCohort);

    // Registrar inmediatamente el ingreso en Google Sheets
    void syncParticipantToGoogleSheets(newParticipant, config.googleSheetsUrl);

    setActiveParticipantId(newParticipant.id);
    storageService.saveActiveId(newParticipant.id);

    setActiveCaseIndex(0);
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setJustificationText('');
  };

  const handleSubmitAnswer = () => {
    if (!activeParticipant) return;
    setQuestionError('');

    const currentCase = CASES_DATA[activeCaseIndex];
    const currentQuestion = currentCase.questions[activeQuestionIndex];

    if (!selectedOption) {
      setQuestionError('Selecciona una alternativa (A, B, C o D) antes de calificar.');
      return;
    }
    const cleanJust = justificationText.trim();
    const wordCount = cleanJust.split(/\s+/).filter(Boolean).length;
    if (cleanJust.length < 25 || wordCount < 5) {
      setQuestionError(
        'Redacta un sustento técnico-normativo de al menos 5 palabras para habilitar la calificación.'
      );
      return;
    }

    const isCorrect = selectedOption === currentQuestion.correctOption;
    const pointsEarned = isCorrect ? currentQuestion.points : 0;
    const socraticFeedback = analyzeJustificationSocratic(
      currentQuestion,
      isCorrect,
      cleanJust
    );

    const nowIso = new Date().toISOString();
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOption,
      justification: cleanJust,
      isCorrect,
      pointsEarned,
      socraticFeedback,
      answeredAt: nowIso,
    };

    const updatedAnswers: Record<string, AnswerRecord> = {
      ...activeParticipant.answers,
      [currentQuestion.id]: record,
    };

    const totalAnswered = Object.keys(updatedAnswers).length;
    const isFinished = totalAnswered >= 12;
    const completedAt = isFinished
      ? activeParticipant.completedAt || nowIso
      : null;

    const updatedParticipant: ParticipantRecord = {
      ...activeParticipant,
      answers: updatedAnswers,
      completedAt,
    };

    const updatedCohort = cohort.map((p) =>
      p.id === updatedParticipant.id ? updatedParticipant : p
    );
    setCohort(updatedCohort);
    storageService.saveCohort(updatedCohort);

    // Actualizar progreso y puntaje en vivo en Google Sheets
    void syncParticipantToGoogleSheets(updatedParticipant, config.googleSheetsUrl);

    setQuestionError('');
  };

  const handleNextStep = () => {
    setSelectedOption(null);
    setJustificationText('');
    setQuestionError('');

    const currentCase = CASES_DATA[activeCaseIndex];
    if (activeQuestionIndex + 1 < currentCase.questions.length) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else if (activeCaseIndex + 1 < CASES_DATA.length) {
      setActiveCaseIndex((prev) => prev + 1);
      setActiveQuestionIndex(0);
    }
  };

  const handleExitParticipantSession = () => {
    setActiveParticipantId(null);
    storageService.saveActiveId(null);
    setFullName('');
    setDni('');
    setEmail('');
    setConsent(false);
    setSelectedOption(null);
    setJustificationText('');
    setActiveCaseIndex(0);
    setActiveQuestionIndex(0);
  };

  const handleOpenPrintablePdf = (participant: ParticipantRecord) => {
    const html = generatePrintableReportHtml(participant, config);
    const win = window.open('', '_blank', 'width=920,height=780');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    }
  };

  // ==========================================================================
  // MANEJADORES DE VISTA DOCENTE Y EXPORTACIÓN EXCEL (CSV)
  // ==========================================================================

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginUser.trim() === config.teacherUsername &&
      loginPass === config.teacherPassword
    ) {
      setShowTeacherLoginModal(false);
      setLoginUser('');
      setLoginPass('');
      setLoginError('');
      setDraftConfig(config);
      setViewMode('teacher');
    } else {
      setLoginError('Usuario o clave docente incorrectos.');
    }
  };

  const handleResetPlatform = async () => {
    const confirmed = window.confirm(
      '¿Confirmas reiniciar la plataforma? Se eliminarán los registros locales y de Google Sheets para dejar la tabla en 0.'
    );
    if (!confirmed) return;

    storageService.cleanLegacy();
    localStorage.removeItem(STORAGE_KEYS.COHORT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
    setCohort([]);
    setActiveParticipantId(null);
    setSelectedDetailParticipant(null);

    if (sheetsConnected) {
      await clearGoogleSheetsData(config.googleSheetsUrl);
      setSheetsSyncStatus('Registros reiniciados en navegador y Google Sheets.');
    }
  };

  const handleLoadDemoExamples = () => {
    const now = Date.now();
    const demo1: ParticipantRecord = {
      id: `demo-1-${now}`,
      fullName: 'Elena Quispe Huamán (Ejemplo)',
      dni: '42891034',
      email: 'equispe.ejemplo@gob.pe',
      startedAt: new Date(now - 18 * 60 * 1000).toISOString(),
      completedAt: new Date(now - 3 * 60 * 1000).toISOString(),
      answers: CASES_DATA.reduce((acc, c) => {
        c.questions.forEach((q) => {
          acc[q.id] = {
            questionId: q.id,
            selectedOption: q.correctOption,
            justification:
              'Sustento técnico de demostración basado en la Ley N° 27815 y la Directiva N° 001-2022-MIDIS.',
            isCorrect: true,
            pointsEarned: q.points,
            socraticFeedback: analyzeJustificationSocratic(
              q,
              true,
              'Sustento técnico de demostración basado en la Ley N° 27815 y la Directiva N° 001-2022-MIDIS.'
            ),
            answeredAt: new Date(now - 3 * 60 * 1000).toISOString(),
          };
        });
        return acc;
      }, {} as Record<string, AnswerRecord>),
    };

    const demo2: ParticipantRecord = {
      id: `demo-2-${now}`,
      fullName: 'Carlos Mendoza Paredes (Ejemplo)',
      dni: '40112233',
      email: 'cmendoza.ejemplo@gob.pe',
      startedAt: new Date(now - 9 * 60 * 1000).toISOString(),
      completedAt: null,
      answers: {
        'q-1-1': {
          questionId: 'q-1-1',
          selectedOption: 'B',
          justification:
            'Se configura conflicto de intereses real por el parentesco con la postulante y requiere abstención oportuna.',
          isCorrect: true,
          pointsEarned: 1.5,
          socraticFeedback: analyzeJustificationSocratic(
            CASES_DATA[0].questions[0],
            true,
            'Se configura conflicto de intereses real por el parentesco con la postulante y requiere abstención oportuna.'
          ),
          answeredAt: new Date(now - 6 * 60 * 1000).toISOString(),
        },
      },
    };

    const updated = [demo1, demo2, ...cohort];
    setCohort(updated);
    storageService.saveCohort(updated);

    if (sheetsConnected) {
      void syncParticipantToGoogleSheets(demo1, config.googleSheetsUrl);
      void syncParticipantToGoogleSheets(demo2, config.googleSheetsUrl);
    }
  };

  const exportCohortCSV = () => {
    const headers = [
      'Participante',
      'DNI',
      'Correo Electrónico',
      'Hora de ingreso',
      'Hora de fin',
      'Preguntas Respondidas',
      'Estado',
      'Puntaje Caso 1 (6.5)',
      'Puntaje Caso 2 (6.5)',
      'Puntaje Caso 3 (7.0)',
      'Puntaje Total (20.0)',
      'Nivel de Desempeño',
    ];

    const escapeCsv = (val: string | number) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = cohort.map((p) => {
      const { answeredCount, c1, c2, c3, total, level } = computeParticipantScores(p);

      return [
        p.fullName,
        p.dni,
        p.email,
        formatTimestamp(p.startedAt),
        p.completedAt ? formatTimestamp(p.completedAt) : 'En curso',
        `${answeredCount} / 12`,
        answeredCount >= 12 ? 'Finalizado' : 'En curso',
        c1.toFixed(1),
        c2.toFixed(1),
        c3.toFixed(1),
        total.toFixed(1),
        level,
      ]
        .map(escapeCsv)
        .join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Resultados_Taller_Integridad_MIDIS_${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxH = 120;
        const scale = img.height > maxH ? maxH / img.height : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const optimizedDataUrl = canvas.toDataURL('image/png');
          setDraftConfig((prev) => ({ ...prev, customLogoDataUrl: optimizedDataUrl }));
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = storageService.saveConfig(draftConfig);
    setConfig(draftConfig);
    setConfigSavedNotice(
      ok
        ? 'Configuración guardada correctamente.'
        : 'Configuración aplicada en la sesión actual.'
    );
    setTimeout(() => setConfigSavedNotice(''), 4000);
  };

  // ==========================================================================
  // CÁLCULOS DERIVADOS PARA PARTICIPANTE ACTIVO Y COHORTE
  // ==========================================================================

  const participantStats = useMemo(() => {
    if (!activeParticipant) return null;
    const answers = Object.values(activeParticipant.answers);
    const totalScore = answers.reduce((acc, a) => acc + a.pointsEarned, 0);
    const answeredCount = answers.length;
    const isCompleted = answeredCount >= 12;
    return { totalScore, answeredCount, isCompleted };
  }, [activeParticipant]);

  const cohortStats = useMemo(() => {
    const total = cohort.length;
    const completed = cohort.filter((p) => Object.keys(p.answers).length >= 12);
    const avgScore =
      completed.length > 0
        ? completed.reduce(
            (sum, p) =>
              sum +
              Object.values(p.answers).reduce((s, a) => s + a.pointsEarned, 0),
            0
          ) / completed.length
        : 0;
    const passed = completed.filter(
      (p) =>
        Object.values(p.answers).reduce((s, a) => s + a.pointsEarned, 0) >= 14
    ).length;
    return {
      total,
      completedCount: completed.length,
      avgScore,
      passRate: completed.length > 0 ? Math.round((passed / completed.length) * 100) : 0,
    };
  }, [cohort]);

  // ==========================================================================
  // RENDERIZADO DE INTERFAZ
  // ==========================================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* CABECERA INSTITUCIONAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MidisLogoBadge
              customUrl={config.customLogoDataUrl}
              onDoubleClick={() => {
                if (viewMode === 'teacher') {
                  setViewMode('participant');
                } else {
                  setLoginError('');
                  setShowTeacherLoginModal(true);
                }
              }}
            />
            <div className="hidden md:block border-l border-slate-200 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 block">
                Taller Virtual de Integridad Pública
              </span>
              <h1 className="text-sm font-bold text-slate-800 leading-tight">
                {config.workshopTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewMode === 'teacher' ? (
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-white text-xs font-bold">
                  Vista Docente · v3.2
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('participant')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Volver a Vista Participante
                </button>
              </div>
            ) : activeParticipant && participantStats ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800">
                    {activeParticipant.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    DNI: {activeParticipant.dni} · Progreso:{' '}
                    <strong>{participantStats.answeredCount}/12</strong>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-extrabold">
                  {participantStats.totalScore.toFixed(1)} / 20 pts
                </div>
                <button
                  type="button"
                  onClick={handleExitParticipantSession}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium transition"
                  title="Cerrar sesión actual"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Simulador Interactivo de Casos
              </span>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* ================================================================== */}
        {/* MODO 1: VISTA DOCENTE / FACILITADOR                                */}
        {/* ================================================================== */}
        {viewMode === 'teacher' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    Panel de Gestión Docente y Seguimiento
                  </h2>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    v3.2
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                      sheetsConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <Database className="w-3 h-3" />
                    {sheetsConnected
                      ? 'Google Sheets Conectado'
                      : 'Google Sheets sin configurar'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">
                  Monitoreo centralizado en Google Sheets y exportación directa de resultados del taller.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTeacherTab('cohort')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    teacherTab === 'cohort'
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Resultados y Cohorte ({cohort.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherTab('matrix')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    teacherTab === 'matrix'
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Matriz Normativa y Claves
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftConfig(config);
                    setTeacherTab('settings');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    teacherTab === 'settings'
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Configuración y Google Sheets
                </button>
              </div>
            </div>

            {/* PESTAÑA DOCENTE 1: COHORTE Y RESULTADOS */}
            {teacherTab === 'cohort' && (
              <div className="space-y-6">
                {/* Tarjetas KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-500">
                      Participantes Registrados
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {cohortStats.total}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-500">
                      Simulaciones Finalizadas
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                      {cohortStats.completedCount}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-500">
                      Promedio General (Finalizados)
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {cohortStats.avgScore.toFixed(1)}{' '}
                      <span className="text-sm font-normal text-slate-500">/ 20.0</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-xs font-semibold text-slate-500">
                      Tasa de Aprobación (≥ 14 pts)
                    </div>
                    <div className="text-2xl font-extrabold text-blue-700 mt-1">
                      {cohortStats.passRate}%
                    </div>
                  </div>
                </div>

                {/* Tabla de Resultados por Participante */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Resultados por Participante ({cohort.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        {sheetsSyncStatus ||
                          'Sincronizado con Google Sheets y respaldo local.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRefreshFromGoogleSheets}
                        disabled={isSyncingSheets}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold transition"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`}
                        />
                        {isSyncingSheets ? 'Sincronizando...' : 'Sincronizar Sheets'}
                      </button>
                      <button
                        type="button"
                        onClick={exportCohortCSV}
                        disabled={cohort.length === 0}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-bold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar Excel (CSV)
                      </button>
                      <button
                        type="button"
                        onClick={handleLoadDemoExamples}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Cargar Demo
                      </button>
                      <button
                        type="button"
                        onClick={handleResetPlatform}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reiniciar Plataforma
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 text-xs uppercase border-b border-slate-200">
                          <th className="py-3 px-3 text-left">Participante</th>
                          <th className="py-3 px-3 text-left">Hora de ingreso</th>
                          <th className="py-3 px-3 text-left">Hora de fin</th>
                          <th className="py-3 px-3 text-center">Progreso</th>
                          <th className="py-3 px-3 text-center">Caso 1</th>
                          <th className="py-3 px-3 text-center">Caso 2</th>
                          <th className="py-3 px-3 text-center">Caso 3</th>
                          <th className="py-3 px-3 text-center">Total / 20</th>
                          <th className="py-3 px-3 text-right">Detalle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {cohort.length === 0 ? (
                          <tr>
                            <td
                              colSpan={9}
                              className="py-10 px-4 text-center text-slate-500 text-sm"
                            >
                              No hay participantes registrados todavía. Conforme completen el formulario de ingreso, sus filas aparecerán en Google Sheets y aquí al sincronizar.
                            </td>
                          </tr>
                        ) : (
                          cohort.map((p) => {
                            const { answeredCount, c1, c2, c3, total } =
                              computeParticipantScores(p);

                            return (
                              <tr key={p.id} className="hover:bg-slate-50">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-slate-900">
                                    {p.fullName}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    DNI: {p.dni} · {p.email}
                                  </div>
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
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                                      En curso
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-center text-xs font-semibold">
                                  {answeredCount} / 12
                                </td>
                                <td className="py-3 px-3 text-center text-xs">
                                  {c1.toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-center text-xs">
                                  {c2.toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-center text-xs">
                                  {c3.toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-center font-extrabold text-slate-900">
                                  {total.toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDetailParticipant(p)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold mr-1.5"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    Ver
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPrintablePdf(p)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
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
            )}

            {/* PESTAÑA DOCENTE 2: MATRIZ NORMATIVA Y CLAVES */}
            {teacherTab === 'matrix' && (
              <div className="space-y-4">
                {CASES_DATA.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase text-red-700">
                          Caso {c.number} · {c.governmentLevel}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                        Puntaje máximo: {c.maxPoints.toFixed(1)} pts
                      </span>
                    </div>

                    <div className="space-y-3">
                      {c.questions.map((q) => {
                        const correctOpt = q.options.find(
                          (o) => o.id === q.correctOption
                        );
                        return (
                          <div
                            key={q.id}
                            className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                          >
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>
                                {q.number} — {q.title}
                              </span>
                              <span className="text-emerald-700">
                                Clave: {q.correctOption} ({q.points.toFixed(1)} pts)
                              </span>
                            </div>
                            <p className="text-slate-700">{q.prompt}</p>
                            <p className="text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                              <strong>Respuesta correcta ({q.correctOption}):</strong>{' '}
                              {correctOpt?.text}
                            </p>
                            <p className="text-slate-600">
                              <strong>Sustento normativo:</strong> {q.rubric.normativeBasis}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PESTAÑA DOCENTE 3: CONFIGURACIÓN INSTITUCIONAL Y GOOGLE SHEETS */}
            {teacherTab === 'settings' && (
              <form
                onSubmit={handleSaveConfig}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 max-w-2xl"
              >
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
                  Conexión con Google Sheets y Personalización Institucional
                </h3>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                    <Database className="w-4 h-4 text-blue-700" />
                    URL de Aplicación Web de Google Apps Script (/exec)
                  </label>
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={draftConfig.googleSheetsUrl}
                    onChange={(e) =>
                      setDraftConfig({ ...draftConfig, googleSheetsUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-blue-300 bg-white rounded-lg text-xs font-mono"
                  />
                  <p className="text-[11px] text-blue-900">
                    Para que todos los participantes envíen sus respuestas desde sus propios equipos, guarda también esta URL en la constante <code>DEFAULT_CONFIG.googleSheetsUrl</code> de <code>src/App.tsx</code> en GitHub.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Taller Virtual
                  </label>
                  <input
                    type="text"
                    value={draftConfig.workshopTitle}
                    onChange={(e) =>
                      setDraftConfig({ ...draftConfig, workshopTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Entidad Organizadora
                  </label>
                  <input
                    type="text"
                    value={draftConfig.institutionName}
                    onChange={(e) =>
                      setDraftConfig({ ...draftConfig, institutionName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Logotipo Oficial MIDIS (Vista previa actual)
                  </label>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg inline-block">
                    <MidisLogoBadge customUrl={draftConfig.customLogoDataUrl} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Subir imagen PNG/JPG
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftConfig({
                          ...draftConfig,
                          customLogoDataUrl: './logo-midis.png',
                        })
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700"
                    >
                      Restaurar emblema oficial MIDIS
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Usuario Vista Docente
                    </label>
                    <input
                      type="text"
                      value={draftConfig.teacherUsername}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          teacherUsername: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Clave Vista Docente
                    </label>
                    <input
                      type="text"
                      value={draftConfig.teacherPassword}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          teacherPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {configSavedNotice && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {configSavedNotice}
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-bold transition"
                >
                  Guardar configuración
                </button>
              </form>
            )}
          </div>
        ) : !activeParticipant ? (
          /* ================================================================ */
          /* MODO 2: PANTALLA DE BIENVENIDA E IDENTIFICACIÓN DEL PARTICIPANTE */
          /* ================================================================ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna Izquierda: Propósito y Reglas */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Oficina de Integridad Institucional — MIDIS
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {config.workshopTitle}
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  <strong>Objetivo de aprendizaje:</strong> Al finalizar el taller virtual,
                  diagnosticas problemáticas vinculadas a{' '}
                  <strong>conflictos de intereses</strong>,{' '}
                  <strong>transparencia de recursos</strong> y{' '}
                  <strong>canales de denuncia</strong> en los servicios del MIDIS y sus
                  Programas Sociales (PPSS), asumiendo tu rol con ética, adaptabilidad y
                  articulación colaborativa frente a situaciones críticas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-red-700">CASO 1 · 6.5 PTS</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      Conflictos de Intereses
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ULE Municipal · Pensión 65 y Contigo
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-red-700">CASO 2 · 6.5 PTS</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      Recursos en Custodia
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Subgerencia Social · PCA y Ollas Comunes
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-red-700">CASO 3 · 7.0 PTS</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      Denuncias y Protección
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      GORE / IAR · Cuna Más y Juntos
                    </p>
                  </div>
                </div>

                {/* Reglas del Simulador */}
                <div className="border-t border-slate-200 pt-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-700" />
                    Reglas de participación en el simulador
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        <strong>Intento único y avance secuencial:</strong> Analiza cada
                        escenario, marca tu alternativa y redacta obligatoriamente un
                        sustento técnico-normativo antes de calificar. Cada pregunta y caso
                        se desbloquean de forma progresiva.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong>Calificación automática (20 pts) y Reporte Integral:</strong>{' '}
                        Recibirás puntaje inmediato, preguntas de retroalimentación socrática
                        personalizadas y tu <strong>Reporte Integral en PDF</strong> al
                        concluir los tres casos.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Formulario de Identificación */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleStartSimulator}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Identificación del Participante
                    </h3>
                    <p className="text-xs text-slate-500">
                      Completa tus datos para registrar tu inicio y emitir tu reporte final
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombres y Apellidos completos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María Fernanda Torres López"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Número de DNI (8 dígitos) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    inputMode="numeric"
                    placeholder="Ej. 45678912"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. mtorres@entidad.gob.pe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-red-700 focus:ring-red-600"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Declaro que los datos consignados son verídicos y autorizo su uso
                    académico para el registro de asistencia y emisión del reporte de
                    evaluación del taller.
                  </span>
                </label>

                {formError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition"
                >
                  Iniciar Simulación de Casos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : participantStats?.isCompleted ? (
          /* ================================================================ */
          /* MODO 3: PANTALLA FINAL DE RESULTADOS Y REPORTE INTEGRAL PDF      */
          /* ================================================================ */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                ¡Simulación Completada con Éxito!
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Has concluido el análisis y sustento de las 12 decisiones críticas de los
                tres casos del taller. Descarga tu <strong>Reporte Integral en PDF</strong>{' '}
                como evidencia de culminación.
              </p>

              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl">
                <div className="text-center sm:text-left">
                  <div className="text-xs text-slate-500 font-semibold">
                    Calificación Final Obtenida
                  </div>
                  <div className="text-3xl font-extrabold text-red-700">
                    {participantStats.totalScore.toFixed(1)}{' '}
                    <span className="text-base font-bold text-slate-500">/ 20.0 pts</span>
                  </div>
                </div>
                <div className="hidden sm:block h-10 w-px bg-slate-200" />
                <div className="text-xs text-slate-600 text-center sm:text-left space-y-1">
                  <div>
                    <strong>Ingreso:</strong> {formatTimestamp(activeParticipant.startedAt)}
                  </div>
                  <div>
                    <strong>Culminación:</strong>{' '}
                    {formatTimestamp(activeParticipant.completedAt)}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenPrintablePdf(activeParticipant)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-xs transition"
                >
                  <Printer className="w-4 h-4" />
                  Descargar Reporte Integral en PDF
                </button>
                <button
                  type="button"
                  onClick={handleExitParticipantSession}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
                >
                  Finalizar y volver al inicio
                </button>
              </div>
            </div>

            {/* Desglose por caso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CASES_DATA.map((c) => {
                const cScore = c.questions.reduce(
                  (sum, q) => sum + (activeParticipant.answers[q.id]?.pointsEarned || 0),
                  0
                );
                return (
                  <div
                    key={c.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2"
                  >
                    <div className="text-xs font-bold text-red-700">CASO {c.number}</div>
                    <div className="text-sm font-bold text-slate-900">{c.title}</div>
                    <div className="text-xl font-extrabold text-slate-900 pt-1">
                      {cScore.toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        / {c.maxPoints.toFixed(1)} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* MODO 4: DESARROLLO SECUENCIAL DE CASOS Y PREGUNTAS               */
          /* ================================================================ */
          (() => {
            const currentCase = CASES_DATA[activeCaseIndex];
            const currentQuestion = currentCase.questions[activeQuestionIndex];
            const existingAnswer = activeParticipant.answers[currentQuestion.id];
            const isLastQuestionOfAll =
              activeCaseIndex === CASES_DATA.length - 1 &&
              activeQuestionIndex === currentCase.questions.length - 1;

            return (
              <div className="space-y-6">
                {/* Barra de progreso de casos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CASES_DATA.map((c, idx) => {
                    const isCurrent = idx === activeCaseIndex;
                    const answeredInCase = c.questions.filter(
                      (q) => !!activeParticipant.answers[q.id]
                    ).length;
                    const isDone = answeredInCase === c.questions.length;
                    const isLocked = idx > activeCaseIndex && answeredInCase === 0;

                    return (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                          isCurrent
                            ? 'bg-white border-red-600 ring-2 ring-red-100'
                            : isDone
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-slate-100 border-slate-200 opacity-70'
                        }`}
                      >
                        <div>
                          <div className="text-[11px] font-bold uppercase text-slate-500">
                            Caso {c.number} ({answeredInCase}/{c.questions.length})
                          </div>
                          <div className="text-xs font-bold text-slate-900 line-clamp-1">
                            {c.title}
                          </div>
                        </div>
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <Unlock className="w-4 h-4 text-red-700 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Expediente del Caso Actual */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                        Caso {currentCase.number} de 3 · {currentCase.governmentLevel}
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                        {currentCase.title}
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                      Articulación: {currentCase.articulation}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">
                        Tu rol protagonista:
                      </span>
                      <p className="text-slate-700">{currentCase.protagonistRole}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">
                        Actores involucrados en el territorio:
                      </span>
                      <p className="text-slate-700">
                        {currentCase.secondaryActors.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                    {currentCase.scenario.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    <strong>Dilema crítico a resolver:</strong> {currentCase.criticalDilemma}
                  </div>
                </div>

                {/* Tarjeta de Pregunta Secuencial Única en Curso */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-red-700 text-white text-xs font-extrabold">
                        Pregunta {currentQuestion.number}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {currentQuestion.title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                      Valor: {currentQuestion.points.toFixed(1)} puntos
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    {currentQuestion.prompt}
                  </p>

                  {/* Alternativas cerradas */}
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt) => {
                      const isPicked = existingAnswer
                        ? existingAnswer.selectedOption === opt.id
                        : selectedOption === opt.id;
                      const isRightKey =
                        !!existingAnswer && opt.id === currentQuestion.correctOption;
                      const isWrongPicked =
                        !!existingAnswer && isPicked && !existingAnswer.isCorrect;

                      let cardStyle =
                        'border-slate-200 hover:border-slate-400 bg-white text-slate-800';
                      if (existingAnswer) {
                        if (isRightKey) {
                          cardStyle =
                            'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
                        } else if (isWrongPicked) {
                          cardStyle = 'border-red-500 bg-red-50 text-red-950';
                        } else {
                          cardStyle = 'border-slate-200 bg-slate-50 text-slate-500';
                        }
                      } else if (isPicked) {
                        cardStyle =
                          'border-red-700 bg-red-50/60 text-slate-900 ring-2 ring-red-100';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!!existingAnswer}
                          onClick={() => setSelectedOption(opt.id)}
                          className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 ${cardStyle}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                              isRightKey
                                ? 'bg-emerald-600 text-white'
                                : isWrongPicked
                                ? 'bg-red-600 text-white'
                                : isPicked
                                ? 'bg-red-700 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-sm leading-relaxed pt-0.5">
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Campo obligatorio de sustento técnico-normativo */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Sustento técnico-normativo de tu decisión (obligatorio para calificar) *
                    </label>
                    <textarea
                      rows={3}
                      disabled={!!existingAnswer}
                      placeholder="Argumenta por qué elegiste esta alternativa indicando el principio ético, plazo legal o mecanismo de articulación aplicable..."
                      value={
                        existingAnswer ? existingAnswer.justification : justificationText
                      }
                      onChange={(e) => setJustificationText(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm disabled:bg-slate-100 disabled:text-slate-700"
                    />
                  </div>

                  {questionError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {questionError}
                    </div>
                  )}

                  {/* Botón de calificación o bloque de retroalimentación socrática */}
                  {!existingAnswer ? (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitAnswer}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-xs transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirmar y Calificar Decisión
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div
                        className={`p-4 rounded-xl border ${
                          existingAnswer.isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-red-50 border-red-300 text-red-950'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 font-extrabold text-sm">
                            {existingAnswer.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                Decisión Correcta (+{existingAnswer.pointsEarned.toFixed(1)}{' '}
                                pts)
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                Decisión Incorrecta (0.0 pts · Clave:{' '}
                                {currentQuestion.correctOption})
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed">
                          <strong>Base normativa:</strong>{' '}
                          {currentQuestion.rubric.normativeBasis}
                        </p>
                      </div>

                      {/* Retroalimentación Socrática */}
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-blue-800">
                          <HelpCircle className="w-4 h-4" />
                          Retroalimentación Socrática sobre tu sustento
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed">
                          {existingAnswer.socraticFeedback}
                        </p>
                      </div>

                      {!isLastQuestionOfAll && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition"
                          >
                            Continuar a la siguiente pregunta
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </main>

      {/* PIE DE PÁGINA CON ACCESO DISCRETO A VISTA DOCENTE */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            {config.institutionName} · Taller: {config.workshopTitle}
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {sheetsConnected
                ? 'Sincronización con Google Sheets activa'
                : 'Registro automático de tiempos activo'}
            </span>
            <button
              type="button"
              onClick={() => {
                if (viewMode === 'teacher') {
                  setViewMode('participant');
                } else {
                  setLoginError('');
                  setShowTeacherLoginModal(true);
                }
              }}
              className="text-slate-400 hover:text-slate-700 transition font-medium"
              title="Acceso exclusivo para facilitadores (Alt + D)"
            >
              🔒 Docente
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DE AUTENTICACIÓN DOCENTE */}
      {showTeacherLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Acceso Vista Docente
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherLoginModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTeacherLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  autoFocus
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {loginError && (
                <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-bold transition"
              >
                Ingresar al Panel Docente
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALLE INDIVIDUAL EN VISTA DOCENTE */}
      {selectedDetailParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full max-h-[88vh] flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDetailParticipant.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  DNI: {selectedDetailParticipant.dni} · Ingreso:{' '}
                  {formatTimestamp(selectedDetailParticipant.startedAt)} · Fin:{' '}
                  {formatTimestamp(selectedDetailParticipant.completedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailParticipant(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              {Object.keys(selectedDetailParticipant.answers).length === 0 ? (
                <p className="text-slate-500 text-center py-6">
                  El participante aún no ha respondido ninguna pregunta.
                </p>
              ) : (
                CASES_DATA.map((c) =>
                  c.questions.map((q) => {
                    const ans = selectedDetailParticipant.answers[q.id];
                    if (!ans) return null;
                    return (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5"
                      >
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>
                            Pregunta {q.number}: {q.title}
                          </span>
                          <span
                            className={
                              ans.isCorrect ? 'text-emerald-700' : 'text-red-700'
                            }
                          >
                            Marcó {ans.selectedOption} ({ans.pointsEarned.toFixed(1)} /{' '}
                            {q.points.toFixed(1)} pts)
                          </span>
                        </div>
                        <p className="text-slate-700">
                          <strong>Sustento:</strong> "{ans.justification}"
                        </p>
                        <p className="text-blue-900 bg-blue-50 p-2 rounded border border-blue-200">
                          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                          {ans.socraticFeedback}
                        </p>
                      </div>
                    );
                  })
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
