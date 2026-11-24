// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

/**
 * ============================================================================
 * SIMULADOR DE CASOS DE INTEGRIDAD MIDIS (ARCHIVO ÚNICO AUTOCONTENIDO)
 * ============================================================================
 * Taller Virtual: Integridad en la gestión pública para la entrega de servicios
 * Público objetivo: Servidores y directivos de Gobiernos Regionales y Locales
 * Puntaje total: 20.0 puntos (12 preguntas en 3 casos territoriales)
 * Mecánica: Intento único + Sustento abierto obligatorio + Retroalimentación
 *           inmediata socrática y complementaria basada en rúbrica.
 * ============================================================================
 */

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
    secondary: '#1E293B',
    accent: '#B45309',
    softBg: '#ECFDF5',
  },
};

const CASES_DATA = [
  {
    id: 'caso-1',
    number: 1,
    shortTitle: 'Caso 1: Conflictos de intereses',
    title: 'Focalización bajo presión y vínculos cercanos en territorio',
    axis: 'Conflictos de intereses y transparencia en decisiones',
    role: 'Jefe o Jefa de la Unidad Local de Empadronamiento y enlace municipal de programas sociales (Municipalidad Distrital)',
    articulation:
      'Coordinación operativa con la Unidad Territorial del Ministerio de Desarrollo e Inclusión Social (Midis) para Pensión 65 y Contigo',
    paragraphs: [
      'Usted se desempeña como Jefe de la Unidad Local de Empadronamiento y enlace municipal de una municipalidad distrital. Tras una emergencia por lluvias intensas, su oficina ejecuta una campaña extraordinaria de cierre de brechas en articulación con la Unidad Territorial del Ministerio de Desarrollo e Inclusión Social (en adelante, Midis), con el objetivo de actualizar la clasificación socioeconómica de los hogares afectados y remitir el lote prioritario de potenciales usuarios para el Programa Nacional de Asistencia Solidaria Pensión 65 y el Programa Nacional Contigo.',
      'Para cumplir con el cronograma acordado con el equipo territorial del Midis, usted preside el comité encargado de evaluar y seleccionar a diez empadronadores temporales de campo. Al revisar los expedientes de los postulantes que obtuvieron los mayores puntajes en la prueba técnica, identifica que una de las candidatas seleccionadas es prima hermana de su cónyuge, aunque usted no mantiene contacto frecuente con ella ni ha intervenido en la elaboración de su examen.',
      'Esa misma tarde, un regidor distrital ingresa directamente a su despacho sin haber registrado su visita en la recepción de la municipalidad. El regidor le solicita verbalmente que acelere y apruebe con prioridad la ficha socioeconómica de su tío adulto mayor antes del cierre de envío hacia la Unidad Territorial del Midis, argumentando que la familia atraviesa una situación económica difícil y que el trámite solo requiere su validación final.',
      'Al día siguiente, la presidenta de una junta vecinal presenta un escrito formal ante la municipalidad cuestionando la imparcialidad del concurso de empadronadores debido al parentesco existente entre usted y la postulante, y solicita su separación inmediata de dicho proceso de selección.',
      'Frente a este escenario, usted debe garantizar la legalidad, la imparcialidad y la transparencia de ambos procesos sin paralizar el cronograma de atención acordado con la Unidad Territorial del Midis para la población en situación de vulnerabilidad del distrito.',
    ],
    questions: [
      {
        id: '1.1',
        code: 'Pregunta 1.1',
        points: 1.5,
        prompt:
          'Respecto al concurso de empadronadores temporales donde participa la prima hermana de su cónyuge, ¿cómo debe diagnosticar técnicamente la situación antes de suscribir el acta de resultados?',
        options: [
          {
            key: 'A',
            text: 'No existe conflicto de intereses porque el parentesco es por afinidad en cuarto grado y la candidata obtuvo su puntaje de manera objetiva en una evaluación técnica previa.',
          },
          {
            key: 'B',
            text: 'Se configura un conflicto de intereses que compromete la imparcialidad objetiva de su decisión como presidente del comité, exigiendo una actuación preventiva antes de validar cualquier resultado.',
          },
          {
            key: 'C',
            text: 'Únicamente existiría un conflicto de intereses si la postulante le ofreciera algún beneficio económico o si usted alterara manualmente la calificación de los demás concursantes.',
          },
          {
            key: 'D',
            text: 'Se trata de una falta administrativa consumada por nepotismo que obliga a anular todo el concurso público y suspender la campaña de empadronamiento en el distrito.',
          },
        ],
        correctKey: 'B',
        normativeBasis:
          'Ley N° 27815 (artículos 6 y 8.1) y lineamientos de Gestión de Conflicto de Intereses de la Oficina de Integridad Institucional del Midis.',
        rubricCriteria:
          'Identificar que el vínculo familiar (parentesco por afinidad en cuarto grado con la prima hermana del cónyuge) en un comité que preside configura un conflicto de intereses que afecta la imparcialidad objetiva, sin requerir que exista favoritismo o beneficio económico consumado.',
        expectedKeywords: [
          'conflicto',
          'imparcialidad',
          'parentesco',
          'afinidad',
          'preventiv',
          'objetiv',
          'probidad',
          'ética',
        ],
        socraticPrompt:
          'Si un ciudadano o la junta vecinal revisa el acta firmada por usted, ¿qué elemento objetivo distingue la prevención ética de un conflicto de intereses frente a la espera de que ocurra una irregularidad consumada?',
      },
      {
        id: '1.2',
        code: 'Pregunta 1.2',
        points: 1.5,
        prompt:
          'Ante el parentesco detectado con la postulante y el escrito presentado por la presidenta de la junta vecinal, ¿qué mecanismo preventivo de gestión de conflictos de intereses corresponde activar de inmediato?',
        options: [
          {
            key: 'A',
            text: 'Continuar presidiendo el comité y dejar una nota aclaratoria al pie del acta final señalando que su evaluación se basó estrictamente en el mérito técnico de la postulante.',
          },
          {
            key: 'B',
            text: 'Esperar a que la Oficina de Recursos Humanos resuelva el pedido de recusación presentado por la junta vecinal y, mientras tanto, suscribir los contratos para no perder el presupuesto.',
          },
          {
            key: 'C',
            text: 'Formular de inmediato su excusación formal por escrito ante su superior jerárquico, apartarse de la evaluación de dicho proceso y solicitar la designación de un reemplazo para proseguir el trámite.',
          },
          {
            key: 'D',
            text: 'Descalificar automáticamente a la prima hermana de su cónyuge del concurso para demostrar ante la junta vecinal que no existe favoritismo ni injerencia personal.',
          },
        ],
        correctKey: 'C',
        normativeBasis:
          'Lineamientos de Gestión de Conflicto de Intereses (excusación vs. recusación) y Principio de Respeto al debido procedimiento (Ley N° 27815).',
        rubricCriteria:
          'Aplicar el deber primario de excusación (abstención formal por escrito ante el superior inmediato), diferenciarlo de la recusación planteada por terceros (junta vecinal) y solicitar reemplazo sin vulnerar el derecho de la postulante.',
        expectedKeywords: [
          'excusación',
          'abstención',
          'escrito',
          'superior',
          'reemplazo',
          'recusación',
          'apartar',
        ],
        socraticPrompt:
          '¿Por qué la excusación presentada por iniciativa propia del servidor protege mejor la legitimidad del comité que esperar a que prospere la recusación planteada por la junta vecinal?',
      },
      {
        id: '1.3',
        code: 'Pregunta 1.3',
        points: 1.5,
        prompt:
          'Frente a la visita sin registro del regidor distrital y su pedido de priorizar el expediente de su tío adulto mayor, ¿qué acción corresponde ejecutar para resguardar la ética pública y la transparencia?',
        options: [
          {
            key: 'A',
            text: 'Atender el pedido del regidor porque se trata de una autoridad electa del distrito y la priorización beneficiará a un adulto mayor en situación de pobreza.',
          },
          {
            key: 'B',
            text: 'Rechazar toda priorización arbitraria, mantener el orden técnico de evaluación socioeconómica y asegurar el registro de la visita y su motivo en los mecanismos oficiales de transparencia institucional.',
          },
          {
            key: 'C',
            text: 'Solicitar al regidor que envíe su pedido por mensaje de texto personal para contar con un respaldo informal en caso de que la Unidad Territorial del Midis observe el expediente.',
          },
          {
            key: 'D',
            text: 'Aprobar la ficha socioeconómica del tío del regidor con la condición de que el regidor sustente el caso posteriormente ante el concejo municipal.',
          },
        ],
        correctKey: 'B',
        normativeBasis:
          'Deberes de Neutralidad y Transparencia, Principios de Justicia y Equidad (Ley N° 27815, artículos 6 y 7) y Registro de Visitas en Línea.',
        rubricCriteria:
          'Rechazar cualquier injerencia o trato preferente por razones políticas, preservar la evaluación técnica objetiva de focalización y garantizar la trazabilidad mediante el registro oficial de visitas.',
        expectedKeywords: [
          'neutralidad',
          'transparencia',
          'registro',
          'visita',
          'equidad',
          'técnic',
          'trazabilidad',
          'imparcialidad',
        ],
        socraticPrompt:
          '¿De qué manera el registro formal de visitas y motivos de reunión actúa como una salvaguarda tanto para la entidad como para el propio servidor frente a presiones de autoridades locales?',
      },
      {
        id: '1.4',
        code: 'Pregunta 1.4',
        points: 2.0,
        prompt:
          '¿Cómo debe articular con la Unidad Territorial del Midis para cumplir el plazo de cierre de brechas sin comprometer la integridad del proceso?',
        options: [
          {
            key: 'A',
            text: 'Suspender todo el envío de expedientes de Pensión 65 y Contigo hasta que concluya la investigación sobre el reclamo vecinal, aunque se pierda el corte bimestral de afiliación.',
          },
          {
            key: 'B',
            text: 'Remitir el padrón completo incluyendo el expediente recomendado por el regidor, dejando que sea el equipo territorial del Midis quien filtre las irregularidades.',
          },
          {
            key: 'C',
            text: 'Comunicar formalmente al Coordinador Territorial del Midis la activación de su excusación y la designación de su reemplazo en el comité, asegurando la continuidad de la validación técnica del resto de hogares dentro del cronograma.',
          },
          {
            key: 'D',
            text: 'Delegar verbalmente la firma de todos los padrones municipales a un empadronador recién contratado para evitar cualquier responsabilidad administrativa futura.',
          },
        ],
        correctKey: 'C',
        normativeBasis:
          'Deber de Responsabilidad y Eficiencia (Ley N° 27815) y articulación operativa intergubernamental con Unidades Territoriales del Midis.',
        rubricCriteria:
          'Evidenciar adaptabilidad y articulación colaborativa: comunicar formalmente la abstención parcial y el reemplazo al Coordinador Territorial del Midis, manteniendo la continuidad oportuna de la validación del padrón para los hogares vulnerables.',
        expectedKeywords: [
          'coordinador',
          'territorial',
          'midis',
          'continuidad',
          'cronograma',
          'reemplazo',
          'articulación',
          'comunicar',
        ],
        socraticPrompt:
          '¿Cómo equilibra un directivo territorial la rigurosidad en la abstención ética con la responsabilidad de no dejar desatendidos a los hogares vulnerables dentro del corte del programa social?',
      },
    ],
  },
  {
    id: 'caso-2',
    number: 2,
    shortTitle: 'Caso 2: Transparencia de recursos',
    title:
      'Uso de recursos en custodia y transparencia en la entrega alimentaria',
    axis: 'Transparencia de recursos públicos y bienes en custodia',
    role: 'Subgerente o Subgerenta de Programas Sociales y Complementación Alimentaria (Municipalidad Provincial)',
    articulation:
      'Articulación multinivel con la Gerencia Regional de Desarrollo Social del Gobierno Regional y el equipo territorial del Midis (Programa de Complementación Alimentaria)',
    paragraphs: [
      'Usted ocupa el cargo de Subgerente de Programas Sociales y Complementación Alimentaria en una municipalidad provincial. Su despacho administra las transferencias presupuestales y custodia en el almacén municipal los lotes de alimentos destinados a los comedores populares y ollas comunes en el marco del Programa de Complementación Alimentaria, además de gestionar dos camionetas asignadas exclusivamente a la supervisión de dichas prestaciones en coordinación con el equipo territorial del Ministerio de Desarrollo e Inclusión Social (en adelante, Midis) y la Gerencia Regional de Desarrollo Social.',
      'A dos semanas de realizarse una actividad proselitista en la provincia, el Gerente Municipal —funcionario de confianza y su superior inmediato— le ordena verbalmente disponer de las dos camionetas de supervisión y retirar ciento cincuenta canastas de alimentos del almacén del programa para repartirlas en una denominada jornada cívica organizada por una agrupación política local, argumentando que los alimentos igual llegarán a familias pobres y acelerarán la ejecución.',
      'Paralelamente, el representante de una empresa proveedora de alimentos cuyas últimas entregas presentan observaciones técnicas por deficiencias de calidad se acerca a su oficina y le ofrece cubrir los gastos de combustible y viáticos de todo su equipo supervisor durante el mes, a cambio de que firme la conformidad de recepción sin aplicar las penalidades contractuales.',
      'Ese mismo día, la presidenta de una red de ollas comunes ingresa por mesa de partes una solicitud formal pidiendo conocer el cronograma de distribución, los criterios técnicos de asignación y el saldo real existente en el almacén municipal, debido a rumores vecinales sobre un presunto desvío de raciones.',
      'Ante esta coyuntura crítica, usted debe proteger el destino público de los bienes en custodia, responder con transparencia a las organizaciones sociales de base y asegurar la entrega oportuna de los alimentos mediante una articulación efectiva con el Gobierno Regional y el Midis.',
    ],
    questions: [
      {
        id: '2.1',
        code: 'Pregunta 2.1',
        points: 1.5,
        prompt:
          'De acuerdo con la Ley del Código de Ética de la Función Pública y su Reglamento, ¿qué infracciones éticas se configuran en la disposición solicitada por el Gerente Municipal y en el ofrecimiento del proveedor?',
        options: [
          {
            key: 'A',
            text: 'Únicamente una falta leve de gestión administrativa en el almacén, ya que las canastas pertenecen temporalmente a la municipalidad y aún no han sido entregadas a los usuarios finales.',
          },
          {
            key: 'B',
            text: 'Proselitismo político mediante el uso de bienes públicos y recursos en custodia, así como la prohibición de obtener o procurar ventajas indebidas para sí o para terceros.',
          },
          {
            key: 'C',
            text: 'Uso eficiente de recursos logísticos en el caso de las camionetas y una colaboración privada permitida en el caso del proveedor, siempre que el combustible se rinda con boletas.',
          },
          {
            key: 'D',
            text: 'Abuso de autoridad por parte del proveedor y ejercicio adecuado del cargo por parte del Gerente Municipal al priorizar la rápida ejecución presupuestal.',
          },
        ],
        correctKey: 'B',
        normativeBasis:
          'Ley N° 27815 (artículo 7.5 y artículo 8, numerales 2 y 3) y Decreto Supremo N° 033-2005-PCM (definición de Bienes del Estado, Proselitismo Político y Ventaja Indebida).',
        rubricCriteria:
          'Tipificar ambas prohibiciones éticas: el proselitismo político utilizando bienes del Estado o recursos de programas sociales bajo custodia, y la obtención o procuración de ventajas indebidas (combustible y viáticos ofrecidos por el proveedor).',
        expectedKeywords: [
          'proselitismo',
          'ventaja',
          'indebida',
          'bienes',
          'custodia',
          'estado',
          '27815',
          'prohibición',
        ],
        socraticPrompt:
          'Aunque los alimentos aún permanezcan en el almacén municipal antes de su reparto, ¿por qué la normativa ética los protege con el mismo rigor que cualquier patrimonio público?',
      },
      {
        id: '2.2',
        code: 'Pregunta 2.2',
        points: 1.5,
        prompt:
          'Frente a la orden verbal del Gerente Municipal de entregar las camionetas y las ciento cincuenta canastas para la actividad vinculada a una agrupación política, ¿cuál es la conducta exigible desde su rol?',
        options: [
          {
            key: 'A',
            text: 'Cumplir la orden en aplicación del principio de lealtad y obediencia hacia su superior inmediato, pero solicitando que el retiro del almacén sea firmado por el encargado de logística.',
          },
          {
            key: 'B',
            text: 'Entregar únicamente las camionetas de supervisión y retener las canastas de alimentos como punto intermedio para evitar conflictos con la alta dirección municipal.',
          },
          {
            key: 'C',
            text: 'Negarse a ejecutar la orden por constituir una ilegalidad manifiesta y desvío de bienes destinados a programas sociales, dejar constancia escrita de su negativa y poner el hecho en conocimiento de la instancia competente.',
          },
          {
            key: 'D',
            text: 'Ejecutar la entrega de las canastas durante la jornada cívica, pero exigir a los organizadores políticos que no coloquen pancartas ni logotipos partidarios en el local.',
          },
        ],
        correctKey: 'C',
        normativeBasis:
          'Principio de Lealtad y Obediencia (Ley N° 27815, artículo 6.6) y Obligación de comunicar transgresiones éticas (artículo 11).',
        rubricCriteria:
          'Reconocer el límite legal del deber de obediencia frente a órdenes que implican ilegalidad manifiesta, dejar constancia escrita de la negativa y reportar el hecho ante la instancia competente.',
        expectedKeywords: [
          'ilegalidad',
          'obediencia',
          'negar',
          'constancia',
          'escrito',
          'comunicar',
          'instancia',
          'control',
        ],
        socraticPrompt:
          '¿Qué diferencia existe entre la lealtad institucional al Estado de Derecho y la obediencia ciega frente a una instrucción verbal que desvía recursos alimentarios?',
      },
      {
        id: '2.3',
        code: 'Pregunta 2.3',
        points: 1.5,
        prompt:
          'Respecto al requerimiento de información de la presidenta de la red de ollas comunes y al ofrecimiento del proveedor observado, ¿qué medidas inmediatas debe adoptar?',
        options: [
          {
            key: 'A',
            text: 'Postergar la respuesta a la olla común hasta que concluya el año fiscal y aceptar el apoyo de combustible del proveedor mientras subsana las observaciones de calidad.',
          },
          {
            key: 'B',
            text: 'Brindar información fidedigna, completa y oportuna sobre los saldos de almacén, cronogramas y criterios de asignación; mantener las observaciones técnicas y penalidades al proveedor; y reportar el ofrecimiento indebido.',
          },
          {
            key: 'C',
            text: 'Entregar el inventario únicamente a los comedores populares reconocidos con mayor antigüedad y negociar con el proveedor la reposición gradual de los productos observados sin levantar acta.',
          },
          {
            key: 'D',
            text: 'Declarar reservada la información del almacén municipal para evitar conflictos sociales y derivar el expediente del proveedor a la asesoría jurídica sin emitir informe técnico.',
          },
        ],
        correctKey: 'B',
        normativeBasis:
          'Deber de Transparencia (Ley N° 27815, artículo 7.2), Principios de Probidad e Idoneidad y Directiva N° 001-2022-MIDIS (pautas de integridad en contrataciones).',
        rubricCriteria:
          'Atender integralmente ambos frentes: garantizar transparencia activa (información fidedigna, completa y oportuna) a la organización social de base y sostener la firmeza técnica aplicando penalidades y reportando el intento de soborno.',
        expectedKeywords: [
          'transparencia',
          'fidedigna',
          'oportuna',
          'saldos',
          'penalidades',
          'observaciones',
          'reportar',
          'criterios',
        ],
        socraticPrompt:
          '¿Cómo contribuye la entrega oportuna de inventarios y criterios técnicos a las ollas comunes a desactivar rumores y fortalecer la vigilancia ciudadana?',
      },
      {
        id: '2.4',
        code: 'Pregunta 2.4',
        points: 2.0,
        prompt:
          '¿Qué estrategia de articulación colaborativa debe impulsar con el Gobierno Regional y el Ministerio de Desarrollo e Inclusión Social (Midis) para blindar la entrega alimentaria?',
        options: [
          {
            key: 'A',
            text: 'Solicitar al Midis que reasigne el presupuesto del Programa de Complementación Alimentaria a otra provincia para evitar responsabilidades administrativas en su gestión.',
          },
          {
            key: 'B',
            text: 'Mantener el problema exclusivamente en el ámbito interno de la municipalidad provincial para no afectar la imagen institucional ante el Gobierno Regional ni ante el sector.',
          },
          {
            key: 'C',
            text: 'Convocar el espacio de monitoreo y vigilancia conjunta con la Gerencia Regional de Desarrollo Social, el equipo territorial del Midis y los comités de vigilancia ciudadana para transparentar el padrón y auditar la entrega en almacén.',
          },
          {
            key: 'D',
            text: 'Entregar de manera adelantada todas las raciones del trimestre en un solo acto público sin verificación de padrones para reducir el tiempo de custodia en el almacén municipal.',
          },
        ],
        correctKey: 'C',
        normativeBasis:
          'Fines de la Función Pública (Ley N° 27815, artículo 3), gobernanza multinivel y mecanismos de control social en programas alimentarios.',
        rubricCriteria:
          'Articular una respuesta colaborativa multinivel (Municipalidad Provincial, Gerencia Regional de Desarrollo Social del Gobierno Regional, equipo territorial del Midis y vigilancia ciudadana) para auditar el almacén y proteger la entrega íntegra.',
        expectedKeywords: [
          'regional',
          'midis',
          'vigilancia',
          'monitoreo',
          'padrón',
          'almacén',
          'articulación',
          'auditar',
        ],
        socraticPrompt:
          '¿Por qué involucrar simultáneamente al Gobierno Regional, al equipo territorial del Midis y a los comités de vigilancia ciudadana reduce el margen de presión política local sobre el almacén?',
      },
    ],
  },
  {
    id: 'caso-3',
    number: 3,
    shortTitle: 'Caso 3: Denuncias y protección',
    title:
      'Canales de denuncia, reserva de identidad y protección laboral en la articulación regional',
    axis: 'Canales de denuncia, reserva y protección al denunciante',
    role: 'Gerente o Gerenta Regional de Desarrollo e Inclusión Social (Gobierno Regional)',
    articulation:
      'Copresidencia de la Instancia de Articulación Regional junto con las Unidades Territoriales de Cuna Más y Juntos del Midis',
    paragraphs: [
      'Usted se desempeña como Gerente Regional de Desarrollo e Inclusión Social de un Gobierno Regional y copreside la Instancia de Articulación Regional junto con los jefes de las Unidades Territoriales del Programa Nacional Cuna Más y del Programa Nacional de Apoyo Directo a los Más Pobres Juntos, adscritos al Ministerio de Desarrollo e Inclusión Social (en adelante, Midis), con el propósito de asegurar la entrega articulada del paquete integrado de Desarrollo Infantil Temprano.',
      'Al concluir una sesión descentralizada de trabajo en provincia, una especialista social del Gobierno Regional contratada bajo modalidad temporal le entrega en reserva un sobre cerrado que contiene grabaciones de audio y actas adulteradas. Dichos elementos evidencian que un jefe de equipo regional y un coordinador territorial de un programa nacional del Midis exigen cobros indebidos a las familias usuarias a cambio de mantenerlas activas en el padrón de atención.',
      'La especialista solicita expresamente reserva de identidad y medidas de protección laboral, debido a que su contrato vence en diez días calendario y su jefe inmediato —quien figura como denunciado— ya anunció verbalmente que no renovará su vínculo. Asimismo, manifiesta temor a represalias porque semanas atrás otro servidor reportó una alerta similar que fue tramitada erróneamente como una simple queja administrativa sin resguardo de confidencialidad.',
      'Al día siguiente, un periodista local ingresa por mesa de partes una solicitud de acceso a la información pública requiriendo copia íntegra de todas las denuncias recibidas durante la sesión descentralizada y la relación nominal de los servidores involucrados.',
      'En este contexto, usted debe encauzar la denuncia respetando los canales oficiales, los plazos perentorios y el principio de reserva, activar mecanismos de protección laboral eficaces y articular con las Unidades Territoriales del Midis para garantizar la continuidad del servicio a las familias.',
    ],
    questions: [
      {
        id: '3.1',
        code: 'Pregunta 3.1',
        points: 1.5,
        prompt:
          '¿Por qué constituyó un error tramitar el reporte previo como una queja administrativa por defecto de tramitación y cuál es la vía correcta para la denuncia actual?',
        options: [
          {
            key: 'A',
            text: 'Porque toda inconformidad ciudadana o laboral debe resolverse primero mediante conciliación interna antes de remitirse a la Oficina de Integridad Institucional.',
          },
          {
            key: 'B',
            text: 'Porque los hechos describen presuntos actos de corrupción con indicios de fundamento y materialidad vinculados al cargo, por lo que deben canalizarse ante la Oficina de Integridad Institucional o la Plataforma Digital Única de Denuncias del Ciudadano bajo estricta reserva.',
          },
          {
            key: 'C',
            text: 'Porque las quejas administrativas solo proceden cuando el monto del cobro indebido supera una Unidad Impositiva Tributaria y existen testigos externos a la entidad.',
          },
          {
            key: 'D',
            text: 'Porque las denuncias que involucran a personal de programas sociales del Midis deben remitirse directamente al Ministerio Público sin realizar registro interno en las oficinas de integridad.',
          },
        ],
        correctKey: 'B',
        normativeBasis:
          'Directiva N° 001-2022-MIDIS (Versión 02, numerales 4, 7.1 y 7.4.3) y Directiva N° 002-2023-PCM-SIP.',
        rubricCriteria:
          'Diferenciar la queja administrativa por defecto de tramitación de una denuncia por presuntos actos de corrupción con indicios de fundamento y materialidad vinculados al cargo, identificando los canales oficiales de integridad y su régimen de reserva.',
        expectedKeywords: [
          'corrupción',
          'fundamento',
          'materialidad',
          'integridad',
          'plataforma',
          'reserva',
          'queja',
          'canal',
        ],
        socraticPrompt:
          '¿Qué consecuencias prácticas sufre un denunciante cuando un caso de cobros indebidos se encauza como una simple queja administrativa en lugar de activarse el protocolo de integridad?',
      },
      {
        id: '3.2',
        code: 'Pregunta 3.2',
        points: 1.5,
        prompt:
          'Respecto al flujo de derivación y los plazos obligatorios establecidos en la normativa vigente, ¿cómo debe proceder con el sobre cerrado recibido en territorio?',
        options: [
          {
            key: 'A',
            text: 'Remitir la denuncia en un plazo máximo de un día hábil, mediante sobre cerrado confidencial o canal digital seguro, a las instancias de integridad competentes del Gobierno Regional y del programa nacional del Midis, asignando un código cifrado para proteger la identidad.',
          },
          {
            key: 'B',
            text: 'Conservar el sobre en su despacho durante cinco días hábiles mientras realiza indagaciones preliminares con los involucrados para confirmar la autenticidad de los audios.',
          },
          {
            key: 'C',
            text: 'Escanear los documentos y enviarlos por correo electrónico institucional ordinario a todos los integrantes de la Instancia de Articulación Regional para promover la transparencia.',
          },
          {
            key: 'D',
            text: 'Trasladar el expediente físico al jefe inmediato de la denunciante para que emita sus descargos en un plazo de tres días hábiles antes de elevarlo a la Oficina de Integridad Institucional.',
          },
        ],
        correctKey: 'A',
        normativeBasis:
          'Decreto Legislativo N° 1327 (artículos 6 y 8.1) y Directiva N° 001-2022-MIDIS (Versión 02, numerales 6.3 y 7.3.3.1).',
        rubricCriteria:
          'Precisar el plazo perentorio de un (1) día hábil para derivar la denuncia por medio seguro/confidencial a las instancias competentes (Gobierno Regional y Midis), reemplazando la identidad por un código cifrado.',
        expectedKeywords: [
          'día hábil',
          '1 día',
          'un día',
          'código',
          'cifrado',
          'confidencial',
          'sobre cerrado',
          'reserva',
        ],
        socraticPrompt:
          '¿Por qué la asignación inmediata de un código cifrado y el plazo perentorio de un día hábil son determinantes antes de que se inicien las actuaciones disciplinarias?',
      },
      {
        id: '3.3',
        code: 'Pregunta 3.3',
        points: 2.0,
        prompt:
          '¿Qué medida de protección laboral corresponde gestionar a favor de la especialista denunciante y qué respuesta debe darse a la solicitud de información del periodista?',
        options: [
          {
            key: 'A',
            text: 'Esperar a que venza el contrato de la especialista para recontratarla posteriormente como locadora de servicios, y entregar al periodista una versión resumida con los nombres de los denunciados.',
          },
          {
            key: 'B',
            text: 'Gestionar la renovación de su relación contractual ante la anunciada no renovación por represalia (además de evaluar su traslado temporal o la licencia del denunciado), y denegar el pedido del periodista por tratarse de información confidencial protegida por reserva.',
          },
          {
            key: 'C',
            text: 'Trasladar a la denunciante a una oficina administrativa reduciendo su remuneración para evitar contacto con el denunciado, y entregar al periodista solo las actas adulteradas sin los audios.',
          },
          {
            key: 'D',
            text: 'Conceder a la denunciante una licencia sin goce de haber mientras dura la investigación y publicar un comunicado oficial detallando el contenido de la denuncia.',
          },
        ],
        correctKey: 'B',
        normativeBasis:
          'Reglamento del Decreto Legislativo N° 1327 (Decreto Supremo N° 010-2017-JUS, medidas de protección laboral) y TUO de la Ley N° 27806 (artículo 17.3, excepción de confidencialidad).',
        rubricCriteria:
          'Activar la renovación contractual frente a la represalia anunciada (y evaluar traslado o licencia del denunciado sin menoscabo laboral) y denegar legalmente la entrega al periodista por el carácter confidencial de las denuncias.',
        expectedKeywords: [
          'renovación',
          'contractual',
          'contrato',
          'represalia',
          'denegar',
          'confidencial',
          'reserva',
          'transparencia',
        ],
        socraticPrompt:
          '¿Cómo se concilia el derecho ciudadano de acceso a la información pública con la excepción legal de confidencialidad que protege tanto al denunciante como la eficacia de la investigación?',
      },
      {
        id: '3.4',
        code: 'Pregunta 3.4',
        points: 2.0,
        prompt:
          '¿Cómo debe articular con la Oficina General de Recursos Humanos, la Secretaría Técnica de Procedimientos Administrativos Disciplinarios y los jefes territoriales de Cuna Más y Juntos para sostener la atención en campo?',
        options: [
          {
            key: 'A',
            text: 'Solicitar el informe de viabilidad operativa a Recursos Humanos dentro de un día hábil (quien cuenta con tres días hábiles para emitirlo), asegurar la reserva de oficio en el procedimiento disciplinario y reorganizar con Cuna Más y Juntos las rutas de acompañamiento familiar sin revelar la identidad de la denunciante.',
          },
          {
            key: 'B',
            text: 'Suspender temporalmente las visitas domiciliarias de Cuna Más y Juntos en la provincia denunciada hasta que concluya el procedimiento administrativo disciplinario.',
          },
          {
            key: 'C',
            text: 'Convocar una asamblea con las familias usuarias para informarles qué servidores están siendo investigados y pedirles que ratifiquen la denuncia en presencia del equipo territorial.',
          },
          {
            key: 'D',
            text: 'Delegar íntegramente el caso a la Unidad Territorial del Midis, desvinculando al Gobierno Regional de la ejecución de las medidas de protección laboral de su propia especialista.',
          },
        ],
        correctKey: 'A',
        normativeBasis:
          'Directiva N° 001-2022-MIDIS (Versión 02, plazos de viabilidad operativa con Recursos Humanos y registro en SISPAD) y Decreto Supremo N° 010-2017-JUS (reserva de oficio).',
        rubricCriteria:
          'Integrar los plazos de articulación interna (solicitud a Recursos Humanos en 1 día hábil y emisión de viabilidad operativa en 3 días hábiles; reserva de oficio disciplinaria) con la reorganización colaborativa de rutas junto a Cuna Más y Juntos.',
        expectedKeywords: [
          'viabilidad',
          'operativa',
          'recursos humanos',
          'tres días',
          '3 días',
          'oficio',
          'cuna más',
          'juntos',
        ],
        socraticPrompt:
          '¿De qué manera la coordinación silenciosa y oportuna entre el Gobierno Regional y las Unidades Territoriales de Cuna Más y Juntos protege simultáneamente a la denunciante y la continuidad del paquete de Desarrollo Infantil Temprano?',
      },
    ],
  },
];

