import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  FileText,
  Download,
  Users,
  Settings,
  RotateCcw,
  Lock,
  Unlock,
  ChevronRight,
  Clock,
  CheckSquare,
  Sparkles,
  Scale,
  Building2,
  Eye,
  Cpu,
  LogOut,
  Search
} from 'lucide-react';

// ============================================================================
// 1. DEFINICIÓN DE TIPOS E INTERFACES
// ============================================================================

interface OptionItem {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

interface RubricConcept {
  id: string;
  label: string;
  keywords: string[];
}

interface QuestionRubric {
  normativeBasis: string;
  rubricCriteria: string;
  concepts: RubricConcept[];
  missingComplement: string;
  socraticOnCorrect: string;
  socraticOnIncorrect: string;
}

interface QuestionItem {
  id: string;
  number: number;
  title: string;
  prompt: string;
  points: number;
  correctOption: 'A' | 'B' | 'C' | 'D';
  options: OptionItem[];
  rubric: QuestionRubric;
}

interface CaseItem {
  id: string;
  number: number;
  axis: string;
  title: string;
  subtitle: string;
  protagonistRole: string;
  articulationLevel: string;
  secondaryActors: string[];
  criticalDilemma: string;
  paragraphs: string[];
  questions: QuestionItem[];
}

interface RubricAnalysisResult {
  recognition: string;
  complement: string;
  socraticQuestion: string;
  matchedLabels: string[];
  missingLabels: string[];
  coveragePercent: number;
}

interface AnswerRecord {
  questionId: string;
  caseId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  justification: string;
  answeredAt: string;
  analysis: RubricAnalysisResult;
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
}

interface InstitutionConfig {
  workshopTitle: string;
  entityName: string;
  logoUrl: string;
  teacherUser: string;
  teacherPass: string;
  sheetsEndpoint: string;
}

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

// ============================================================================
// 2. CASOS VALIDADOS ÍNTEGROS (3 CASOS · 5 PÁRRAFOS C/U · 12 PREGUNTAS · 20 PTS)
// ============================================================================

const CASES_DATA: CaseItem[] = [
  {
    id: 'caso-1',
    number: 1,
    axis: 'Conflictos de intereses y transparencia',
    title: 'Caso 1: Focalización bajo presión y vínculos cercanos en territorio',
    subtitle: 'Gestión preventiva de conflictos de intereses y articulación con la Unidad Territorial del MIDIS',
    protagonistRole: 'Jefe/a de la Unidad Local de Empadronamiento (ULE) y Enlace Municipal de Pensión 65 y Contigo (Municipalidad Distrital)',
    articulationLevel: 'Gobierno Local (Municipalidad Distrital) en articulación operativa con la Unidad Territorial (UT) del MIDIS (Programas Pensión 65 y Contigo)',
    secondaryActors: [
      'Coordinador/a Territorial de la UT del MIDIS',
      'Gerente de Desarrollo Social (superior inmediato)',
      'Regidor distrital',
      'Postulante a empadronador/a (prima hermana de tu cónyuge)',
      'Presidente/a de una junta vecinal'
    ],
    criticalDilemma:
      'Garantizar la imparcialidad y legalidad en la selección de personal de campo y en la validación de potenciales usuarios de Pensión 65 y Contigo frente a vínculos familiares y presiones políticas locales, activando oportunamente los mecanismos de prevención del conflicto de intereses sin paralizar el cronograma acordado con la UT del MIDIS.',
    paragraphs: [
      'Te desempeñas como Jefe/a de la Unidad Local de Empadronamiento (ULE) y Enlace Municipal de los programas Pensión 65 y Contigo en una municipalidad distrital de zona rural. Tras una emergencia climática que afectó a diversas comunidades del distrito, la municipalidad y la Unidad Territorial (UT) del MIDIS pusieron en marcha una campaña extraordinaria de cierre de brechas para actualizar la Clasificación Socioeconómica (CSE) en el Padrón General de Hogares e incorporar nuevos usuarios vulnerables antes del cierre de corte bimestral.',
      'Por disposición de la Gerencia de Desarrollo Social (tu superior inmediato), presides el comité encargado de seleccionar a seis empadronadores temporales de campo y, simultáneamente, tienes la responsabilidad funcional de revisar y validar el lote prioritario de expedientes de hogares que será remitido formalmente a la UT del MIDIS en un plazo de 72 horas.',
      'Al consolidar el cuadro de evaluación curricular de los postulantes a empadronadores, adviertes que la candidata que obtuvo el primer puesto en la evaluación técnica es prima hermana de tu cónyuge (parentesco por afinidad). Aunque no interviniste en la elaboración de su ficha ni alteraste su puntaje, tu firma como presidente del comité resulta determinante para aprobar el acta final y adjudicar la contratación.',
      'Esa misma mañana, un regidor distrital ingresa sin cita ni registro previo a tu oficina y te exige de manera insistente que incluyas y priorices de inmediato el expediente socioeconómico de su tío directo en el lote que enviarás a la UT del MIDIS, argumentando que "es una persona mayor de su sector y el alcalde respalda el pedido". Horas después, el presidente de una junta vecinal presenta un escrito formal por mesa de partes cuestionando la transparencia del concurso de empadronadores por el parentesco con la postulante y exigiendo tu separación inmediata de todo el proceso.',
      'El Coordinador Territorial de la UT del MIDIS te recuerda que, si el lote prioritario no ingresa validado dentro del cronograma establecido, más de 180 hogares en situación de pobreza extrema perderán el corte de afiliación a Pensión 65 y Contigo. Debes actuar con rigor ético, neutralidad y adaptabilidad operativa para resolver los conflictos sin detener la atención a la población vulnerable.'
    ],
    questions: [
      {
        id: '1.1',
        number: 1,
        title: 'Pregunta 1.1 · Diagnóstico técnico del conflicto de intereses',
        prompt:
          '¿Cómo se califican técnicamente las situaciones descritas respecto a la postulante emparentada con tu cónyuge y la solicitud del regidor distrital sobre su tío?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'No existe conflicto de intereses mientras la postulante haya obtenido el mayor puntaje técnico por mérito propio y aún no se firme su contrato.'
          },
          {
            id: 'B',
            text: 'Existe un conflicto de intereses real en el comité de selección por el vínculo de afinidad con la postulante, y un riesgo de afectación a la imparcialidad por la injerencia del regidor, que exigen prevención antes de que se consuma un beneficio indebido.'
          },
          {
            id: 'C',
            text: 'Solo existe un conflicto aparente causado por la queja del dirigente vecinal, el cual se resuelve publicando los puntajes finales en el mural municipal.'
          },
          {
            id: 'D',
            text: 'El conflicto únicamente se configura si el tío del regidor no cumple los requisitos socioeconómicos para ingresar a Pensión 65.'
          }
        ],
        rubric: {
          normativeBasis:
            'Guía de Gestión de Conflicto de Intereses (OII-MIDIS) y Art. 8.1 de la Ley N° 27815 (Prohibición de mantener intereses en conflicto).',
          rubricCriteria:
            'Distinguir el conflicto de intereses real respecto de la postulante (vínculo familiar actual que colisiona con el deber de decisión en el comité) y el riesgo de parcialidad por injerencia externa del regidor, precisando que el conflicto se configura por la colisión de intereses antes de que se consume un beneficio.',
          concepts: [
            {
              id: 'real',
              label: 'Conflicto de intereses real (vínculo familiar/afinidad vigente)',
              keywords: ['real', 'afinidad', 'conyuge', 'prima', 'parentesco', 'vinculo familiar']
            },
            {
              id: 'imparcialidad',
              label: 'Afectación a la imparcialidad y neutralidad funcional',
              keywords: ['imparcialidad', 'neutralidad', 'objetividad', 'deber funcional', 'interes publico']
            },
            {
              id: 'injerencia',
              label: 'Riesgo de injerencia política externa (regidor)',
              keywords: ['regidor', 'injerencia', 'presion', 'tio', 'tercero', 'influencia']
            },
            {
              id: 'preventivo',
              label: 'Configuración previa sin necesidad de beneficio consumado',
              keywords: ['antes', 'prevencion', 'preventivo', 'consuma', 'beneficio', 'colision']
            }
          ],
          missingComplement:
            'Para alcanzar el estándar completo de la rúbrica, precisa que el conflicto de intereses es REAL en el comité de selección porque el vínculo familiar por afinidad con tu cónyuge ya existe y colisiona con tu facultad decisoria (Art. 8.1 de la Ley N° 27815 y Guía OII-MIDIS), sin requerir que se firme el contrato ni que se consume un beneficio indebido; además, la presión del regidor compromete el principio de neutralidad e imparcialidad.',
          socraticOnCorrect:
            '¿Qué impacto institucional tendría en la legitimidad del padrón de Pensión 65 y Contigo si esperaras a que se firme el contrato para recién reportar el vínculo?',
          socraticOnIncorrect:
            'Si condicionaras la existencia de un conflicto de intereses únicamente al resultado final o al mérito técnico del familiar, ¿cómo garantizarías ante la ciudadanía que tu criterio como presidente del comité no estuvo influenciado por el vínculo?'
        }
      },
      {
        id: '1.2',
        number: 2,
        title: 'Pregunta 1.2 · Activación de mecanismos preventivos (excusación vs. recusación)',
        prompt:
          'Ante el parentesco con la postulante en el comité de selección y el escrito presentado por el presidente de la junta vecinal, ¿qué mecanismo preventivo corresponde activar de inmediato?',
        points: 1.5,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Esperar a que el presidente de la junta vecinal formalice una recusación con pruebas documentales y continuar presidiendo todas las etapas hasta que resuelva Asesoría Jurídica.'
          },
          {
            id: 'B',
            text: 'Descalificar automáticamente de oficio a la postulante emparentada para demostrar imparcialidad ante la junta vecinal sin informar al superior inmediato.'
          },
          {
            id: 'C',
            text: 'Formular de inmediato tu excusación (abstención) por escrito ante el Gerente de Desarrollo Social respecto a la evaluación y adjudicación de dicha postulante, solicitando la designación de un miembro suplente en el comité.'
          },
          {
            id: 'D',
            text: 'Delegar verbalmente la firma del acta final a otro integrante de la ULE y mantener tu participación en la deliberación para no retrasar el cronograma.'
          }
        ],
        rubric: {
          normativeBasis:
            'Guía de Gestión de Conflicto de Intereses en la Administración Pública (OII-MIDIS) y Art. 99 del TUO de la Ley N° 27444 (Causales de abstención).',
          rubricCriteria:
            'Diferenciar la excusación/abstención (deber proactivo e inmediato del propio servidor ante su superior jerárquico) de la recusación (planteada por terceros), tramitando el reemplazo formal sin vulnerar derechos de postulantes ni paralizar el comité.',
          concepts: [
            {
              id: 'excusacion',
              label: 'Excusación o abstención formal de oficio',
              keywords: ['excusacion', 'excusarse', 'abstencion', 'abstenerse', 'apartarse']
            },
            {
              id: 'superior',
              label: 'Comunicación escrita al superior inmediato (Gerente de Desarrollo Social)',
              keywords: ['gerente', 'superior', 'escrito', 'formal', 'inmediato']
            },
            {
              id: 'reemplazo',
              label: 'Designación de miembro suplente/reemplazo en el comité',
              keywords: ['suplente', 'reemplazo', 'comite', 'integrante']
            },
            {
              id: 'recusacion',
              label: 'Diferenciación frente a la recusación de terceros',
              keywords: ['recusacion', 'tercero', 'vecinal', 'dirigente', 'deber primario']
            }
          ],
          missingComplement:
            'La rúbrica exige distinguir que la EXCUSACIÓN (abstención) es un deber proactivo e inmediato del propio servidor ante su superior inmediato (Gerente de Desarrollo Social) apenas advierte la causal, sin esperar a que prospere la RECUSACIÓN planteada por el dirigente vecinal, ni descalificar arbitrariamente a la postulante vulnerando el debido procedimiento.',
          socraticOnCorrect:
            '¿Por qué sería igualmente irregular descalificar de oficio a la postulante emparentada en lugar de tramitar tu excusación formal y dejar que un suplente evalúe su expediente?',
          socraticOnIncorrect:
            'Si esperas a que un tercero te recuse o delegas solo la firma manteniendo tu voz en el comité, ¿qué vicio de nulidad o responsabilidad administrativa recaería sobre el proceso de contratación?'
        }
      },
      {
        id: '1.3',
        number: 3,
        title: 'Pregunta 1.3 · Trazabilidad y transparencia frente a injerencias políticas',
        prompt:
          '¿Qué medidas preventivas de transparencia institucional debes aplicar frente a la visita informal del regidor distrital y la gestión del comité de selección?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Atender el pedido del regidor de manera reservada para evitar conflictos políticos con el Concejo Municipal, evaluando el expediente de su tío por canales internos.'
          },
          {
            id: 'B',
            text: 'Exigir y consignar la audiencia en el Registro de Visitas en Línea / Agendas Oficiales detallando el motivo de la gestión, rechazar cualquier priorización ajena a los criterios técnicos del Sisfho y verificar la Declaración Jurada de Intereses (DJI).'
          },
          {
            id: 'C',
            text: 'Suspender temporalmente el ingreso de solicitudes de Clasificación Socioeconómica (CSE) en todo el distrito hasta que culmine el periodo de fiscalización del regidor.'
          },
          {
            id: 'D',
            text: 'Remitir el expediente del tío del regidor directamente a la UT del MIDIS con una nota indicando que fue recomendado por una autoridad electa.'
          }
        ],
        rubric: {
          normativeBasis:
            'Ley N° 28024 (Gestión de Intereses y Registro de Visitas en Línea), Ley N° 31227 (Declaración Jurada de Intereses) y Art. 7.1 de la Ley N° 27815 (Neutralidad).',
          rubricCriteria:
            'Aplicar herramientas concretas de trazabilidad (Registro de Visitas en Línea / Agendas Oficiales) frente a gestiones de intereses informales, sujetar la focalización exclusivamente a criterios técnicos del Sisfho y verificar la Declaración Jurada de Intereses (DJI).',
          concepts: [
            {
              id: 'visitas',
              label: 'Registro de Visitas en Línea / Agendas Oficiales',
              keywords: ['registro de visitas', 'agenda', 'visitas en linea', 'trazabilidad', 'audiencia']
            },
            {
              id: 'dji',
              label: 'Declaración Jurada de Intereses (DJI)',
              keywords: ['declaracion jurada', 'dji', '31227', 'vinculos']
            },
            {
              id: 'criterios',
              label: 'Sujeción estricta a criterios técnicos de focalización (Sisfho)',
              keywords: ['sisfho', 'criterios tecnicos', 'merito', 'orden de prelacion', 'neutralidad']
            }
          ],
          missingComplement:
            'Completa tu sustento integrando los dos instrumentos preventivos clave de la rúbrica: el registro obligatorio de la audiencia del regidor en el Registro de Visitas en Línea / Agendas Oficiales (Ley N° 28024) para dejar trazabilidad de la gestión de intereses, y la verificación/actualización de la Declaración Jurada de Intereses (Ley N° 31227) junto con la aplicación estricta de los criterios objetivos del Sisfho.',
          socraticOnCorrect:
            '¿De qué manera el Registro de Visitas en Línea y la Declaración Jurada de Intereses te protegen administrativamente si el regidor alega posteriormente que te negaste a atender a un vecino?',
          socraticOnIncorrect:
            'Cuando una autoridad local realiza una gestión verbal fuera de agenda oficial para favorecer a un familiar, ¿qué riesgo asume el servidor si no deja trazabilidad institucional de dicha visita?'
        }
      },
      {
        id: '1.4',
        number: 4,
        title: 'Pregunta 1.4 · Adaptabilidad y articulación colaborativa con la UT del MIDIS',
        prompt:
          '¿Cómo debes articular con el/la Coordinador/a Territorial de la UT del MIDIS para cumplir el plazo de cierre de brechas sin comprometer la integridad del proceso?',
        points: 2.0,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Devolver todos los expedientes a la UT del MIDIS y solicitar la postergación indefinida del cierre de corte hasta que se resuelva el escrito del dirigente vecinal.'
          },
          {
            id: 'B',
            text: 'Remitir el lote completo incluyendo el expediente del familiar del regidor bajo observación verbal para que la UT del MIDIS asuma la responsabilidad de filtrarlo.'
          },
          {
            id: 'C',
            text: 'Comunicar formalmente a la UT del MIDIS la abstención parcial tramitada ante el superior inmediato, asegurar la validación y envío oportuno del resto del lote de hogares sin conflicto con asistencia técnica de la UT, y encauzar el expediente del familiar del regidor por el conducto regular verificable.'
          },
          {
            id: 'D',
            text: 'Asumir personalmente la validación de todos los expedientes argumentando estado de emergencia climática para evitar demoras administrativas.'
          }
        ],
        rubric: {
          normativeBasis:
            'Principios de Adaptabilidad, Articulación Intergubernamental y Protección del Interés Público (Ley N° 27815, Art. 6 y 7; Directiva operativa Sisfho/MIDIS).',
          rubricCriteria:
            'Demostrar adaptabilidad operativa y articulación colaborativa: acotar la abstención exclusivamente a los actos en conflicto (sin paralizar todo el servicio), coordinar formalmente con la UT del MIDIS para cumplir el corte en beneficio de los 180 hogares vulnerables y mantener trazabilidad en el conducto regular.',
          concepts: [
            {
              id: 'abstencion_parcial',
              label: 'Abstención parcial acotada sin paralizar el servicio',
              keywords: ['parcial', 'sin paralizar', 'continuidad', 'resto del lote', 'no detener']
            },
            {
              id: 'articulacion_ut',
              label: 'Coordinación formal y asistencia técnica con la UT del MIDIS',
              keywords: ['unidad territorial', 'ut', 'midis', 'coordinador', 'articulacion', 'asistencia tecnica']
            },
            {
              id: 'usuarios',
              label: 'Protección del derecho de los hogares vulnerables al corte',
              keywords: ['usuarios', 'hogares', 'vulnerables', 'plazo', 'corte', 'pension 65', 'contigo']
            }
          ],
          missingComplement:
            'La rúbrica destaca la adaptabilidad operativa: la ética pública no consiste en paralizar el servicio afectando a 180 hogares vulnerables, sino en acotar la abstención estrictamente al expediente en conflicto, comunicar formalmente la medida al Coordinador Territorial de la UT del MIDIS y sostener el envío oportuno del resto del padrón con trazabilidad.',
          socraticOnCorrect:
            '¿Cómo equilibra esta decisión el deber de probidad con el principio de eficiencia y protección social hacia los adultos mayores y personas con discapacidad severa del distrito?',
          socraticOnIncorrect:
            'Si paralizas todo el padrón o trasladas la responsabilidad ética a la UT del MIDIS sin filtrar ni documentar tu actuación, ¿quiénes resultan finalmente perjudicados por la falta de articulación?'
        }
      }
    ]
  },
  {
    id: 'caso-2',
    number: 2,
    axis: 'Transparencia de recursos y custodia',
    title: 'Caso 2: Uso de recursos en custodia y transparencia en la entrega alimentaria',
    subtitle: 'Protección de bienes en custodia, límites al deber de obediencia y transparencia activa',
    protagonistRole: 'Subgerente/a de Programas Sociales y Complementación Alimentaria (Municipalidad Provincial)',
    articulationLevel: 'Gobierno Local (Municipalidad Provincial) en articulación con el Gobierno Regional (Gerencia Regional de Desarrollo Social) y el equipo territorial del MIDIS (PCA y Ollas Comunes)',
    secondaryActors: [
      'Gerente Municipal (funcionario de confianza y superior inmediato)',
      'Representante de empresa proveedora de alimentos del PCA',
      'Presidenta de una red de ollas comunes',
      'Especialista de la Gerencia Regional de Desarrollo Social (GORE)',
      'Gestor/a territorial del MIDIS'
    ],
    criticalDilemma:
      'Resistir una orden superior orientada al proselitismo político con recursos alimentarios en custodia, rechazar un ofrecimiento de ventaja indebida en la cadena de suministro y garantizar transparencia activa hacia las organizaciones sociales de base en coordinación con el GORE y el MIDIS.',
    paragraphs: [
      'Te desempeñas como Subgerente/a de Programas Sociales y Complementación Alimentaria en una municipalidad provincial. Tras recibir una transferencia presupuestal extraordinaria para la atención alimentaria de comedores populares y ollas comunes, tu Subgerencia custodia en el almacén municipal un lote de alimentos no perecibles del Programa de Complementación Alimentaria (PCA) y administra dos camionetas asignadas exclusivamente a la supervisión de centros de atención alimentaria.',
      'A dos semanas de una actividad proselitista en la provincia, el Gerente Municipal (tu superior inmediato) te convoca a su despacho y te ordena verbalmente disponer de las dos camionetas institucionales y retirar 150 canastas de alimentos del almacén del PCA para repartirlas ese fin de semana en una "jornada cívica" organizada por una agrupación política local, argumentando que "igual se entrega a población pobre y agiliza la ejecución presupuestal".',
      'Ese mismo día, el representante de una empresa proveedora —cuya última entrega de conservas y menestras tiene observaciones técnicas pendientes por incumplimiento de especificaciones de calidad— te visita y ofrece cubrir "los gastos de combustible y viáticos de tu equipo supervisor" a cambio de que firmes el acta de conformidad sin aplicar penalidades.',
      'Paralelamente, la presidenta de una red distrital de ollas comunes ingresa una solicitud formal por mesa de partes requiriendo el cronograma de distribución, los criterios técnicos de asignación y el stock actualizado del almacén, señalando que existen rumores vecinales sobre un presunto desvío de raciones hacia actividades políticas.',
      'El especialista de la Gerencia Regional de Desarrollo Social (GORE) y el gestor territorial del MIDIS han programado una mesa técnica de seguimiento para verificar el cumplimiento de metas de entrega alimentaria en la provincia. Debes tomar decisiones firmes y transparentes para proteger los bienes públicos en custodia y asegurar la continuidad del servicio.'
    ],
    questions: [
      {
        id: '2.1',
        number: 5,
        title: 'Pregunta 2.1 · Diagnóstico de prohibiciones éticas y bienes protegidos',
        prompt:
          '¿Qué infracciones éticas se configuran en la disposición de camionetas y canastas para la "jornada cívica" y en el ofrecimiento económico del proveedor?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'No se configura infracción ética respecto a las canastas porque provienen de una transferencia sectorial destinada a población pobre, y el ofrecimiento del proveedor solo constituye una falta administrativa menor.'
          },
          {
            id: 'B',
            text: 'Se configuran las prohibiciones éticas de realizar actividades de proselitismo político mediante el uso de bienes públicos y recursos de programas sociales en custodia, así como de obtener o procurar ventajas indebidas.'
          },
          {
            id: 'C',
            text: 'Únicamente existe una falta de planificación logística en el uso de las camionetas, siempre que el proveedor entregue el dinero mediante recibo simple.'
          },
          {
            id: 'D',
            text: 'Solo habría infracción ética si el Subgerente/a participa personalmente vistiendo distintivos partidarios durante el reparto.'
          }
        ],
        rubric: {
          normativeBasis:
            'Art. 8.2 (Obtener ventajas indebidas) y Art. 8.3 (Realizar actividades de proselitismo político) de la Ley N° 27815; Art. 3 del Reglamento aprobado por DS N° 033-2005-PCM (Definición de Bienes del Estado y bienes en custodia).',
          rubricCriteria:
            'Identificar simultáneamente el proselitismo político con bienes públicos/recursos en custodia y la obtención/procuración de ventajas indebidas, precisando que la protección alcanza a bienes destinados a programas sociales bajo custodia municipal.',
          concepts: [
            {
              id: 'proselitismo',
              label: 'Prohibición de proselitismo político con bienes públicos',
              keywords: ['proselitismo', 'politico', 'partidario', 'agrupacion', 'jornada civica']
            },
            {
              id: 'custodia',
              label: 'Protección de bienes en custodia y patrimonio institucional',
              keywords: ['custodia', 'bienes', 'almacen', 'canastas', 'camionetas', 'patrimonio', 'ds 033']
            },
            {
              id: 'ventaja',
              label: 'Prohibición de obtener o procurar ventajas indebidas (soborno/dádiva)',
              keywords: ['ventaja indebida', 'ventajas indebidas', 'soborno', 'dadiva', 'proveedor', 'combustible', 'viaticos']
            },
            {
              id: 'ley27815',
              label: 'Referencia a la Ley N° 27815 / Reglamento DS N° 033-2005-PCM',
              keywords: ['27815', 'codigo de etica', '033-2005', 'articulo 8']
            }
          ],
          missingComplement:
            'Para completar el análisis según la rúbrica, precisa que el Art. 3 del Reglamento de la Ley N° 27815 (DS N° 033-2005-PCM) equipara los bienes de terceros o de programas sociales bajo custodia municipal al patrimonio del Estado: usar las camionetas o las 150 canastas del PCA en una actividad partidaria configura proselitismo político (Art. 8.3), mientras que aceptar combustible o viáticos del proveedor constituye ventaja indebida (Art. 8.2).',
          socraticOnCorrect:
            '¿Por qué el argumento del Gerente Municipal ("igual se entrega a población pobre") no legitima ni atenúa la infracción ética ni la responsabilidad administrativa y penal por peculado de uso?',
          socraticOnIncorrect:
            'Si se permitiera disponer de alimentos del PCA en actos organizados por agrupaciones políticas bajo el argumento de atender pobreza, ¿qué ocurriría con la neutralidad del Estado y el derecho de los comedores empadronados?'
        }
      },
      {
        id: '2.2',
        number: 6,
        title: 'Pregunta 2.2 · Límites del deber de obediencia frente a órdenes superiores',
        prompt:
          'Frente a la instrucción verbal del Gerente Municipal de retirar las 150 canastas y usar las camionetas en la jornada política, ¿cuál es la conducta exigible al Subgerente/a?',
        points: 1.5,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Cumplir la orden invocando el principio de obediencia jerárquica, solicitando posteriormente un memorándum de regularización al Gerente Municipal.'
          },
          {
            id: 'B',
            text: 'Entregar únicamente las camionetas pero retener las canastas del PCA como solución intermedia para evitar represalias laborales.'
          },
          {
            id: 'C',
            text: 'Negarse a ejecutar la orden por constituir una ilegalidad manifiesta y desviación de recursos públicos, dejar constancia escrita fundamentada de la negativa y poner el hecho en conocimiento de la instancia competente / Órgano de Control Institucional.'
          },
          {
            id: 'D',
            text: 'Solicitar vacaciones inmediatas durante esa semana para que el encargado de almacén decida directamente bajo responsabilidad.'
          }
        ],
        rubric: {
          normativeBasis:
            'Art. 6.7 (Justicia y Equidad / Legalidad) y Art. 7.6 (Responsabilidad) de la Ley N° 27815; Art. 16 de la Ley N° 28175 (Límites del deber de obediencia ante órdenes manifiestamente ilegales).',
          rubricCriteria:
            'Fundamentar que el deber de obediencia jerárquica tiene como límite infranqueable la Constitución y la ley; ante una orden manifiestamente ilegal o ilícita, el servidor debe negarse, documentar por escrito su negativa y reportar a la instancia competente / OCI.',
          concepts: [
            {
              id: 'negativa',
              label: 'Negativa firme a ejecutar una orden manifiestamente ilegal',
              keywords: ['negarse', 'rechazar', 'no ejecutar', 'ilegal', 'arbitraria', 'ilicita']
            },
            {
              id: 'limite_obediencia',
              label: 'Límites del deber de obediencia jerárquica',
              keywords: ['obediencia', 'jerarquia', 'superior', 'lealtad', 'limite']
            },
            {
              id: 'constancia',
              label: 'Constancia escrita y reporte al OCI / instancia competente',
              keywords: ['escrito', 'constancia', 'informe', 'oci', 'control', 'denunciar', 'comunicar']
            }
          ],
          missingComplement:
            'En la rúbrica es indispensable señalar que el deber de obediencia jerárquica NO ampara órdenes manifiestamente ilegales ni el uso político de bienes en custodia; por ello, corresponde negarse expresamente, dejar constancia escrita del sustento normativo de la negativa y comunicar el hecho al Órgano de Control Institucional (OCI) o instancia competente.',
          socraticOnCorrect:
            '¿Qué consecuencias legales enfrentarías si ejecutabas la orden verbal del Gerente Municipal alegando únicamente que "cumplías instrucciones de tu superior inmediato"?',
          socraticOnIncorrect:
            '¿Puede un servidor público eximirse de responsabilidad administrativa o penal cuando ejecuta una orden verbal que desvía recursos destinados a programas sociales hacia una actividad proselitista?'
        }
      },
      {
        id: '2.3',
        number: 7,
        title: 'Pregunta 2.3 · Transparencia de recursos y gestión ante el proveedor',
        prompt:
          '¿Qué acciones inmediatas corresponden frente al requerimiento de información de la presidenta de la olla común y la oferta del proveedor observado?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Postergar la respuesta a la olla común hasta que se resuelva la controversia con el proveedor para no generar alarma vecinal, y aceptar el apoyo de combustible con cargo a rendición.'
          },
          {
            id: 'B',
            text: 'Entregar información fidedigna, completa y oportuna sobre stocks, cronogramas y criterios de asignación a la organización social; mantener las observaciones técnicas al proveedor aplicando las penalidades contractuales; y reportar el intento de soborno.'
          },
          {
            id: 'C',
            text: 'Responder a la olla común que la información del almacén es de uso interno reservado y conceder al proveedor un plazo gracioso sin penalidades a cambio de mejorar la siguiente entrega.'
          },
          {
            id: 'D',
            text: 'Entregar las raciones observadas directamente a la red de ollas comunes para evitar desabastecimiento y cerrar el expediente contractual.'
          }
        ],
        rubric: {
          normativeBasis:
            'Art. 7.2 (Transparencia) y Art. 7.5 (Uso Adecuado de los Bienes del Estado) de la Ley N° 27815; TUO de la Ley N° 27806 (Ley de Transparencia y Acceso a la Información Pública) y normativa de contrataciones.',
          rubricCriteria:
            'Vincular el deber de transparencia activa (entrega oportuna y fidedigna de stocks, cronogramas y criterios de asignación) con la firmeza contractual frente a observaciones de calidad y la denuncia del ofrecimiento de ventaja indebida.',
          concepts: [
            {
              id: 'transparencia',
              label: 'Transparencia activa: entrega fidedigna y oportuna de stocks y criterios',
              keywords: ['transparencia', 'stock', 'cronograma', 'criterios', 'informacion', 'fidedigna', 'oportuna']
            },
            {
              id: 'observaciones',
              label: 'Mantenimiento de observaciones técnicas y penalidades al proveedor',
              keywords: ['observaciones', 'penalidades', 'calidad', 'conformidad', 'contrato', 'incumplimiento']
            },
            {
              id: 'reporte_soborno',
              label: 'Rechazo y reporte formal del intento de soborno/ventaja indebida',
              keywords: ['reportar', 'denunciar', 'soborno', 'integridad', 'abastecimiento', 'rechazar']
            }
          ],
          missingComplement:
            'Tu respuesta debe articular dos frentes inseparables de la rúbrica: (1) el deber de Transparencia (Art. 7.2 de la Ley N° 27815) de entregar información veraz, completa y oportuna sobre stocks y criterios de asignación a las ollas comunes, y (2) la integridad contractual de sostener las observaciones de calidad, aplicar penalidades y reportar formalmente el intento de soborno del proveedor.',
          socraticOnCorrect:
            '¿Cómo fortalece la transparencia activa sobre stocks y criterios de distribución la confianza de las organizaciones sociales de base frente a rumores de desvío político?',
          socraticOnIncorrect:
            'Si se oculta información pública sobre stocks o se flexibilizan observaciones de calidad a cambio de beneficios logísticos, ¿qué impacto directo sufre la seguridad alimentaria de los usuarios del PCA?'
        }
      },
      {
        id: '2.4',
        number: 8,
        title: 'Pregunta 2.4 · Articulación multinivel GORE – GL – MIDIS para la continuidad del servicio',
        prompt:
          '¿Cómo debes articular con la Gerencia Regional de Desarrollo Social (GORE) y el equipo territorial del MIDIS para asegurar la entrega íntegra de las raciones en la provincia?',
        points: 2.0,
        correctOption: 'C',
        options: [
          {
            id: 'A',
            text: 'Solicitar que el MIDIS asuma directamente el reparto diario en todos los comedores para desligar a la municipalidad de cualquier responsabilidad operativa.'
          },
          {
            id: 'B',
            text: 'Mantener la gestión exclusivamente dentro de la municipalidad sin informar al GORE ni al MIDIS para proteger la autonomía local.'
          },
          {
            id: 'C',
            text: 'Activar el comité de gestión y monitoreo conjunto con participación de los comités de vigilancia ciudadana, el especialista del GORE y el gestor territorial del MIDIS para auditar el padrón de entrega, verificar la trazabilidad del almacén y ejecutar la reposición inmediata de los lotes observados.'
          },
          {
            id: 'D',
            text: 'Distribuir las raciones disponibles únicamente a las organizaciones que no presentaron quejas por mesa de partes.'
          }
        ],
        rubric: {
          normativeBasis:
            'Modelo de Gestión Descentralizada del PCA / Ollas Comunes (MIDIS), Control Social y Articulación Intergubernamental (GORE – GL – MIDIS).',
          rubricCriteria:
            'Demostrar articulación multinivel (GORE – Gobierno Local – MIDIS) combinada con control social (comités de vigilancia ciudadana de comedores y ollas comunes) para auditar el almacén, asegurar trazabilidad y garantizar la entrega íntegra.',
          concepts: [
            {
              id: 'multinivel',
              label: 'Articulación multinivel GORE – Gobierno Local – MIDIS',
              keywords: ['gore', 'gobierno regional', 'midis', 'articulacion', 'conjunto', 'mesa tecnica', 'comite de gestion']
            },
            {
              id: 'control_social',
              label: 'Vigilancia ciudadana y participación de organizaciones sociales',
              keywords: ['vigilancia', 'ciudadana', 'comites', 'ollas comunes', 'comedores', 'control social']
            },
            {
              id: 'trazabilidad',
              label: 'Auditoría de padrón, trazabilidad de almacén y reposición de lotes',
              keywords: ['trazabilidad', 'almacen', 'padron', 'reposicion', 'entrega integra', 'auditar']
            }
          ],
          missingComplement:
            'La rúbrica enfatiza que el blindaje frente a presiones internas se logra mediante articulación colaborativa multinivel (Subgerencia Provincial + Gerencia Regional de Desarrollo Social del GORE + Gestor Territorial del MIDIS) sumada al control social de los comités de vigilancia ciudadana sobre el almacén y el padrón de entrega.',
          socraticOnCorrect:
            '¿Por qué la participación de los comités de vigilancia ciudadana junto con el GORE y el MIDIS reduce drásticamente el riesgo de captura política de los alimentos en territorio?',
          socraticOnIncorrect:
            '¿Qué ocurre cuando un gestor local intenta enfrentar presiones políticas internas en aislamiento, sin activar los mecanismos de monitoreo conjunto con el GORE, el MIDIS y la vigilancia ciudadana?'
        }
      }
    ]
  },
  {
    id: 'caso-3',
    number: 3,
    axis: 'Canales de denuncia y protección',
    title: 'Caso 3: Filtración de denuncias, reserva de identidad y protección laboral en la articulación regional',
    subtitle: 'Canales de denuncia, plazos perentorios, principio de reserva y articulación GORE – MIDIS',
    protagonistRole: 'Gerente/a o Director/a Regional de Desarrollo e Inclusión Social del Gobierno Regional (GORE), copresidente/a de la Instancia de Articulación Regional (IAR)',
    articulationLevel: 'Gobierno Regional (GORE) en articulación directa con las Unidades Territoriales de Cuna Más y Juntos (PPSS del MIDIS) en el marco de la Instancia de Articulación Regional (IAR)',
    secondaryActors: [
      'Especialista social regional (contratada bajo modalidad temporal con vínculo próximo a vencer)',
      'Jefe/a de Equipo Territorial del GORE (denunciado y jefe inmediato de la especialista)',
      'Jefes/as de las Unidades Territoriales de Cuna Más y Juntos del MIDIS',
      'Jefe/a de la Oficina General de Recursos Humanos (OGRH)',
      'Periodista local'
    ],
    criticalDilemma:
      'Canalizar la denuncia cumpliendo estrictamente los plazos y reglas de confidencialidad entre el GORE y el MIDIS, activar medidas de protección laboral efectivas frente a represalias contractuales y denegar legalmente la divulgación de información reservada sin interrumpir el servicio a las familias de Cuna Más y Juntos.',
    paragraphs: [
      'Te desempeñas como Gerente/a o Director/a Regional de Desarrollo e Inclusión Social de un Gobierno Regional (GORE) y copresides la Instancia de Articulación Regional (IAR) orientada al cierre de brechas del paquete integrado de Desarrollo Infantil Temprano (DIT). En dicho espacio coordinas permanentemente con las Unidades Territoriales de los programas nacionales Cuna Más y Juntos del MIDIS.',
      'Al concluir una sesión descentralizada de la IAR, una especialista social del GORE —que realiza seguimiento en campo junto con acompañantes técnicos de Cuna Más y gestores locales de Juntos— solicita hablar contigo en privado y te entrega en un sobre cerrado audios y copias de actas adulteradas. Las evidencias muestran que un coordinador territorial de un Programa Nacional del MIDIS y un jefe de equipo del GORE cobran "cupos" económicos y condicionan la afiliación de familias usuarias.',
      'La especialista solicita expresamente reserva de identidad y medidas de protección laboral, pues su contrato administrativo temporal vence en diez (10) días calendario y su jefe inmediato (precisamente el jefe de equipo denunciado) ya le comunicó verbalmente que no le renovará el contrato. Además, manifiesta temor porque semanas atrás otro servidor reportó irregularidades similares y su comunicación fue tramitada como una simple queja administrativa sin reserva, exponiendo su identidad.',
      'A la mañana siguiente, un periodista de un medio local ingresa una solicitud formal de acceso a la información pública pidiendo copia íntegra de todas las denuncias recibidas durante la sesión descentralizada de la IAR y los nombres completos de los funcionarios involucrados.',
      'Debes activar de inmediato los canales oficiales de integridad entre el GORE y el MIDIS, proteger eficazmente la estabilidad contractual e identidad de la denunciante, responder con rigor legal al pedido de prensa y reorganizar la cobertura operativa en campo para que las familias de Cuna Más y Juntos no pierdan atención.'
    ],
    questions: [
      {
        id: '3.1',
        number: 9,
        title: 'Pregunta 3.1 · Diagnóstico del canal y calificación del trámite',
        prompt:
          '¿Por qué fue erróneo tramitar el caso previo como queja administrativa y cuál es la vía correcta para canalizar la denuncia actual?',
        points: 1.5,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Porque toda comunicación recibida en territorio debe ingresar primero por Mesa de Partes común como reclamo ciudadano y luego evaluarse en sesión ordinaria del Consejo Regional.'
          },
          {
            id: 'B',
            text: 'Porque los hechos presentan fundamento e indicios razonables de presuntos actos de corrupción con materialidad que afecta el acceso a los programas sociales; por ello corresponde canalizarla como denuncia reservada ante la Oficina de Integridad Institucional (OII) / Plataforma Digital Única de Denuncias del Ciudadano, y no como queja por defecto de tramitación.'
          },
          {
            id: 'C',
            text: 'Porque debió derivarse directamente al jefe inmediato del área denunciada para que realice una indagación preliminar antes de informar a Integridad.'
          },
          {
            id: 'D',
            text: 'Porque solo puede tramitarse como denuncia de corrupción cuando existe una sentencia penal firme contra los implicados.'
          }
        ],
        rubric: {
          normativeBasis:
            'Directiva N° 001-2022-MIDIS Versión 02 (RM N° 157-2026-MIDIS) y Decreto Supremo N° 002-2020-JUS (Plataforma Digital Única de Denuncias del Ciudadano).',
          rubricCriteria:
            'Diferenciar el reclamo/queja por defecto de tramitación de una denuncia por presuntos actos de corrupción sustentada en criterios de fundamento (indicios razonables) y materialidad (afectación al servicio y vínculo funcional), canalizándola por la OII / Plataforma Digital Única.',
          concepts: [
            {
              id: 'denuncia_vs_queja',
              label: 'Diferenciación entre queja administrativa y denuncia de corrupción',
              keywords: ['queja', 'reclamo', 'denuncia', 'corrupcion', 'cupos', 'defecto de tramitacion']
            },
            {
              id: 'fundamento_materialidad',
              label: 'Criterios de fundamento (indicios) y materialidad',
              keywords: ['fundamento', 'materialidad', 'indicios', 'audios', 'actas', 'pruebas']
            },
            {
              id: 'canal_oii',
              label: 'Canalización mediante Oficina de Integridad Institucional (OII) / Plataforma Única',
              keywords: ['oficina de integridad', 'oii', 'plataforma digital', 'canal', 'reserva']
            }
          ],
          missingComplement:
            'La Directiva N° 001-2022-MIDIS (Versión 02, aprobada por RM N° 157-2026-MIDIS) distingue claramente: mientras un reclamo o queja por defecto de tramitación se deriva a Atención al Ciudadano, una comunicación con FUNDAMENTO (hechos e indicios razonables de cobro de cupos) y MATERIALIDAD (afectación al acceso a PPSS y vínculo funcional) es una denuncia por presunto acto de corrupción que debe ingresar por la Oficina de Integridad Institucional (OII) o la Plataforma Digital Única de Denuncias del Ciudadano.',
          socraticOnCorrect:
            '¿Qué efecto disuasivo genera en los servidores territoriales confundir una denuncia de corrupción con una queja administrativa ordinaria sin reserva de identidad?',
          socraticOnIncorrect:
            'Si se tramitan cobros indebidos y adulteración de actas como una simple queja administrativa o se remiten al jefe del área denunciada, ¿qué ocurre con la reserva de identidad y las evidencias?'
        }
      },
      {
        id: '3.2',
        number: 10,
        title: 'Pregunta 3.2 · Flujo de derivación y plazos perentorios',
        prompt:
          '¿Cuál es el procedimiento y plazo obligatorio para remitir la denuncia recibida en territorio hacia las instancias competentes del MIDIS/Programa Nacional y del GORE?',
        points: 1.5,
        correctOption: 'A',
        options: [
          {
            id: 'A',
            text: 'Remitirla en un plazo máximo de un (1) día hábil, en sobre cerrado confidencial o medio digital seguro, a la Oficina de Integridad Institucional (OII) del Programa Nacional/MIDIS y a la instancia de integridad/STPAD regional, asignando un código cifrado.'
          },
          {
            id: 'B',
            text: 'Acumular las evidencias durante quince (15) días hábiles para realizar primero una auditoría interna completa antes de trasladar el expediente a la OII.'
          },
          {
            id: 'C',
            text: 'Enviar copia simple por correo electrónico institucional abierto a todos los integrantes de la Instancia de Articulación Regional (IAR) para conocimiento.'
          },
          {
            id: 'D',
            text: 'Remitir únicamente los audios sin mencionar la solicitud de protección laboral hasta que la STPAD inicie procedimiento disciplinario.'
          }
        ],
        rubric: {
          normativeBasis:
            'Directiva N° 001-2022-MIDIS Versión 02 (Plazo máximo de 1 día hábil para remisión desde territorio) y Art. 4 del Reglamento del D. Leg. N° 1327 (DS N° 010-2017-JUS: código cifrado y verificación en 2 días hábiles).',
          rubricCriteria:
            'Precisar el plazo perentorio de un (1) día hábil para la remisión confidencial (sobre cerrado o canal digital seguro) a la OII del Programa Nacional/MIDIS y a la instancia de integridad/STPAD regional, con asignación de código cifrado.',
          concepts: [
            {
              id: 'plazo_1_dia',
              label: 'Plazo máximo de un (1) día hábil para derivación',
              keywords: ['1 dia', 'un dia', 'dia habil', '24 horas', 'inmediato']
            },
            {
              id: 'codigo_cifrado',
              label: 'Asignación de código cifrado de protección de identidad',
              keywords: ['codigo cifrado', 'cifrado', 'anonimato', 'identidad', 'confidencial', 'sobre cerrado']
            },
            {
              id: 'instancias',
              label: 'Derivación simultánea a OII del MIDIS/Programa Nacional e instancia regional',
              keywords: ['oii', 'programa nacional', 'midis', 'stpad', 'integridad']
            }
          ],
          missingComplement:
            'Según la Directiva N° 001-2022-MIDIS (Versión 02) y el Reglamento del D. Leg. N° 1327, toda denuncia recibida en territorio debe remitirse en un plazo máximo de UN (1) DÍA HÁBIL en sobre cerrado confidencial o medio digital seguro a la OII del Programa Nacional/MIDIS y a la instancia de integridad/STPAD regional, asignando un CÓDIGO CIFRADO antes de la verificación de requisitos (2 días hábiles).',
          socraticOnCorrect:
            '¿Por qué el plazo perentorio de 1 día hábil y el código cifrado son críticos cuando el denunciado ocupa una jefatura con capacidad de decidir sobre contratos temporales?',
          socraticOnIncorrect:
            'Si demoras días o semanas en derivar una denuncia recibida en territorio o la circulas por canales abiertos, ¿cómo se compromete la cadena de custodia y la seguridad del denunciante?'
        }
      },
      {
        id: '3.3',
        number: 11,
        title: 'Pregunta 3.3 · Medidas de protección laboral y principio de reserva ante prensa',
        prompt:
          '¿Qué medidas de protección laboral corresponden a la especialista social y cómo debe responderse a la solicitud de acceso a la información presentada por el periodista?',
        points: 2.0,
        correctOption: 'B',
        options: [
          {
            id: 'A',
            text: 'Esperar a que venza su contrato para evaluar una nueva convocatoria abierta, y entregar al periodista una versión testada con los hechos de la denuncia.'
          },
          {
            id: 'B',
            text: 'Disponer la renovación de su relación contractual frente a la anunciada no-renovación por represalia (además de evaluar traslado temporal o licencia/exoneración del denunciado si hay riesgo inminente), y denegar formalmente la solicitud del periodista por carácter confidencial.'
          },
          {
            id: 'C',
            text: 'Trasladar a la denunciante a una sede alejada reduciendo su remuneración para protegerla, y entregar los nombres de los denunciados al periodista en aras de la transparencia.'
          },
          {
            id: 'D',
            text: 'Pedir autorización verbal al jefe denunciado antes de renovar el contrato de la especialista, y derivar el pedido del periodista a la Oficina de Imagen Institucional.'
          }
        ],
        rubric: {
          normativeBasis:
            'Art. 6.2 del Reglamento del D. Leg. N° 1327 (DS N° 010-2017-JUS: renovación contractual, traslado sin afectación y licencia/exoneración del denunciado) y Art. 3 del DS N° 010-2017-JUS en concordancia con el Art. 17.3 del TUO de la Ley N° 27806 (Excepción de confidencialidad).',
          rubricCriteria:
            'Aplicar la medida específica de renovación de la relación contractual ante represalia de no-renovación (y traslado temporal o licencia del denunciado sin afectar derechos de la denunciante) y denegar legalmente la solicitud de acceso a la información pública invocando el principio de reserva y el Art. 17.3 del TUO de la Ley de Transparencia.',
          concepts: [
            {
              id: 'renovacion',
              label: 'Renovación de la relación contractual frente a represalia',
              keywords: ['renovacion', 'contrato', 'contractual', 'no renovacion', 'represalia']
            },
            {
              id: 'traslado_licencia',
              label: 'Traslado temporal sin afectar condiciones o licencia/exoneración del denunciado',
              keywords: ['traslado', 'licencia', 'exoneracion', 'denunciado', 'sin afectar', 'condiciones']
            },
            {
              id: 'denegar_prensa',
              label: 'Denegatoria legal al periodista por carácter confidencial (Art. 17.3 TUO Ley 27806)',
              keywords: ['denegar', 'negar', 'periodista', 'confidencial', 'reserva', '17.3', 'transparencia']
            }
          ],
          missingComplement:
            'La rúbrica exige integrar dos pilares legales: (1) el Art. 6.2 del Reglamento del D. Leg. N° 1327 (DS N° 010-2017-JUS), que contempla expresamente la RENOVACIÓN de la relación contractual ante una anunciada no-renovación por represalia (así como el traslado temporal sin afectar condiciones o la licencia/exoneración del denunciado), y (2) la DENEGATORIA al pedido del periodista por tratarse de información confidencial protegida por el principio de reserva (Art. 3 del DS N° 010-2017-JUS y Art. 17.3 del TUO de la Ley N° 27806).',
          socraticOnCorrect:
            '¿Por qué el principio de reserva prohíbe divulgar incluso la existencia o contenido de la denuncia ante el periodista o superiores jerárquicos, aunque se omita el nombre de la denunciante?',
          socraticOnIncorrect:
            'Si permites que venza el contrato de quien denunció actos de corrupción o entregas información de una denuncia en trámite a la prensa, ¿qué garantías reales quedan para cualquier servidor que detecte cobros ilegales en los programas sociales?'
        }
      },
      {
        id: '3.4',
        number: 12,
        title: 'Pregunta 3.4 · Articulación colaborativa GORE – UT MIDIS frente a la crisis operativa',
        prompt:
          '¿Cómo deben coordinar el/la Director/a Regional y los/as Jefes/as de las Unidades Territoriales de Cuna Más y Juntos para ejecutar la protección laboral y sostener la atención en campo?',
        points: 2.0,
        correctOption: 'A',
        options: [
          {
            id: 'A',
            text: 'Solicitar el informe de viabilidad operativa a OGRH (plazo de 1 día hábil para requerirlo y 3 días hábiles para emitirlo), activar la protección de oficio en la STPAD y redistribuir temporalmente las rutas de acompañamiento familiar entre los equipos de la IAR sin revelar el motivo al entorno operativo.'
          },
          {
            id: 'B',
            text: 'Suspender por 30 días las visitas domiciliarias de Cuna Más y Juntos en los distritos involucrados mientras concluye el procedimiento disciplinario.'
          },
          {
            id: 'C',
            text: 'Informar en asamblea abierta a todos los acompañantes técnicos y gestores locales quién presentó la denuncia para que respalden a su compañera.'
          },
          {
            id: 'D',
            text: 'Esperar a que la Oficina General de Recursos Humanos resuelva de oficio al vencimiento del contrato sin coordinar con las Unidades Territoriales del MIDIS.'
          }
        ],
        rubric: {
          normativeBasis:
            'Art. 5.2 del Reglamento del D. Leg. N° 1327 (Informe de viabilidad operativa de OGRH en 3 días hábiles), Directiva N° 001-2022-MIDIS Versión 02 (articulación OII–OGRH–STPAD en 1 día hábil) y Art. 3.3 (protección de oficio en STPAD).',
          rubricCriteria:
            'Articular los plazos internos de protección (requerimiento en 1 día hábil e informe de viabilidad operativa de OGRH en 3 días hábiles; protección de oficio en STPAD) con la reorganización operativa de rutas de Cuna Más y Juntos en la IAR manteniendo estricta reserva.',
          concepts: [
            {
              id: 'ogrh_plazos',
              label: 'Informe de viabilidad operativa de OGRH (1 día para pedir / 3 días para emitir)',
              keywords: ['ogrh', 'recursos humanos', 'viabilidad operativa', '3 dias', 'tres dias', '1 dia']
            },
            {
              id: 'stpad_oficio',
              label: 'Protección de oficio en la STPAD / autoridades del PAD',
              keywords: ['stpad', 'secretaria tecnica', 'de oficio', 'pad', 'disciplinario']
            },
            {
              id: 'continuidad_iar',
              label: 'Redistribución de rutas de Cuna Más y Juntos en la IAR sin revelar el motivo',
              keywords: ['cuna mas', 'juntos', 'rutas', 'iar', 'continuidad', 'sin revelar', 'acompanamiento']
            }
          ],
          missingComplement:
            'La rúbrica integra la gestión normativa interna con la continuidad territorial: solicitar el informe de viabilidad operativa a OGRH (1 día hábil para requerirlo y 3 días hábiles para emitirlo según el Art. 5.2 del DS N° 010-2017-JUS y la Directiva N° 001-2022-MIDIS), garantizar la reserva de oficio en la STPAD (Art. 3.3) y redistribuir temporalmente las rutas de Cuna Más y Juntos en la IAR sin exponer el motivo.',
          socraticOnCorrect:
            '¿Cómo demuestra esta articulación entre OII, OGRH, STPAD y las Unidades Territoriales de Cuna Más y Juntos que la integridad pública protege simultáneamente al servidor denunciante y a las familias usuarias?',
          socraticOnIncorrect:
            'Si se detienen las rutas de Desarrollo Infantil Temprano o se divulga la identidad de la denunciante al reorganizar los equipos de campo, ¿qué doble afectación se genera sobre el servicio público?'
        }
      }
    ]
  }
];

