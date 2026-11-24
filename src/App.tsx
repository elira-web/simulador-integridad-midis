// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

/**
 * SIMULADOR DE CASOS DE INTEGRIDAD - MIDIS (v3.0)
 * Taller Virtual: Integridad en la gestión pública para la entrega de servicios
 * Arquitectura: React + Tailwind CSS (100% Client-Side, cero dependencias externas)
 */

const APP_VERSION = 'v3.0';

const STORAGE_KEYS = {
  COHORT: 'midis_sim_cohort_v3',
  SESSION: 'midis_sim_active_session_v3',
  CONFIG: 'midis_sim_config_v3',
  LEGACY: [
    'midis_sim_cohort_v1',
    'midis_sim_cohort_v2',
    'midis_sim_active_session_v1',
    'midis_sim_active_session_v2',
    'midis_integridad_cohort',
  ],
};

const DEFAULT_CONFIG = {
  workshopTitle: 'Integridad en la gestión pública para la entrega de servicios',
  subtitle: 'Simulador de Toma de Decisiones Éticas y Articulación Territorial — MIDIS y PPSS',
  customLogoDataUrl: '/logo-midis.png',
  minJustificationWords: 12,
  passingScore: 14,
  teacherUser: 'docente.midis',
  teacherPass: 'Integridad2026',
};