const TOTAL_QUESTIONS = CASES_DATA.reduce(
  (acc, c) => acc + c.questions.length,
  0
);
const MAX_SCORE = CASES_DATA.reduce(
  (acc, c) => acc + c.questions.reduce((qAcc, q) => qAcc + q.points, 0),
  0
);

const DEFAULT_INSTRUCTOR_CREDENTIALS = {
  username: 'docente.midis',
  password: 'Integridad2026',
};

const DEMO_COHORT = [
  {
    id: 'demo-1',
    name: 'Elena Quispe Huamán',
    dni: '42891563',
    email: 'equispe@munisanta.gob.pe',
    entity: 'Participante Taller Midis',
    consent: true,
    startedAt: '2026-11-23T09:10:00.000Z',
    completedAt: '2026-11-23T09:38:00.000Z',
    responses: {
      '1.1': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Existe un conflicto de intereses objetivo por el parentesco por afinidad con la prima hermana del cónyuge dentro del comité que presido, por lo que corresponde actuar preventivamente.',
        timestamp: '2026-11-23T09:12:00.000Z',
      },
      '1.2': {
        selectedKey: 'C',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Debo presentar mi excusación formal por escrito ante mi superior jerárquico y solicitar la designación de un reemplazo en el comité, diferenciándolo de la recusación vecinal.',
        timestamp: '2026-11-23T09:15:00.000Z',
      },
      '1.3': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'En cumplimiento del deber de neutralidad y transparencia, rechazo cualquier priorización arbitraria y registro la visita del regidor en los mecanismos oficiales.',
        timestamp: '2026-11-23T09:18:00.000Z',
      },
      '1.4': {
        selectedKey: 'C',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Comunico formalmente al Coordinador Territorial del Midis mi abstención y reemplazo para continuar con la validación técnica del resto de hogares dentro del cronograma.',
        timestamp: '2026-11-23T09:20:00.000Z',
      },
      '2.1': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Se configuran las prohibiciones de proselitismo político con bienes públicos en custodia y la obtención de ventajas indebidas por el ofrecimiento de combustible del proveedor.',
        timestamp: '2026-11-23T09:23:00.000Z',
      },
      '2.2': {
        selectedKey: 'C',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'El deber de obediencia no ampara una orden ilegal. Me niego por escrito a entregar los bienes del almacén y reporto el hecho a la instancia competente.',
        timestamp: '2026-11-23T09:25:00.000Z',
      },
      '2.3': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Entrego información fidedigna y oportuna a la olla común sobre saldos y criterios, mantengo las penalidades al proveedor y reporto el intento de soborno.',
        timestamp: '2026-11-23T09:28:00.000Z',
      },
      '2.4': {
        selectedKey: 'C',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Convoco el monitoreo conjunto con la Gerencia Regional de Desarrollo Social, el equipo territorial del Midis y los comités de vigilancia ciudadana para auditar el almacén.',
        timestamp: '2026-11-23T09:30:00.000Z',
      },
      '3.1': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Los cobros indebidos constituyen presuntos actos de corrupción con fundamento y materialidad que deben ir a la Oficina de Integridad Institucional bajo reserva.',
        timestamp: '2026-11-23T09:32:00.000Z',
      },
      '3.2': {
        selectedKey: 'A',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Remito la denuncia en el plazo máximo de un día hábil en sobre cerrado confidencial asignando un código cifrado para resguardar la identidad.',
        timestamp: '2026-11-23T09:34:00.000Z',
      },
      '3.3': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Gestiono la renovación contractual ante la represalia anunciada y deniego el acceso al periodista por tratarse de información confidencial protegida por reserva.',
        timestamp: '2026-11-23T09:36:00.000Z',
      },
      '3.4': {
        selectedKey: 'A',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Solicito viabilidad operativa a Recursos Humanos en un día hábil (3 días para emitir), aseguro reserva de oficio y reorganizo rutas con Cuna Más y Juntos.',
        timestamp: '2026-11-23T09:38:00.000Z',
      },
    },
  },
  {
    id: 'demo-2',
    name: 'Carlos Mendoza Paredes',
    dni: '40512398',
    email: 'cmendoza@regionjunin.gob.pe',
    entity: 'Participante Taller Midis',
    consent: true,
    startedAt: '2026-11-23T10:05:00.000Z',
    completedAt: '2026-11-23T10:35:00.000Z',
    responses: {
      '1.1': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Se configura un conflicto de intereses que afecta la imparcialidad del comité y requiere prevención antes de firmar el acta.',
        timestamp: '2026-11-23T10:08:00.000Z',
      },
      '1.2': {
        selectedKey: 'B',
        isCorrect: false,
        pointsEarned: 0,
        justification:
          'Consideré que era mejor esperar a que Recursos Humanos resuelva la recusación vecinal mientras se avanza con los contratos para no perder presupuesto.',
        timestamp: '2026-11-23T10:11:00.000Z',
      },
      '1.3': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Rechazo el pedido del regidor manteniendo la neutralidad y registro su visita en los canales oficiales de transparencia.',
        timestamp: '2026-11-23T10:14:00.000Z',
      },
      '1.4': {
        selectedKey: 'C',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Coordino con el Coordinador Territorial del Midis comunicando mi abstención y reemplazo para sostener el cronograma de atención.',
        timestamp: '2026-11-23T10:17:00.000Z',
      },
      '2.1': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Hay proselitismo político con bienes en custodia del programa y ofrecimiento de ventajas indebidas por parte del proveedor.',
        timestamp: '2026-11-23T10:20:00.000Z',
      },
      '2.2': {
        selectedKey: 'C',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Me niego por escrito a ejecutar la orden ilegal del Gerente Municipal y reporto la situación a la instancia competente.',
        timestamp: '2026-11-23T10:22:00.000Z',
      },
      '2.3': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Entrego información oportuna sobre saldos y criterios a la olla común y mantengo las observaciones técnicas al proveedor.',
        timestamp: '2026-11-23T10:25:00.000Z',
      },
      '2.4': {
        selectedKey: 'C',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Convoco a la Gerencia Regional, al equipo territorial del Midis y a los comités de vigilancia ciudadana para auditar la entrega.',
        timestamp: '2026-11-23T10:27:00.000Z',
      },
      '3.1': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 1.5,
        justification:
          'Es una denuncia por presuntos actos de corrupción con fundamento y materialidad que corresponde a la Oficina de Integridad Institucional.',
        timestamp: '2026-11-23T10:29:00.000Z',
      },
      '3.2': {
        selectedKey: 'B',
        isCorrect: false,
        pointsEarned: 0,
        justification:
          'Pensé que convenía verificar primero los audios durante cinco días hábiles antes de derivar la denuncia a integridad.',
        timestamp: '2026-11-23T10:31:00.000Z',
      },
      '3.3': {
        selectedKey: 'B',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Gestiono la renovación contractual por represalia y deniego el acceso al periodista por el principio de reserva confidencial.',
        timestamp: '2026-11-23T10:33:00.000Z',
      },
      '3.4': {
        selectedKey: 'A',
        isCorrect: true,
        pointsEarned: 2.0,
        justification:
          'Pido viabilidad operativa a Recursos Humanos en un día hábil y reorganizo las rutas con Cuna Más y Juntos bajo reserva.',
        timestamp: '2026-11-23T10:35:00.000Z',
      },
    },
  },
];