const DEMO_COHORT: ParticipantRecord[] = [];

const DEFAULT_CONFIG: InstitutionConfig = {
  workshopTitle: 'Integridad en la gestión pública para la entrega de servicios',
  entityName: 'Ministerio de Desarrollo e Inclusión Social (MIDIS)',
  logoUrl: '/logo-midis.png',
  teacherUser: 'docente.midis',
  teacherPass: 'Integridad2026',
  sheetsEndpoint: ''
};

// ============================================================================
// 3. UTILIDADES DE VALIDACIÓN LINGÜÍSTICA Y MOTOR SOCRÁTICO DE RÚBRICA
// ============================================================================

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function formatLocalTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Valida que el sustento abierto contenga palabras reales y coherentes en español,
 * bloqueando texto aleatorio de teclado (ej. "g gkfñklg gkgkñlgf...") o repeticiones.
 */
function validateJustificationQuality(rawText: string): {
  isValid: boolean;
  validWordCount: number;
  uniqueValidCount: number;
  reason: string;
} {
  const tokens = rawText
    .trim()
    .split(/[\s,.;:!?()[\]"'«»¿¡/\\-]+/)
    .filter(Boolean);

  const singleLetterValid = new Set(['a', 'e', 'o', 'u', 'y']);
  const validWords: string[] = [];

  for (const token of tokens) {
    const clean = normalizeText(token);
    if (!/^[a-zñ]+$/.test(clean)) continue;

    if (clean.length === 1) {
      if (singleLetterValid.has(clean)) validWords.push(clean);
      continue;
    }

    // Rechazar secuencias repetitivas como "aaa", "kkk", "ñññ"
    if (/(.)\1{2,}/.test(clean)) continue;

    // Rechazar grupos imposibles de 4 o más consonantes seguidas (ej. "gkfñklg")
    if (/[^aeiouñ]{4,}/.test(clean)) continue;

    // Debe contener al menos una vocal y una proporción razonable de vocales
    const vowels = (clean.match(/[aeiou]/g) || []).length;
    if (vowels === 0) continue;
    const vowelRatio = vowels / clean.length;
    if (vowelRatio < 0.2 || vowelRatio > 0.85) continue;

    // Rechazar palabras excesivamente largas sin estructura silábica normal
    if (clean.length > 22) continue;

    validWords.push(clean);
  }

  const uniqueValid = new Set(validWords);
  const minWords = 10;
  const minUnique = 8;

  if (validWords.length < minWords) {
    return {
      isValid: false,
      validWordCount: validWords.length,
      uniqueValidCount: uniqueValid.size,
      reason: `Redacta un sustento técnico coherente de al menos ${minWords} palabras reales en español (llevas ${validWords.length} palabras válidas). No se admiten caracteres aleatorios ni abreviaturas sueltas.`
    };
  }

  if (uniqueValid.size < minUnique) {
    return {
      isValid: false,
      validWordCount: validWords.length,
      uniqueValidCount: uniqueValid.size,
      reason: `Evita repetir las mismas palabras; desarrolla tu argumento empleando al menos ${minUnique} palabras distintas con sentido técnico-normativo.`
    };
  }

  return {
    isValid: true,
    validWordCount: validWords.length,
    uniqueValidCount: uniqueValid.size,
    reason: 'Sustento válido listo para calificación y análisis de rúbrica.'
  };
}

/**
 * Analiza el sustento redactado frente a los criterios de la rúbrica validada
 * y devuelve: (1) Reconocimiento, (2) Complemento técnico-normativo y (3) Pregunta socrática.
 */
function analyzeJustificationSocratic(
  question: QuestionItem,
  selectedOptionId: 'A' | 'B' | 'C' | 'D',
  justification: string
): RubricAnalysisResult {
  const norm = normalizeText(justification);
  const isCorrect = selectedOptionId === question.correctOption;
  const { rubric } = question;

  const matchedConcepts: RubricConcept[] = [];
  const missingConcepts: RubricConcept[] = [];

  for (const concept of rubric.concepts) {
    const found = concept.keywords.some((kw) => norm.includes(normalizeText(kw)));
    if (found) {
      matchedConcepts.push(concept);
    } else {
      missingConcepts.push(concept);
    }
  }

  // Detectar si citó explícitamente normas, artículos o plazos
  const normPatterns = [
    'ley',
    '27815',
    'directiva',
    '001-2022',
    '1327',
    '010-2017',
    '033-2005',
    '31227',
    '28024',
    '27806',
    '27444',
    '17.3',
    'articulo',
    'art.',
    'guia',
    'reglamento',
    'plazo',
    'dia habil',
    'dias habiles'
  ];
  const citedNorms = normPatterns.some((p) => norm.includes(p));

  const totalConcepts = rubric.concepts.length;
  const coveragePercent =
    totalConcepts > 0 ? Math.round((matchedConcepts.length / totalConcepts) * 100) : 0;

  // 1. RECONOCIMIENTO DE ACIERTOS EN EL SUSTENTO
  let recognition = '';
  if (matchedConcepts.length > 0) {
    const labelsText = matchedConcepts.map((c) => `"${c.label}"`).join(', ');
    recognition = isCorrect
      ? `Tu elección de la alternativa ${selectedOptionId} es acertada y tu sustento identifica correctamente ${matchedConcepts.length} de ${totalConcepts} criterios clave de la rúbrica: ${labelsText}.${citedNorms ? ' Además, respaldas tu postura con referencia normativa o procedimental explícita.' : ''}`
      : `Aunque marcaste la alternativa ${selectedOptionId} (que no corresponde a la conducta exigible), en tu argumentación rescatas elementos pertinentes vinculados con ${labelsText}.`;
  } else {
    recognition = isCorrect
      ? `Seleccionaste correctamente la alternativa ${selectedOptionId} y expresaste una postura orientada a resguardar la gestión del servicio; sin embargo, tu redacción aún no incorpora explícitamente los conceptos técnico-normativos centrales evaluados en la rúbrica.`
      : `Elegiste la alternativa ${selectedOptionId} y planteaste tu criterio operativo sobre el escenario, pero tu sustento no recoge los criterios normativos ni los mecanismos preventivos que exige la rúbrica para este dilema.`;
  }

  // 2. COMPLEMENTO TÉCNICO-NORMATIVO CONTRASTADO CON LA RÚBRICA
  let complement = '';
  const correctOptObj = question.options.find((o) => o.id === question.correctOption);
  if (missingConcepts.length === 0 && citedNorms) {
    complement = `Has cubierto de manera integral los criterios de la rúbrica (${rubric.rubricCriteria}). Como síntesis de respaldo, ten presente la base aplicable: ${rubric.normativeBasis}`;
  } else {
    const missingList =
      missingConcepts.length > 0
        ? ` Criterios de la rúbrica que conviene incorporar en tu análisis: ${missingConcepts
            .map((m) => m.label)
            .join('; ')}.`
        : '';
    complement = `${rubric.missingComplement}${missingList}${
      !isCorrect && correctOptObj
        ? ` En este escenario, la decisión correcta es la alternativa ${question.correctOption}: "${correctOptObj.text}".`
        : ''
    }`;
  }

  // 3. PREGUNTA SOCRÁTICA PERSONALIZADA
  let socraticQuestion = isCorrect ? rubric.socraticOnCorrect : rubric.socraticOnIncorrect;
  if (isCorrect && missingConcepts.length > 0) {
    const primaryGap = missingConcepts[0].label.toLowerCase();
    socraticQuestion = `Considerando que en tu sustento omitiste desarrollar el componente de ${primaryGap}, ${
      rubric.socraticOnCorrect.charAt(0).toLowerCase() + rubric.socraticOnCorrect.slice(1)
    }`;
  }

  return {
    recognition,
    complement,
    socraticQuestion,
    matchedLabels: matchedConcepts.map((c) => c.label),
    missingLabels: missingConcepts.map((c) => c.label),
    coveragePercent
  };
}

// ============================================================================
// 4. PERFIL ADAPTATIVO EN TIEMPO REAL Y PLAN DE ACCIÓN TERRITORIAL
// ============================================================================

function computeAdaptiveProfile(participant: ParticipantRecord) {
  const answersList = Object.values(participant.answers);
  const totalScore = answersList.reduce((acc, a) => acc + a.pointsEarned, 0);
  const answeredCount = answersList.length;

  const axisStats = CASES_DATA.map((c) => {
    const caseAnswers = c.questions
      .map((q) => participant.answers[q.id])
      .filter((a): a is AnswerRecord => Boolean(a));
    const earned = caseAnswers.reduce((s, a) => s + a.pointsEarned, 0);
    const max = c.questions.reduce((s, q) => s + q.points, 0);
    const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
    return {
      caseId: c.id,
      axis: c.axis,
      earned,
      max,
      pct,
      answered: caseAnswers.length,
      total: c.questions.length
    };
  });

  let level = 'En diagnóstico inicial';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  if (answeredCount > 0) {
    if (totalScore >= 17) {
      level = 'Liderazgo Ético Consolidado';
      badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    } else if (totalScore >= 13) {
      level = 'Criterio Preventivo Competente';
      badgeColor = 'bg-blue-50 text-blue-800 border-blue-300';
    } else if (totalScore >= 9) {
      level = 'En Desarrollo Operativo';
      badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
    } else {
      level = 'Requiere Reforzamiento Normativo';
      badgeColor = 'bg-rose-50 text-rose-800 border-rose-300';
    }
  }

  const weakAxes = axisStats.filter((a) => a.answered > 0 && a.pct < 75);
  const actionPlan: string[] = [];

  if (weakAxes.some((w) => w.caseId === 'caso-1') || answeredCount === 0) {
    actionPlan.push(
      'Implementar protocolos de excusación escrita inmediata ante vínculos familiares y exigir el registro obligatorio de audiencias en el Registro de Visitas en Línea en coordinación con la UT del MIDIS.'
    );
  }
  if (weakAxes.some((w) => w.caseId === 'caso-2') || answeredCount === 0) {
    actionPlan.push(
      'Institucionalizar actas de negativa fundamentada frente a órdenes ilegales, publicar stocks/criterios de distribución alimentaria y activar comités conjuntos de vigilancia con el GORE y el MIDIS.'
    );
  }
  if (weakAxes.some((w) => w.caseId === 'caso-3') || answeredCount === 0) {
    actionPlan.push(
      'Garantizar la derivación cifrada de denuncias en máximo 1 día hábil a la OII, activar medidas de protección laboral (renovación/traslado) y resguardar la reserva frente a pedidos de acceso a la información.'
    );
  }

  return {
    totalScore,
    answeredCount,
    axisStats,
    level,
    badgeColor,
    actionPlan
  };
}

// ============================================================================
// 5. EMBLEMA OFICIAL MIDIS SIN RECORTES
// ============================================================================

const MidisLogoBadge: React.FC<{
  logoUrl: string;
  onDoubleClick?: () => void;
}> = ({ logoUrl, onDoubleClick }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  return (
    <div
      onDoubleClick={onDoubleClick}
      className="flex items-center select-none cursor-pointer"
      title="Ministerio de Desarrollo e Inclusión Social - MIDIS"
    >
      {!imgError && logoUrl ? (
        <div className="flex items-center bg-white rounded-lg border border-slate-200 px-2.5 py-1.5 shadow-xs">
          <img
            src={logoUrl}
            alt="Logo Oficial MIDIS"
            className="h-11 w-auto max-w-[230px] object-contain"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="inline-flex items-stretch rounded-md overflow-hidden border border-slate-300 shadow-xs bg-white">
          <div className="bg-[#D91023] text-white px-3 py-1.5 flex items-center gap-2">
            <svg viewBox="0 0 36 40" className="w-6 h-7 shrink-0" aria-hidden="true">
              <path
                d="M18 2 C25 2 31 5 33 11 L33 24 C33 32 25 37 18 39 C11 37 3 32 3 24 L3 11 C5 5 11 2 18 2 Z"
                fill="#FFFFFF"
                stroke="#FACC15"
                strokeWidth="2"
              />
              <rect x="6" y="8" width="11" height="10" fill="#0284C7" />
              <rect x="19" y="8" width="11" height="10" fill="#F8FAFC" />
              <path d="M6 20 L30 20 L30 25 C30 30 24 34 18 36 C12 34 6 30 6 25 Z" fill="#DC2626" />
              <circle cx="18" cy="27" r="3.5" fill="#FACC15" />
            </svg>
            <span className="font-extrabold tracking-wider text-sm">PERÚ</span>
          </div>
          <div className="bg-[#4B5563] text-white px-3 py-1.5 flex flex-col justify-center leading-tight">
            <span className="text-[11px] font-semibold">Ministerio</span>
            <span className="text-[11px] font-semibold">de Desarrollo e Inclusión Social</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. EXPORTACIÓN PDF INDIVIDUAL Y CSV MASIVO PARA EXCEL
// ============================================================================

function exportParticipantPDF(participant: ParticipantRecord, config: InstitutionConfig) {
  const profile = computeAdaptiveProfile(participant);
  const win = window.open('', '_blank', 'width=960,height=800');
  if (!win) {
    alert('Por favor habilita las ventanas emergentes en tu navegador para generar el reporte PDF.');
    return;
  }

  const rowsHtml = CASES_DATA.map((c) => {
    const qHtml = c.questions
      .map((q) => {
        const ans = participant.answers[q.id];
        if (!ans) {
          return `<div style="margin-bottom:10px;padding:10px;border:1px solid #e2e8f0;border-radius:6px;">
            <strong>${q.title}</strong> — <em>Pendiente</em>
          </div>`;
        }
        const selectedText = q.options.find((o) => o.id === ans.selectedOption)?.text || '';
        return `
          <div style="margin-bottom:14px;padding:12px;border:1px solid ${
            ans.isCorrect ? '#86efac' : '#fca5a5'
          };background:${ans.isCorrect ? '#f0fdf4' : '#fef2f2'};border-radius:8px;">
            <div style="display:flex;justify-content:space-between;font-weight:700;font-size:13px;color:#0f172a;">
              <span>${q.title}</span>
              <span>${ans.isCorrect ? 'Correcta' : 'Incorrecta'} (${ans.pointsEarned.toFixed(1)} / ${ans.maxPoints.toFixed(1)} pts)</span>
            </div>
            <p style="margin:6px 0;font-size:12px;color:#1e293b;"><strong>Alternativa marcada (${ans.selectedOption}):</strong> ${selectedText}</p>
            <p style="margin:6px 0;font-size:12px;color:#334155;background:#ffffff;padding:8px;border-radius:4px;border:1px solid #cbd5e1;">
              <strong>Sustento del participante:</strong> ${ans.justification}
            </p>
            <div style="margin-top:8px;font-size:11.5px;color:#1e3a8a;background:#eff6ff;padding:8px;border-radius:4px;">
              <p style="margin:0 0 4px 0;"><strong>1. Reconocimiento:</strong> ${ans.analysis.recognition}</p>
              <p style="margin:0 0 4px 0;"><strong>2. Complemento de rúbrica:</strong> ${ans.analysis.complement}</p>
              <p style="margin:0;"><strong>3. Reflexión socrática:</strong> ${ans.analysis.socraticQuestion}</p>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <h3 style="margin-top:20px;color:#0f172a;border-bottom:2px solid #cbd5e1;padding-bottom:4px;font-size:15px;">
        ${c.title} (${c.axis})
      </h3>
      ${qHtml}
    `;
  }).join('');

  win.document.write(`
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>Reporte Integral - ${participant.fullName}</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 28px; line-height: 1.45; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #d91023; padding-bottom: 12px; margin-bottom: 18px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-weight: bold; font-size: 12px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12.5px; }
        @media print { body { margin: 14px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div style="font-size:11px;font-weight:700;color:#d91023;text-transform:uppercase;">${config.entityName}</div>
          <h1 style="margin:4px 0;font-size:18px;">Reporte Integral de Simulación de Integridad</h1>
          <div style="font-size:12px;color:#475569;">Taller: ${config.workshopTitle}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:22px;font-weight:800;color:#0f172a;">${profile.totalScore.toFixed(1)} / 20.0 pts</div>
          <span class="badge">${profile.level}</span>
        </div>
      </div>

      <div class="grid">
        <div><strong>Participante:</strong> ${participant.fullName}</div>
        <div><strong>DNI:</strong> ${participant.dni}</div>
        <div><strong>Correo electrónico:</strong> ${participant.email}</div>
        <div><strong>Avance:</strong> ${profile.answeredCount} de 12 preguntas</div>
        <div><strong>Hora de ingreso:</strong> ${participant.startedAt}</div>
        <div><strong>Hora de fin:</strong> ${participant.completedAt || 'En curso'}</div>
      </div>

      <h3 style="margin-top:18px;font-size:14px;">Desempeño por Eje Temático</h3>
      <ul style="font-size:12.5px;">
        ${profile.axisStats
          .map(
            (s) =>
              `<li><strong>${s.axis}:</strong> ${s.earned.toFixed(1)} / ${s.max.toFixed(1)} pts (${s.pct}%)</li>`
          )
          .join('')}
      </ul>

      <h3 style="margin-top:16px;font-size:14px;">Plan de Acción Territorial Recomendado</h3>
      <ul style="font-size:12.5px;">
        ${profile.actionPlan.map((item) => `<li>${item}</li>`).join('')}
      </ul>

      ${rowsHtml}
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `);
  win.document.close();
}

function exportCohortCSV(cohort: ParticipantRecord[]) {
  const headers = [
    'ID',
    'Nombre Completo',
    'DNI',
    'Correo Electronico',
    'Hora de Ingreso',
    'Hora de Fin',
    'Preguntas Respondidas',
    'Puntaje Total (sobre 20)',
    'Nivel Adaptativo',
    'Caso 1 (6.5 pts)',
    'Caso 2 (6.5 pts)',
    'Caso 3 (7.0 pts)',
    ...CASES_DATA.flatMap((c) =>
      c.questions.flatMap((q) => [
        `P${q.id} Opcion`,
        `P${q.id} Puntos`,
        `P${q.id} Cobertura Rubrica (%)`,
        `P${q.id} Sustento`
      ])
    )
  ];

  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = cohort.map((p) => {
    const profile = computeAdaptiveProfile(p);
    const c1 = profile.axisStats[0]?.earned.toFixed(1) || '0.0';
    const c2 = profile.axisStats[1]?.earned.toFixed(1) || '0.0';
    const c3 = profile.axisStats[2]?.earned.toFixed(1) || '0.0';

    const qCols = CASES_DATA.flatMap((c) =>
      c.questions.flatMap((q) => {
        const a = p.answers[q.id];
        return a
          ? [a.selectedOption, a.pointsEarned.toFixed(1), a.analysis.coveragePercent, a.justification]
          : ['', '0.0', '0', ''];
      })
    );

    return [
      p.id,
      p.fullName,
      p.dni,
      p.email,
      p.startedAt,
      p.completedAt || 'En curso',
      `${profile.answeredCount}/12`,
      profile.totalScore.toFixed(1),
      profile.level,
      c1,
      c2,
      c3,
      ...qCols
    ]
      .map(escapeCsv)
      .join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `resultados_taller_integridad_midis_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 7. AUTOPRUEBAS AUTOMATIZADAS DE INTEGRIDAD TÉCNICA Y PEDAGÓGICA
// ============================================================================

function runAutomatedTests(): TestResult[] {
  const allQuestions = CASES_DATA.flatMap((c) => c.questions);
  const totalPoints = allQuestions.reduce((sum, q) => sum + q.points, 0);

  const gibberishCheck = validateJustificationQuality(
    'g gkfñklg gkgkñlgf gfklgfklñgf gkññgfklñgf gfklñgfklñgf'
  );
  const validTextCheck = validateJustificationQuality(
    'Existe un conflicto de intereses real por el vinculo de afinidad con mi conyuge segun la Ley 27815 y debo formular mi excusacion formal ante el superior inmediato.'
  );

  const sampleAnalysis = analyzeJustificationSocratic(
    CASES_DATA[0].questions[0],
    'B',
    'Existe un conflicto de intereses real por el vinculo familiar con la postulante y debo prevenir antes de que se firme el contrato.'
  );

  return [
    {
      id: 't1',
      name: 'Ponderación exacta de 12 preguntas = 20.0 puntos',
      passed: allQuestions.length === 12 && Math.abs(totalPoints - 20.0) < 0.001,
      detail: `Ítems cargados: ${allQuestions.length} · Suma total verificada: ${totalPoints.toFixed(1)} pts.`
    },
    {
      id: 't2',
      name: 'Integridad de los 3 casos validados (5 párrafos c/u y claves exactas)',
      passed:
        CASES_DATA.length === 3 &&
        CASES_DATA.every((c) => c.paragraphs.length === 5 && c.questions.length === 4),
      detail: 'Los 3 escenarios territoriales conservan sus 5 párrafos narrativos y 4 preguntas por caso.'
    },
    {
      id: 't3',
      name: 'Filtro lingüístico anti-texto aleatorio en sustento abierto',
      passed: !gibberishCheck.isValid && validTextCheck.isValid,
      detail: `Texto sin sentido bloqueado (${gibberishCheck.validWordCount} palabras válidas) · Argumento técnico aceptado (${validTextCheck.validWordCount} palabras válidas).`
    },
    {
      id: 't4',
      name: 'Motor de análisis por rúbrica y retroalimentación socrática en 3 bloques',
      passed:
        sampleAnalysis.recognition.length > 20 &&
        sampleAnalysis.complement.length > 20 &&
        sampleAnalysis.socraticQuestion.includes('?'),
      detail: `Cobertura detectada en prueba: ${sampleAnalysis.coveragePercent}% (${sampleAnalysis.matchedLabels.length} criterios reconocidos).`
    }
  ];
}

// ============================================================================
// 8. COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================

const STORAGE_KEYS = {
  COHORT: 'midis_integridad_cohort_v4',
  ACTIVE_ID: 'midis_integridad_active_id_v4',
  CONFIG: 'midis_integridad_config_v4'
};

export default function App() {
  // Estado de configuración institucional
  const [config, setConfig] = useState<InstitutionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Estado de cohorte de participantes (inicia vacío: 0 registros)
  const [cohort, setCohort] = useState<ParticipantRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COHORT);
      return saved ? JSON.parse(saved) : DEMO_COHORT;
    } catch {
      return DEMO_COHORT;
    }
  });

  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    } catch {
      return null;
    }
  });

  // Estados de navegación y formulario de registro
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState('');

  // Estados de resolución secuencial de casos y preguntas
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [draftOption, setDraftOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [draftJustification, setDraftJustification] = useState('');
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Estados de Vista Docente oculta
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [teacherAuthenticated, setTeacherAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [teacherTab, setTeacherTab] = useState<'cohort' | 'settings' | 'architecture'>('cohort');
  const [inspectedParticipantId, setInspectedParticipantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Persistencia automática en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COHORT, JSON.stringify(cohort));
    } catch {
      // Ignorar si almacenamiento está lleno
    }
  }, [cohort]);

  useEffect(() => {
    try {
      if (activeParticipantId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeParticipantId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
      }
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [activeParticipantId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [config]);

  // Atajo de teclado Alt + D para acceso docente discreto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (teacherAuthenticated) {
          setTeacherAuthenticated(false);
        } else {
          setShowTeacherLoginModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [teacherAuthenticated]);

  const activeParticipant = useMemo(
    () => cohort.find((p) => p.id === activeParticipantId) || null,
    [cohort, activeParticipantId]
  );

  // Sincronización opcional hacia Google Sheets (si está configurado en Ajustes)
  const syncToGoogleSheets = async (record: ParticipantRecord) => {
    if (!config.sheetsEndpoint.trim()) return;
    setSyncStatus('syncing');
    try {
      const profile = computeAdaptiveProfile(record);
      await fetch(config.sheetsEndpoint.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: record.id,
          fullName: record.fullName,
          dni: record.dni,
          email: record.email,
          startedAt: record.startedAt,
          completedAt: record.completedAt || 'En curso',
          answeredCount: profile.answeredCount,
          totalScore: profile.totalScore,
          level: profile.level,
          answers: record.answers
        })
      });
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  // Registro de participante
  const handleStartSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = fullName.trim();
    const cleanDni = dni.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 5) {
      setFormError('Ingresa tu nombre completo (mínimo 5 caracteres).');
      return;
    }
    if (!/^\d{8}$/.test(cleanDni)) {
      setFormError('El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }
    if (!consent) {
      setFormError('Debes aceptar el consentimiento de registro para iniciar la simulación.');
      return;
    }

    const existing = cohort.find((p) => p.dni === cleanDni);
    if (existing) {
      setActiveParticipantId(existing.id);
      const answeredIds = Object.keys(existing.answers);
      const nextCaseIdx = CASES_DATA.findIndex((c) =>
        c.questions.some((q) => !answeredIds.includes(q.id))
      );
      setActiveCaseIndex(nextCaseIdx === -1 ? 0 : nextCaseIdx);
      setShowFinalReport(answeredIds.length === 12);
      return;
    }

    const newRecord: ParticipantRecord = {
      id: `part_${Date.now()}`,
      fullName: cleanName,
      dni: cleanDni,
      email: cleanEmail,
      consent: true,
      startedAt: formatLocalTimestamp(new Date()),
      completedAt: null,
      answers: {}
    };

    setCohort((prev) => [newRecord, ...prev]);
    setActiveParticipantId(newRecord.id);
    setActiveCaseIndex(0);
    setDraftOption(null);
    setDraftJustification('');
    setShowFinalReport(false);
    syncToGoogleSheets(newRecord);
  };

  // Determinar la pregunta secuencial actual dentro del caso activo
  const currentCase = CASES_DATA[activeCaseIndex] || CASES_DATA[0];

  const unlockedQuestionIndex = useMemo(() => {
    if (!activeParticipant) return 0;
    const idx = currentCase.questions.findIndex((q) => !activeParticipant.answers[q.id]);
    return idx === -1 ? currentCase.questions.length - 1 : idx;
  }, [activeParticipant, currentCase]);

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  useEffect(() => {
    setSelectedQuestionIndex(unlockedQuestionIndex);
    setDraftOption(null);
    setDraftJustification('');
  }, [activeCaseIndex, unlockedQuestionIndex]);

  const activeQuestion = currentCase.questions[selectedQuestionIndex] || currentCase.questions[0];
  const existingAnswer = activeParticipant?.answers[activeQuestion.id] || null;
  const justificationQuality = useMemo(
    () => validateJustificationQuality(draftJustification),
    [draftJustification]
  );

  // Calificar pregunta en intento único
  const handleSubmitAnswer = () => {
    if (!activeParticipant || existingAnswer || !draftOption || !justificationQuality.isValid) {
      return;
    }

    const isCorrect = draftOption === activeQuestion.correctOption;
    const pointsEarned = isCorrect ? activeQuestion.points : 0;
    const analysis = analyzeJustificationSocratic(
      activeQuestion,
      draftOption,
      draftJustification.trim()
    );

    const newAnswer: AnswerRecord = {
      questionId: activeQuestion.id,
      caseId: currentCase.id,
      selectedOption: draftOption,
      isCorrect,
      pointsEarned,
      maxPoints: activeQuestion.points,
      justification: draftJustification.trim(),
      answeredAt: formatLocalTimestamp(new Date()),
      analysis
    };

    const updatedAnswers = {
      ...activeParticipant.answers,
      [activeQuestion.id]: newAnswer
    };

    const isAllCompleted = Object.keys(updatedAnswers).length === 12;
    const updatedRecord: ParticipantRecord = {
      ...activeParticipant,
      answers: updatedAnswers,
      completedAt: isAllCompleted
        ? formatLocalTimestamp(new Date())
        : activeParticipant.completedAt
    };

    setCohort((prev) =>
      prev.map((p) => (p.id === activeParticipant.id ? updatedRecord : p))
    );
    syncToGoogleSheets(updatedRecord);
  };

  // Avanzar secuencialmente a la siguiente pregunta o caso
  const handleNextStep = () => {
    if (!activeParticipant) return;
    if (selectedQuestionIndex < currentCase.questions.length - 1) {
      setSelectedQuestionIndex((prev) => prev + 1);
      setDraftOption(null);
      setDraftJustification('');
    } else if (activeCaseIndex < CASES_DATA.length - 1) {
      setActiveCaseIndex((prev) => prev + 1);
    } else {
      setShowFinalReport(true);
    }
  };

  // Autenticación Vista Docente
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginUser.trim() === config.teacherUser &&
      loginPass.trim() === config.teacherPass
    ) {
      setTeacherAuthenticated(true);
      setShowTeacherLoginModal(false);
      setLoginError('');
      setLoginUser('');
      setLoginPass('');
    } else {
      setLoginError('Usuario o clave incorrectos.');
    }
  };

  // Reinicio completo de plataforma (limpia localStorage y deja cohorte en 0)
  const handleResetPlatform = () => {
    if (
      !window.confirm(
        '¿Confirmas que deseas reiniciar la plataforma y eliminar todos los registros locales para iniciar en 0 participantes?'
      )
    ) {
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.COHORT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
    setCohort([]);
    setActiveParticipantId(null);
    setInspectedParticipantId(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setConfig((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const automatedTests = useMemo(() => runAutomatedTests(), []);

  // ==========================================================================
  // RENDERIZADO: VISTA DOCENTE
  // ==========================================================================
  if (teacherAuthenticated) {
    const filteredCohort = cohort.filter(
      (p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dni.includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const avgScore =
      cohort.length > 0
        ? cohort.reduce((s, p) => s + computeAdaptiveProfile(p).totalScore, 0) / cohort.length
        : 0;
    const completedCount = cohort.filter(
      (p) => Object.keys(p.answers).length === 12
    ).length;

    const inspectedParticipant =
      cohort.find((p) => p.id === inspectedParticipantId) || null;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <MidisLogoBadge logoUrl={config.logoUrl} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                    Panel Docente · v4.0
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {config.workshopTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTeacherAuthenticated(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Salir de Vista Docente
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-slate-100 overflow-x-auto">
            <button
              onClick={() => setTeacherTab('cohort')}
              className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                teacherTab === 'cohort'
                  ? 'border-rose-600 text-rose-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Resultados y Comparador ({cohort.length})
            </button>
            <button
              onClick={() => setTeacherTab('settings')}
              className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                teacherTab === 'settings'
                  ? 'border-rose-600 text-rose-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Configuración Institucional y Marca
            </button>
            <button
              onClick={() => setTeacherTab('architecture')}
              className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                teacherTab === 'architecture'
                  ? 'border-rose-600 text-rose-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Plan Técnico y Autopruebas
            </button>
          </div>
        </header>

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
          {teacherTab === 'cohort' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Participantes Registrados
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {cohort.length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Simulaciones Completadas
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {completedCount}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Promedio General (sobre 20)
                  </div>
                  <div className="text-2xl font-extrabold text-blue-700 mt-1">
                    {avgScore.toFixed(1)} pts
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2">
                  <button
                    onClick={() => exportCohortCSV(cohort)}
                    disabled={cohort.length === 0}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Exportar Excel (CSV)
                  </button>
                  <button
                    onClick={handleResetPlatform}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reiniciar Plataforma (0)
                  </button>
                </div>
              </div>

              {/* Buscador y Tabla */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-rose-700" />
                    Registro de Participantes y Tiempos de Ejecución
                  </h2>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, DNI o correo..."
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {filteredCohort.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    <p className="font-semibold text-slate-700">
                      La plataforma está limpia (0 participantes registrados).
                    </p>
                    <p className="text-sm mt-1">
                      Los registros aparecerán aquí automáticamente conforme los participantes inicien y respondan los casos.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                          <th className="py-3 px-4">Participante</th>
                          <th className="py-3 px-4">DNI</th>
                          <th className="py-3 px-4">Hora de ingreso</th>
                          <th className="py-3 px-4">Hora de fin</th>
                          <th className="py-3 px-4">Avance</th>
                          <th className="py-3 px-4">Puntaje</th>
                          <th className="py-3 px-4">Perfil Adaptativo</th>
                          <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredCohort.map((p) => {
                          const prof = computeAdaptiveProfile(p);
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/80">
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900">{p.fullName}</div>
                                <div className="text-xs text-slate-500">{p.email}</div>
                              </td>
                              <td className="py-3 px-4 font-mono text-xs">{p.dni}</td>
                              <td className="py-3 px-4 text-xs text-slate-700">{p.startedAt}</td>
                              <td className="py-3 px-4 text-xs">
                                {p.completedAt ? (
                                  <span className="text-emerald-700 font-medium">
                                    {p.completedAt}
                                  </span>
                                ) : (
                                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                                    En curso
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-xs font-semibold">
                                {prof.answeredCount} / 12
                              </td>
                              <td className="py-3 px-4 font-extrabold text-slate-900">
                                {prof.totalScore.toFixed(1)} / 20
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${prof.badgeColor}`}
                                >
                                  {prof.level}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => setInspectedParticipantId(p.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Analizar
                                </button>
                                <button
                                  onClick={() => exportParticipantPDF(p, config)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  PDF
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Comparador detallado de respuestas y sustentos */}
              {inspectedParticipant && (
                <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Auditoría de Decisiones y Sustentos: {inspectedParticipant.fullName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        DNI: {inspectedParticipant.dni} · Ingreso: {inspectedParticipant.startedAt} · Fin:{' '}
                        {inspectedParticipant.completedAt || 'En curso'}
                      </p>
                    </div>
                    <button
                      onClick={() => setInspectedParticipantId(null)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-lg border border-slate-300 cursor-pointer"
                    >
                      Cerrar detalle
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CASES_DATA.flatMap((c) => c.questions).map((q) => {
                      const ans = inspectedParticipant.answers[q.id];
                      return (
                        <div
                          key={q.id}
                          className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                            !ans
                              ? 'bg-slate-50 border-slate-200'
                              : ans.isCorrect
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : 'bg-rose-50/60 border-rose-200'
                          }`}
                        >
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>{q.title}</span>
                            <span>
                              {ans
                                ? `${ans.pointsEarned.toFixed(1)} / ${q.points.toFixed(1)} pts`
                                : 'Sin responder'}
                            </span>
                          </div>
                          {ans && (
                            <>
                              <div>
                                <strong>Marcó:</strong> {ans.selectedOption} (Clave: {q.correctOption}) ·{' '}
                                <strong>Rúbrica cubierta:</strong> {ans.analysis.coveragePercent}%
                              </div>
                              <div className="bg-white p-2 rounded border border-slate-200 text-slate-700">
                                <strong>Sustento:</strong> {ans.justification}
                              </div>
                              <div className="text-blue-900 bg-blue-50 p-2 rounded">
                                <strong>Análisis socrático emitido:</strong> {ans.analysis.recognition}{' '}
                                {ans.analysis.complement}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {teacherTab === 'settings' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl space-y-5 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-rose-700" />
                Configuración Institucional, Credenciales y Sincronización
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre de la Entidad
                  </label>
                  <input
                    type="text"
                    value={config.entityName}
                    onChange={(e) => setConfig({ ...config, entityName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título del Taller Virtual
                  </label>
                  <input
                    type="text"
                    value={config.workshopTitle}
                    onChange={(e) => setConfig({ ...config, workshopTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Usuario Vista Docente
                  </label>
                  <input
                    type="text"
                    value={config.teacherUser}
                    onChange={(e) => setConfig({ ...config, teacherUser: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clave Vista Docente
                  </label>
                  <input
                    type="text"
                    value={config.teacherPass}
                    onChange={(e) => setConfig({ ...config, teacherPass: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Logotipo Institucional (URL o carga directa sin recorte)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={config.logoUrl}
                    onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    placeholder="/logo-midis.png"
                  />
                  <label className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 cursor-pointer">
                    Subir imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL de Google Apps Script (Opcional para respaldo en Google Sheets)
                </label>
                <input
                  type="url"
                  value={config.sheetsEndpoint}
                  onChange={(e) => setConfig({ ...config, sheetsEndpoint: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSettingsSavedMsg('Configuración guardada correctamente.');
                    setTimeout(() => setSettingsSavedMsg(''), 3000);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-rose-700 text-white hover:bg-rose-800 cursor-pointer"
                >
                  Guardar configuración
                </button>
                {settingsSavedMsg && (
                  <span className="text-xs font-semibold text-emerald-700">{settingsSavedMsg}</span>
                )}
              </div>
            </div>
          )}

          {teacherTab === 'architecture' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-rose-700" />
                Verificación Técnica, Rúbricas y Autopruebas Automatizadas
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {automatedTests.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border ${
                      t.passed
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                      {t.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{t.name}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">{t.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================================================
  // RENDERIZADO: VISTA DEL PARTICIPANTE (INICIO O SIMULADOR)
  // ==========================================================================
  const profile = activeParticipant ? computeAdaptiveProfile(activeParticipant) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Cabecera Institucional */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MidisLogoBadge
              logoUrl={config.logoUrl}
              onDoubleClick={() => setShowTeacherLoginModal(true)}
            />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                Taller Virtual de Integridad Pública
              </div>
              <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 leading-snug">
                {config.workshopTitle}
              </h1>
            </div>
          </div>

          {activeParticipant && profile && (
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-right">
                <div className="text-[11px] text-slate-500 font-semibold">
                  Puntaje acumulado ({profile.answeredCount}/12)
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {profile.totalScore.toFixed(1)} / 20.0 pts
                </div>
              </div>

              <button
                onClick={() => setShowFinalReport((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                {showFinalReport ? 'Volver a los casos' : 'Ver Reporte Integral'}
              </button>

              <button
                onClick={() => {
                  setActiveParticipantId(null);
                  setShowFinalReport(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Cambiar participante
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {!activeParticipant ? (
          /* PANTALLA 1: IDENTIFICACIÓN DEL PARTICIPANTE Y REGLAS SIMPLIFICADAS */
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                Simulador de Casos Territoriales
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                Diagnóstico ético y articulación en los servicios del MIDIS y sus PPSS
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Analizarás <strong>3 casos prácticos</strong> situados en gobiernos locales y regionales en articulación con los programas sociales del MIDIS (12 decisiones en total, calificadas sobre <strong>20 puntos</strong>).
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Reglas de la simulación
                </h3>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <CheckSquare className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>1. Intento único y avance progresivo:</strong> Cada pregunta admite un solo intento puntuable. Debes seleccionar una alternativa y redactar tu sustento técnico-normativo para recibir retroalimentación inmediata y desbloquear la siguiente pregunta.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <Award className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>2. Reporte integral y plan de acción:</strong> Al concluir las 12 preguntas obtendrás tu diagnóstico adaptativo por eje temático, recomendaciones personalizadas y tu reporte descargable en PDF.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-extrabold text-slate-900">
                Identificación del Participante
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Completa tus datos para registrar tu hora de ingreso y generar tu reporte individual.
              </p>

              <form onSubmit={handleStartSimulation} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombres y Apellidos completos *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. María Elena Quispe Huamán"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                      maxLength={8}
                      value={dni}
                      onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                      placeholder="12345678"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
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
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 rounded text-rose-700 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Autorizo el registro de mis respuestas, tiempos de participación y puntaje con fines exclusivamente académicos y de seguimiento del taller virtual del MIDIS.
                  </span>
                </label>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Iniciar Simulación de Casos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : showFinalReport && profile ? (
          /* PANTALLA 3: REPORTE INTEGRAL FINAL DEL PARTICIPANTE */
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Reporte Integral de Desempeño
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {activeParticipant.fullName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    DNI: {activeParticipant.dni} · Correo: {activeParticipant.email} · Ingreso:{' '}
                    {activeParticipant.startedAt} · Fin:{' '}
                    {activeParticipant.completedAt || 'En curso'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-slate-900">
                      {profile.totalScore.toFixed(1)} / 20.0 pts
                    </div>
                    <span
                      className={`inline-block text-xs font-bold px-3 py-0.5 rounded-full border ${profile.badgeColor}`}
                    >
                      {profile.level}
                    </span>
                  </div>
                  <button
                    onClick={() => exportParticipantPDF(activeParticipant, config)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Reporte PDF
                  </button>
                </div>
              </div>

              {/* Desglose por ejes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {profile.axisStats.map((stat) => (
                  <div
                    key={stat.caseId}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="text-xs font-bold text-slate-700">{stat.axis}</div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-extrabold text-slate-900">
                        {stat.earned.toFixed(1)} / {stat.max.toFixed(1)} pts
                      </span>
                      <span className="text-xs font-bold text-blue-700">{stat.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${stat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan de acción */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <h3 className="text-sm font-extrabold text-blue-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  Plan de Acción Territorial Recomendado
                </h3>
                <ul className="space-y-1.5 text-xs text-blue-900 list-disc pl-5">
                  {profile.actionPlan.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Revisión detallada de las 12 preguntas */}
            <div className="space-y-4">
              {CASES_DATA.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-2">
                    {c.title}
                  </h3>
                  <div className="space-y-3">
                    {c.questions.map((q) => {
                      const ans = activeParticipant.answers[q.id];
                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border text-xs space-y-2 ${
                            !ans
                              ? 'bg-slate-50 border-slate-200'
                              : ans.isCorrect
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : 'bg-rose-50/60 border-rose-200'
                          }`}
                        >
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>{q.title}</span>
                            <span>
                              {ans
                                ? `${ans.isCorrect ? 'Correcta' : 'Incorrecta'} (+${ans.pointsEarned.toFixed(1)} pts)`
                                : 'Pendiente'}
                            </span>
                          </div>
                          {ans && (
                            <>
                              <p className="text-slate-800">
                                <strong>Alternativa elegida ({ans.selectedOption}):</strong>{' '}
                                {q.options.find((o) => o.id === ans.selectedOption)?.text}
                              </p>
                              <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                                <strong>Tu sustento:</strong> {ans.justification}
                              </p>
                              <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-lg text-blue-950 space-y-1">
                                <p>
                                  <strong>1. Reconocimiento:</strong> {ans.analysis.recognition}
                                </p>
                                <p>
                                  <strong>2. Complemento de rúbrica:</strong>{' '}
                                  {ans.analysis.complement}
                                </p>
                                <p>
                                  <strong>3. Reflexión socrática:</strong>{' '}
                                  {ans.analysis.socraticQuestion}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* PANTALLA 2: ESPACIO DE SIMULACIÓN POR CASOS Y PREGUNTAS SECUENCIALES */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Principal: Caso + Pregunta activa */}
            <div className="lg:col-span-8 space-y-6">
              {/* Navegación secuencial entre los 3 casos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CASES_DATA.map((c, idx) => {
                  const caseAnsweredCount = c.questions.filter(
                    (q) => Boolean(activeParticipant.answers[q.id])
                  ).length;
                  const prevCaseCompleted =
                    idx === 0 ||
                    CASES_DATA[idx - 1].questions.every((q) =>
                      Boolean(activeParticipant.answers[q.id])
                    );
                  const isActive = idx === activeCaseIndex;

                  return (
                    <button
                      key={c.id}
                      disabled={!prevCaseCompleted}
                      onClick={() => setActiveCaseIndex(idx)}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : prevCaseCompleted
                          ? 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                        <span>Caso {c.number}</span>
                        <span>
                          {prevCaseCompleted ? `${caseAnsweredCount}/4` : 'Bloqueado'}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mt-1 line-clamp-1">{c.axis}</div>
                    </button>
                  );
                })}
              </div>

              {/* Tarjeta narrativa íntegra del Caso (5 párrafos) */}
              <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      Eje: {currentCase.axis}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                      {currentCase.title}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                    {currentCase.questions.reduce((s, q) => s + q.points, 0).toFixed(1)} puntos en juego
                  </span>
                </div>

                {/* Ficha técnica de rol y articulación */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-rose-700" />
                      Tu rol protagonista:
                    </div>
                    <p className="text-slate-600 mt-0.5">{currentCase.protagonistRole}</p>
                  </div>
                  <div>
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      Articulación territorial:
                    </div>
                    <p className="text-slate-600 mt-0.5">{currentCase.articulationLevel}</p>
                  </div>
                </div>

                {/* 5 Párrafos completos del escenario */}
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  {currentCase.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Dilema crítico */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                  <strong>Dilema crítico a resolver:</strong> {currentCase.criticalDilemma}
                </div>
              </article>

              {/* Indicador de progreso secuencial de preguntas del caso */}
              <div className="flex items-center gap-2">
                {currentCase.questions.map((q, qIdx) => {
                  const isAnswered = Boolean(activeParticipant.answers[q.id]);
                  const isUnlocked = qIdx <= unlockedQuestionIndex;
                  const isSelected = qIdx === selectedQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      disabled={!isUnlocked}
                      onClick={() => setSelectedQuestionIndex(qIdx)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-700 text-white border-blue-700'
                          : isAnswered
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 cursor-pointer'
                          : isUnlocked
                          ? 'bg-white text-slate-700 border-slate-300 cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      {isAnswered ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : !isUnlocked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5" />
                      )}
                      <span>Pregunta {q.id}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tarjeta de Pregunta Activa + Alternativas + Sustento + Análisis Socrático */}
              <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    {activeQuestion.title}
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">
                    Valor: {activeQuestion.points.toFixed(1)} pts · Intento único
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {activeQuestion.prompt}
                </h3>

                {/* 4 Alternativas */}
                <div className="space-y-3">
                  {activeQuestion.options.map((opt) => {
                    const isPicked = existingAnswer
                      ? existingAnswer.selectedOption === opt.id
                      : draftOption === opt.id;
                    const isRightKey = opt.id === activeQuestion.correctOption;

                    let cardStyle =
                      'border-slate-200 bg-white hover:border-slate-400 text-slate-800 cursor-pointer';
                    let badgeStyle = 'bg-slate-100 text-slate-700';

                    if (existingAnswer) {
                      if (isRightKey) {
                        cardStyle = 'border-emerald-500 bg-emerald-50/70 text-slate-900';
                        badgeStyle = 'bg-emerald-600 text-white';
                      } else if (isPicked && !isRightKey) {
                        cardStyle = 'border-rose-500 bg-rose-50/70 text-slate-900';
                        badgeStyle = 'bg-rose-600 text-white';
                      } else {
                        cardStyle = 'border-slate-200 bg-slate-50/60 text-slate-500';
                      }
                    } else if (isPicked) {
                      cardStyle = 'border-blue-600 bg-blue-50/60 text-slate-900 ring-1 ring-blue-600';
                      badgeStyle = 'bg-blue-700 text-white';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={Boolean(existingAnswer)}
                        onClick={() => setDraftOption(opt.id)}
                        className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 ${cardStyle}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 ${badgeStyle}`}
                        >
                          {opt.id}
                        </span>
                        <span className="text-sm leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Campo obligatorio de sustento técnico-normativo */}
                <div className="space-y-2 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-extrabold text-slate-800">
                      Sustento técnico-normativo de tu decisión (obligatorio para calificar) *
                    </label>
                    {!existingAnswer && (
                      <span
                        className={`text-[11px] font-bold ${
                          justificationQuality.isValid ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {justificationQuality.validWordCount} palabras válidas (mínimo 10)
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    disabled={Boolean(existingAnswer)}
                    value={existingAnswer ? existingAnswer.justification : draftJustification}
                    onChange={(e) => setDraftJustification(e.target.value)}
                    placeholder="Redacta con tus propias palabras el fundamento ético, normativo y operativo de tu elección (mínimo 10 palabras reales en español)..."
                    className="w-full p-3.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50 disabled:text-slate-700"
                  />

                  {!existingAnswer && draftJustification.trim().length > 0 && !justificationQuality.isValid && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{justificationQuality.reason}</span>
                    </div>
                  )}
                </div>

                {/* Botón de calificación o Bloque de Retroalimentación Inmediata */}
                {!existingAnswer ? (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={!draftOption || !justificationQuality.isValid}
                      onClick={handleSubmitAnswer}
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer"
                    >
                      Calificar decisión y recibir retroalimentación
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    {/* Resultado de puntuación */}
                    <div
                      className={`p-4 rounded-xl border ${
                        existingAnswer.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm">
                        {existingAnswer.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                        <span>
                          {existingAnswer.isCorrect
                            ? `Decisión Correcta (+${existingAnswer.pointsEarned.toFixed(1)} pts)`
                            : `Decisión Incorrecta (0.0 pts · Clave correcta: ${activeQuestion.correctOption})`}
                        </span>
                      </div>
                      <p className="text-xs mt-1.5">
                        <strong>Base normativa:</strong> {activeQuestion.rubric.normativeBasis}
                      </p>
                    </div>

                    {/* Retroalimentación Socrática y Complementaria basada en Rúbrica */}
                    <div className="p-4 sm:p-5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          Análisis de tu sustento según rúbrica y retroalimentación socrática
                        </div>
                        <span className="text-[11px] font-bold bg-white text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                          Cobertura de criterios clave: {existingAnswer.analysis.coveragePercent}%
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
                        <div className="bg-white/90 p-3 rounded-lg border border-blue-100">
                          <strong className="text-emerald-800">
                            1. Reconocimiento en tu argumentación:
                          </strong>{' '}
                          {existingAnswer.analysis.recognition}
                        </div>

                        <div className="bg-white/90 p-3 rounded-lg border border-blue-100">
                          <strong className="text-blue-900">
                            2. Complemento técnico-normativo (rúbrica):
                          </strong>{' '}
                          {existingAnswer.analysis.complement}
                        </div>

                        <div className="bg-indigo-50/90 p-3 rounded-lg border border-indigo-200">
                          <strong className="text-indigo-950">
                            3. Pregunta socrática para profundizar:
                          </strong>{' '}
                          {existingAnswer.analysis.socraticQuestion}
                        </div>
                      </div>
                    </div>

                    {/* Botón de avance secuencial */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer"
                      >
                        {selectedQuestionIndex < currentCase.questions.length - 1
                          ? 'Continuar a la siguiente pregunta'
                          : activeCaseIndex < CASES_DATA.length - 1
                          ? `Continuar al Caso ${activeCaseIndex + 2}`
                          : 'Finalizar y ver Reporte Integral'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Columna Lateral: Panel Adaptativo en Tiempo Real */}
            {profile && (
              <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Diagnóstico en Tiempo Real
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${profile.badgeColor}`}
                    >
                      {profile.level}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-slate-900">
                        {profile.totalScore.toFixed(1)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        de 20.0 puntos posibles
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-rose-700 rounded-full transition-all duration-300"
                        style={{ width: `${(profile.totalScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-700">
                      Indicadores por Eje Temático
                    </div>
                    {profile.axisStats.map((st) => (
                      <div key={st.caseId} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-medium line-clamp-1">
                            {st.axis}
                          </span>
                          <span className="font-bold text-slate-900 shrink-0 ml-2">
                            {st.earned.toFixed(1)}/{st.max.toFixed(1)}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${st.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Inicio: {activeParticipant.startedAt}
                    </span>
                    {config.sheetsEndpoint && (
                      <span>
                        {syncStatus === 'syncing'
                          ? 'Sincronizando...'
                          : syncStatus === 'synced'
                          ? 'Nube OK'
                          : ''}
                      </span>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}
      </main>

      {/* Pie de página con acceso discreto para Vista Docente */}
      <footer className="bg-white border-t border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            {config.entityName} · Taller: {config.workshopTitle}
          </span>
          <button
            type="button"
            onClick={() => setShowTeacherLoginModal(true)}
            className="text-slate-400 hover:text-slate-700 transition inline-flex items-center gap-1 cursor-pointer"
            title="Acceso reservado para equipo docente (Alt + D)"
          >
            <Lock className="w-3 h-3" />
            <span>Docente</span>
          </button>
        </div>
      </footer>

      {/* Modal de autenticación docente */}
      {showTeacherLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
                <Unlock className="w-4 h-4 text-rose-700" />
                Acceso Vista Docente
              </h3>
              <button
                onClick={() => {
                  setShowTeacherLoginModal(false);
                  setLoginError('');
                }}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTeacherLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Usuario</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clave</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs font-semibold text-rose-700">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold cursor-pointer"
              >
                Ingresar al Panel Docente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