const CASES_DATA = [
  {
    id: 'caso-1',
    number: 1,
    code: 'CASO 01',
    title: 'Focalización bajo presión y vínculos cercanos en territorio',
    axis: 'Conflictos de Intereses',
    axisKey: 'conflictos',
    level: 'Gobierno Local (Municipalidad Distrital) ↔ UT MIDIS (Pensión 65 y Contigo)',
    role: 'Jefe/a de la Unidad Local de Empadronamiento (ULE) y Enlace Municipal de Pensión 65 y Contigo',
    maxPoints: 6.5,
    narrative: [
      'En el marco de una campaña extraordinaria de cierre de brechas para actualizar la Clasificación Socioeconómica (CSE) e incorporar nuevos usuarios a los programas nacionales Pensión 65 y Contigo tras una emergencia climática, usted —en su calidad de Jefe/a de la Unidad Local de Empadronamiento (ULE)— preside el comité de selección de empadronadores temporales y valida el lote prioritario de hogares que será remitido a la Unidad Territorial (UT) del MIDIS.',
      'Durante la revisión final de los expedientes de contratación y de focalización, identifica tres situaciones críticas que ocurren de manera simultánea y amenazan la transparencia del proceso a menos de 48 horas del corte oficial acordado con la UT del MIDIS.',
      'En primer lugar, advierte que una de las postulantes que obtuvo el mayor puntaje técnico en la evaluación curricular es prima hermana de su cónyuge. Aunque usted no intervino en la elaboración de su expediente, le corresponde suscribir el acta de adjudicación y el contrato temporal.',
      'En segundo lugar, un regidor distrital ingresa sin cita ni registro previo a su oficina y le exige verbalmente priorizar la ficha socioeconómica de su tío directo en el lote urgente, argumentando que "es un adulto mayor conocido del distrito y no puede esperar al siguiente padrón".',
      'En tercer lugar, el presidente de una junta vecinal presenta un escrito formal por mesa de partes cuestionando la imparcialidad del comité por el vínculo familiar con la postulante y exigiendo su separación inmediata de todo el proceso de empadronamiento.'
    ],
    questions: [
      {
        id: 'q1_1',
        code: '1.1',
        points: 1.5,
        axisKey: 'conflictos',
        prompt: 'Respecto al vínculo familiar con la postulante a empadronadora y a la exigencia del regidor distrital para priorizar a su tío, ¿cómo se califican técnicamente estas situaciones desde el enfoque preventivo de gestión de conflictos de intereses?',
        options: [
          {
            id: 'A',
            text: 'No existe conflicto de intereses mientras no se firme el contrato de la postulante ni se apruebe la CSE del familiar del regidor, pues aún no se ha consumado ningún beneficio económico.'
          },
          {
            id: 'B',
            text: 'Se configura un conflicto de intereses real respecto a la postulante (colisión directa entre el deber funcional de suscribir la adjudicación y el vínculo de parentesco por afinidad) y un riesgo de injerencia indebida que compromete la imparcialidad y la apariencia de integridad en el padrón.'
          },
          {
            id: 'C',
            text: 'Únicamente existe un conflicto aparente generado por la denuncia del dirigente vecinal, el cual se subsana emitiendo un comunicado aclaratorio sin modificar la conformación del comité.'
          }
        ],
        correctOption: 'B',
        rubric: {
          keywords: ['real', 'potencial', 'aparente', 'parentesco', 'afinidad', 'imparcialidad', 'deber funcional', 'interés', 'prevención', 'consumado'],
          coreConcept: 'El conflicto de intereses es estructural y preventivo: surge cuando el interés personal o familiar (parentesco hasta cuarto grado de consanguinidad o segundo de afinidad, o vínculos cercanos) colisiona con el deber funcional de imparcialidad, antes incluso de que exista un daño o beneficio consumado.',
          normativeRef: 'Material técnico OII-MIDIS sobre Gestión de Conflicto de Intereses; Ley N° 27815 (Art. 6 y Art. 8 num. 1) y D.S. N° 033-2005-PCM.',
          socraticPrompt: 'Si usted decidiera continuar participando en la adjudicación argumentando que la postulante obtuvo el mayor puntaje técnico por mérito propio, ¿de qué manera se vería afectada la legitimidad institucional del padrón frente a la ciudadanía y la UT del MIDIS?'
        }
      },
      {
        id: 'q1_2',
        code: '1.2',
        points: 1.5,
        axisKey: 'conflictos',
        prompt: 'Ante el vínculo con la postulante y el escrito presentado por el presidente de la junta vecinal, ¿qué mecanismo preventivo corresponde activar de inmediato y cuál es su diferencia técnica?',
        options: [
          {
            id: 'A',
            text: 'Esperar a que el dirigente vecinal formalice una denuncia penal antes de apartarse, manteniendo la presidencia del comité para no retrasar el cronograma.'
          },
          {
            id: 'B',
            text: 'Solicitar que la postulante renuncie voluntariamente al concurso para evitar que proceda la recusación planteada por la junta vecinal.'
          },
          {
            id: 'C',
            text: 'Activar de inmediato la excusación (abstención) formal por escrito ante el superior inmediato (Gerente de Desarrollo Social) para apartarse de la evaluación y adjudicación de dicha postulante y tramitar su reemplazo, diferenciándola de la recusación que es el mecanismo ejercido por terceros.'
          }
        ],
        correctOption: 'C',
        rubric: {
          keywords: ['excusación', 'abstención', 'recusación', 'superior', 'reemplazo', 'terceros', 'apartarse', 'legalidad', 'nulidad'],
          coreConcept: 'La excusación (abstención) es el deber proactivo del servidor de apartarse de una decisión donde tiene conflicto de intereses y comunicarlo a su superior para designar reemplazo; la recusación, en cambio, es la facultad de un tercero para solicitar la separación del servidor cuando este no se excusa.',
          normativeRef: 'Material técnico OII-MIDIS (Mecanismos de prevención: Excusación vs. Recusación); TUO de la Ley N° 27444 (causales de abstención).',
          socraticPrompt: '¿Qué consecuencias administrativas y sobre la validez del proceso de contratación podrían generarse si el superior inmediato no designa formalmente un reemplazo antes de suscribir el acta de adjudicación?'
        }
      },
      {
        id: 'q1_3',
        code: '1.3',
        points: 1.5,
        axisKey: 'conflictos',
        prompt: 'Frente a la visita informal del regidor distrital y la gestión preventiva del comité de selección, ¿qué medidas de trazabilidad y transparencia institucional resultan obligatorias?',
        options: [
          {
            id: 'A',
            text: 'Atender el pedido del regidor de manera reservada para mantener buenas relaciones políticas, pero evaluar el expediente de su tío bajo los mismos criterios técnicos.'
          },
          {
            id: 'B',
            text: 'Registrar obligatoriamente la visita y el motivo de la gestión en el Registro de Visitas en Línea / Agendas Oficiales, rechazar cualquier priorización ajena a los criterios técnicos del SISFOH y verificar la presentación y actualización de la Declaración Jurada de Intereses (DJI).'
          },
          {
            id: 'C',
            text: 'Elaborar un acta interna privada firmada solo por los miembros del comité sin publicarla en los portales de transparencia para evitar conflictos con el Concejo Municipal.'
          }
        ],
        correctOption: 'B',
        rubric: {
          keywords: ['registro de visitas', 'agendas oficiales', 'declaración jurada', 'dji', 'trazabilidad', 'neutralidad', 'sisfoh', 'transparencia'],
          coreConcept: 'La trazabilidad de gestiones de intereses mediante el Registro de Visitas en Línea y el control preventivo a través de la Declaración Jurada de Intereses (DJI) neutralizan presiones políticas y garantizan la neutralidad en la focalización.',
          normativeRef: 'Ley N° 28024 (Gestión de Intereses), Ley N° 31227 (DJI) y Principio de Neutralidad de la Ley N° 27815.',
          socraticPrompt: '¿Cómo protege el registro transparente de audiencias y visitas tanto al servidor público como a los hogares más vulnerables del distrito frente a futuras auditorías o cuestionamientos vecinales?'
        }
      },
      {
        id: 'q1_4',
        code: '1.4',
        points: 2.0,
        axisKey: 'conflictos',
        prompt: '¿Cómo debe articular el/la Jefe/a de la ULE con el/la Coordinador/a Territorial de la UT del MIDIS para cumplir el plazo de cierre de brechas sin comprometer la ética ni paralizar el servicio?',
        options: [
          {
            id: 'A',
            text: 'Suspender íntegramente el envío de todo el lote de hogares de Pensión 65 y Contigo hasta que concluya el proceso disciplinario sobre el escrito de la junta vecinal.'
          },
          {
            id: 'B',
            text: 'Remitir el padrón completo incluyendo el expediente del familiar del regidor, dejando una nota al pie para que sea la UT del MIDIS quien decida si lo excluye.'
          },
          {
            id: 'C',
            text: 'Comunicar formalmente a la UT del MIDIS la abstención parcial acotada únicamente al expediente en conflicto, asegurar la designación de su reemplazo para dicho acto y continuar sin interrupción la validación técnica del resto del padrón con asistencia de la UT.'
          }
        ],
        correctOption: 'C',
        rubric: {
          keywords: ['abstención parcial', 'coordinador territorial', 'ut', 'midis', 'continuidad', 'reemplazo', 'articulación', 'padrón', 'adaptabilidad'],
          coreConcept: 'La articulación colaborativa exige aislar el foco del conflicto mediante abstención parcial y reemplazo puntual, asegurando la continuidad operativa del servicio público y el cumplimiento oportuno de los cortes de afiliación con la UT del MIDIS.',
          normativeRef: 'Modelo de Integridad (D.S. N° 148-2024-PCM) y deber de responsabilidad y adaptabilidad funcional (Ley N° 27815).',
          socraticPrompt: 'Si usted paralizara todo el lote de focalización por un solo expediente observado, ¿cómo impactaría esa decisión en el derecho de acceso oportuno a la protección social de los demás adultos mayores y personas con discapacidad severa del distrito?'
        }
      }
    ]
  },
  {
    id: 'caso-2',
    number: 2,
    code: 'CASO 02',
    title: 'Uso de recursos en custodia y transparencia en la entrega alimentaria',
    axis: 'Transparencia de Recursos',
    axisKey: 'recursos',
    level: 'Gobierno Local (Municipalidad Provincial) ↔ GORE y Equipo Territorial MIDIS (PCA / Ollas Comunes)',
    role: 'Subgerente/a de Programas Sociales y Complementación Alimentaria',
    maxPoints: 6.5,
    narrative: [
      'Tras recibir una transferencia presupuestal destinada a la atención alimentaria de comedores populares y ollas comunes en situación de vulnerabilidad, la Subgerencia a su cargo custodia en el almacén municipal un lote de alimentos no perecibles del Programa de Complementación Alimentaria (PCA) y administra dos camionetas asignadas exclusivamente a la supervisión y distribución alimentaria.',
      'A dos semanas de una actividad proselitista en la provincia, se desencadenan tres hechos críticos que ponen a prueba la integridad en el manejo de los recursos públicos y la transparencia hacia la población usuaria.',
      'Primero, el Gerente Municipal —su superior jerárquico inmediato— le ordena verbalmente disponer de las dos camionetas institucionales y retirar 150 canastas del almacén del PCA para repartirlas durante una "jornada cívica" organizada por una agrupación política local, sosteniendo que "igual se entrega a población pobre y ayuda a acelerar la ejecución presupuestal".',
      'Segundo, el representante de una empresa proveedora cuyos lotes de menestras y conservas fueron observados por incumplir especificaciones técnicas le ofrece cubrir "los gastos de combustible y viáticos de su equipo supervisor" a cambio de que firme la conformidad sin aplicar penalidades.',
      'Tercero, la presidenta de una red de ollas comunes ingresa una solicitud formal por mesa de partes exigiendo conocer el cronograma de distribución, los criterios objetivos de asignación y el stock real en almacén, tras circular rumores de un presunto desvío de raciones.'
    ],
    questions: [
      {
        id: 'q2_1',
        code: '2.1',
        points: 1.5,
        axisKey: 'recursos',
        prompt: 'Según la Ley del Código de Ética de la Función Pública y su Reglamento, ¿qué infracciones éticas se configuran en la disposición de camionetas/canastas para la jornada cívica y en el ofrecimiento del proveedor?',
        options: [
          {
            id: 'A',
            text: 'Una falta administrativa leve de gestión logística, dado que los alimentos no perecibles aún se encuentran en almacén y su destino final sería población en situación de pobreza.'
          },
          {
            id: 'B',
            text: 'Proselitismo político mediante el uso indebido de bienes del Estado y recursos alimentarios en custodia destinados a programas sociales, junto con la prohibición de obtener o procurar ventajas indebidas frente al ofrecimiento del proveedor.'
          },
          {
            id: 'C',
            text: 'Únicamente una infracción contractual del proveedor, ya que el uso de camionetas municipales fuera de horario de oficina no constituye bien patrimonial protegido.'
          }
        ],
        correctOption: 'B',
        rubric: {
          keywords: ['proselitismo', 'bienes del estado', 'custodia', 'ventaja indebida', 'pca', 'ollas comunes', 'patrimonio', 'uso adecuado'],
          coreConcept: 'El Reglamento de la Ley N° 27815 define como Bienes del Estado tanto los bienes patrimoniales de la entidad como los bienes de terceros o programas sociales bajo custodia, prohibiendo tajantemente su uso para proselitismo político y cualquier ventaja indebida.',
          normativeRef: 'Ley N° 27815 (Art. 7 num. 5, Art. 8 num. 2 y 3) y D.S. N° 033-2005-PCM (Art. 3: Bienes del Estado, Proselitismo Político y Ventaja Indebida).',
          socraticPrompt: '¿Por qué la normativa ética equipara los bienes en custodia de programas sociales con los bienes patrimoniales propios de la municipalidad, incluso si la entrega se hiciera a personas de bajos recursos?'
        }
      },
      {
        id: 'q2_2',
        code: '2.2',
        points: 1.5,
        axisKey: 'recursos',
        prompt: 'Frente a la instrucción verbal del Gerente Municipal para retirar las 150 canastas y utilizar las camionetas en la jornada política, ¿cuál es la conducta jurídicamente exigible al Subgerente/a?',
        options: [
          {
            id: 'A',
            text: 'Ejecutar la orden en cumplimiento del principio de lealtad y obediencia jerárquica, solicitando posteriormente que el Gerente Municipal regularice un memorando.'
          },
          {
            id: 'B',
            text: 'Entregar solo la mitad de las canastas para no confrontar a la alta dirección y compensar el stock en la siguiente compra del mes.'
          },
          {
            id: 'C',
            text: 'Negarse a ejecutar la orden por constituir una arbitrariedad e ilegalidad manifiesta, dejar constancia escrita fundamentada de la negativa y poner el hecho en conocimiento de la instancia superior y del órgano de control competente.'
          }
        ],
        correctOption: 'C',
        rubric: {
          keywords: ['obediencia', 'ilegalidad', 'arbitrariedad', 'negarse', 'constancia escrita', 'órgano de control', 'oci', 'lealtad'],
          coreConcept: 'El deber de lealtad y obediencia tiene un límite expreso en la ley: el servidor debe abstenerse de cumplir órdenes superiores que impliquen arbitrariedad o ilegalidad manifiestas, dejando constancia escrita y reportando el hecho.',
          normativeRef: 'Ley N° 27815 (Art. 6 num. 6: Principio de Lealtad y Obediencia; Art. 7 num. 6: Deber de Responsabilidad).',
          socraticPrompt: 'Si usted ejecutara la orden verbal alegando subordinación jerárquica, ¿le eximiría esa obediencia de responsabilidad administrativa, civil o penal ante una intervención de la Contraloría o el Ministerio Público?'
        }
      },
      {
        id: 'q2_3',
        code: '2.3',
        points: 1.5,
        axisKey: 'recursos',
        prompt: '¿Qué acciones inmediatas corresponden frente al requerimiento de información de la presidenta de la red de ollas comunes y ante la oferta de viáticos/combustible del proveedor observado?',
        options: [
          {
            id: 'A',
            text: 'Postergar la respuesta a la olla común hasta finalizar el trimestre y aceptar el apoyo de combustible del proveedor para acelerar las inspecciones de campo.'
          },
          {
            id: 'B',
            text: 'Brindar información fidedigna, completa y oportuna sobre stocks, padrones y criterios de distribución a la organización social; mantener firmes las observaciones técnicas y penalidades al proveedor; y reportar formalmente el intento de soborno.'
          },
          {
            id: 'C',
            text: 'Responder a la dirigente vecinal que el stock del almacén es información interna reservada y resolver el contrato del proveedor sin documentar las observaciones.'
          }
        ],
        correctOption: 'B',
        rubric: {
          keywords: ['transparencia', 'fidedigna', 'completa', 'oportuna', 'stock', 'penalidades', 'observaciones', 'soborno', 'denuncia'],
          coreConcept: 'El deber de transparencia exige entregar información fidedigna, completa y oportuna a la ciudadanía y organizaciones sociales, mientras que la integridad contractual obliga a rechazar ventajas indebidas, aplicar penalidades y denunciar actos de corrupción.',
          normativeRef: 'Ley N° 27815 (Art. 7 num. 2: Deber de Transparencia; Art. 8 num. 2) y Directiva N° 001-2022-MIDIS v.02 (Anexo 2: Pautas en contrataciones).',
          socraticPrompt: '¿De qué manera la entrega oportuna y verificable de los saldos de almacén a las dirigentes de ollas comunes desactiva conflictos sociales y previene el desvío de raciones?'
        }
      },
      {
        id: 'q2_4',
        code: '2.4',
        points: 2.0,
        axisKey: 'recursos',
        prompt: '¿Cómo debe articular el/la Subgerente/a con la Gerencia Regional de Desarrollo Social (GORE) y el equipo territorial del MIDIS para asegurar la entrega íntegra de las raciones en este contexto de presión?',
        options: [
          {
            id: 'A',
            text: 'Gestionar la distribución de manera aislada desde la Subgerencia sin convocar a otros niveles de gobierno para evitar que se conozcan las tensiones internas de la municipalidad.'
          },
          {
            id: 'B',
            text: 'Transferir unilateralmente las llaves del almacén al equipo territorial del MIDIS para que asuma la distribución directa en reemplazo de la municipalidad.'
          },
          {
            id: 'C',
            text: 'Activar el comité de gestión y monitoreo conjunto con participación de los comités de vigilancia ciudadana, la Gerencia Regional de Desarrollo Social (GORE) y el equipo territorial del MIDIS para auditar el padrón de entrega, verificar las actas y blindar la trazabilidad del almacén.'
          }
        ],
        correctOption: 'C',
        rubric: {
          keywords: ['comité', 'vigilancia ciudadana', 'gore', 'midis', 'trazabilidad', 'almacén', 'articulación', 'padrón', 'control social'],
          coreConcept: 'La cogestión transparente del PCA y ollas comunes requiere articulación multinivel (GL–GORE–MIDIS) combinada con control social de los comités de vigilancia ciudadana para garantizar trazabilidad desde el almacén hasta el usuario final.',
          normativeRef: 'Ley N° 25307 / Normativa de gestión del PCA y Ollas Comunes MIDIS; Modelo de Integridad (D.S. N° 148-2024-PCM).',
          socraticPrompt: '¿Qué rol preventivo cumple la incorporación de los comités de vigilancia ciudadana y del equipo territorial del MIDIS en el acto físico de verificación de inventarios y actas de entrega?'
        }
      }
    ]
  },
  {
    id: 'caso-3',
    number: 3,
    code: 'CASO 03',
    title: 'Filtración de denuncias, reserva de identidad y protección laboral en la articulación regional',
    axis: 'Canales de Denuncia y Protección',
    axisKey: 'denuncias',
    level: 'Gobierno Regional (GORE / IAR) ↔ Unidades Territoriales de Cuna Más y Juntos (MIDIS)',
    role: 'Gerente/a o Director/a Regional de Desarrollo e Inclusión Social (Copresidente/a de la IAR)',
    maxPoints: 7.0,
    narrative: [
      'Durante una sesión descentralizada de la Instancia de Articulación Regional (IAR) destinada a monitorear el paquete integrado de Desarrollo Infantil Temprano (DIT), una especialista social del Gobierno Regional —que articula en campo con acompañantes técnicos de Cuna Más y gestores locales de Juntos— solicita hablar con usted en reserva y le entrega un sobre cerrado con audios y actas adulteradas.',
      'La documentación evidencia que un coordinador territorial de un Programa Nacional del MIDIS y un jefe de equipo territorial del GORE exigen "cupos" económicos y condicionan la afiliación y permanencia de familias usuarias en ambos programas sociales.',
      'La especialista solicita expresamente reserva de identidad y medidas de protección laboral, explicando que su contrato vence en diez (10) días calendario y que su jefe inmediato —precisamente el funcionario regional denunciado— ya le comunicó verbalmente que no renovará su vínculo.',
      'Además, manifiesta temor fundado a represalias porque semanas atrás otro servidor presentó una alerta similar que fue tramitada erróneamente como una simple queja administrativa sin reserva de identidad, exponiendo su nombre ante los involucrados.',
      'Al día siguiente de la sesión, un periodista local ingresa una solicitud de acceso a la información pública exigiendo copia de todas las denuncias recibidas durante la jornada de la IAR, así como los nombres de la denunciante y de los servidores involucrados.'
    ],
    questions: [
      {
        id: 'q3_1',
        code: '3.1',
        points: 1.5,
        axisKey: 'denuncias',
        prompt: 'Según la Directiva N° 001-2022-MIDIS (Versión 02), ¿por qué fue erróneo tramitar la alerta previa como una queja administrativa y cuál es la calificación y vía correcta para la denuncia actual?',
        options: [
          {
            id: 'A',
            text: 'Porque las quejas solo proceden contra proveedores externos; toda alerta de servidores debe derivarse primero al jefe inmediato para que realice un descargo preliminar.'
          },
          {
            id: 'B',
            text: 'Porque la queja por defecto de tramitación busca corregir fallas procedimentales en un trámite, mientras que los hechos descritos contienen indicios de fundamento y materialidad de presuntos actos de corrupción, debiendo canalizarse como denuncia ante la Oficina de Integridad Institucional (OII) / Plataforma Digital Única de Denuncias del Ciudadano.'
          },
          {
            id: 'C',
            text: 'Porque cualquier denuncia presentada en una sesión de la IAR debe hacerse pública en el acta de acuerdos antes de ser remitida a la Oficina de Integridad Institucional.'
          }
        ],
        correctOption: 'B',
        rubric: {
          keywords: ['queja', 'denuncia', 'corrupción', 'fundamento', 'materialidad', 'oii', 'integridad', 'plataforma digital', 'directiva'],
          coreConcept: 'La Directiva N° 001-2022-MIDIS (v.02) distingue entre reclamo/queja por defecto de tramitación (que va a Atención al Ciudadano) y denuncia por presuntos actos de corrupción con fundamento (indicios razonables) y materialidad (afectación al servicio y vínculo funcional), gestionada por la OII y la Plataforma Digital Única.',
          normativeRef: 'Directiva N° 001-2022-MIDIS (Versión 02, aprobada por R.M. N° 157-2026-MIDIS) y Directiva N° 002-2023-PCM-SIP.',
          socraticPrompt: '¿Qué consecuencias tiene sobre la protección del denunciante y el principio de reserva confundir una denuncia por corrupción con un reclamo o queja ordinaria de atención al ciudadano?'
        }
      },
      {
        id: 'q3_2',
        code: '3.2',
        points: 1.5,
        axisKey: 'denuncias',
        prompt: '¿Cuál es el procedimiento y plazo perentorio obligatorio para remitir la denuncia recibida en territorio hacia las instancias de integridad competentes del Programa Nacional del MIDIS y del GORE?',
        options: [
          {
            id: 'A',
            text: 'Remitirla en un plazo máximo de un (1) día hábil, mediante sobre cerrado confidencial o canal digital seguro, a la Oficina de Integridad Institucional (OII) del Programa Nacional/MIDIS y a la instancia de integridad/STPAD regional, asignando un código cifrado para resguardar la identidad.'
          },
          {
            id: 'B',
            text: 'Conservar el sobre cerrado en la Dirección Regional durante diez (10) días hábiles mientras se realizan entrevistas de verificación con los testigos en campo.'
          },
          {
            id: 'C',
            text: 'Remitir copia digital por correo institucional abierto a todas las unidades involucradas dentro de los cinco (5) días hábiles siguientes para garantizar la transparencia.'
          }
        ],
        correctOption: 'A',
        rubric: {
          keywords: ['1 día hábil', 'un día hábil', 'sobre cerrado', 'código cifrado', 'reserva', 'oii', 'sispad', 'confidencial'],
          coreConcept: 'Las autoridades o coordinadores en territorio deben remitir las denuncias en un plazo máximo de un (1) día hábil —en sobre cerrado confidencial o medio digital seguro— a la OII, asignando un código cifrado antes de la evaluación de requisitos (2 días hábiles) y el registro en el SISPAD.',
          normativeRef: 'Directiva N° 001-2022-MIDIS (Versión 02, numerales 7.1 y 7.2) y D. Leg. N° 1327 (Art. 6: Principio de Reserva).',
          socraticPrompt: '¿Por qué la asignación inmediata del código cifrado y el cumplimiento estricto del plazo de un (1) día hábil son determinantes antes de iniciar cualquier requerimiento de información en campo?'
        }
      },
      {
        id: 'q3_3',
        code: '3.3',
        points: 2.0,
        axisKey: 'denuncias',
        prompt: 'Respecto a la situación contractual de la especialista denunciante y a la solicitud de acceso a la información pública presentada por el periodista, ¿qué decisiones corresponden legalmente?',
        options: [
          {
            id: 'A',
            text: 'Dejar que venza el contrato de la especialista para evitar conflictos con su jefe y entregar al periodista una copia testada con los nombres de los funcionarios denunciados.'
          },
          {
            id: 'B',
            text: 'Gestionar como medida de protección laboral la renovación de su relación contractual ante la anunciada no-renovación por represalia (además de traslado temporal o exoneración del denunciado si hay riesgo inminente) y denegar la solicitud del periodista por tratarse de información confidencial.'
          },
          {
            id: 'C',
            text: 'Suspender preventivamente a la especialista con goce de haber por seguridad y publicar un resumen del expediente en el portal de transparencia.'
          }
        ],
        correctOption: 'B',
        rubric: {
          keywords: ['renovación', 'contractual', 'represalia', 'medida de protección', 'denegar', 'confidencial', '17.3', 'reserva', 'd. leg. 1327'],
          coreConcept: 'El Reglamento del D. Leg. N° 1327 prevé la renovación del contrato ante una anunciada no-renovación por represalia (así como traslado o licencia/exoneración del denunciado). Asimismo, toda información sobre denuncias y medidas de protección es estrictamente confidencial y está exceptuada de acceso público (Art. 17.3 TUO Ley N° 27806).',
          normativeRef: 'D. Leg. N° 1327 (Art. 6 y Art. 9), D.S. N° 010-2017-JUS (Art. 6: Medidas de protección laboral) y Art. 17.3 del TUO de la Ley N° 27806.',
          socraticPrompt: '¿Qué responsabilidad disciplinaria recaería sobre el funcionario que divulgue —incluso por negligencia o ante una solicitud de prensa— la identidad del denunciante o el contenido de la denuncia protegida?'
        }
      },
      {
        id: 'q3_4',
        code: '3.4',
        points: 2.0,
        axisKey: 'denuncias',
        prompt: '¿Cómo deben articular el/la Director/a Regional y los/as Jefes/as de las Unidades Territoriales de Cuna Más y Juntos para ejecutar las medidas de protección en los plazos normativos y sostener la atención a las familias?',
        options: [
          {
            id: 'A',
            text: 'Requerir en 1 día hábil el informe de viabilidad operativa a OGRH (que debe emitirlo en máximo 3 días hábiles), activar la protección de oficio en la STPAD y redistribuir temporalmente las rutas de acompañamiento familiar en la IAR sin revelar el motivo al entorno operativo.'
          },
          {
            id: 'B',
            text: 'Paralizar las visitas domiciliarias de Cuna Más y Juntos en el distrito involucrado durante 30 días mientras la STPAD concluye el procedimiento disciplinario.'
          },
          {
            id: 'C',
            text: 'Convocar a una asamblea con los comités de gestión de Cuna Más y Juntos para informarles quién presentó la denuncia y pedirles que vigilen al coordinador cuestionado.'
          }
        ],
        correctOption: 'A',
        rubric: {
          keywords: ['ogrh', 'viabilidad operativa', '3 días hábiles', '1 día hábil', 'stpad', 'oficio', 'rutas', 'cuna más', 'juntos', 'continuidad'],
          coreConcept: 'La articulación interna exige solicitar el informe de viabilidad operativa a OGRH en 1 día hábil (emisión en máximo 3 días hábiles) y asegurar la reserva de oficio en la STPAD, mientras en territorio se reorganizan las rutas de Cuna Más y Juntos sin exponer al denunciante ni interrumpir el servicio DIT.',
          normativeRef: 'Directiva N° 001-2022-MIDIS (Versión 02: Articulación OII–OGRH–STPAD, plazos de 1 y 3 días hábiles) y D.S. N° 010-2017-JUS.',
          socraticPrompt: '¿Cómo se equilibra la celeridad en la coordinación interna entre OII, OGRH y STPAD (plazos de 1 y 3 días hábiles) con el deber de no interrumpir las prestaciones de Desarrollo Infantil Temprano a las familias usuarias?'
        }
      }
    ]
  }
];