const STORAGE_KEYS = {
  PARTICIPANTS: 'midis_sim_integridad_participants_v1',
  ACTIVE_ID: 'midis_sim_integridad_active_id_v1',
  CONFIG: 'midis_sim_integridad_config_v1',
  INSTRUCTOR_SESSION: 'midis_sim_integridad_docente_auth_v1',
};

function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function validateParticipant(form) {
  const errors = {};
  const nameTrimmed = (form.name || '').trim();
  const dniTrimmed = (form.dni || '').trim();
  const emailTrimmed = (form.email || '').trim();

  if (nameTrimmed.length < 4) {
    errors.name =
      'Ingrese el nombre completo del participante (mínimo 4 caracteres).';
  }
  if (!/^\d{8}$/.test(dniTrimmed)) {
    errors.dni = 'El DNI debe contener exactamente 8 dígitos numéricos.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    errors.email =
      'Ingrese un correo electrónico institucional o personal válido.';
  }
  if (!form.consent) {
    errors.consent =
      'Debe marcar la casilla de consentimiento para guardar sus avances y generar reportes.';
  }
  return errors;
}

const storageService = {
  loadParticipants() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
  saveParticipants(list) {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.PARTICIPANTS,
        JSON.stringify(list)
      );
      return { ok: true };
    } catch {
      return {
        ok: false,
        error:
          'No se pudo guardar localmente en el navegador. Verifique espacio o permisos de almacenamiento.',
      };
    }
  },
  loadActiveId() {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.ACTIVE_ID) || '';
    } catch {
      return '';
    }
  },
  saveActiveId(id) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id || '');
    } catch {
      // Ignorar error secundario
    }
  },
  loadConfig() {
    const defaults = {
      presetId: 'midisClasico',
      customLogoUrl: '',
      minWords: 15,
      workshopTitle:
        'Taller Virtual: Integridad en la gestión pública para la entrega de servicios',
      instructorUser: DEFAULT_INSTRUCTOR_CREDENTIALS.username,
      instructorPass: DEFAULT_INSTRUCTOR_CREDENTIALS.password,
    };
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        ...defaults,
        ...parsed,
      };
    } catch {
      return defaults;
    }
  },
  saveConfig(cfg) {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
      return { ok: true };
    } catch {
      return {
        ok: false,
        error:
          'El archivo supera la capacidad de almacenamiento local del navegador. Intente con una imagen más ligera.',
      };
    }
  },
};

function analyzeJustificationSocratic(
  question,
  selectedKey,
  justificationText
) {
  const isCorrect = selectedKey === question.correctKey;
  const chosenOption = question.options.find((o) => o.key === selectedKey);
  const correctOption = question.options.find(
    (o) => o.key === question.correctKey
  );
  const lower = (justificationText || '').toLowerCase();

  const matchedKeywords = question.expectedKeywords.filter((kw) =>
    lower.includes(kw.toLowerCase())
  );
  const missingKeywords = question.expectedKeywords.filter(
    (kw) => !lower.includes(kw.toLowerCase())
  );

  const excerpt =
    justificationText.trim().length > 130
      ? `"${justificationText.trim().slice(0, 130)}..."`
      : `"${justificationText.trim()}"`;

  let recognition = '';
  if (isCorrect) {
    if (matchedKeywords.length >= 3) {
      recognition = `Su sustento (${excerpt}) acierta en la alternativa ${selectedKey} (+${question.points.toFixed(
        1
      )} pts) e incorpora con solidez conceptos clave como ${matchedKeywords
        .slice(0, 3)
        .join(', ')}.`;
    } else if (matchedKeywords.length >= 1) {
      recognition = `Usted seleccionó correctamente la alternativa ${selectedKey} (+${question.points.toFixed(
        1
      )} pts) y rescató en su argumento la noción de "${matchedKeywords[0]}".`;
    } else {
      recognition = `Usted acertó en la alternativa ${selectedKey} (+${question.points.toFixed(
        1
      )} pts), orientando su decisión hacia la protección del servicio público.`;
    }
  } else {
    recognition = `Usted marcó la alternativa ${selectedKey} (0.0 pts) sustentando: ${excerpt}. Si bien muestra preocupación por resolver la situación operativa, la alternativa seleccionada genera un riesgo ético o procedimental frente a la opción técnicamente exigible (${question.correctKey}).`;
  }

  const complement = `Criterio técnico y normativo (${
    question.normativeBasis
  }): ${question.rubricCriteria}${
    missingKeywords.length > 0
      ? ` Para fortalecer aún más su argumento, conviene integrar explícitamente nociones como: ${missingKeywords
          .slice(0, 3)
          .join(', ')}.`
      : ''
  }`;

  const socraticQuestion = isCorrect
    ? `Pregunta socrática para profundizar: Considerando su argumento sobre ${
        matchedKeywords[0] || 'la decisión tomada'
      }, ${
        question.socraticPrompt.charAt(0).toLowerCase() +
        question.socraticPrompt.slice(1)
      }`
    : `Pregunta socrática de contraste: Al optar por "${
        chosenOption ? chosenOption.text.slice(0, 85) + '...' : selectedKey
      }", ¿qué vulnerabilidad institucional o desprotección al usuario se produciría frente a lo que exige la alternativa ${
        question.correctKey
      } ("${correctOption ? correctOption.text.slice(0, 85) + '...' : ''}")?`;

  return {
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    recognition,
    complement,
    socraticQuestion,
    matchedCount: matchedKeywords.length,
    totalKeywords: question.expectedKeywords.length,
  };
}

function computeAdaptiveProfile(participant) {
  const responses = participant?.responses || {};
  const answeredIds = Object.keys(responses);
  const answeredCount = answeredIds.length;
  const correctCount = answeredIds.filter(
    (id) => responses[id]?.isCorrect
  ).length;
  const totalScore = answeredIds.reduce(
    (sum, id) => sum + (responses[id]?.pointsEarned || 0),
    0
  );
  const progressPct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  let level = 'Diagnóstico Inicial';
  let levelBadgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  let levelSummary =
    'Inicie el recorrido por los casos territoriales para evaluar su diagnóstico ético y colaborativo.';

  if (answeredCount > 0) {
    const ratio =
      totalScore /
      Math.max(
        1,
        answeredIds.reduce((acc, id) => {
          for (const c of CASES_DATA) {
            const q = c.questions.find((item) => item.id === id);
            if (q) return acc + q.points;
          }
          return acc;
        }, 0)
      );

    if (ratio >= 0.85) {
      level = 'Referente Ético Territorial';
      levelBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      levelSummary =
        'Demuestra dominio preventivo, rigor procedimental y sólida articulación multinivel con el Midis y sus Programas Sociales.';
    } else if (ratio >= 0.65) {
      level = 'Gestión Preventiva Competente';
      levelBadgeColor = 'bg-sky-50 text-sky-800 border-sky-300';
      levelSummary =
        'Identifica adecuadamente los riesgos principales, con oportunidades puntuales de precisión en plazos y mecanismos formales.';
    } else if (ratio >= 0.4) {
      level = 'En Desarrollo Operativo';
      levelBadgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
      levelSummary =
        'Reconoce dilemas éticos básicos, pero requiere reforzar los protocolos preventivos de excusación, reserva y límites a órdenes ilegales.';
    } else {
      level = 'Prioridad de Reforzamiento Normativo';
      levelBadgeColor = 'bg-rose-50 text-rose-800 border-rose-300';
      levelSummary =
        'Es prioritario revisar la Ley N° 27815, el Decreto Legislativo N° 1327 y la Directiva N° 001-2022-MIDIS para evitar riesgos de responsabilidad administrativa.';
    }
  }

  const axisStats = CASES_DATA.map((c) => {
    const qIds = c.questions.map((q) => q.id);
    const maxPts = c.questions.reduce((s, q) => s + q.points, 0);
    const earnedPts = qIds.reduce(
      (s, id) => s + (responses[id]?.pointsEarned || 0),
      0
    );
    const answeredInCase = qIds.filter((id) => Boolean(responses[id])).length;
    const pct = Math.round((earnedPts / maxPts) * 100);
    return {
      caseId: c.id,
      caseNumber: c.number,
      axis: c.axis,
      earnedPts,
      maxPts,
      answeredInCase,
      totalInCase: qIds.length,
      pct,
    };
  });

  const opportunities = [];
  const recommendations = [];
  const actionPlan = [];

  axisStats.forEach((st) => {
    if (st.caseNumber === 1 && (st.answeredInCase === 0 || st.pct < 80)) {
      opportunities.push(
        'Fortalecer la detección temprana de conflictos de intereses y la activación oportuna de la excusación escrita antes de validar padrones o comités.'
      );
      recommendations.push(
        'Revisar los lineamientos de Gestión de Conflicto de Intereses de la Oficina de Integridad Institucional del Midis y verificar el uso obligatorio del Registro de Visitas en Línea.'
      );
      actionPlan.push({
        horizon: 'Corto plazo (1 a 7 días)',
        axis: 'Conflictos de intereses',
        action:
          'Implementar una lista de verificación previa de parentesco e intereses en los comités de contratación y procesos de empadronamiento local, asegurando la trazabilidad de visitas.',
        allies:
          'Unidad Local de Empadronamiento, Oficina de Recursos Humanos y Unidad Territorial del Midis.',
      });
    }
    if (st.caseNumber === 2 && (st.answeredInCase === 0 || st.pct < 80)) {
      opportunities.push(
        'Consolidar la protección de bienes públicos y alimentos en custodia frente a presiones proselitistas u ofrecimientos indebidos de proveedores.'
      );
      recommendations.push(
        'Aplicar el artículo 6.6 y 7.5 de la Ley N° 27815 sobre límites al deber de obediencia ante órdenes manifiestamente ilegales y transparencia activa hacia organizaciones sociales de base.'
      );
      actionPlan.push({
        horizon: 'Mediano plazo (8 a 15 días)',
        axis: 'Transparencia de recursos',
        action:
          'Publicar cronogramas, saldos de almacén y criterios de distribución de alimentos en coordinación con los comités de vigilancia ciudadana y el equipo territorial.',
        allies:
          'Subgerencia de Programas Sociales, Gerencia Regional de Desarrollo Social, Midis y Comités de Vigilancia.',
      });
    }
    if (st.caseNumber === 3 && (st.answeredInCase === 0 || st.pct < 80)) {
      opportunities.push(
        'Asegurar la derivación de denuncias en el plazo perentorio de un (1) día hábil con código cifrado y la activación inmediata de medidas de protección laboral.'
      );
      recommendations.push(
        'Aplicar la Directiva N° 001-2022-MIDIS (Versión 02) y el Reglamento del Decreto Legislativo N° 1327 para resguardar la reserva de identidad frente a solicitudes de acceso público.'
      );
      actionPlan.push({
        horizon: 'Inmediato / Permanente (1 a 30 días)',
        axis: 'Canales de denuncia y protección',
        action:
          'Establecer un protocolo interno de recepción en sobre cerrado confidencial, derivación en 24 horas hábiles y articulación con Recursos Humanos y Unidades Territoriales de Cuna Más y Juntos.',
        allies:
          'Gerencia Regional de Desarrollo e Inclusión Social, Oficina de Integridad Institucional, Recursos Humanos y Midis.',
      });
    }
  });

  if (actionPlan.length === 0) {
    actionPlan.push({
      horizon: 'Consolidación territorial (30 días)',
      axis: 'Liderazgo ético multinivel',
      action:
        'Replicar los protocolos preventivos de excusación, transparencia de almacenes y canalización reservada de denuncias en las Instancias de Articulación Local y Regional.',
      allies:
        'Gobiernos Locales, Gobiernos Regionales y Unidades Territoriales del Midis.',
    });
  }

  return {
    answeredCount,
    correctCount,
    totalScore,
    progressPct,
    level,
    levelBadgeColor,
    levelSummary,
    axisStats,
    opportunities,
    recommendations,
    actionPlan,
  };
}