const DEMO_COHORT = [
  {
    id: 'demo-1',
    name: 'Elena Quispe Huamán',
    dni: '42891034',
    email: 'equispe@regioncusco.gob.pe',
    startedAt: '2026-07-15T09:10:00.000Z',
    completedAt: '2026-07-15T09:42:00.000Z',
    answers: {
      q1_1: { selected: 'B', justification: 'Existe un conflicto de intereses real con la postulante por parentesco por afinidad con su cónyuge, lo que colisiona con el deber de imparcialidad.' },
      q1_2: { selected: 'C', justification: 'Corresponde activar la excusación formal ante el Gerente de Desarrollo Social para tramitar su reemplazo, diferenciándola de la recusación de terceros.' },
      q1_3: { selected: 'B', justification: 'Debe anotarse en el Registro de Visitas en Línea para dar trazabilidad y verificar la Declaración Jurada de Intereses.' },
      q1_4: { selected: 'C', justification: 'Se comunica la abstención parcial al Coordinador Territorial de la UT del MIDIS y se continúa validando el resto del padrón.' },
      q2_1: { selected: 'B', justification: 'Se configura proselitismo político con bienes en custodia del PCA y ventaja indebida por el ofrecimiento de viáticos del proveedor.' },
      q2_2: { selected: 'C', justification: 'El deber de obediencia no ampara órdenes ilegales; debe negarse por escrito y comunicar al órgano de control.' },
      q2_3: { selected: 'B', justification: 'Entregar información fidedigna y oportuna sobre stocks a la olla común, aplicar penalidades y denunciar el intento de soborno.' },
      q2_4: { selected: 'C', justification: 'Activar el comité conjunto con vigilancia ciudadana, GORE y MIDIS para auditar el almacén y el padrón.' },
      q3_1: { selected: 'B', justification: 'Tiene fundamento y materialidad de corrupción, por lo que debe tramitarse como denuncia ante la OII y no como queja.' },
      q3_2: { selected: 'A', justification: 'Remitir en un plazo máximo de 1 día hábil en sobre cerrado confidencial asignando código cifrado para proteger su identidad.' },
      q3_3: { selected: 'B', justification: 'Corresponde renovar el contrato como medida de protección laboral ante represalia y denegar acceso al periodista por confidencialidad.' },
      q3_4: { selected: 'A', justification: 'Pedir informe de viabilidad operativa a OGRH en 1 día hábil para emisión en 3 días hábiles y redistribuir rutas con Cuna Más y Juntos.' }
    }
  },
  {
    id: 'demo-2',
    name: 'Carlos Mendoza Paredes',
    dni: '40119283',
    email: 'cmendoza@munihuamanga.gob.pe',
    startedAt: '2026-07-15T10:05:00.000Z',
    completedAt: '2026-07-15T10:39:00.000Z',
    answers: {
      q1_1: { selected: 'B', justification: 'Hay colisión directa entre el interés familiar por parentesco y la función pública de adjudicar el puesto.' },
      q1_2: { selected: 'B', justification: 'Lo más práctico es que la postulante desista para no retrasar la campaña con la unidad territorial.' },
      q1_3: { selected: 'B', justification: 'Registrar la visita del regidor en el Registro de Visitas en Línea y revisar la DJI.' },
      q1_4: { selected: 'C', justification: 'Abstención parcial solo en el caso observado y continuidad del padrón con la UT del MIDIS.' },
      q2_1: { selected: 'B', justification: 'Uso indebido de bienes en custodia para proselitismo y ventaja indebida del proveedor.' },
      q2_2: { selected: 'C', justification: 'Rechazar la orden ilegal dejando constancia escrita y reportar al OCI.' },
      q2_3: { selected: 'B', justification: 'Transparencia sobre stocks y criterios, mantener observaciones al proveedor y reportar el soborno.' },
      q2_4: { selected: 'A', justification: 'Resolverlo internamente en la subgerencia para no generar alarma innecesaria.' },
      q3_1: { selected: 'B', justification: 'Es denuncia por corrupción con indicios y materialidad ante la Oficina de Integridad Institucional.' },
      q3_2: { selected: 'A', justification: 'Derivar en 1 día hábil con código cifrado y sobre cerrado.' },
      q3_3: { selected: 'B', justification: 'Renovación contractual por protección laboral y reserva de identidad frente a la solicitud de prensa.' },
      q3_4: { selected: 'B', justification: 'Suspender temporalmente las visitas mientras se investiga.' }
    }
  }
];