function escapeCsvCell(value) {
  const str = String(value ?? '').replace(/\r?\n|\r/g, ' ');
  if (str.includes(';') || str.includes('"') || str.includes(',')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCohortCsv(participantsList) {
  const headers = [
    'Participante',
    'DNI',
    'Correo Electrónico',
    'Consentimiento',
    'Preguntas Respondidas',
    'Aciertos',
    'Puntaje Total (/20)',
    'Nivel Adaptativo',
    'Caso 1 (/6.5)',
    'Caso 2 (/6.5)',
    'Caso 3 (/7.0)',
    ...CASES_DATA.flatMap((c) =>
      c.questions.flatMap((q) => [
        `P${q.id} Respuesta`,
        `P${q.id} Estado`,
        `P${q.id} Puntaje`,
        `P${q.id} Sustento`,
      ])
    ),
  ];

  const rows = participantsList.map((p) => {
    const prof = computeAdaptiveProfile(p);
    const c1 = prof.axisStats[0]?.earnedPts ?? 0;
    const c2 = prof.axisStats[1]?.earnedPts ?? 0;
    const c3 = prof.axisStats[2]?.earnedPts ?? 0;

    const detailCols = CASES_DATA.flatMap((c) =>
      c.questions.flatMap((q) => {
        const r = p.responses?.[q.id];
        if (!r) return ['Sin responder', 'Pendiente', '0', ''];
        return [
          r.selectedKey,
          r.isCorrect ? 'Correcta' : 'Incorrecta',
          r.pointsEarned.toFixed(1),
          r.justification || '',
        ];
      })
    );

    return [
      p.name,
      p.dni,
      p.email,
      p.consent ? 'Sí' : 'No',
      `${prof.answeredCount}/${TOTAL_QUESTIONS}`,
      prof.correctCount,
      prof.totalScore.toFixed(1),
      prof.level,
      c1.toFixed(1),
      c2.toFixed(1),
      c3.toFixed(1),
      ...detailCols,
    ]
      .map(escapeCsvCell)
      .join(';');
  });

  return (
    '\uFEFF' + [headers.map(escapeCsvCell).join(';'), ...rows].join('\r\n')
  );
}

function generatePrintableReportHtml(
  participant,
  brandPreset,
  customLogoUrl = ''
) {
  const profile = computeAdaptiveProfile(participant);
  const nowStr = new Date().toLocaleString('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const reportLogoMarkup = customLogoUrl
    ? `<img src="${customLogoUrl}" alt="Logo Ministerio de Desarrollo e Inclusión Social - Midis" style="height:48px; width:auto; max-width:290px; object-fit:contain; display:block;" />`
    : `<svg viewBox="0 0 1030 200" style="height:48px; width:auto; display:block;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PERÚ - Ministerio de Desarrollo e Inclusión Social">
        <defs>
          <path id="pdfRepArc" d="M 28,68 A 88,65 0 0,1 190,68" />
        </defs>
        <rect x="0" y="0" width="218" height="200" fill="#FFFFFF" />
        <text font-family="Arial Narrow, Arial, sans-serif" font-weight="800" font-size="17" fill="#111827" letter-spacing="0.4">
          <textPath href="#pdfRepArc" startOffset="50%" text-anchor="middle">REPÚBLICA DEL PERÚ</textPath>
        </text>
        <ellipse cx="109" cy="50" rx="21" ry="9.5" fill="none" stroke="#15803D" stroke-width="6" />
        <path d="M 43,66 L 73,57 L 73,164 L 40,147 Z" fill="#D91023" stroke="#92400E" stroke-width="1.3" />
        <path d="M 52,83 L 73,77 L 73,133 L 51,127 Z" fill="#FFFFFF" />
        <polygon points="41,64 46,53 50,62" fill="#EAB308" />
        <path d="M 175,66 L 145,57 L 145,164 L 178,147 Z" fill="#D91023" stroke="#92400E" stroke-width="1.3" />
        <path d="M 166,83 L 145,77 L 145,133 L 167,127 Z" fill="#FFFFFF" />
        <polygon points="177,64 172,53 168,62" fill="#EAB308" />
        <path d="M 69,63 L 149,63 L 149,126 C 149,158 109,178 109,178 C 109,178 69,158 69,126 Z" fill="#D91023" stroke="#D97706" stroke-width="3.5" />
        <rect x="73" y="67" width="34.5" height="53" fill="#56B4E9" />
        <rect x="73" y="114" width="34.5" height="6" fill="#A3A33E" />
        <path d="M 83,114 L 84,102 L 82,102 L 81,114 M 95,114 L 95,102 L 98,102 L 98,114 M 80,96 C 83,93 93,93 97,96 L 98,103 L 81,103 Z M 94,96 L 95,80 L 93,76 L 96,79 L 98,76 L 98,81 L 103,82 L 103,85 L 98,86 L 98,96 Z" fill="#B45309" />
        <rect x="110.5" y="67" width="34.5" height="53" fill="#FFFFFF" />
        <rect x="110.5" y="114" width="34.5" height="6" fill="#4D7C0F" />
        <path d="M 126,114 L 126,95 L 121,90 M 129,114 L 129,95 L 134,90" stroke="#78350F" stroke-width="3.2" fill="none" />
        <circle cx="127.5" cy="84" r="10.5" fill="#15803D" />
        <circle cx="121" cy="87" r="6.5" fill="#16A34A" />
        <circle cx="134" cy="87" r="6.5" fill="#16A34A" />
        <path d="M 73,122 L 145,122 L 145,127 C 145,154 109,173 109,173 C 109,173 73,154 73,127 Z" fill="#D91023" />
        <path d="M 90,136 C 103,126 123,127 130,138 C 132,143 125,147 121,143 C 117,139 106,149 91,148 Z" fill="#FACC15" stroke="#92400E" stroke-width="1.4" />
        <ellipse cx="90" cy="142" rx="4" ry="6.5" fill="#451A03" />
        <circle cx="85" cy="148" r="2.8" fill="#FEF08A" />
        <circle cx="91" cy="152" r="2.8" fill="#FACC15" />
        <circle cx="98" cy="153" r="2.8" fill="#FEF08A" />
        <circle cx="88" cy="156" r="2.6" fill="#F59E0B" />
        <path d="M 95,178 L 109,172 L 123,178 L 118,192 L 109,185 L 100,192 Z" fill="#D91023" />
        <rect x="223" y="0" width="188" height="200" fill="#E30613" />
        <text x="317" y="123" text-anchor="middle" fill="#FFFFFF" font-family="Calibri, Arial, sans-serif" font-weight="400" font-size="64" letter-spacing="1">PERÚ</text>
        <rect x="416" y="0" width="614" height="200" fill="#575756" />
        <text x="442" y="89" fill="#FFFFFF" font-family="Calibri, Arial, sans-serif" font-weight="400" font-size="50">Ministerio de Desarrollo</text>
        <text x="442" y="152" fill="#FFFFFF" font-family="Calibri, Arial, sans-serif" font-weight="400" font-size="50">e Inclusión Social</text>
      </svg>`;

  const questionsHtml = CASES_DATA.map((c) => {
    const qRows = c.questions
      .map((q) => {
        const resp = participant.responses?.[q.id];
        const statusText = resp
          ? resp.isCorrect
            ? `Correcta (+${resp.pointsEarned.toFixed(1)} pts)`
            : `Incorrecta (0.0 pts · Clave: ${q.correctKey})`
          : 'Sin responder';
        return `
          <tr>
            <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold; width:14%;">${
              q.code
            }</td>
            <td style="padding:8px; border:1px solid #cbd5e1; width:34%;">${
              q.prompt
            }</td>
            <td style="padding:8px; border:1px solid #cbd5e1; width:20%;">
              <strong>Elegida:</strong> ${resp ? resp.selectedKey : '-'}<br/>
              <span>${statusText}</span>
            </td>
            <td style="padding:8px; border:1px solid #cbd5e1; width:32%; font-size:11px;">
              ${
                resp?.justification
                  ? resp.justification
                  : '<em>Sin sustento registrado</em>'
              }
            </td>
          </tr>
        `;
      })
      .join('');

    return `
      <h3 style="margin:18px 0 6px; color:${brandPreset.secondary}; font-size:14px;">
        Caso ${c.number}: ${c.title}
      </h3>
      <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:12px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Ítem</th>
            <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Situación evaluada</th>
            <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Decisión y puntaje</th>
            <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Sustento del participante</th>
          </tr>
        </thead>
        <tbody>${qRows}</tbody>
      </table>
    `;
  }).join('');

  const planRows = profile.actionPlan
    .map(
      (item) => `
      <tr>
        <td style="padding:7px; border:1px solid #cbd5e1; font-weight:bold;">${item.horizon}</td>
        <td style="padding:7px; border:1px solid #cbd5e1;">${item.axis}</td>
        <td style="padding:7px; border:1px solid #cbd5e1;">${item.action}</td>
        <td style="padding:7px; border:1px solid #cbd5e1;">${item.allies}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Reporte Integral - ${participant.name}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 24px; line-height: 1.45; }
    @media print {
      body { margin: 12mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background:#fef3c7; border:1px solid #f59e0b; padding:10px 14px; border-radius:6px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
    <span style="font-size:13px;"><strong>Vista previa de impresión PDF:</strong> Use la opción "Guardar como PDF" en el cuadro de diálogo de su navegador.</span>
    <button onclick="window.print()" style="background:${
      brandPreset.primary
    }; color:#fff; border:none; padding:8px 14px; border-radius:5px; font-weight:bold; cursor:pointer;">Imprimir / Guardar PDF</button>
  </div>

  <div style="border-bottom:3px solid ${
    brandPreset.primary
  }; padding-bottom:12px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; gap:12px;">
    <div style="display:flex; align-items:center; gap:12px;">
      ${reportLogoMarkup}
      <div>
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:${
          brandPreset.primary
        }; font-weight:bold;">Ministerio de Desarrollo e Inclusión Social (Midis)</div>
        <h1 style="margin:4px 0; font-size:19px; color:${
          brandPreset.secondary
        };">Reporte Integral – Simulador de Casos de Integridad</h1>
        <div style="font-size:12px; color:#64748b;">Taller Virtual: Integridad en la gestión pública para la entrega de servicios</div>
      </div>
    </div>
    <div style="text-align:right; font-size:11px; color:#475569;">
      <div><strong>Fecha de emisión:</strong></div>
      <div>${nowStr}</div>
    </div>
  </div>

  <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:16px;">
    <tr>
      <td style="padding:7px; border:1px solid #cbd5e1; background:#f8fafc; width:22%;"><strong>Participante:</strong></td>
      <td style="padding:7px; border:1px solid #cbd5e1; width:28%;">${
        participant.name
      }</td>
      <td style="padding:7px; border:1px solid #cbd5e1; background:#f8fafc; width:22%;"><strong>DNI:</strong></td>
      <td style="padding:7px; border:1px solid #cbd5e1; width:28%;">${
        participant.dni
      }</td>
    </tr>
    <tr>
      <td style="padding:7px; border:1px solid #cbd5e1; background:#f8fafc;"><strong>Correo electrónico:</strong></td>
      <td style="padding:7px; border:1px solid #cbd5e1;">${
        participant.email
      }</td>
      <td style="padding:7px; border:1px solid #cbd5e1; background:#f8fafc;"><strong>Nivel Adaptativo:</strong></td>
      <td style="padding:7px; border:1px solid #cbd5e1;"><strong>${
        profile.level
      }</strong></td>
    </tr>
    <tr>
      <td style="padding:7px; border:1px solid #cbd5e1; background:#f8fafc;"><strong>Puntaje Obtenido:</strong></td>
      <td style="padding:7px; border:1px solid #cbd5e1;"><strong>${profile.totalScore.toFixed(
        1
      )} / ${MAX_SCORE.toFixed(1)} puntos</strong></td>
      <td style="padding:7px; border:1px solid #cbd5e1; background:#f8fafc;"><strong>Aciertos / Avance:</strong></td>
      <td style="padding:7px; border:1px solid #cbd5e1;">${
        profile.correctCount
      } aciertos de ${profile.answeredCount} respondidas (${
    profile.progressPct
  }%)</td>
    </tr>
  </table>

  <h2 style="font-size:15px; color:${
    brandPreset.primary
  }; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">1. Detalle de Casos, Decisiones y Sustentos</h2>
  ${questionsHtml}

  <h2 style="font-size:15px; color:${
    brandPreset.primary
  }; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-top:20px;">2. Oportunidades de Mejora y Recomendaciones</h2>
  <ul style="font-size:12px; padding-left:18px;">
    ${
      profile.opportunities.length > 0
        ? profile.opportunities
            .map((o) => `<li style="margin-bottom:4px;">${o}</li>`)
            .join('')
        : '<li>Excelente desempeño transversal en los tres ejes de integridad pública evaluados.</li>'
    }
    ${profile.recommendations
      .map(
        (r) =>
          `<li style="margin-bottom:4px;"><strong>Recomendación:</strong> ${r}</li>`
      )
      .join('')}
  </ul>

  <h2 style="font-size:15px; color:${
    brandPreset.primary
  }; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-top:20px;">3. Plan de Acción Territorial</h2>
  <table style="width:100%; border-collapse:collapse; font-size:12px;">
    <thead>
      <tr style="background:#f1f5f9;">
        <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Horizonte</th>
        <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Eje</th>
        <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Acción concreta en territorio</th>
        <th style="padding:7px; border:1px solid #cbd5e1; text-align:left;">Actores articulados</th>
      </tr>
    </thead>
    <tbody>${planRows}</tbody>
  </table>
</body>
</html>`;
}

function runAutomatedTests() {
  const results = [];

  const exactSum = Math.abs(MAX_SCORE - 20.0) < 0.001 && TOTAL_QUESTIONS === 12;
  results.push({
    name: 'T1: Suma exacta de 20.0 puntos en 12 preguntas',
    passed: exactSum,
    detail: `Total preguntas: ${TOTAL_QUESTIONS} | Puntaje máximo calculado: ${MAX_SCORE.toFixed(
      1
    )} pts`,
  });

  const invalidEval = validateParticipant({
    name: 'Ab',
    dni: '123',
    email: 'invalido',
    consent: false,
  });
  const validEval = validateParticipant({
    name: 'María Torres',
    dni: '45678912',
    email: 'mtorres@gob.pe',
    consent: true,
  });
  results.push({
    name: 'T2: Validación de identidad (Nombre, DNI 8 dígitos, Correo y Consentimiento)',
    passed:
      Object.keys(invalidEval).length === 4 &&
      Object.keys(validEval).length === 0,
    detail: `Errores detectados en inválido: ${
      Object.keys(invalidEval).length
    }/4 | Errores en válido: ${Object.keys(validEval).length}`,
  });

  const q1 = CASES_DATA[0].questions[0];
  const socOk = analyzeJustificationSocratic(
    q1,
    'B',
    'Existe un conflicto de intereses objetivo por el parentesco por afinidad con la prima hermana de mi cónyuge en el comité que presido.'
  );
  const socFail = analyzeJustificationSocratic(
    q1,
    'A',
    'Considero que no pasa nada porque sacó buen puntaje.'
  );
  results.push({
    name: 'T3: Motor de calificación inmediata y retroalimentación socrática',
    passed:
      socOk.isCorrect &&
      socOk.pointsEarned === 1.5 &&
      !socFail.isCorrect &&
      socFail.pointsEarned === 0 &&
      socOk.socraticQuestion.length > 20,
    detail: `Acierto: +${socOk.pointsEarned} pts | Desacierto: ${socFail.pointsEarned} pts | Pregunta socrática generada`,
  });

  const csvOutput = buildCohortCsv(DEMO_COHORT);
  results.push({
    name: 'T4: Exportación consolidada compatible con Excel (UTF-8 BOM + CSV)',
    passed:
      csvOutput.startsWith('\uFEFF') &&
      csvOutput.includes('Elena Quispe Huamán'),
    detail: `Longitud CSV: ${csvOutput.length} caracteres con cabecera BOM para Excel`,
  });

  return results;
}

/**
 * ============================================================================
 * COMPONENTE VISUAL DE MARCA INSTITUCIONAL MIDIS (COMPLETO Y SIN RECORTES)
 * ============================================================================
 */

function MidisLogoBadge({ customLogoUrl, onSecretDoubleClick }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [customLogoUrl]);

  return (
    <div
      onDoubleClick={onSecretDoubleClick}
      className="flex items-center select-none cursor-default shrink-0"
      title="Ministerio de Desarrollo e Inclusión Social (Midis)"
    >
      {customLogoUrl && !imgError ? (
        <div className="bg-white flex items-center justify-center shrink-0">
          <img
            src={customLogoUrl}
            alt="Logo Ministerio de Desarrollo e Inclusión Social - Midis"
            className="h-10 sm:h-12 md:h-[52px] w-auto max-w-[275px] sm:max-w-[320px] object-contain block"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <svg
          viewBox="0 0 1030 200"
          className="h-10 sm:h-12 md:h-[52px] w-auto max-w-[275px] sm:max-w-[320px] block bg-white shrink-0"
          role="img"
          aria-label="PERÚ - Ministerio de Desarrollo e Inclusión Social (Midis)"
        >
          <defs>
            <path id="midisRepublicaArc" d="M 28,68 A 88,65 0 0,1 190,68" />
          </defs>

          {/* Bloque 1: Fondo blanco con Escudo Nacional del Perú completo */}
          <rect x="0" y="0" width="218" height="200" fill="#FFFFFF" />

          {/* Texto superior curvo REPÚBLICA DEL PERÚ */}
          <text
            fontFamily="Arial Narrow, Arial, Helvetica, sans-serif"
            fontWeight="800"
            fontSize="17"
            fill="#111827"
            letterSpacing="0.4"
          >
            <textPath
              href="#midisRepublicaArc"
              startOffset="50%"
              textAnchor="middle"
            >
              REPÚBLICA DEL PERÚ
            </textPath>
          </text>

          {/* Corona cívica de encina verde */}
          <ellipse
            cx="109"
            cy="50"
            rx="21"
            ry="9.5"
            fill="none"
            stroke="#15803D"
            strokeWidth="6"
          />
          <ellipse
            cx="109"
            cy="50"
            rx="21"
            ry="9.5"
            fill="none"
            stroke="#166534"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Pabellones y banderas nacionales laterales */}
          <path
            d="M 43,66 L 73,57 L 73,164 L 40,147 Z"
            fill="#D91023"
            stroke="#92400E"
            strokeWidth="1.3"
          />
          <path d="M 52,83 L 73,77 L 73,133 L 51,127 Z" fill="#FFFFFF" />
          <polygon points="41,64 46,53 50,62" fill="#EAB308" />

          <path
            d="M 175,66 L 145,57 L 145,164 L 178,147 Z"
            fill="#D91023"
            stroke="#92400E"
            strokeWidth="1.3"
          />
          <path d="M 166,83 L 145,77 L 145,133 L 167,127 Z" fill="#FFFFFF" />
          <polygon points="177,64 172,53 168,62" fill="#EAB308" />

          {/* Blasón central con bordura dorada */}
          <path
            d="M 69,63 L 149,63 L 149,126 C 149,158 109,178 109,178 C 109,178 69,158 69,126 Z"
            fill="#D91023"
            stroke="#D97706"
            strokeWidth="3.5"
          />

          {/* Cuartel superior izquierdo: Campo celeste con Vicuña heráldica */}
          <rect x="73" y="67" width="34.5" height="53" fill="#56B4E9" />
          <rect x="73" y="114" width="34.5" height="6" fill="#A3A33E" />
          <path
            d="M 83,114 L 84,102 L 82,102 L 81,114 M 95,114 L 95,102 L 98,102 L 98,114 M 80,96 C 83,93 93,93 97,96 L 98,103 L 81,103 Z M 94,96 L 95,80 L 93,76 L 96,79 L 98,76 L 98,81 L 103,82 L 103,85 L 98,86 L 98,96 Z"
            fill="#B45309"
          />

          {/* Cuartel superior derecho: Campo blanco con Árbol de la Quina */}
          <rect x="110.5" y="67" width="34.5" height="53" fill="#FFFFFF" />
          <rect x="110.5" y="114" width="34.5" height="6" fill="#4D7C0F" />
          <path
            d="M 126,114 L 126,95 L 121,90 M 129,114 L 129,95 L 134,90"
            stroke="#78350F"
            strokeWidth="3.2"
            fill="none"
          />
          <circle cx="127.5" cy="84" r="10.5" fill="#15803D" />
          <circle cx="121" cy="87" r="6.5" fill="#16A34A" />
          <circle cx="134" cy="87" r="6.5" fill="#16A34A" />

          {/* Cuartel inferior: Campo rojo con Cornucopia derramando monedas */}
          <path
            d="M 73,122 L 145,122 L 145,127 C 145,154 109,173 109,173 C 109,173 73,154 73,127 Z"
            fill="#D91023"
          />
          <path
            d="M 90,136 C 103,126 123,127 130,138 C 132,143 125,147 121,143 C 117,139 106,149 91,148 Z"
            fill="#FACC15"
            stroke="#92400E"
            strokeWidth="1.4"
          />
          <ellipse cx="90" cy="142" rx="4" ry="6.5" fill="#451A03" />
          <circle cx="85" cy="148" r="2.8" fill="#FEF08A" />
          <circle cx="91" cy="152" r="2.8" fill="#FACC15" />
          <circle cx="98" cy="153" r="2.8" fill="#FEF08A" />
          <circle cx="88" cy="156" r="2.6" fill="#F59E0B" />

          {/* Lazo rojo inferior */}
          <path
            d="M 95,178 L 109,172 L 123,178 L 118,192 L 109,185 L 100,192 Z"
            fill="#D91023"
          />

          {/* Bloque 2: Rectángulo rojo oficial PERÚ (con filete blanco de 5px) */}
          <rect x="223" y="0" width="188" height="200" fill="#E30613" />
          <text
            x="317"
            y="123"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Calibri, 'Segoe UI', Arial, sans-serif"
            fontWeight="400"
            fontSize="64"
            letterSpacing="1"
          >
            PERÚ
          </text>

          {/* Bloque 3: Rectángulo gris institucional Ministerio de Desarrollo e Inclusión Social */}
          <rect x="416" y="0" width="614" height="200" fill="#575756" />
          <text
            x="442"
            y="89"
            fill="#FFFFFF"
            fontFamily="Calibri, 'Segoe UI', Arial, sans-serif"
            fontWeight="400"
            fontSize="50"
          >
            Ministerio de Desarrollo
          </text>
          <text
            x="442"
            y="152"
            fill="#FFFFFF"
            fontFamily="Calibri, 'Segoe UI', Arial, sans-serif"
            fontWeight="400"
            fontSize="50"
          >
            e Inclusión Social
          </text>
        </svg>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * ============================================================================
 */

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');
  const [bannerAlert, setBannerAlert] = useState(null);

  const [config, setConfig] = useState(() => storageService.loadConfig());
  const [activeView, setActiveView] = useState('participant');
  const [projectorMode, setProjectorMode] = useState(false);

  const [isInstructorAuthenticated, setIsInstructorAuthenticated] = useState(
    () => {
      try {
        return (
          window.sessionStorage.getItem(STORAGE_KEYS.INSTRUCTOR_SESSION) === '1'
        );
      } catch {
        return false;
      }
    }
  );
  const [showInstructorLoginModal, setShowInstructorLoginModal] =
    useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showDefaultHint, setShowDefaultHint] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [activeParticipantId, setActiveParticipantId] = useState('');

  const [regForm, setRegForm] = useState({
    name: '',
    dni: '',
    email: '',
    consent: false,
  });
  const [regErrors, setRegErrors] = useState({});

  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [draftSelection, setDraftSelection] = useState('');
  const [draftJustification, setDraftJustification] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [showFinalReport, setShowFinalReport] = useState(false);

  const [instructorTab, setInstructorTab] = useState('cohort');
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [inspectedParticipantId, setInspectedParticipantId] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const brand = BRAND_PRESETS[config.presetId] || BRAND_PRESETS.midisClasico;

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedList = storageService.loadParticipants();
        const storedActiveId = storageService.loadActiveId();

        if (storedList && storedList.length > 0) {
          setParticipants(storedList);
          if (
            storedActiveId &&
            storedList.some((p) => p.id === storedActiveId)
          ) {
            setActiveParticipantId(storedActiveId);
          }
          setSelectedCompareIds(storedList.slice(0, 3).map((p) => p.id));
          setInspectedParticipantId(storedList[0].id);
        } else {
          setParticipants(DEMO_COHORT);
          storageService.saveParticipants(DEMO_COHORT);
          setSelectedCompareIds(DEMO_COHORT.map((p) => p.id));
          setInspectedParticipantId(DEMO_COHORT[0].id);
        }
      } catch {
        setBannerAlert({
          type: 'error',
          message:
            'Ocurrió un inconveniente al leer los datos locales del navegador. Puede restaurar los datos de demostración.',
        });
      } finally {
        setIsInitializing(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      const saveRes = storageService.saveParticipants(participants);
      if (!saveRes.ok) {
        setBannerAlert({
          type: 'error',
          message: saveRes.error,
        });
      }
    }
  }, [participants, isInitializing]);

  useEffect(() => {
    if (!isInitializing) {
      const res = storageService.saveConfig(config);
      if (res && !res.ok) {
        setBannerAlert({
          type: 'error',
          message: res.error,
        });
      }
    }
  }, [config, isInitializing]);

  const openInstructorAccess = () => {
    if (isInstructorAuthenticated) {
      setActiveView('instructor');
      if (!inspectedParticipantId && participants.length > 0) {
        setInspectedParticipantId(activeParticipantId || participants[0].id);
      }
    } else {
      setLoginForm({ username: '', password: '' });
      setLoginError('');
      setShowDefaultHint(false);
      setShowInstructorLoginModal(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        openInstructorAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleInstructorLoginSubmit = (e) => {
    e.preventDefault();
    const expectedUser = (
      config.instructorUser || DEFAULT_INSTRUCTOR_CREDENTIALS.username
    ).trim();
    const expectedPass =
      config.instructorPass || DEFAULT_INSTRUCTOR_CREDENTIALS.password;

    if (
      loginForm.username.trim().toLowerCase() === expectedUser.toLowerCase() &&
      loginForm.password === expectedPass
    ) {
      setIsInstructorAuthenticated(true);
      try {
        window.sessionStorage.setItem(STORAGE_KEYS.INSTRUCTOR_SESSION, '1');
      } catch {
        // Ignorar si sessionStorage no está disponible
      }
      setShowInstructorLoginModal(false);
      setLoginError('');
      setActiveView('instructor');
      if (!inspectedParticipantId && participants.length > 0) {
        setInspectedParticipantId(activeParticipantId || participants[0].id);
      }
      setBannerAlert({
        type: 'success',
        message: 'Acceso docente verificado correctamente.',
      });
    } else {
      setLoginError(
        'Usuario o clave incorrectos. Verifique las credenciales docentes.'
      );
    }
  };

  const handleInstructorLogout = () => {
    setIsInstructorAuthenticated(false);
    try {
      window.sessionStorage.removeItem(STORAGE_KEYS.INSTRUCTOR_SESSION);
    } catch {
      // Ignorar
    }
    setActiveView('participant');
    setBannerAlert({
      type: 'info',
      message: 'Sesión docente cerrada y vista protegida.',
    });
  };

  const activeParticipant = useMemo(
    () => participants.find((p) => p.id === activeParticipantId) || null,
    [participants, activeParticipantId]
  );

  const adaptiveProfile = useMemo(
    () => computeAdaptiveProfile(activeParticipant),
    [activeParticipant]
  );

  const currentCase = CASES_DATA[activeCaseIndex] || CASES_DATA[0];
  const currentQuestion =
    currentCase.questions[activeQuestionIndex] || currentCase.questions[0];

  const isCaseUnlocked = (caseIdx) => {
    if (caseIdx === 0) return true;
    const prevCase = CASES_DATA[caseIdx - 1];
    return prevCase.questions.every((q) =>
      Boolean(activeParticipant?.responses?.[q.id])
    );
  };

  const isQuestionUnlocked = (caseIdx, qIdx) => {
    if (!isCaseUnlocked(caseIdx)) return false;
    if (qIdx === 0) return true;
    const prevQ = CASES_DATA[caseIdx].questions[qIdx - 1];
    return Boolean(activeParticipant?.responses?.[prevQ.id]);
  };

  const currentQuestionResponse =
    activeParticipant?.responses?.[currentQuestion.id] || null;

  useEffect(() => {
    if (currentQuestionResponse) {
      setDraftSelection(currentQuestionResponse.selectedKey);
      setDraftJustification(currentQuestionResponse.justification);
    } else {
      setDraftSelection('');
      setDraftJustification('');
    }
    setQuestionError('');
  }, [
    activeCaseIndex,
    activeQuestionIndex,
    activeParticipantId,
    currentQuestionResponse,
  ]);

  const triggerLoadingTransition = (label, callback) => {
    setBusyLabel(label);
    setIsBusy(true);
    setTimeout(() => {
      try {
        callback();
      } catch {
        setBannerAlert({
          type: 'error',
          message:
            'Se produjo un error inesperado durante la operación. Intente nuevamente.',
        });
      } finally {
        setIsBusy(false);
        setBusyLabel('');
      }
    }, 280);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = validateParticipant(regForm);
    setRegErrors(errors);
    if (Object.keys(errors).length > 0) {
      setBannerAlert({
        type: 'error',
        message:
          'Por favor corrija los campos marcados antes de iniciar el simulador.',
      });
      return;
    }

    triggerLoadingTransition(
      'Iniciando sesión y cargando casos territoriales...',
      () => {
        const cleanDni = regForm.dni.trim();
        const existing = participants.find((p) => p.dni === cleanDni);

        if (existing) {
          const updated = participants.map((p) =>
            p.id === existing.id
              ? {
                  ...p,
                  name: regForm.name.trim(),
                  email: regForm.email.trim(),
                  consent: true,
                }
              : p
          );
          setParticipants(updated);
          setActiveParticipantId(existing.id);
          storageService.saveActiveId(existing.id);
          setBannerAlert({
            type: 'success',
            message: `Sesión recuperada para ${regForm.name.trim()} (DNI ${cleanDni}). Sus avances previos se conservan.`,
          });
        } else {
          const newId = `part-${Date.now()}`;
          const newParticipant = {
            id: newId,
            name: regForm.name.trim(),
            dni: cleanDni,
            email: regForm.email.trim(),
            entity: 'Participante Taller Midis',
            consent: true,
            startedAt: new Date().toISOString(),
            completedAt: null,
            responses: {},
          };
          setParticipants((prev) => [newParticipant, ...prev]);
          setActiveParticipantId(newId);
          storageService.saveActiveId(newId);
          setBannerAlert({
            type: 'success',
            message:
              'Datos guardados automáticamente en el navegador. Bienvenido/a al simulador.',
          });
        }

        setActiveCaseIndex(0);
        setActiveQuestionIndex(0);
        setShowFinalReport(false);
      }
    );
  };

  const handleFillQuickDemoForm = () => {
    setRegForm({
      name: 'Jorge Salazar Huarcaya',
      dni: '44882211',
      email: 'jsalazar@munidistrital.gob.pe',
      consent: true,
    });
    setRegErrors({});
    setBannerAlert({
      type: 'info',
      message:
        'Datos de demostración precargados en el formulario. Presione "Iniciar Simulador" para comenzar.',
    });
  };

  const handleConfirmAnswer = () => {
    if (!activeParticipant) return;

    if (currentQuestionResponse) {
      setQuestionError(
        'Esta pregunta ya fue respondida y calificada (intento único).'
      );
      return;
    }

    if (!draftSelection) {
      setQuestionError(
        'Seleccione una alternativa (A, B, C o D) antes de confirmar.'
      );
      return;
    }

    const words = countWords(draftJustification);
    if (words < config.minWords) {
      setQuestionError(
        `El sustento abierto es obligatorio. Redacte al menos ${config.minWords} palabras (actualmente tiene ${words}).`
      );
      return;
    }

    setQuestionError('');

    const socraticEval = analyzeJustificationSocratic(
      currentQuestion,
      draftSelection,
      draftJustification
    );

    const newResponseRecord = {
      selectedKey: draftSelection,
      isCorrect: socraticEval.isCorrect,
      pointsEarned: socraticEval.pointsEarned,
      justification: draftJustification.trim(),
      socraticFeedback: socraticEval,
      timestamp: new Date().toISOString(),
    };

    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== activeParticipant.id) return p;
        const updatedResponses = {
          ...(p.responses || {}),
          [currentQuestion.id]: newResponseRecord,
        };
        const isAllDone =
          Object.keys(updatedResponses).length >= TOTAL_QUESTIONS;
        return {
          ...p,
          responses: updatedResponses,
          completedAt: isAllDone ? new Date().toISOString() : p.completedAt,
        };
      })
    );
  };

  const handleNextStep = () => {
    if (activeQuestionIndex < currentCase.questions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      return;
    }
    if (activeCaseIndex < CASES_DATA.length - 1) {
      triggerLoadingTransition(
        `Cargando Caso ${activeCaseIndex + 2}...`,
        () => {
          setActiveCaseIndex((prev) => prev + 1);
          setActiveQuestionIndex(0);
        }
      );
      return;
    }
    triggerLoadingTransition(
      'Generando Reporte Integral y Plan de Acción...',
      () => {
        setShowFinalReport(true);
      }
    );
  };

  const handleExportPDF = (targetParticipant) => {
    if (!targetParticipant) return;
    triggerLoadingTransition(
      `Preparando reporte PDF de ${targetParticipant.name}...`,
      () => {
        const html = generatePrintableReportHtml(
          targetParticipant,
          brand,
          config.customLogoUrl || ''
        );
        const printWin = window.open('', '_blank', 'width=960,height=800');
        if (!printWin) {
          setBannerAlert({
            type: 'error',
            message:
              'El navegador bloqueó la ventana emergente de impresión PDF. Habilite ventanas emergentes para este sitio e intente de nuevo.',
            retryAction: () => handleExportPDF(targetParticipant),
          });
          return;
        }
        printWin.document.open();
        printWin.document.write(html);
        printWin.document.close();
        setBannerAlert({
          type: 'success',
          message:
            'Reporte PDF generado. Use "Guardar como PDF" en la ventana abierta.',
        });
      }
    );
  };

  const handleExportExcelCSV = () => {
    if (participants.length === 0) {
      setBannerAlert({
        type: 'error',
        message: 'No existen registros de participantes para exportar.',
      });
      return;
    }
    triggerLoadingTransition(
      'Generando archivo compatible con Excel (.CSV)...',
      () => {
        const csvContent = buildCohortCsv(participants);
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resultados_Simulador_Integridad_Midis_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setBannerAlert({
          type: 'success',
          message:
            'Archivo CSV codificado en UTF-8 (compatible con Microsoft Excel) descargado correctamente.',
        });
      }
    );
  };

  const handleRestoreDemoData = () => {
    setConfirmModal({
      title: 'Restaurar datos de demostración',
      message:
        'Se cargarán los participantes de ejemplo en la sesión docente manteniendo los participantes nuevos registrados. ¿Desea continuar?',
      confirmLabel: 'Restaurar demostración',
      onConfirm: () => {
        setConfirmModal(null);
        triggerLoadingTransition('Restaurando datos de demostración...', () => {
          setParticipants((prev) => {
            const nonDemo = prev.filter((p) => !p.id.startsWith('demo-'));
            const merged = [...nonDemo, ...DEMO_COHORT];
            setSelectedCompareIds(merged.slice(0, 3).map((x) => x.id));
            if (merged.length > 0) setInspectedParticipantId(merged[0].id);
            return merged;
          });
          setBannerAlert({
            type: 'success',
            message: 'Datos de demostración restaurados correctamente.',
          });
        });
      },
    });
  };

  const handleResetAllPlatform = () => {
    setConfirmModal({
      title: 'Reiniciar plataforma y limpiar registros',
      message:
        'Esta acción eliminará todos los resultados almacenados localmente en este navegador y reiniciará el simulador desde cero. ¿Está seguro?',
      confirmLabel: 'Sí, reiniciar todo',
      onConfirm: () => {
        setConfirmModal(null);
        triggerLoadingTransition('Reiniciando simulador...', () => {
          setParticipants([]);
          setActiveParticipantId('');
          storageService.saveParticipants([]);
          storageService.saveActiveId('');
          setRegForm({ name: '', dni: '', email: '', consent: false });
          setShowFinalReport(false);
          setActiveCaseIndex(0);
          setActiveQuestionIndex(0);
          setBannerAlert({
            type: 'info',
            message:
              'Plataforma reiniciada. Todos los registros de la sesión han sido limpiados.',
          });
        });
      },
    });
  };

  const handleSwitchParticipantSession = () => {
    setActiveParticipantId('');
    storageService.saveActiveId('');
    setShowFinalReport(false);
    setRegForm({ name: '', dni: '', email: '', consent: false });
    setRegErrors({});
  };

  const handleRunSelfTests = () => {
    triggerLoadingTransition(
      'Ejecutando batería de pruebas automatizadas...',
      () => {
        const results = runAutomatedTests();
        setTestResults(results);
      }
    );
  };

  const textScaleClass = projectorMode
    ? 'text-base sm:text-lg'
    : 'text-sm sm:text-base';

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col ${textScaleClass}`}
    >
      {/* SPINNER GLOBAL DE CARGA / TRANSICIÓN */}
      {(isInitializing || isBusy) && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-2xl shadow-xl px-6 py-5 flex items-center gap-4 border border-slate-200 max-w-sm w-full">
            <div
              className="w-8 h-8 rounded-full border-4 border-slate-200 animate-spin shrink-0"
              style={{ borderTopColor: brand.primary }}
            />
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                {isInitializing
                  ? 'Inicializando Simulador Midis...'
                  : busyLabel}
              </p>
              <p className="text-xs text-slate-500">
                Por favor espere un momento
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN INSTITUCIONAL */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-confirm-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3
              id="modal-confirm-title"
              className="text-lg font-bold text-slate-900"
            >
              {confirmModal.title}
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ backgroundColor: brand.primary }}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ACCESO DOCENTE CON USUARIO Y CLAVE */}
      {showInstructorLoginModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-docente-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: brand.primary }}
                >
                  Acceso Restringido · Facilitador / Docente
                </span>
                <h3
                  id="modal-docente-title"
                  className="text-lg font-bold text-slate-900 mt-0.5"
                >
                  Ingreso a la Vista Docente
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructorLoginModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1"
                aria-label="Cerrar ventana de acceso docente"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ingrese su usuario y clave institucional para revisar los
              resultados de los participantes, descargar reportes consolidados o
              configurar el taller.
            </p>

            <form
              onSubmit={handleInstructorLoginSubmit}
              className="space-y-3.5"
            >
              <div>
                <label
                  htmlFor="doc-user"
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Usuario docente
                </label>
                <input
                  id="doc-user"
                  type="text"
                  autoFocus
                  value={loginForm.username}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, username: e.target.value });
                    setLoginError('');
                  }}
                  placeholder="Ingrese su usuario"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="doc-pass"
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Clave de acceso
                </label>
                <input
                  id="doc-pass"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                    setLoginError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              {loginError && (
                <p
                  className="text-xs text-rose-700 font-semibold bg-rose-50 border border-rose-200 rounded-lg px-3 py-2"
                  role="alert"
                >
                  {loginError}
                </p>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowDefaultHint((v) => !v)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                >
                  {showDefaultHint
                    ? 'Ocultar credenciales iniciales'
                    : '¿Primera vez? Ver credenciales iniciales del taller'}
                </button>
                {showDefaultHint && (
                  <div className="mt-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <div>
                      <strong>Usuario:</strong>{' '}
                      <code>
                        {config.instructorUser ||
                          DEFAULT_INSTRUCTOR_CREDENTIALS.username}
                      </code>
                    </div>
                    <div>
                      <strong>Clave:</strong>{' '}
                      <code>
                        {config.instructorPass ||
                          DEFAULT_INSTRUCTOR_CREDENTIALS.password}
                      </code>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInstructorLoginModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-bold shadow-sm hover:opacity-95"
                  style={{ backgroundColor: brand.secondary }}
                >
                  Ingresar como Docente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENCABEZADO INSTITUCIONAL */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MidisLogoBadge
              customLogoUrl={config.customLogoUrl}
              onSecretDoubleClick={openInstructorAccess}
            />
            <div className="hidden md:block border-l border-slate-200 pl-3">
              <h1 className="font-bold text-slate-900 text-base lg:text-lg leading-tight">
                Simulador de Casos de Integridad Midis
              </h1>
              <p className="text-xs text-slate-500">{config.workshopTitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setProjectorMode((v) => !v)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                projectorMode
                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Amplía el tamaño de texto para proyección en aula o taller"
            >
              <span aria-hidden="true">🖥️</span>
              <span>{projectorMode ? 'Proyector: ON' : 'Modo Proyector'}</span>
            </button>

            {isInstructorAuthenticated && (
              <nav
                aria-label="Selector de vista docente"
                className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200"
              >
                <button
                  type="button"
                  onClick={() => setActiveView('participant')}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition ${
                    activeView === 'participant'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Vista Participante
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('instructor');
                    if (!inspectedParticipantId && participants.length > 0) {
                      setInspectedParticipantId(
                        activeParticipantId || participants[0].id
                      );
                    }
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                    activeView === 'instructor'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Vista Docente</span>
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-200 text-slate-800">
                    {participants.length}
                  </span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* BANNER GLOBAL DE MENSAJES Y ERRORES RECUPERABLES */}
      {bannerAlert && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4">
          <div
            role="alert"
            className={`rounded-xl px-4 py-3 border flex flex-wrap items-center justify-between gap-3 shadow-xs ${
              bannerAlert.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : bannerAlert.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              <span aria-hidden="true">
                {bannerAlert.type === 'error'
                  ? '⚠️'
                  : bannerAlert.type === 'success'
                  ? '✅'
                  : 'ℹ️'}
              </span>
              <span>{bannerAlert.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {bannerAlert.retryAction && (
                <button
                  type="button"
                  onClick={bannerAlert.retryAction}
                  className="px-3 py-1 rounded-lg bg-white border border-current text-xs font-bold hover:opacity-85"
                >
                  Reintentar
                </button>
              )}
              <button
                type="button"
                onClick={() => setBannerAlert(null)}
                className="text-xs font-bold opacity-75 hover:opacity-100 px-2 py-1"
                aria-label="Cerrar aviso"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {activeView === 'participant' ? (
          !activeParticipant ? (
            /* ================================================================
               PANTALLA DE INGRESO Y CONSENTIMIENTO DEL PARTICIPANTE
               ================================================================ */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <section className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: brand.softBg,
                    color: brand.primary,
                  }}
                >
                  <span>Juego de Roles Territorial · 20 Puntos</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  Toma de decisiones éticas en la entrega de servicios sociales
                </h2>

                <p className="text-slate-600 leading-relaxed">
                  Bienvenido/a al simulador práctico del{' '}
                  <strong>
                    Ministerio de Desarrollo e Inclusión Social (Midis)
                  </strong>
                  . Asumirá tres roles directivos y operativos en gobiernos
                  locales y regionales para resolver situaciones críticas de
                  focalización, custodia de recursos alimentarios y protección
                  al denunciante.
                </p>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Reglas del simulador:
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700 mt-0.5">
                        1.
                      </span>
                      <span>
                        <strong>
                          Intento único por pregunta y avance progresivo:
                        </strong>{' '}
                        Cada pregunta se habilita únicamente después de
                        responder y calificar la anterior (12 preguntas que
                        suman <strong>20.0 puntos</strong>). Requiere redactar
                        un sustento abierto obligatorio antes de calificar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="font-bold text-emerald-700 mt-0.5">
                        2.
                      </span>
                      <span>
                        <strong>Reporte integral y plan de acción:</strong> Al
                        concluir los 3 casos obtendrá su perfil adaptativo,
                        recomendaciones y plan de acción territorial descargable
                        en <strong>PDF</strong>.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap gap-2"></div>
              </section>

              <section className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">
                  Identificación del Participante
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Complete sus datos para registrar su progreso de forma
                  automática en este navegador.
                </p>

                <form
                  onSubmit={handleRegisterSubmit}
                  className="mt-5 space-y-4"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="block text-sm font-semibold text-slate-800 mb-1"
                    >
                      Nombre completo del participante{' '}
                      <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      value={regForm.name}
                      onChange={(e) =>
                        setRegForm({ ...regForm, name: e.target.value })
                      }
                      placeholder="Ej. Ana María Paredes Quispe"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ${
                        regErrors.name
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-slate-300 focus:ring-slate-500'
                      }`}
                    />
                    {regErrors.name && (
                      <p
                        className="text-xs text-rose-700 font-medium mt-1"
                        role="alert"
                      >
                        {regErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="reg-dni"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        DNI (8 dígitos) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="reg-dni"
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        value={regForm.dni}
                        onChange={(e) =>
                          setRegForm({
                            ...regForm,
                            dni: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="Ej. 45891234"
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ${
                          regErrors.dni
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-slate-500'
                        }`}
                      />
                      {regErrors.dni && (
                        <p
                          className="text-xs text-rose-700 font-medium mt-1"
                          role="alert"
                        >
                          {regErrors.dni}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="reg-email"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Correo electrónico{' '}
                        <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        value={regForm.email}
                        onChange={(e) =>
                          setRegForm({ ...regForm, email: e.target.value })
                        }
                        placeholder="nombre@entidad.gob.pe"
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 ${
                          regErrors.email
                            ? 'border-rose-400 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-slate-500'
                        }`}
                      />
                      {regErrors.email && (
                        <p
                          className="text-xs text-rose-700 font-medium mt-1"
                          role="alert"
                        >
                          {regErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regForm.consent}
                        onChange={(e) =>
                          setRegForm({ ...regForm, consent: e.target.checked })
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-400 text-red-700 focus:ring-red-500"
                      />
                      <span className="text-xs text-slate-700 leading-relaxed">
                        <strong>Aviso de privacidad y consentimiento:</strong>{' '}
                        Autorizo que mi nombre, DNI y correo electrónico se
                        guarden automáticamente de forma local en este navegador
                        para registrar mi progreso y se incluyan en los reportes
                        individuales (PDF) y consolidados del taller
                        (Excel/CSV).
                      </span>
                    </label>
                    {regErrors.consent && (
                      <p
                        className="text-xs text-rose-700 font-medium mt-1.5"
                        role="alert"
                      >
                        {regErrors.consent}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 rounded-xl text-white font-bold text-sm sm:text-base shadow-sm hover:opacity-95 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: brand.primary }}
                  >
                    Iniciar Simulador de Casos
                  </button>
                </form>
              </section>
            </div>
          ) : showFinalReport ? (
            /* ================================================================
               REPORTE INTEGRAL FINAL DEL PARTICIPANTE + DESCARGA PDF
               ================================================================ */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: brand.primary }}
                  >
                    Reporte Integral de Desempeño Ético
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    {activeParticipant.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    DNI: <strong>{activeParticipant.dni}</strong> · Correo:{' '}
                    {activeParticipant.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleExportPDF(activeParticipant)}
                    className="px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-sm hover:opacity-95 transition flex items-center gap-2"
                    style={{ backgroundColor: brand.primary }}
                  >
                    <span aria-hidden="true">📄</span>
                    <span>Descargar Reporte PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFinalReport(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
                  >
                    Volver a los Casos
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchParticipantSession}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                  >
                    Nuevo Participante
                  </button>
                </div>
              </div>

              {/* Resumen de KPIs del participante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Puntaje Final
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">
                    {adaptiveProfile.totalScore.toFixed(1)}{' '}
                    <span className="text-base font-medium text-slate-400">
                      / {MAX_SCORE.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Calificación inmediata sobre 20 pts
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Aciertos y Avance
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">
                    {adaptiveProfile.correctCount}{' '}
                    <span className="text-base font-medium text-slate-400">
                      / {TOTAL_QUESTIONS}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {adaptiveProfile.answeredCount} preguntas respondidas (
                    {adaptiveProfile.progressPct}%)
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Nivel Adaptativo Alcanzado
                  </div>
                  <div className="mt-1.5">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${adaptiveProfile.levelBadgeColor}`}
                    >
                      {adaptiveProfile.level}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">
                    {adaptiveProfile.levelSummary}
                  </p>
                </div>
              </div>

              {/* Desempeño por Eje Temático */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Desempeño por Eje de Integridad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {adaptiveProfile.axisStats.map((st) => (
                    <div
                      key={st.caseId}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="text-xs font-bold text-slate-500">
                        CASO {st.caseNumber}
                      </div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        {st.axis}
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span
                          className="text-xl font-extrabold"
                          style={{ color: brand.primary }}
                        >
                          {st.earnedPts.toFixed(1)} / {st.maxPts.toFixed(1)} pts
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {st.pct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${st.pct}%`,
                            backgroundColor: brand.primary,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Oportunidades de Mejora, Recomendaciones y Plan de Acción Territorial */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Oportunidades de Mejora y Recomendaciones
                  </h3>
                  {adaptiveProfile.opportunities.length > 0 ? (
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                      {adaptiveProfile.opportunities.map((op, i) => (
                        <li key={i}>{op}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-emerald-800 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                      Excelente desempeño: sus decisiones cumplen con los
                      estándares preventivos, de transparencia y de reserva
                      exigidos en los tres casos.
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-500">
                      Recomendaciones Normativas
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                      {adaptiveProfile.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Plan de Acción Territorial
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <th className="p-3 font-bold">Plazo</th>
                          <th className="p-3 font-bold">Eje</th>
                          <th className="p-3 font-bold">
                            Acción en territorio
                          </th>
                          <th className="p-3 font-bold">Articulación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {adaptiveProfile.actionPlan.map((plan, idx) => (
                          <tr key={idx} className="align-top">
                            <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                              {plan.horizon}
                            </td>
                            <td className="p-3 font-medium text-slate-700">
                              {plan.axis}
                            </td>
                            <td className="p-3 text-slate-600">
                              {plan.action}
                            </td>
                            <td className="p-3 text-slate-600">
                              {plan.allies}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Revisión detallada de respuestas */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Bitácora Detallada de Respuestas y Sustentos
                </h3>
                {CASES_DATA.map((c) => (
                  <div key={c.id} className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-sm bg-slate-100 px-3.5 py-2 rounded-lg">
                      Caso {c.number}: {c.title}
                    </h4>
                    <div className="space-y-2.5">
                      {c.questions.map((q) => {
                        const r = activeParticipant.responses?.[q.id];
                        return (
                          <div
                            key={q.id}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                {q.code}: {q.prompt}
                              </span>
                              {r ? (
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    r.isCorrect
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {r.isCorrect
                                    ? `Correcta (+${r.pointsEarned.toFixed(
                                        1
                                      )} pts)`
                                    : `Incorrecta (0.0 pts · Clave: ${q.correctKey})`}
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                                  Pendiente
                                </span>
                              )}
                            </div>
                            {r && (
                              <p className="text-xs text-slate-700">
                                <strong>
                                  Alternativa elegida ({r.selectedKey}) ·
                                  Sustento:
                                </strong>{' '}
                                {r.justification}
                              </p>
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
            /* ================================================================
               ESTACIÓN ACTIVA DE SIMULACIÓN DE CASOS (VISTA PARTICIPANTE)
               ================================================================ */
            <div className="space-y-5">
              {/* Barra superior de progreso e indicadores en tiempo real */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500">
                      Participante activo:
                    </span>
                    <div className="font-bold text-slate-900 text-sm sm:text-base">
                      {activeParticipant.name}{' '}
                      <span className="font-normal text-slate-500">
                        (DNI {activeParticipant.dni})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${adaptiveProfile.levelBadgeColor}`}
                    >
                      {adaptiveProfile.level}
                    </span>
                    <div className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-800">
                      Puntaje: {adaptiveProfile.totalScore.toFixed(1)} /{' '}
                      {MAX_SCORE.toFixed(1)} pts
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFinalReport(true)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Ver Reporte Integral
                    </button>
                    <button
                      type="button"
                      onClick={handleSwitchParticipantSession}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cambiar participante
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>
                      Avance general: {adaptiveProfile.answeredCount} de{' '}
                      {TOTAL_QUESTIONS} preguntas completadas
                    </span>
                    <span>{adaptiveProfile.progressPct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${adaptiveProfile.progressPct}%`,
                        backgroundColor: brand.primary,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pestañas de selección de Caso (se desbloquean progresivamente) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CASES_DATA.map((c, idx) => {
                  const unlocked = isCaseUnlocked(idx);
                  const stat = adaptiveProfile.axisStats[idx];
                  const isCurrent = idx === activeCaseIndex;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => {
                        setActiveCaseIndex(idx);
                        const firstPendingIdx = c.questions.findIndex(
                          (q) => !activeParticipant?.responses?.[q.id]
                        );
                        setActiveQuestionIndex(
                          firstPendingIdx >= 0 ? firstPendingIdx : 0
                        );
                      }}
                      className={`text-left p-4 rounded-xl border transition ${
                        !unlocked
                          ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-white border-2 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                      style={
                        isCurrent && unlocked
                          ? { borderColor: brand.primary }
                          : undefined
                      }
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span
                          style={{
                            color: unlocked ? brand.primary : '#64748b',
                          }}
                        >
                          {unlocked
                            ? `CASO ${c.number}`
                            : `🔒 CASO ${c.number} (Bloqueado)`}
                        </span>
                        <span className="text-slate-600">
                          {stat.answeredInCase}/{stat.totalInCase} ·{' '}
                          {stat.earnedPts.toFixed(1)}/{stat.maxPts.toFixed(1)}{' '}
                          pts
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1 line-clamp-1">
                        {c.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Área principal de 2 columnas: Escenario (Izquierda) + Pregunta Secuencial (Derecha) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Columna Escenario Narrativo */}
                <article className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold"
                      style={{
                        backgroundColor: brand.softBg,
                        color: brand.primary,
                      }}
                    >
                      {currentCase.shortTitle}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-1.5 leading-snug">
                      {currentCase.title}
                    </h2>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div>
                      <strong className="text-slate-800">
                        Su rol asignado:
                      </strong>{' '}
                      <span className="text-slate-700">{currentCase.role}</span>
                    </div>
                    <div>
                      <strong className="text-slate-800">
                        Articulación territorial:
                      </strong>{' '}
                      <span className="text-slate-700">
                        {currentCase.articulation}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-slate-700 leading-relaxed text-xs sm:text-sm">
                    {currentCase.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </article>

                {/* Columna Pregunta Secuencial, Alternativas, Sustento Obligatorio y Retroalimentación Socrática */}
                <section className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                  {/* Indicador de avance secuencial dentro del caso */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      {currentCase.questions.map((q, idx) => {
                        const resp = activeParticipant?.responses?.[q.id];
                        const unlocked = isQuestionUnlocked(
                          activeCaseIndex,
                          idx
                        );
                        const isSel = idx === activeQuestionIndex;
                        return (
                          <button
                            key={q.id}
                            type="button"
                            disabled={!unlocked}
                            onClick={() => setActiveQuestionIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                              !unlocked
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : isSel
                                ? 'text-white shadow-2xs'
                                : resp
                                ? resp.isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-rose-50 border-rose-300 text-rose-800'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                            style={
                              isSel && unlocked
                                ? {
                                    backgroundColor: brand.secondary,
                                    borderColor: brand.secondary,
                                  }
                                : undefined
                            }
                            title={
                              unlocked
                                ? `${q.code} (${q.points.toFixed(1)} pts)`
                                : 'Responda la pregunta anterior para desbloquear'
                            }
                          >
                            {unlocked ? q.code : `🔒 ${q.code}`}
                          </button>
                        );
                      })}
                    </div>

                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                      Valor: {currentQuestion.points.toFixed(1)} puntos ·
                      Intento único
                    </span>
                  </div>

                  {/* Enunciado de la pregunta actual */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {currentQuestion.code}. {currentQuestion.prompt}
                    </h3>
                  </div>

                  {/* 4 Alternativas cerradas */}
                  <div
                    className="space-y-2.5"
                    role="radiogroup"
                    aria-label={currentQuestion.code}
                  >
                    {currentQuestion.options.map((opt) => {
                      const isSelected = draftSelection === opt.key;
                      const isLocked = Boolean(currentQuestionResponse);
                      const isRightKey = opt.key === currentQuestion.correctKey;

                      let cardStyle =
                        'bg-white border-slate-300 hover:border-slate-400';
                      if (isLocked) {
                        if (isRightKey) {
                          cardStyle =
                            'bg-emerald-50 border-emerald-500 text-emerald-950';
                        } else if (isSelected && !isRightKey) {
                          cardStyle =
                            'bg-rose-50 border-rose-500 text-rose-950';
                        } else {
                          cardStyle = 'bg-slate-50 border-slate-200 opacity-75';
                        }
                      } else if (isSelected) {
                        cardStyle =
                          'bg-slate-50 border-2 border-slate-800 shadow-2xs';
                      }

                      return (
                        <label
                          key={opt.key}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border transition ${cardStyle} ${
                            isLocked ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${currentQuestion.id}`}
                            value={opt.key}
                            checked={isSelected}
                            disabled={isLocked}
                            onChange={() => setDraftSelection(opt.key)}
                            className="mt-1 h-4 w-4 text-slate-900 focus:ring-slate-500"
                          />
                          <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                            <span className="font-extrabold mr-1.5">
                              {opt.key})
                            </span>
                            <span>{opt.text}</span>
                            {isLocked && isRightKey && (
                              <span className="ml-2 inline-block px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold">
                                Clave correcta
                              </span>
                            )}
                            {isLocked && isSelected && !isRightKey && (
                              <span className="ml-2 inline-block px-2 py-0.5 rounded bg-rose-700 text-white text-[10px] font-bold">
                                Su elección
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Campo abierto obligatorio de sustento */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor={`just-${currentQuestion.id}`}
                        className="text-xs sm:text-sm font-bold text-slate-800"
                      >
                        Sustento técnico y normativo obligatorio{' '}
                        <span className="text-rose-600">*</span>
                      </label>
                      <span
                        className={`text-xs font-semibold ${
                          countWords(draftJustification) >= config.minWords
                            ? 'text-emerald-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {countWords(draftJustification)} / {config.minWords}{' '}
                        palabras mínimas
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Explique el principio o norma aplicable, la acción
                      operativa inmediata y cómo articula para proteger el
                      servicio.
                    </p>
                    <textarea
                      id={`just-${currentQuestion.id}`}
                      rows={3}
                      disabled={Boolean(currentQuestionResponse)}
                      value={draftJustification}
                      onChange={(e) => setDraftJustification(e.target.value)}
                      placeholder="Redacte aquí el fundamento de su decisión..."
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-slate-100 disabled:text-slate-700"
                    />
                  </div>

                  {questionError && (
                    <p
                      className="text-xs text-rose-700 font-semibold bg-rose-50 border border-rose-200 rounded-lg px-3 py-2"
                      role="alert"
                    >
                      {questionError}
                    </p>
                  )}

                  {/* Botón de Calificar (si aún no responde) o Retroalimentación Socrática Inmediata */}
                  {!currentQuestionResponse ? (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleConfirmAnswer}
                        disabled={
                          !draftSelection ||
                          countWords(draftJustification) < config.minWords
                        }
                        className="px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-sm transition disabled:opacity-45 disabled:cursor-not-allowed hover:opacity-95"
                        style={{ backgroundColor: brand.primary }}
                      >
                        Confirmar Respuesta y Calificar (Intento Único)
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`rounded-2xl p-5 border-2 space-y-3 ${
                        currentQuestionResponse.isCorrect
                          ? 'bg-emerald-50/70 border-emerald-400'
                          : 'bg-amber-50/80 border-amber-400'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">
                          {currentQuestionResponse.isCorrect
                            ? `✅ Decisión acertada (+${currentQuestionResponse.pointsEarned.toFixed(
                                1
                              )} puntos)`
                            : `⚠️ Decisión observada (0.0 puntos · Clave correcta: ${currentQuestion.correctKey})`}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700">
                          Retroalimentación Socrática y Normativa
                        </span>
                      </div>

                      {(() => {
                        const fb =
                          currentQuestionResponse.socraticFeedback ||
                          analyzeJustificationSocratic(
                            currentQuestion,
                            currentQuestionResponse.selectedKey,
                            currentQuestionResponse.justification
                          );
                        return (
                          <div className="space-y-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                            <p>
                              <strong>1. Valoración de su sustento:</strong>{' '}
                              {fb.recognition}
                            </p>
                            <p>
                              <strong>
                                2. Complemento basado en la rúbrica:
                              </strong>{' '}
                              {fb.complement}
                            </p>
                            <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium">
                              <strong>3. Reflexión socrática:</strong>{' '}
                              {fb.socraticQuestion}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 transition"
                          style={{ backgroundColor: brand.secondary }}
                        >
                          {activeQuestionIndex <
                          currentCase.questions.length - 1
                            ? `Continuar a ${
                                currentCase.questions[activeQuestionIndex + 1]
                                  .code
                              } →`
                            : activeCaseIndex < CASES_DATA.length - 1
                            ? `Avanzar al Caso ${activeCaseIndex + 2} →`
                            : 'Finalizar y Ver Reporte Integral →'}
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )
        ) : (
          /* ==================================================================
             VISTA DEL DOCENTE / ADMINISTRADOR
             ================================================================== */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: brand.primary }}
                >
                  Panel de Gestión Académica y Seguimiento
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Vista Docente y Administración del Simulador
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Revise resultados en tiempo real, compare decisiones de
                  múltiples participantes, descargue reportes o reinicie la
                  sesión.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportExcelCSV}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-emerald-800 transition flex items-center gap-2"
                >
                  <span aria-hidden="true">📊</span>
                  <span>Descargar Excel (.CSV compatible con Excel)</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestoreDemoData}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
                >
                  Restaurar Demo
                </button>
                <button
                  type="button"
                  onClick={handleResetAllPlatform}
                  className="px-3.5 py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs sm:text-sm font-semibold hover:bg-rose-100"
                >
                  Reiniciar Plataforma
                </button>
                <button
                  type="button"
                  onClick={handleInstructorLogout}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-200"
                  title="Cierra el acceso docente y oculta este panel"
                >
                  🔒 Cerrar Sesión Docente
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
              {[
                {
                  id: 'cohort',
                  label: `Resultados por Participante (${participants.length})`,
                },
                { id: 'compare', label: 'Comparador de Decisiones' },
                {
                  id: 'settings',
                  label: 'Configuración Institucional y Marca',
                },
                {
                  id: 'architecture',
                  label: 'Plan Técnico, Nube y Autopruebas',
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInstructorTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                    instructorTab === tab.id
                      ? 'text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  style={
                    instructorTab === tab.id
                      ? { backgroundColor: brand.secondary }
                      : undefined
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {instructorTab === 'cohort' && (
              <div className="space-y-6">
                {participants.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
                    <div className="text-3xl">📋</div>
                    <h3 className="text-lg font-bold text-slate-900">
                      No hay participantes registrados en la sesión
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Puede registrar un participante desde la Vista
                      Participante o restaurar los datos de demostración para
                      explorar los reportes.
                    </p>
                    <button
                      type="button"
                      onClick={handleRestoreDemoData}
                      className="px-4 py-2 rounded-xl text-white text-sm font-bold"
                      style={{ backgroundColor: brand.primary }}
                    >
                      Restaurar Datos de Demostración
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                              <th className="p-3.5 font-bold">Participante</th>
                              <th className="p-3.5 font-bold">DNI</th>
                              <th className="p-3.5 font-bold">Correo</th>
                              <th className="p-3.5 font-bold">Avance</th>
                              <th className="p-3.5 font-bold">Puntaje (/20)</th>
                              <th className="p-3.5 font-bold">
                                Nivel Adaptativo
                              </th>
                              <th className="p-3.5 font-bold text-right">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {participants.map((p) => {
                              const prof = computeAdaptiveProfile(p);
                              return (
                                <tr
                                  key={p.id}
                                  className={`hover:bg-slate-50 ${
                                    inspectedParticipantId === p.id
                                      ? 'bg-slate-50/90'
                                      : ''
                                  }`}
                                >
                                  <td className="p-3.5 font-bold text-slate-900">
                                    {p.name}
                                  </td>
                                  <td className="p-3.5 text-slate-700">
                                    {p.dni}
                                  </td>
                                  <td className="p-3.5 text-slate-600">
                                    {p.email}
                                  </td>
                                  <td className="p-3.5 text-slate-700">
                                    {prof.answeredCount}/{TOTAL_QUESTIONS} (
                                    {prof.progressPct}%)
                                  </td>
                                  <td className="p-3.5 font-extrabold text-slate-900">
                                    {prof.totalScore.toFixed(1)} pts
                                  </td>
                                  <td className="p-3.5">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${prof.levelBadgeColor}`}
                                    >
                                      {prof.level}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setInspectedParticipantId(p.id)
                                      }
                                      className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white"
                                    >
                                      Inspeccionar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleExportPDF(p)}
                                      className="px-2.5 py-1 rounded-lg text-white text-xs font-bold hover:opacity-95"
                                      style={{ backgroundColor: brand.primary }}
                                    >
                                      PDF Individual
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {(() => {
                      const inspected =
                        participants.find(
                          (p) => p.id === inspectedParticipantId
                        ) || participants[0];
                      if (!inspected) return null;
                      return (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">
                                Detalle de Respuestas: {inspected.name}
                              </h3>
                              <p className="text-xs text-slate-500">
                                DNI {inspected.dni} · {inspected.email}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleExportPDF(inspected)}
                              className="px-3.5 py-2 rounded-xl text-white text-xs font-bold"
                              style={{ backgroundColor: brand.primary }}
                            >
                              📄 Descargar PDF de {inspected.name}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {CASES_DATA.flatMap((c) =>
                              c.questions.map((q) => {
                                const r = inspected.responses?.[q.id];
                                return (
                                  <div
                                    key={q.id}
                                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1"
                                  >
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-slate-800">
                                        Caso {c.number} · {q.code}
                                      </span>
                                      {r ? (
                                        <span
                                          className={
                                            r.isCorrect
                                              ? 'text-emerald-700'
                                              : 'text-rose-700'
                                          }
                                        >
                                          Elegida: {r.selectedKey} (
                                          {r.pointsEarned.toFixed(1)} pts)
                                        </span>
                                      ) : (
                                        <span className="text-slate-400">
                                          Pendiente
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2">
                                      {q.prompt}
                                    </p>
                                    {r?.justification && (
                                      <p className="text-xs text-slate-800 bg-white p-2 rounded border border-slate-200 mt-1">
                                        <strong>Sustento:</strong>{' '}
                                        {r.justification}
                                      </p>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            )}

            {instructorTab === 'compare' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Comparador de Decisiones entre Participantes
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Seleccione hasta 4 participantes para contrastar sus
                    alternativas y sustentos pregunta por pregunta.
                  </p>
                </div>

                {participants.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No hay participantes disponibles para comparar.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {participants.map((p) => {
                        const checked = selectedCompareIds.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedCompareIds((prev) =>
                                prev.includes(p.id)
                                  ? prev.filter((id) => id !== p.id)
                                  : prev.length < 4
                                  ? [...prev, p.id]
                                  : prev
                              );
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                              checked
                                ? 'text-white border-transparent'
                                : 'bg-slate-50 border-slate-300 text-slate-700'
                            }`}
                            style={
                              checked
                                ? { backgroundColor: brand.secondary }
                                : undefined
                            }
                          >
                            {checked ? '✓ ' : '+ '}
                            {p.name}
                          </button>
                        );
                      })}
                    </div>

                    {selectedCompareIds.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Seleccione al menos un participante en las etiquetas
                        superiores.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                              <th className="p-3 font-bold w-48">
                                Pregunta y Clave
                              </th>
                              {selectedCompareIds.map((id) => {
                                const p = participants.find(
                                  (item) => item.id === id
                                );
                                if (!p) return null;
                                const prof = computeAdaptiveProfile(p);
                                return (
                                  <th
                                    key={id}
                                    className="p-3 font-bold min-w-[210px]"
                                  >
                                    <div>{p.name}</div>
                                    <div className="text-[11px] font-normal text-slate-500">
                                      Puntaje: {prof.totalScore.toFixed(1)}/20 ·{' '}
                                      {prof.level}
                                    </div>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {CASES_DATA.flatMap((c) =>
                              c.questions.map((q) => (
                                <tr key={q.id} className="align-top">
                                  <td className="p-3 bg-slate-50/70">
                                    <div className="font-bold text-slate-900">
                                      Caso {c.number} · {q.code}
                                    </div>
                                    <div className="text-emerald-700 font-semibold mt-0.5">
                                      Clave: {q.correctKey} (
                                      {q.points.toFixed(1)} pts)
                                    </div>
                                  </td>
                                  {selectedCompareIds.map((id) => {
                                    const p = participants.find(
                                      (item) => item.id === id
                                    );
                                    const r = p?.responses?.[q.id];
                                    return (
                                      <td key={id} className="p-3">
                                        {r ? (
                                          <div className="space-y-1">
                                            <span
                                              className={`inline-block px-2 py-0.5 rounded font-bold ${
                                                r.isCorrect
                                                  ? 'bg-emerald-100 text-emerald-800'
                                                  : 'bg-rose-100 text-rose-800'
                                              }`}
                                            >
                                              Opción {r.selectedKey} (
                                              {r.pointsEarned.toFixed(1)} pts)
                                            </span>
                                            <p className="text-slate-600 leading-snug">
                                              {r.justification}
                                            </p>
                                          </div>
                                        ) : (
                                          <span className="text-slate-400 italic">
                                            Sin responder
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {instructorTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 max-w-3xl">
                <h3 className="text-lg font-bold text-slate-900">
                  Personalización Institucional y Parámetros Pedagógicos
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Paleta de colores corporativos
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.values(BRAND_PRESETS).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setConfig({ ...config, presetId: preset.id })
                        }
                        className={`p-3.5 rounded-xl border text-left transition ${
                          config.presetId === preset.id
                            ? 'border-2 border-slate-900 bg-slate-50'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <div className="text-xs font-bold text-slate-900">
                          {preset.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cfg-logo"
                    className="block text-sm font-semibold text-slate-800 mb-1"
                  >
                    Logotipo Institucional Midis (archivo local optimizado o
                    URL)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Por defecto se muestra el emblema institucional de{' '}
                    <em>PERÚ · Ministerio de Desarrollo e Inclusión Social</em>.
                    Si desea usar su archivo exacto{' '}
                    <strong>MIDIS (1).png</strong>, selecciónelo aquí (se
                    optimiza automáticamente para conservar nitidez sin saturar
                    el navegador):
                  </p>
                  <div className="mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Vista previa activa en cabecera y PDF:
                      </div>
                      <MidisLogoBadge customLogoUrl={config.customLogoUrl} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <label className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-200 cursor-pointer transition">
                      <span>
                        📁 Cargar archivo MIDIS (1).png desde mi equipo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result !== 'string') return;
                            const img = new Image();
                            img.onload = () => {
                              const targetHeight = 160;
                              const scale = Math.min(
                                1,
                                targetHeight / Math.max(1, img.height)
                              );
                              const canvas = document.createElement('canvas');
                              canvas.width = Math.round(img.width * scale);
                              canvas.height = Math.round(img.height * scale);
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(
                                  img,
                                  0,
                                  0,
                                  canvas.width,
                                  canvas.height
                                );
                                const optimizedDataUrl =
                                  canvas.toDataURL('image/png');
                                setConfig({
                                  ...config,
                                  customLogoUrl: optimizedDataUrl,
                                });
                                setBannerAlert({
                                  type: 'success',
                                  message: `Logotipo oficial "${file.name}" cargado y optimizado correctamente.`,
                                });
                              } else {
                                setConfig({
                                  ...config,
                                  customLogoUrl: reader.result,
                                });
                              }
                            };
                            img.src = reader.result;
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({ ...config, customLogoUrl: '' })
                      }
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Restaurar Emblema Institucional
                    </button>
                  </div>
                  <input
                    id="cfg-logo"
                    type="url"
                    value={
                      config.customLogoUrl?.startsWith('data:')
                        ? ''
                        : config.customLogoUrl
                    }
                    onChange={(e) =>
                      setConfig({ ...config, customLogoUrl: e.target.value })
                    }
                    placeholder="O pegue una URL externa de imagen (opcional)"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cfg-words"
                      className="block text-sm font-semibold text-slate-800 mb-1"
                    >
                      Mínimo de palabras en sustento abierto
                    </label>
                    <input
                      id="cfg-words"
                      type="number"
                      min={5}
                      max={100}
                      value={config.minWords}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          minWords: Math.max(5, Number(e.target.value) || 15),
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cfg-title"
                      className="block text-sm font-semibold text-slate-800 mb-1"
                    >
                      Subtítulo del taller en cabecera
                    </label>
                    <input
                      id="cfg-title"
                      type="text"
                      value={config.workshopTitle}
                      onChange={(e) =>
                        setConfig({ ...config, workshopTitle: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">
                    Credenciales de Acceso a la Vista Docente
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="cfg-doc-user"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Usuario docente
                      </label>
                      <input
                        id="cfg-doc-user"
                        type="text"
                        value={config.instructorUser || ''}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            instructorUser: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cfg-doc-pass"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Clave docente
                      </label>
                      <input
                        id="cfg-doc-pass"
                        type="text"
                        value={config.instructorPass || ''}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            instructorPass: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {instructorTab === 'architecture' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Arquitectura y Despliegue Gratuito en la Nube (&gt;1,000
                    participantes)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Esta aplicación está construida bajo arquitectura{' '}
                    <strong>
                      100 % estática en el navegador (Client-Side SPA)
                    </strong>{' '}
                    sin servidores backend que entren en reposo ni límites de
                    conexiones simultáneas.
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <strong>
                        1. Opciones gratuitas sin suspensión por inactividad:
                      </strong>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>
                          <strong>Cloudflare Pages:</strong> Ancho de banda
                          ilimitado, red CDN global y cero suspensión.
                        </li>
                        <li>
                          <strong>GitHub Pages / Vercel / Netlify:</strong>{' '}
                          Despliegue continuo desde repositorio con
                          disponibilidad permanente para más de 1,000 usuarios
                          concurrentes.
                        </li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <strong>
                        2. Inicio del proyecto local (Vite + React + Tailwind):
                      </strong>
                      <pre className="mt-1.5 bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs overflow-x-auto">
                        {`npm create vite@latest simulador-integridad-midis -- --template react
cd simulador-integridad-midis
npm install
npm run build   # Genera carpeta dist/ lista para subir a la nube`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Verificación y Pruebas Automatizadas
                    </h3>
                    <button
                      type="button"
                      onClick={handleRunSelfTests}
                      className="px-3.5 py-2 rounded-xl text-white text-xs font-bold"
                      style={{ backgroundColor: brand.primary }}
                    >
                      ▶ Ejecutar Pruebas
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Valide en vivo la integridad del puntaje sobre 20, las
                    reglas de validación, la retroalimentación socrática y la
                    generación de exportaciones Excel/CSV.
                  </p>

                  {testResults.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                      Presione "Ejecutar Pruebas" para correr los 4 casos de
                      verificación unitaria.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {testResults.map((t, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border text-xs ${
                            t.passed
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                              : 'bg-rose-50 border-rose-300 text-rose-950'
                          }`}
                        >
                          <div className="font-bold">
                            {t.passed ? '✅ PASÓ:' : '❌ FALLÓ:'} {t.name}
                          </div>
                          <div className="mt-0.5 opacity-85">{t.detail}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA INSTITUCIONAL CON ACCESO DISCRETO DOCENTE */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 text-xs text-slate-500 mt-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            Ministerio de Desarrollo e Inclusión Social (Midis) · Oficina de
            Integridad Institucional
          </span>
          <div className="flex items-center gap-4">
            <span>
              Simulador pedagógico offline-first · Datos almacenados localmente
              en el navegador
            </span>
            <button
              type="button"
              onClick={openInstructorAccess}
              className="text-slate-400 hover:text-slate-700 transition flex items-center gap-1"
              title="Acceso reservado para el docente o facilitador (Atajo: Alt + D)"
            >
              <span aria-hidden="true">🔒</span>
              <span>Docente</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