/**
 * SERVICIO DE PERSISTENCIA Y LIMPIEZA SEGURA
 */
const storageService = {
  purgeLegacy() {
    try {
      STORAGE_KEYS.LEGACY.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      // Ignorar errores de almacenamiento restringido
    }
  },
  loadCohort() {
    this.purgeLegacy();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COHORT);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },
  saveCohort(cohort) {
    try {
      localStorage.setItem(STORAGE_KEYS.COHORT, JSON.stringify(cohort));
    } catch (e) {
      console.error('No se pudo guardar la cohorte en localStorage:', e);
    }
  },
  loadActiveSessionId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.SESSION) || null;
    } catch (e) {
      return null;
    }
  },
  saveActiveSessionId(id) {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.SESSION, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {
      // Ignorar
    }
  },
  loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!raw) return { ...DEFAULT_CONFIG };
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  },
  saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
    } catch (e) {
      console.error('No se pudo guardar la configuración:', e);
    }
  }
};

/**
 * VALIDACIÓN DE IDENTIFICACIÓN DEL PARTICIPANTE
 */
function validateParticipantForm({ name, dni, email, consent }) {
  const errors = {};
  if (!name || name.trim().length < 5) {
    errors.name = 'Ingrese sus nombres y apellidos completos (mínimo 5 caracteres).';
  }
  if (!/^\d{8}$/.test((dni || '').trim())) {
    errors.dni = 'El DNI debe contener exactamente 8 dígitos numéricos.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim())) {
    errors.email = 'Ingrese un correo electrónico válido.';
  }
  if (!consent) {
    errors.consent = 'Debe aceptar el registro de avance y generación de reporte.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * MOTOR DE RETROALIMENTACIÓN SOCRÁTICA Y COMPLEMENTARIA BASADA EN RÚBRICA
 */
function analyzeJustificationSocratic(question, selectedOptionId, justificationText) {
  const isCorrect = selectedOptionId === question.correctOption;
  const textLower = (justificationText || '').toLowerCase();
  const matchedKeywords = question.rubric.keywords.filter((kw) =>
    textLower.includes(kw.toLowerCase())
  );
  const missingKeywords = question.rubric.keywords.filter(
    (kw) => !textLower.includes(kw.toLowerCase())
  );

  let recognition = '';
  if (matchedKeywords.length >= 3) {
    recognition = `Su sustento incorpora con precisión conceptos técnicos clave de la rúbrica (${matchedKeywords
      .slice(0, 4)
      .join(', ')}), evidenciando claridad en el diagnóstico normativo.`;
  } else if (matchedKeywords.length > 0) {
    recognition = `Su argumentación identifica acertadamente elementos relevantes (${matchedKeywords.join(
      ', '
    )}) vinculados a la gestión ética del caso.`;
  } else {
    recognition = `Ha planteado una postura operativa frente al dilema; sin embargo, su sustento no explicita aún las categorías técnicas ni los plazos normativos exigidos por la directiva sectorial.`;
  }

  const complement = `${question.rubric.coreConcept} (Base normativa: ${question.rubric.normativeRef}).${
    missingKeywords.length > 0
      ? ` Para fortalecer su sustento técnico, integre criterios como: ${missingKeywords
          .slice(0, 3)
          .join(', ')}.`
      : ''
  }`;

  const socraticQuestion = isCorrect
    ? question.rubric.socraticPrompt
    : `Usted eligió la alternativa ${selectedOptionId}. Contraste su argumento con el criterio normativo: ${question.rubric.socraticPrompt}`;

  return {
    isCorrect,
    earnedPoints: isCorrect ? question.points : 0,
    recognition,
    complement,
    socraticQuestion,
    matchedCount: matchedKeywords.length,
  };
}

/**
 * CÁLCULO EN TIEMPO REAL DEL PERFIL ADAPTATIVO Y PLAN DE ACCIÓN
 */
function computeAdaptiveProfile(answers = {}) {
  const allQuestions = CASES_DATA.flatMap((c) => c.questions);
  let totalScore = 0;
  let answeredCount = 0;

  const axisStats = {
    conflictos: { label: 'Conflictos de Intereses', earned: 0, max: 6.5, count: 0, total: 4 },
    recursos: { label: 'Transparencia de Recursos', earned: 0, max: 6.5, count: 0, total: 4 },
    denuncias: { label: 'Canales de Denuncia y Protección', earned: 0, max: 7.0, count: 0, total: 4 },
  };

  allQuestions.forEach((q) => {
    const ans = answers[q.id];
    if (ans && ans.selected) {
      answeredCount += 1;
      axisStats[q.axisKey].count += 1;
      if (ans.selected === q.correctOption) {
        totalScore += q.points;
        axisStats[q.axisKey].earned += q.points;
      }
    }
  });

  totalScore = Math.round(totalScore * 10) / 10;

  const axes = Object.entries(axisStats).map(([key, stat]) => {
    const pct = stat.max > 0 ? Math.round((stat.earned / stat.max) * 100) : 0;
    return {
      key,
      label: stat.label,
      earned: Math.round(stat.earned * 10) / 10,
      max: stat.max,
      pct,
      answered: stat.count,
      total: stat.total,
    };
  });

  let level = 'En Evaluación';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  let summary = 'Complete las preguntas secuenciales para obtener su diagnóstico integral.';

  if (answeredCount > 0) {
    if (totalScore >= 17) {
      level = 'Liderazgo Ético Estratégico';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      summary =
        'Demuestra dominio sobresaliente para diagnosticar riesgos de integridad, activar mecanismos preventivos y articular con el MIDIS sin detener la entrega de servicios.';
    } else if (totalScore >= 14) {
      level = 'Gestión Pública Competente';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
      summary =
        'Aplica criterios sólidos de probidad y transparencia territorial, con oportunidades puntuales de precisión en plazos y protocolos de protección.';
    } else if (totalScore >= 10) {
      level = 'Criterio Preventivo en Desarrollo';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
      summary =
        'Reconoce dilemas éticos básicos, pero requiere reforzar la activación oportuna de abstenciones, límites ante órdenes ilegales y plazos perentorios de denuncia.';
    } else {
      level = 'Alerta de Riesgo Operativo';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
      summary =
        'Presenta vulnerabilidades críticas en la gestión de conflictos de intereses, custodia de recursos o reserva de denuncias que pueden comprometer la continuidad del servicio.';
    }
  }

  const recommendations = [];
  const actionPlan = [];

  axes.forEach((ax) => {
    if (ax.key === 'conflictos' && ax.pct < 85) {
      recommendations.push(
        'Reforzar la diferenciación operativa entre excusación (deber propio de abstenerse ante el superior) y recusación, asegurando siempre el Registro de Visitas en Línea y la DJI.'
      );
      actionPlan.push({
        eje: 'Conflictos de Intereses',
        accion: 'Implementar bitácora de abstenciones parciales y verificación previa de DJI en comités de selección y focalización ULE.',
        plazo: 'Inmediato (antes del siguiente corte SISFOH)',
      });
    }
    if (ax.key === 'recursos' && ax.pct < 85) {
      recommendations.push(
        'Aplicar el deber de resistencia documentada frente a órdenes arbitrarias o proselitismo con bienes en custodia, activando comités de vigilancia ciudadana.'
      );
      actionPlan.push({
        eje: 'Transparencia de Recursos',
        accion: 'Publicar actas de stock de almacén y cronogramas de entrega PCA/Ollas Comunes con veeduría de GORE y equipo territorial MIDIS.',
        plazo: 'Semanal / En cada entrega programada',
      });
    }
    if (ax.key === 'denuncias' && ax.pct < 85) {
      recommendations.push(
        'Garantizar la derivación de denuncias de corrupción en máximo 1 día hábil con código cifrado a la OII y proteger el vínculo laboral sin divulgar identidad.'
      );
      actionPlan.push({
        eje: 'Canales de Denuncia y Protección',
        accion: 'Establecer protocolo territorial de sobre cerrado confidencial (1 día hábil) y coordinación expresa OII–OGRH–STPAD (3 días hábiles para viabilidad laboral).',
        plazo: 'Permanente en espacios de articulación (IAR / IAL)',
      });
    }
  });

  if (actionPlan.length === 0 && answeredCount === 12) {
    recommendations.push(
      'Consolidar su rol como referente de integridad territorial replicando los protocolos de prevención y articulación multinivel con los equipos locales y regionales.'
    );
    actionPlan.push({
      eje: 'Liderazgo Integral en Territorio',
      accion: 'Conducir sesiones de réplica técnica sobre prevención de conflictos de intereses, transparencia activa y canales seguros de denuncia con equipos ULE, PCA e IAR.',
      plazo: 'Próximos 30 días calendario',
    });
  }

  return {
    totalScore,
    maxScore: 20.0,
    answeredCount,
    totalQuestions: 12,
    progressPct: Math.round((answeredCount / 12) * 100),
    axes,
    level,
    badgeColor,
    summary,
    recommendations,
    actionPlan,
  };
}

/**
 * COMPONENTE DE EMBLEMA OFICIAL MIDIS (DETECCIÓN AUTOMÁTICA + RESPALDO VECTORIAL SIN RECORTES)
 */
function MidisLogoBadge({ customLogoUrl, onDoubleClick, className = '' }) {
  const candidates = useMemo(() => {
    const list = [];
    if (customLogoUrl && customLogoUrl.trim()) {
      list.push(customLogoUrl.trim());
    }
    ['/logo-midis.png', '/MIDIS.png', '/MIDIS (1).png'].forEach((path) => {
      if (!list.includes(path)) list.push(path);
    });
    return list;
  }, [customLogoUrl]);

  const [candidateIdx, setCandidateIdx] = useState(0);
  const [useFallbackSvg, setUseFallbackSvg] = useState(false);

  useEffect(() => {
    setCandidateIdx(0);
    setUseFallbackSvg(false);
  }, [customLogoUrl]);

  const handleImgError = () => {
    if (candidateIdx + 1 < candidates.length) {
      setCandidateIdx((prev) => prev + 1);
    } else {
      setUseFallbackSvg(true);
    }
  };

  return (
    <div
      onDoubleClick={onDoubleClick}
      title="Ministerio de Desarrollo e Inclusión Social"
      className={`select-none inline-flex items-center ${className}`}
    >
      {!useFallbackSvg ? (
        <img
          src={candidates[candidateIdx]}
          alt="Logo Oficial MIDIS"
          onError={handleImgError}
          className="h-11 sm:h-12 w-auto max-w-[260px] object-contain bg-white rounded px-1.5 py-1 shadow-sm"
        />
      ) : (
        <div className="inline-flex items-stretch h-11 sm:h-12 bg-white rounded overflow-hidden shadow-sm border border-slate-200">
          {/* Bloque Escudo Nacional */}
          <div className="flex items-center justify-center px-2 bg-white border-r border-slate-200">
            <svg viewBox="0 0 64 64" className="w-8 h-8" aria-label="Escudo del Perú">
              <circle cx="32" cy="32" r="29" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <path d="M14 18 C10 28, 10 38, 16 48 L22 44 C18 36, 18 28, 20 20 Z" fill="#dc2626" />
              <path d="M50 18 C54 28, 54 38, 48 48 L42 44 C46 36, 46 28, 44 20 Z" fill="#dc2626" />
              <ellipse cx="32" cy="13" rx="9" ry="4.5" fill="none" stroke="#15803d" strokeWidth="3.5" />
              <path d="M21 20 H43 V35 C43 43, 32 49, 32 49 C32 49, 21 43, 21 35 Z" fill="#fef08a" stroke="#b45309" strokeWidth="1.8" />
              <rect x="22.5" y="21.5" width="9" height="12" fill="#38bdf8" />
              <rect x="32.5" y="21.5" width="9" height="12" fill="#ffffff" />
              <path d="M22.5 34.5 H41.5 V36 C41.5 41.5, 32 47, 32 47 C32 47, 22.5 41.5, 22.5 36 Z" fill="#dc2626" />
              <circle cx="37" cy="27.5" r="3.2" fill="#16a34a" />
              <circle cx="27" cy="28" r="2.2" fill="#92400e" />
              <path d="M26 39 Q32 43 38 39" stroke="#facc15" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
          {/* Bloque Rojo PERÚ */}
          <div className="bg-[#D91023] text-white font-extrabold tracking-wider text-xs sm:text-sm px-2.5 flex items-center justify-center">
            PERÚ
          </div>
          {/* Bloque Gris MIDIS */}
          <div className="bg-[#575756] text-white px-2.5 py-1 flex flex-col justify-center leading-tight">
            <span className="text-[10px] sm:text-[11px] font-semibold">Ministerio</span>
            <span className="text-[10px] sm:text-[11px] font-semibold">de Desarrollo</span>
            <span className="text-[10px] sm:text-[11px] font-semibold">e Inclusión Social</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * EXPORTACIÓN DE REPORTE INDIVIDUAL EN PDF (VENTANA DE IMPRESIÓN LIMPIA)
 */
function exportParticipantPDF(participant, config) {
  const profile = computeAdaptiveProfile(participant.answers);
  const logoSrc = config.customLogoDataUrl || '/logo-midis.png';

  const questionsHtml = CASES_DATA.map((c) => {
    const qItems = c.questions
      .map((q) => {
        const ans = participant.answers?.[q.id];
        if (!ans) {
          return `
            <div style="border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px; background:#f8fafc;">
              <div style="font-weight:700; color:#475569;">Pregunta ${q.code} (${q.points.toFixed(1)} pts) — Pendiente</div>
              <div style="font-size:12px; color:#64748b;">No respondida aún.</div>
            </div>
          `;
        }
        const feedback = analyzeJustificationSocratic(q, ans.selected, ans.justification);
        const chosenOpt = q.options.find((o) => o.id === ans.selected);
        const correctOpt = q.options.find((o) => o.id === q.correctOption);
        return `
          <div style="border:1px solid ${feedback.isCorrect ? '#86efac' : '#fecdd3'}; border-radius:6px; padding:10px; margin-bottom:10px; background:${feedback.isCorrect ? '#f0fdf4' : '#fff1f2'}; page-break-inside:avoid;">
            <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px; color:#0f172a; margin-bottom:4px;">
              <span>Pregunta ${q.code}: ${q.prompt}</span>
              <span style="color:${feedback.isCorrect ? '#15803d' : '#be123c'}; white-space:nowrap; margin-left:8px;">
                ${feedback.earnedPoints.toFixed(1)} / ${q.points.toFixed(1)} pts
              </span>
            </div>
            <div style="font-size:12px; margin-bottom:4px;">
              <strong>Alternativa elegida (${ans.selected}):</strong> ${chosenOpt ? chosenOpt.text : ans.selected}
            </div>
            ${
              !feedback.isCorrect
                ? `<div style="font-size:12px; color:#15803d; margin-bottom:4px;"><strong>Alternativa correcta (${q.correctOption}):</strong> ${correctOpt ? correctOpt.text : ''}</div>`
                : ''
            }
            <div style="font-size:12px; background:#ffffff; padding:6px 8px; border-radius:4px; border:1px solid #cbd5e1; margin-bottom:6px;">
              <strong>Sustento del participante:</strong> "${ans.justification}"
            </div>
            <div style="font-size:11.5px; color:#1e293b; line-height:1.45;">
              <div><strong>• Reconocimiento:</strong> ${feedback.recognition}</div>
              <div><strong>• Complemento normativo:</strong> ${feedback.complement}</div>
              <div><strong>• Reflexión socrática:</strong> <em>${feedback.socraticQuestion}</em></div>
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div style="margin-top:16px;">
        <h3 style="background:#1e293b; color:#ffffff; padding:7px 12px; border-radius:6px; font-size:14px; margin-bottom:8px;">
          ${c.code}: ${c.title} (${c.axis})
        </h3>
        ${qItems}
      </div>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Reporte Individual - ${participant.name}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 24px; font-size: 13px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #D91023; padding-bottom: 12px; margin-bottom: 16px; }
        .brand { display: flex; align-items: center; gap: 10px; }
        .badge-peru { background: #D91023; color: #fff; font-weight: 800; padding: 8px 10px; font-size: 14px; }
        .badge-midis { background: #575756; color: #fff; font-weight: 600; padding: 6px 10px; font-size: 11px; line-height: 1.2; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 16px; }
        .score-box { background: #0f172a; color: #fff; padding: 14px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #f1f5f9; font-weight: 700; }
        @media print { body { margin: 12px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <img src="${logoSrc}" alt="MIDIS" style="height:46px; object-fit:contain;" onerror="this.style.display='none'; document.getElementById('fallback-brand').style.display='flex';" />
          <div id="fallback-brand" style="display:none; align-items:stretch;">
            <div class="badge-peru">PERÚ</div>
            <div class="badge-midis">Ministerio de Desarrollo<br/>e Inclusión Social</div>
          </div>
          <div>
            <div style="font-size:15px; font-weight:800; color:#0f172a;">${config.workshopTitle}</div>
            <div style="font-size:11.5px; color:#475569;">Reporte Individual de Desempeño y Plan de Acción Territorial</div>
          </div>
        </div>
        <div style="text-align:right; font-size:11px; color:#64748b;">
          Fecha: ${new Date().toLocaleDateString('es-PE')}<br/>
          Simulador ${APP_VERSION}
        </div>
      </div>

      <div class="grid">
        <div><strong>Participante / Equipo:</strong> ${participant.name}</div>
        <div><strong>DNI:</strong> ${participant.dni}</div>
        <div><strong>Correo electrónico:</strong> ${participant.email}</div>
        <div><strong>Avance registrado:</strong> ${profile.answeredCount} de 12 ítems (${profile.progressPct}%)</div>
      </div>

      <div class="score-box">
        <div>
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8;">Nivel Adaptativo Alcanzado</div>
          <div style="font-size:17px; font-weight:800; margin-top:2px;">${profile.level}</div>
          <div style="font-size:12px; color:#cbd5e1; margin-top:4px; max-width:520px;">${profile.summary}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:26px; font-weight:900; color:#38bdf8;">${profile.totalScore.toFixed(1)} / 20.0</div>
          <div style="font-size:11px; color:#cbd5e1;">Puntaje Total</div>
        </div>
      </div>

      <h3 style="font-size:14px; margin-bottom:6px;">Desempeño por Eje Temático</h3>
      <table>
        <thead>
          <tr>
            <th>Eje Temático</th>
            <th>Ítems Respondidos</th>
            <th>Puntaje Obtenido</th>
            <th>Porcentaje de Logro</th>
          </tr>
        </thead>
        <tbody>
          ${profile.axes
            .map(
              (ax) => `
            <tr>
              <td><strong>${ax.label}</strong></td>
              <td>${ax.answered} / ${ax.total}</td>
              <td>${ax.earned.toFixed(1)} / ${ax.max.toFixed(1)} pts</td>
              <td>${ax.pct}%</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h3 style="font-size:14px; margin-bottom:6px;">Plan de Acción Territorial Recomendado</h3>
      <table>
        <thead>
          <tr>
            <th>Eje</th>
            <th>Acción Prioritaria en Territorio</th>
            <th>Horizonte</th>
          </tr>
        </thead>
        <tbody>
          ${profile.actionPlan
            .map(
              (item) => `
            <tr>
              <td><strong>${item.eje}</strong></td>
              <td>${item.accion}</td>
              <td>${item.plazo}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h2 style="font-size:15px; border-bottom:2px solid #cbd5e1; padding-bottom:4px; margin-top:20px;">
        Detalle de Decisiones, Sustentos y Retroalimentación Socrática
      </h2>
      ${questionsHtml}

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;

  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  } else {
    alert('Por favor, permita las ventanas emergentes en su navegador para descargar el reporte PDF.');
  }
}

/**
 * EXPORTACIÓN MASIVA DE COHORTE EN CSV (UTF-8 BOM COMPATIBLE CON EXCEL)
 */
function exportCohortCSV(cohort) {
  const allQuestions = CASES_DATA.flatMap((c) => c.questions);
  const headers = [
    'Participante',
    'DNI',
    'Correo',
    'Avance_Items',
    'Puntaje_Total_20',
    'Nivel_Adaptativo',
    'Conflictos_Intereses_Pts',
    'Transparencia_Recursos_Pts',
    'Canales_Denuncia_Pts',
    ...allQuestions.flatMap((q) => [`Resp_${q.code}`, `Pts_${q.code}`, `Sustento_${q.code}`]),
  ];

  const escapeCsv = (val) => {
    const str = String(val ?? '').replace(/\r?\n|\r/g, ' ');
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = cohort.map((p) => {
    const prof = computeAdaptiveProfile(p.answers);
    const cPts = prof.axes.find((a) => a.key === 'conflictos')?.earned ?? 0;
    const rPts = prof.axes.find((a) => a.key === 'recursos')?.earned ?? 0;
    const dPts = prof.axes.find((a) => a.key === 'denuncias')?.earned ?? 0;

    const qCols = allQuestions.flatMap((q) => {
      const ans = p.answers?.[q.id];
      if (!ans) return ['', '0', ''];
      const pts = ans.selected === q.correctOption ? q.points : 0;
      return [ans.selected, pts.toFixed(1), ans.justification];
    });

    return [
      p.name,
      p.dni,
      p.email,
      `${prof.answeredCount}/12`,
      prof.totalScore.toFixed(1),
      prof.level,
      cPts.toFixed(1),
      rPts.toFixed(1),
      dPts.toFixed(1),
      ...qCols,
    ]
      .map(escapeCsv)
      .join(';');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(';'), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resultados_simulador_integridad_midis_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 */
export default function App() {
  const [config, setConfig] = useState(() => storageService.loadConfig());
  const [cohort, setCohort] = useState(() => storageService.loadCohort());
  const [activeSessionId, setActiveSessionId] = useState(() => storageService.loadActiveSessionId());

  // Navegación principal: 'participant' | 'teacher'
  const [viewMode, setViewMode] = useState('participant');

  // Autenticación discreta de Vista Docente
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [showTeacherLoginModal, setShowTeacherLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Pestaña activa en Vista Docente: 'cohort' | 'comparator' | 'settings'
  const [teacherTab, setTeacherTab] = useState('cohort');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectParticipantId, setInspectParticipantId] = useState(null);

  // Estado de formulario de registro del participante
  const [regName, setRegName] = useState('');
  const [regDni, setRegDni] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regConsent, setRegConsent] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  // Estado de navegación del simulador activo
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [draftSelections, setDraftSelections] = useState({});
  const [draftJustifications, setDraftJustifications] = useState({});
  const [validationAlert, setValidationAlert] = useState('');

  // Estado temporal en pestaña de configuración docente
  const [cfgForm, setCfgForm] = useState(config);
  const [cfgSavedMsg, setCfgSavedMsg] = useState('');

  // Sincronización con localStorage
  useEffect(() => {
    storageService.saveCohort(cohort);
  }, [cohort]);

  useEffect(() => {
    storageService.saveActiveSessionId(activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    storageService.saveConfig(config);
    setCfgForm(config);
  }, [config]);

  // Atajo de teclado discreto Alt + D para abrir acceso docente
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        if (isTeacherAuthenticated) {
          setViewMode((prev) => (prev === 'teacher' ? 'participant' : 'teacher'));
        } else {
          setLoginError('');
          setShowTeacherLoginModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTeacherAuthenticated]);

  const activeParticipant = useMemo(
    () => cohort.find((p) => p.id === activeSessionId) || null,
    [cohort, activeSessionId]
  );

  // Abrir acceso docente discreto
  const triggerTeacherAccess = () => {
    if (isTeacherAuthenticated) {
      setViewMode('teacher');
    } else {
      setLoginUser('');
      setLoginPass('');
      setLoginError('');
      setShowTeacherLoginModal(true);
    }
  };

  const handleTeacherLoginSubmit = (e) => {
    e.preventDefault();
    if (
      loginUser.trim() === (config.teacherUser || DEFAULT_CONFIG.teacherUser) &&
      loginPass === (config.teacherPass || DEFAULT_CONFIG.teacherPass)
    ) {
      setIsTeacherAuthenticated(true);
      setShowTeacherLoginModal(false);
      setViewMode('teacher');
      setLoginError('');
    } else {
      setLoginError('Usuario o clave incorrectos. Verifique las credenciales docentes.');
    }
  };

  // Registro / inicio de sesión del participante
  const handleStartSimulation = (e) => {
    e.preventDefault();
    const { isValid, errors } = validateParticipantForm({
      name: regName,
      dni: regDni,
      email: regEmail,
      consent: regConsent,
    });
    setRegErrors(errors);
    if (!isValid) return;

    const cleanDni = regDni.trim();
    const existing = cohort.find((p) => p.dni === cleanDni);

    if (existing) {
      setActiveSessionId(existing.id);
      // Posicionar en el primer caso con preguntas pendientes
      const firstIncompleteCaseIdx = CASES_DATA.findIndex((c) =>
        c.questions.some((q) => !existing.answers?.[q.id])
      );
      setActiveCaseIdx(firstIncompleteCaseIdx >= 0 ? firstIncompleteCaseIdx : 0);
    } else {
      const newParticipant = {
        id: `part-${Date.now()}`,
        name: regName.trim(),
        dni: cleanDni,
        email: regEmail.trim(),
        startedAt: new Date().toISOString(),
        completedAt: null,
        answers: {},
      };
      setCohort((prev) => [newParticipant, ...prev]);
      setActiveSessionId(newParticipant.id);
      setActiveCaseIdx(0);
    }
  };

  // Confirmar y calificar una pregunta (intento único + avance secuencial)
  const handleConfirmAnswer = (question) => {
    if (!activeParticipant) return;
    if (activeParticipant.answers?.[question.id]) return; // Intento único

    const selected = draftSelections[question.id];
    const justification = (draftJustifications[question.id] || '').trim();
    const wordCount = justification ? justification.split(/\s+/).filter(Boolean).length : 0;

    if (!selected) {
      setValidationAlert('Debe seleccionar una alternativa (A, B o C) antes de calificar.');
      return;
    }
    if (wordCount < config.minJustificationWords) {
      setValidationAlert(
        `Su sustento técnico es obligatorio y requiere al menos ${config.minJustificationWords} palabras (actual: ${wordCount}).`
      );
      return;
    }

    setValidationAlert('');
    const updatedAnswers = {
      ...(activeParticipant.answers || {}),
      [question.id]: {
        selected,
        justification,
        answeredAt: new Date().toISOString(),
      },
    };

    const totalAnswered = Object.keys(updatedAnswers).length;
    const isFinished = totalAnswered === 12;

    setCohort((prev) =>
      prev.map((p) =>
        p.id === activeParticipant.id
          ? {
              ...p,
              answers: updatedAnswers,
              completedAt: isFinished ? new Date().toISOString() : p.completedAt,
            }
          : p
      )
    );
  };

  // Reiniciar plataforma completamente a 0 registros (sin recargar demo)
  const handleResetPlatform = () => {
    const confirmed = window.confirm(
      '¿Está seguro de eliminar TODOS los registros de participantes y dejar la plataforma en 0? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    storageService.purgeLegacy();
    localStorage.removeItem(STORAGE_KEYS.COHORT);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setCohort([]);
    setActiveSessionId(null);
    setInspectParticipantId(null);
    setDraftSelections({});
    setDraftJustifications({});
    setActiveCaseIdx(0);
  };

  // Cargar explícitamente los 2 participantes de demostración
  const handleLoadDemo = () => {
    setCohort(DEMO_COHORT);
  };

  // Subir logotipo personalizado desde el panel docente
  const handleLogoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxH = 120;
        const scale = img.height > maxH ? maxH / img.height : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCfgForm((prev) => ({ ...prev, customLogoDataUrl: dataUrl }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setConfig(cfgForm);
    setCfgSavedMsg('Configuración institucional y logotipo guardados correctamente.');
    setTimeout(() => setCfgSavedMsg(''), 3500);
  };

  // Calcular desbloqueo secuencial de casos y preguntas para el participante activo
  const participantProfile = useMemo(
    () => (activeParticipant ? computeAdaptiveProfile(activeParticipant.answers) : null),
    [activeParticipant]
  );

  const unlockedCaseIndex = useMemo(() => {
    if (!activeParticipant) return 0;
    const ans = activeParticipant.answers || {};
    const c1Done = CASES_DATA[0].questions.every((q) => Boolean(ans[q.id]));
    if (!c1Done) return 0;
    const c2Done = CASES_DATA[1].questions.every((q) => Boolean(ans[q.id]));
    if (!c2Done) return 1;
    return 2;
  }, [activeParticipant]);

  // Métricas globales de cohorte para Vista Docente
  const cohortMetrics = useMemo(() => {
    const total = cohort.length;
    if (total === 0) {
      return { total: 0, completed: 0, avgScore: 0, passRate: 0 };
    }
    let completed = 0;
    let sumScore = 0;
    let passed = 0;
    cohort.forEach((p) => {
      const prof = computeAdaptiveProfile(p.answers);
      if (prof.answeredCount === 12) completed += 1;
      sumScore += prof.totalScore;
      if (prof.totalScore >= (config.passingScore || 14)) passed += 1;
    });
    return {
      total,
      completed,
      avgScore: Math.round((sumScore / total) * 10) / 10,
      passRate: Math.round((passed / total) * 100),
    };
  }, [cohort, config.passingScore]);

  const filteredCohort = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return cohort;
    return cohort.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.dni.includes(q) ||
        p.email.toLowerCase().includes(q)
    );
  }, [cohort, searchTerm]);

  const inspectedParticipant = useMemo(
    () => cohort.find((p) => p.id === inspectParticipantId) || null,
    [cohort, inspectParticipantId]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* CABECERA INSTITUCIONAL */}
      <header className="bg-slate-900 text-white border-b-4 border-[#D91023] shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <MidisLogoBadge
              customLogoUrl={config.customLogoDataUrl}
              onDoubleClick={triggerTeacherAccess}
            />
            <div className="border-l border-slate-700 pl-3.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                  Oficina de Integridad Institucional
                </span>
                {viewMode === 'teacher' && (
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    {APP_VERSION}
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold leading-snug text-white">
                {config.workshopTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'teacher' && (
              <button
                type="button"
                onClick={() => setViewMode('participant')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 transition"
              >
                ← Volver a Vista Participante
              </button>
            )}

            {viewMode === 'participant' && activeParticipant && (
              <div className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white">{activeParticipant.name}</div>
                  <div className="text-[11px] text-slate-400">DNI: {activeParticipant.dni}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSessionId(null);
                    setValidationAlert('');
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                >
                  Cambiar usuario
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {viewMode === 'participant' ? (
          !activeParticipant ? (
            /* PANTALLA DE BIENVENIDA Y REGISTRO DEL PARTICIPANTE */
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-50 text-[#D91023] border border-red-200 mb-3">
                  Taller Virtual de Integridad Pública
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-3">
                  Simulador de Casos Prácticos en Servicios del MIDIS y sus PPSS
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Analice tres situaciones críticas de articulación territorial entre Gobiernos Locales,
                  Gobiernos Regionales y Programas Sociales del MIDIS (Pensión 65, Contigo, PCA/Ollas Comunes,
                  Cuna Más y Juntos), diagnosticando riesgos de <strong>conflictos de intereses</strong>,{' '}
                  <strong>transparencia de recursos</strong> y <strong>canales de denuncia</strong>.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Reglas de participación y evaluación (20 puntos)
                  </h3>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-[#D91023] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      <strong>Intento único y avance secuencial:</strong> El simulador consta de 3 casos y 12
                      preguntas (20 puntos en total). Cada pregunta se desbloquea de manera progresiva tras
                      confirmar la anterior, requiere un <strong>sustento técnico obligatorio</strong> y admite
                      un único intento puntuable.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      <strong>Retroalimentación socrática y reporte PDF:</strong> Al responder cada ítem
                      recibirá su puntaje inmediato junto con el análisis de su argumento frente a la rúbrica
                      normativa. Al finalizar, podrá descargar su reporte integral y plan de acción en PDF.
                    </p>
                  </div>
                </div>
              </div>

              {/* FORMULARIO DE IDENTIFICACIÓN SIMPLIFICADO */}
              <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Identificación del Participante
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Complete sus datos para registrar su avance y emitir su reporte individual.
                </p>

                <form onSubmit={handleStartSimulation} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombres y Apellidos completos *
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ej. María Fernanda Torres Salazar"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D91023]"
                    />
                    {regErrors.name && (
                      <p className="text-xs text-rose-600 mt-1">{regErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Número de DNI (8 dígitos) *
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={regDni}
                      onChange={(e) => setRegDni(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ej. 45678912"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D91023]"
                    />
                    {regErrors.dni && (
                      <p className="text-xs text-rose-600 mt-1">{regErrors.dni}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Ej. mtorres@entidad.gob.pe"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D91023]"
                    />
                    {regErrors.email && (
                      <p className="text-xs text-rose-600 mt-1">{regErrors.email}</p>
                    )}
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regConsent}
                        onChange={(e) => setRegConsent(e.target.checked)}
                        className="mt-1 rounded border-slate-300 text-[#D91023] focus:ring-[#D91023]"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Autorizo el registro de mis respuestas y puntajes en esta sesión para el
                        seguimiento académico del taller y la generación de mi reporte PDF.
                      </span>
                    </label>
                    {regErrors.consent && (
                      <p className="text-xs text-rose-600 mt-1">{regErrors.consent}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#D91023] hover:bg-red-700 text-white font-bold text-sm shadow-sm transition cursor-pointer"
                  >
                    Iniciar Simulación de Casos →
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* VISTA ACTIVA DEL SIMULADOR PARA EL PARTICIPANTE */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* COLUMNA IZQUIERDA (8 COLS): CASO Y PREGUNTAS SECUENCIALES */}
              <div className="lg:col-span-8 space-y-5">
                {/* SELECTOR SECUENCIAL DE CASOS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CASES_DATA.map((c, idx) => {
                    const isUnlocked = idx <= unlockedCaseIndex;
                    const cAnswered = c.questions.filter(
                      (q) => activeParticipant.answers?.[q.id]
                    ).length;
                    const isCurrent = activeCaseIdx === idx;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => {
                          setActiveCaseIdx(idx);
                          setValidationAlert('');
                        }}
                        className={`text-left p-3.5 rounded-xl border transition ${
                          !isUnlocked
                            ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                            : isCurrent
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className={isCurrent ? 'text-red-400' : 'text-[#D91023]'}>
                            {c.code} • {c.maxPoints.toFixed(1)} pts
                          </span>
                          <span>
                            {!isUnlocked ? '🔒 Bloqueado' : `${cAnswered}/4 ítems`}
                          </span>
                        </div>
                        <div className="text-xs font-bold line-clamp-2">{c.title}</div>
                      </button>
                    );
                  })}
                </div>

                {/* EXPEDIENTE NARRATIVO DEL CASO ACTUAL */}
                {(() => {
                  const currentCase = CASES_DATA[activeCaseIdx];
                  const answeredInCase = currentCase.questions.filter(
                    (q) => activeParticipant.answers?.[q.id]
                  ).length;

                  // Solo mostrar preguntas hasta la siguiente pendiente (desbloqueo estricto una a una)
                  const visibleQuestionsCount = Math.min(
                    currentCase.questions.length,
                    answeredInCase + 1
                  );
                  const visibleQuestions = currentCase.questions.slice(0, visibleQuestionsCount);

                  return (
                    <>
                      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#D91023]">
                              {currentCase.code} — Eje: {currentCase.axis}
                            </span>
                            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                              {currentCase.title}
                            </h2>
                          </div>
                          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                            Valor del caso: {currentCase.maxPoints.toFixed(1)} pts
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs">
                          <div>
                            <span className="font-bold text-slate-700 block">
                              Articulación Territorial:
                            </span>
                            <span className="text-slate-600">{currentCase.level}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700 block">
                              Rol Protagonista que usted asume:
                            </span>
                            <span className="text-slate-600">{currentCase.role}</span>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                          {currentCase.narrative.map((paragraph, pIdx) => (
                            <p key={pIdx}>{paragraph}</p>
                          ))}
                        </div>
                      </section>

                      {/* REACTIVOS SECUENCIALES (SIN PISTAS Y DESBLOQUEO PROGRESIVO) */}
                      <section className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                            Toma de Decisiones ({answeredInCase} de {currentCase.questions.length}{' '}
                            respondidas en este caso)
                          </h3>
                          <span className="text-xs text-slate-500">
                            Avance secuencial • Intento único
                          </span>
                        </div>

                        {visibleQuestions.map((q) => {
                          const savedAns = activeParticipant.answers?.[q.id];
                          const isAnswered = Boolean(savedAns);
                          const currentSel = isAnswered
                            ? savedAns.selected
                            : draftSelections[q.id] || '';
                          const currentJust = isAnswered
                            ? savedAns.justification
                            : draftJustifications[q.id] || '';
                          const wordCount = currentJust
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean).length;

                          const feedback = isAnswered
                            ? analyzeJustificationSocratic(
                                q,
                                savedAns.selected,
                                savedAns.justification
                              )
                            : null;

                          return (
                            <div
                              key={q.id}
                              className={`bg-white rounded-2xl shadow-sm border p-6 transition ${
                                isAnswered
                                  ? feedback.isCorrect
                                    ? 'border-emerald-300'
                                    : 'border-rose-300'
                                  : 'border-slate-300 ring-2 ring-slate-900/5'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold">
                                    Pregunta {q.code}
                                  </span>
                                  <span className="text-xs font-bold text-slate-500">
                                    Puntaje: {q.points.toFixed(1)} pts
                                  </span>
                                </div>
                                {isAnswered && (
                                  <span
                                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                                      feedback.isCorrect
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {feedback.isCorrect
                                      ? `✓ Correcta (+${feedback.earnedPoints.toFixed(1)} pts)`
                                      : `✕ Incorrecta (0.0 / ${q.points.toFixed(1)} pts)`}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm sm:text-base font-bold text-slate-900 mb-4 leading-snug">
                                {q.prompt}
                              </p>

                              {/* ALTERNATIVAS CERRADAS */}
                              <div className="space-y-2.5 mb-5">
                                {q.options.map((opt) => {
                                  const isSelected = currentSel === opt.id;
                                  const isKey = q.correctOption === opt.id;

                                  let cardStyle =
                                    'border-slate-200 hover:border-slate-400 bg-white';
                                  if (isAnswered) {
                                    if (isKey) {
                                      cardStyle =
                                        'border-emerald-500 bg-emerald-50/70 text-emerald-950';
                                    } else if (isSelected && !isKey) {
                                      cardStyle = 'border-rose-500 bg-rose-50/70 text-rose-950';
                                    } else {
                                      cardStyle = 'border-slate-200 bg-slate-50 opacity-70';
                                    }
                                  } else if (isSelected) {
                                    cardStyle =
                                      'border-[#D91023] bg-red-50/40 ring-1 ring-[#D91023]';
                                  }

                                  return (
                                    <label
                                      key={opt.id}
                                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm transition ${
                                        isAnswered ? 'cursor-default' : 'cursor-pointer'
                                      } ${cardStyle}`}
                                    >
                                      <input
                                        type="radio"
                                        name={q.id}
                                        value={opt.id}
                                        disabled={isAnswered}
                                        checked={isSelected}
                                        onChange={() => {
                                          setDraftSelections((prev) => ({
                                            ...prev,
                                            [q.id]: opt.id,
                                          }));
                                          setValidationAlert('');
                                        }}
                                        className="mt-1 text-[#D91023] focus:ring-[#D91023]"
                                      />
                                      <div className="flex-1">
                                        <span className="font-extrabold mr-1.5">{opt.id}.</span>
                                        <span>{opt.text}</span>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>

                              {/* SUSTENTO TÉCNICO OBLIGATORIO */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-xs font-bold text-slate-700">
                                    Sustento técnico-normativo de su decisión (obligatorio) *
                                  </label>
                                  <span
                                    className={`text-xs font-semibold ${
                                      wordCount >= config.minJustificationWords
                                        ? 'text-emerald-700'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    {wordCount} / {config.minJustificationWords} palabras mínimas
                                  </span>
                                </div>
                                <textarea
                                  rows={3}
                                  disabled={isAnswered}
                                  value={currentJust}
                                  onChange={(e) => {
                                    setDraftJustifications((prev) => ({
                                      ...prev,
                                      [q.id]: e.target.value,
                                    }));
                                    setValidationAlert('');
                                  }}
                                  placeholder="Fundamente su elección citando los principios éticos, plazos, actores responsables o mecanismos preventivos aplicables al caso..."
                                  className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D91023] disabled:bg-slate-50 disabled:text-slate-700"
                                />
                              </div>

                              {!isAnswered && (
                                <>
                                  {validationAlert && (
                                    <div className="mb-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                                      {validationAlert}
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmAnswer(q)}
                                    disabled={
                                      !currentSel || wordCount < config.minJustificationWords
                                    }
                                    className="px-5 py-2.5 rounded-xl bg-[#D91023] hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-sm"
                                  >
                                    Confirmar y Calificar Respuesta
                                  </button>
                                </>
                              )}

                              {/* RETROALIMENTACIÓN INMEDIATA SOCRÁTICA Y COMPLEMENTARIA */}
                              {isAnswered && feedback && (
                                <div className="mt-4 rounded-xl bg-slate-900 text-slate-100 p-4 sm:p-5 space-y-3 border border-slate-700">
                                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
                                      Retroalimentación Socrática y Análisis de Rúbrica
                                    </span>
                                    <span className="text-xs font-bold text-slate-300">
                                      Clave correcta: {q.correctOption}
                                    </span>
                                  </div>

                                  <div className="text-xs sm:text-sm leading-relaxed">
                                    <span className="font-bold text-emerald-400">
                                      1. Reconocimiento de su argumento:{' '}
                                    </span>
                                    <span>{feedback.recognition}</span>
                                  </div>

                                  <div className="text-xs sm:text-sm leading-relaxed">
                                    <span className="font-bold text-amber-300">
                                      2. Complemento técnico-normativo:{' '}
                                    </span>
                                    <span>{feedback.complement}</span>
                                  </div>

                                  <div className="bg-slate-800/90 border-l-4 border-sky-400 p-3 rounded-r-lg text-xs sm:text-sm">
                                    <span className="font-bold text-sky-300 block mb-0.5">
                                      3. Pregunta socrática para profundizar:
                                    </span>
                                    <em className="text-slate-200">{feedback.socraticQuestion}</em>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* BOTÓN DE AVANCE AL SIGUIENTE CASO AL COMPLETAR LAS 4 PREGUNTAS */}
                        {answeredInCase === 4 && activeCaseIdx < CASES_DATA.length - 1 && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <h4 className="text-sm font-extrabold text-emerald-900">
                                ¡Ha completado el {currentCase.code}!
                              </h4>
                              <p className="text-xs text-emerald-700 mt-0.5">
                                El siguiente caso ya se encuentra habilitado para continuar su
                                evaluación.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCaseIdx((prev) => prev + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-sm transition"
                            >
                              Continuar al Caso {activeCaseIdx + 2} →
                            </button>
                          </div>
                        )}
                      </section>
                    </>
                  );
                })()}
              </div>

              {/* COLUMNA DERECHA (4 COLS): PANEL ADAPTATIVO EN TIEMPO REAL Y PDF */}
              <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                      Progreso y Calificación
                    </h3>
                    <span className="text-xs font-bold text-slate-900">
                      {participantProfile.answeredCount} / 12 ítems
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-[#D91023] transition-all duration-300"
                      style={{ width: `${participantProfile.progressPct}%` }}
                    />
                  </div>

                  {/* Puntaje sobre 20 */}
                  <div className="bg-slate-900 text-white rounded-xl p-4 mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400">
                        Puntaje Acumulado
                      </div>
                      <div className="text-2xl font-black text-white">
                        {participantProfile.totalScore.toFixed(1)}{' '}
                        <span className="text-sm font-semibold text-slate-400">/ 20.0 pts</span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${participantProfile.badgeColor}`}
                    >
                      {participantProfile.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {participantProfile.summary}
                  </p>

                  {/* Indicadores por eje temático */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-700">
                      Desempeño por Eje Temático
                    </h4>
                    {participantProfile.axes.map((ax) => (
                      <div key={ax.key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">{ax.label}</span>
                          <span className="font-bold text-slate-900">
                            {ax.earned.toFixed(1)}/{ax.max.toFixed(1)} pts ({ax.pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-800 transition-all duration-300"
                            style={{ width: `${ax.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Plan de acción territorial */}
                  {participantProfile.answeredCount > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-bold text-slate-700 mb-2">
                        Plan de Acción Territorial Sugerido
                      </h4>
                      <div className="space-y-2">
                        {participantProfile.actionPlan.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div className="font-bold text-slate-800">{item.eje}</div>
                            <div className="text-slate-600 mt-0.5">{item.accion}</div>
                            <div className="text-[11px] font-semibold text-[#D91023] mt-1">
                              Plazo: {item.plazo}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botón Descargar PDF */}
                  <button
                    type="button"
                    onClick={() => exportParticipantPDF(activeParticipant, config)}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <span>📄 Descargar Reporte Individual (PDF)</span>
                  </button>
                </div>
              </aside>
            </div>
          )
        ) : (
          /* VISTA DOCENTE / FACILITADOR (AUTENTICADA) */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Panel Docente y Analítica de Cohorte
                    </h2>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {APP_VERSION}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Monitoreo en tiempo real, exportación Excel (CSV) y configuración institucional
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadDemo}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
                  >
                    Cargar Demo (2 ejemplos)
                  </button>
                  <button
                    type="button"
                    onClick={() => exportCohortCSV(cohort)}
                    disabled={cohort.length === 0}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white transition"
                  >
                    Exportar Excel (CSV)
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPlatform}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition"
                  >
                    Reiniciar Plataforma
                  </button>
                </div>
              </div>

              {/* KPIs DE COHORTE */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">
                    Participantes Registrados
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {cohortMetrics.total}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">
                    Simulación Completada
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {cohortMetrics.completed}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">
                    Promedio General (/20)
                  </div>
                  <div className="text-2xl font-black text-[#D91023] mt-1">
                    {cohortMetrics.avgScore.toFixed(1)} pts
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">
                    Tasa de Logro (≥{config.passingScore} pts)
                  </div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    {cohortMetrics.passRate}%
                  </div>
                </div>
              </div>

              {/* 3 PESTAÑAS DE LA VISTA DOCENTE */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-5">
                <button
                  type="button"
                  onClick={() => setTeacherTab('cohort')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    teacherTab === 'cohort'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Resultados por Participante ({cohort.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherTab('comparator')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    teacherTab === 'comparator'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Comparador de Decisiones e Ítems
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherTab('settings')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    teacherTab === 'settings'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Configuración Institucional y Marca
                </button>
              </div>

              {/* PESTAÑA 1: TABLA DE PARTICIPANTES */}
              {teacherTab === 'cohort' && (
                <div>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, DNI o correo electrónico..."
                      className="w-full sm:w-96 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  {filteredCohort.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-sm font-bold text-slate-700">
                        No hay participantes registrados en este momento (0 registros).
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Los resultados aparecerán automáticamente a medida que los participantes
                        ingresen y resuelvan los casos.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                            <th className="py-3 px-3 font-bold">Participante</th>
                            <th className="py-3 px-3 font-bold">DNI</th>
                            <th className="py-3 px-3 font-bold">Avance</th>
                            <th className="py-3 px-3 font-bold">Puntaje (/20)</th>
                            <th className="py-3 px-3 font-bold">Nivel Adaptativo</th>
                            <th className="py-3 px-3 font-bold text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredCohort.map((p) => {
                            const prof = computeAdaptiveProfile(p.answers);
                            return (
                              <tr key={p.id} className="hover:bg-slate-50">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-slate-900">{p.name}</div>
                                  <div className="text-slate-500">{p.email}</div>
                                </td>
                                <td className="py-3 px-3 font-mono">{p.dni}</td>
                                <td className="py-3 px-3">
                                  {prof.answeredCount}/12 ({prof.progressPct}%)
                                </td>
                                <td className="py-3 px-3 font-extrabold text-slate-900">
                                  {prof.totalScore.toFixed(1)} pts
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full font-bold border ${prof.badgeColor}`}
                                  >
                                    {prof.level}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setInspectParticipantId(p.id)}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold"
                                  >
                                    Ver sustentos
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => exportParticipantPDF(p, config)}
                                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300"
                                  >
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
              )}

              {/* PESTAÑA 2: COMPARADOR DE DECISIONES POR ÍTEM */}
              {teacherTab === 'comparator' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Distribución de alternativas marcadas por la cohorte en cada una de las 12
                    preguntas para orientar la plenaria de retroalimentación del taller.
                  </p>
                  {CASES_DATA.map((c) => (
                    <div key={c.id} className="border border-slate-200 rounded-xl p-4">
                      <h4 className="text-sm font-extrabold text-slate-900 mb-3">
                        {c.code}: {c.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {c.questions.map((q) => {
                          const responses = cohort
                            .map((p) => p.answers?.[q.id]?.selected)
                            .filter(Boolean);
                          const totalResp = responses.length;
                          const correctCount = responses.filter(
                            (r) => r === q.correctOption
                          ).length;
                          const accuracy =
                            totalResp > 0 ? Math.round((correctCount / totalResp) * 100) : 0;

                          return (
                            <div
                              key={q.id}
                              className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                            >
                              <div className="flex justify-between font-bold text-slate-800 mb-1">
                                <span>
                                  Ítem {q.code} (Clave: {q.correctOption})
                                </span>
                                <span className="text-emerald-700">
                                  Acierto: {accuracy}% ({correctCount}/{totalResp})
                                </span>
                              </div>
                              <p className="text-slate-600 line-clamp-2 mb-2">{q.prompt}</p>
                              <div className="flex gap-2">
                                {['A', 'B', 'C'].map((letter) => {
                                  const cnt = responses.filter((r) => r === letter).length;
                                  return (
                                    <span
                                      key={letter}
                                      className={`px-2 py-0.5 rounded font-semibold ${
                                        letter === q.correctOption
                                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                          : 'bg-white text-slate-600 border border-slate-200'
                                      }`}
                                    >
                                      {letter}: {cnt}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PESTAÑA 3: CONFIGURACIÓN INSTITUCIONAL Y MARCA */}
              {teacherTab === 'settings' && (
                <form onSubmit={handleSaveConfig} className="max-w-2xl space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título del Taller Virtual
                    </label>
                    <input
                      type="text"
                      value={cfgForm.workshopTitle}
                      onChange={(e) =>
                        setCfgForm((prev) => ({ ...prev, workshopTitle: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mínimo de palabras en sustento
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={100}
                        value={cfgForm.minJustificationWords}
                        onChange={(e) =>
                          setCfgForm((prev) => ({
                            ...prev,
                            minJustificationWords: Number(e.target.value) || 12,
                          }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nota mínima de logro (/20)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        step={0.5}
                        value={cfgForm.passingScore}
                        onChange={(e) =>
                          setCfgForm((prev) => ({
                            ...prev,
                            passingScore: Number(e.target.value) || 14,
                          }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Usuario de Acceso Docente
                      </label>
                      <input
                        type="text"
                        value={cfgForm.teacherUser}
                        onChange={(e) =>
                          setCfgForm((prev) => ({ ...prev, teacherUser: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Clave de Acceso Docente
                      </label>
                      <input
                        type="text"
                        value={cfgForm.teacherPass}
                        onChange={(e) =>
                          setCfgForm((prev) => ({ ...prev, teacherPass: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-700">
                      Logotipo Institucional (Cabecera y Reportes PDF)
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <MidisLogoBadge customLogoUrl={cfgForm.customLogoDataUrl} />
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml"
                          onChange={handleLogoFileUpload}
                          className="block text-xs text-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCfgForm((prev) => ({
                              ...prev,
                              customLogoDataUrl: '/logo-midis.png',
                            }))
                          }
                          className="text-xs font-semibold text-[#D91023] hover:underline"
                        >
                          Restaurar emblema oficial Midis (/logo-midis.png)
                        </button>
                      </div>
                    </div>
                  </div>

                  {cfgSavedMsg && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                      {cfgSavedMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    Guardar Configuración
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA INSTITUCIONAL CON ACCESO DISCRETO PARA DOCENTES */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Ministerio de Desarrollo e Inclusión Social (MIDIS) — Oficina de Integridad
            Institucional
          </div>
          <div className="flex items-center gap-3">
            <span>Taller Virtual de Integridad Pública</span>
            <button
              type="button"
              onClick={triggerTeacherAccess}
              className="text-slate-400 hover:text-slate-700 transition font-medium"
              title="Acceso exclusivo para docentes y facilitadores (Alt + D)"
            >
              🔒 Docente
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DE AUTENTICACIÓN DOCENTE */}
      {showTeacherLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Acceso Docente / Facilitador
              </h3>
              <button
                type="button"
                onClick={() => setShowTeacherLoginModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Ingrese sus credenciales institucionales para acceder al panel de seguimiento y
              analítica de cohorte.
            </p>
            <form onSubmit={handleTeacherLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Usuario</label>
                <input
                  type="text"
                  autoFocus
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clave</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                />
              </div>
              {loginError && <p className="text-xs font-semibold text-rose-600">{loginError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherLoginModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE INSPECCIÓN DETALLADA DE SUSTENTOS (VISTA DOCENTE) */}
      {inspectedParticipant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Detalle de Respuestas y Sustentos — {inspectedParticipant.name}
                </h3>
                <p className="text-xs text-slate-500">
                  DNI: {inspectedParticipant.dni} • {inspectedParticipant.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectParticipantId(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {CASES_DATA.flatMap((c) => c.questions).map((q) => {
                const ans = inspectedParticipant.answers?.[q.id];
                const ok = ans?.selected === q.correctOption;
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border ${
                      !ans
                        ? 'bg-slate-50 border-slate-200'
                        : ok
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-slate-900 mb-1">
                      <span>Pregunta {q.code}</span>
                      <span>
                        {!ans
                          ? 'Sin responder'
                          : ok
                          ? `Correcta (${q.points.toFixed(1)} pts)`
                          : `Incorrecta — Marcó ${ans.selected} (Clave: ${q.correctOption})`}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-2">{q.prompt}</p>
                    {ans && (
                      <div className="bg-white p-2.5 rounded border border-slate-200 text-slate-800">
                        <strong>Sustento escrito:</strong> {ans.justification}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
