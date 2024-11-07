/**
 * @module M/impl/ol/js/patches
 */

/* eslint-disable */
import * as LayerModule from 'ol/layer/Layer';
import OLFormatGML3 from 'ol/format/GML3';
// import OLInteractionPointer from 'ol/interaction/Pointer';
import { writeStringTextNode } from 'ol/format/xsd';
import { get as getProjection } from 'ol/proj';
import { createFromCapabilitiesMatrixSet } from 'ol/tilegrid/WMTS';
// import WMTSRequestEncoding from 'ol/source/WMTSRequestEncoding';

// import { POINTERUP, POINTERDOWN, POINTERDRAG } from 'ol/MapBrowserEventType';
// import { getValues } from 'ol/obj';

/**
 * Parche: deshabilita la configuración del orden de los ejes.
 * @function
 * @param {Node} node Nodo.
 * @param {ol.geom.Point} value Punto geométrico.
 * @param {Array.<*>} objectStack Conjunto de nodos.
 * @api
 */
OLFormatGML3.prototype.writePos_ = (node, value, objectStack) => {
  // var context = objectStack[objectStack.length - 1];
  // PATCH: ------------------------------ init
  // var srsName = context['srsName'];
  // var axisOrientation = 'enu';
  // if (srsName) {
  //   axisOrientation = ol.proj.get(srsName).getAxisOrientation();
  // }
  // ------------------------------------- end
  const point = value.getCoordinates();
  const coords = `${point[0]} ${point[1]}`;
  // PATCH: ------------------------------ init
  // only 2d for simple features profile
  // if (axisOrientation.substr(0, 2) === 'en') {
  // ------------------------------------- end
  // PATCH: ------------------------------ init
  // } else {
  //   coords = (point[1] + ' ' + point[0]);
  // }
  // ------------------------------------- end
  writeStringTextNode(node, coords);
};

/**
 * Parche: Devuelve las coordenadas de un punto geométrico.
 * @function
 * @param {Array.<number>} point Punto geométrico.
 * @param {string=} optSRSName Nombre del sistema de referencia espacial.
 * @return {string} Coordenadas.
 * @api
 */
OLFormatGML3.prototype.getCoords_ = (point, optSRSName) => {
  // PATCH: ------------------------------ init
  // var axisOrientation = 'enu';
  // if (optSRSName) {
  //   axisOrientation = ol.proj.get(optSRSName).getAxisOrientation();
  // }
  // return ((axisOrientation.substr(0, 2) === 'en') ?
  //     point[0] + ' ' + point[1] :
  //     point[1] + ' ' + point[0]);
  return `${point[0]} ${point[1]}`;
  // ------------------------------------- end
};

/**
 * Genere opciones de origen a partir de un objeto de "capabilities".
 * Parche: permitir anular la extensión de tileGrid
 * @function
 * @param {Object} wmtsCap Un objeto que representa el documento de "capabilities".
 * @param {!Object} config Propiedades de configuración para la capa. Valores predeterminados para
 * la capa se aplicará si no se proporciona.
 *
 * Propiedades de configuración requeridas:
 *  - layer - {string} El identificador de capa.
 *
 * Propiedades de configuración opcionales:
 *  - matrixSet - {string} El identificador del conjunto de matrices, requerido si hay
  * más de una matriz establecida en las "capabilities" de la capa.
 *  - projection - {string} El CRS deseado cuando no se especifica "matrixSet".
  * por ejemplo: "EPSG:3857". Si la proyección deseada no está disponible,
  * se arroja un error.
 *  - requestEncoding - {string} formato de codificación de URL para la capa. El valor predeterminado es
  * el primer formato de URL de mosaico que se encuentra en la respuesta de "GetCapabilities".
 *  - style - {string} El nombre del estilo.
 *  - format - {string} Formato de imagen para la capa. El valor predeterminado es el primero
  * formato devuelto en la respuesta GetCapabilities.
 *  - crossOrigin - {string|null|undefined} Origen cruzado. El valor predeterminado es "undefined".
 * @return {?Options} Objeto de opciones de fuente WMTS o "null" si no se encontró la capa.
 * @api
 */
export const optionsFromCapabilities = (wmtsCap, config) => {
  const layers = wmtsCap['Contents']['Layer'];
  const l = layers.find(function(elt) {
    return elt['Identifier'] == config['layer'];
  });
  if (l === null) {
    return null;
  }
  const tileMatrixSets = wmtsCap['Contents']['TileMatrixSet'];
  let idx;
  if (l['TileMatrixSetLink'].length > 1) {
    if ('projection' in config) {
      idx = l['TileMatrixSetLink'].findIndex(
        function(elt, index, array) {
          const tileMatrixSet = tileMatrixSets.find(function(el) {
            return el['Identifier'] == elt['TileMatrixSet'];
          });
          const supportedCRS = tileMatrixSet['SupportedCRS'];
          const proj1 = getProjection(supportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) ||
            getProjection(supportedCRS);
          const proj2 = getProjection(config['projection']);
          if (proj1 && proj2) {
            return equivalent(proj1, proj2);
          } else {
            return supportedCRS == config['projection'];
          }
        });
    } else {
      idx = l['TileMatrixSetLink'].findIndex(
        function(elt, index, array) {
          return elt['TileMatrixSet'] == config['matrixSet'];
        });
    }
  } else {
    idx = 0;
  }
  if (idx < 0) {
    idx = 0;
  }
  const matrixSet = /** @type {string} */
    (l['TileMatrixSetLink'][idx]['TileMatrixSet']);
  const matrixLimits = /** @type {Array<Object>} */
    (l['TileMatrixSetLink'][idx]['TileMatrixSetLimits']);

  let format = /** @type {string} */ (l['Format'][0]);
  if ('format' in config) {
    format = config['format'];
  }
  idx = l['Style'].findIndex(function(elt) {
    if ('style' in config) {
      return elt['Title'] == config['style'];
    } else {
      return elt['isDefault'];
    }
  });
  if (idx < 0) {
    idx = 0;
  }
  const style = /** @type {string} */ (l['Style'][idx]['Identifier']);

  const dimensions = {};
  if ('Dimension' in l) {
    l['Dimension'].forEach(function(elt, index, array) {
      const key = elt['Identifier'];
      let value = elt['Default'];
      if (value === undefined) {
        value = elt['Value'][0];
      }
      dimensions[key] = value;
    });
  }

  const matrixSets = wmtsCap['Contents']['TileMatrixSet'];
  const matrixSetObj = matrixSets.find(function(elt) {
    return elt['Identifier'] == matrixSet;
  });

  let projection;
  const code = matrixSetObj['SupportedCRS'];
  if (code) {
    projection = getProjection(code.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) ||
      getProjection(code);
  }
  if ('projection' in config) {
    const projConfig = getProjection(config['projection']);
    if (projConfig) {
      if (!projection || equivalent(projConfig, projection)) {
        projection = projConfig;
      }
    }
  }

  const wgs84BoundingBox = l['WGS84BoundingBox'];
  let extent, wrapX;
  // PATCH init ------------------
  if (config.extent) {
    extent = config.extent;
  }
  // PATCH end ------------------
  else if (wgs84BoundingBox !== undefined) {
    const wgs84ProjectionExtent = getProjection('EPSG:4326').getExtent();
    wrapX = (wgs84BoundingBox[0] == wgs84ProjectionExtent[0] &&
      wgs84BoundingBox[2] == wgs84ProjectionExtent[2]);
    extent = transformExtent(
      wgs84BoundingBox, 'EPSG:4326', projection);
    const projectionExtent = projection.getExtent();
    if (projectionExtent) {
      // If possible, do a sanity check on the extent - it should never be
      // bigger than the validity extent of the projection of a matrix set.
      if (!containsExtent(projectionExtent, extent)) {
        extent = undefined;
      }
    }
  }

  const tileGrid = createFromCapabilitiesMatrixSet(matrixSetObj, extent, matrixLimits);

  /** @type {!Array<string>} */
  const urls = [];
  let requestEncoding = config['requestEncoding'];
  requestEncoding = requestEncoding !== undefined ? requestEncoding : '';

  if ('OperationsMetadata' in wmtsCap && 'GetTile' in wmtsCap['OperationsMetadata']) {
    const gets = wmtsCap['OperationsMetadata']['GetTile']['DCP']['HTTP']['Get'];

    for (let i = 0, ii = gets.length; i < ii; ++i) {
      if (gets[i]['Constraint']) {
        const constraint = gets[i]['Constraint'].find(function(element) {
          return element['name'] == 'GetEncoding';
        });
        const encodings = constraint['AllowedValues']['Value'];

        if (requestEncoding === '') {
          // requestEncoding not provided, use the first encoding from the list
          requestEncoding = encodings[0];
        }
        if (requestEncoding === 'KVP') {
          if (encodings.includes('KVP')) {
            urls.push( /** @type {string} */ (gets[i]['href']));
          }
        } else {
          break;
        }
      } else if (gets[i]['href']) {
        requestEncoding = 'KVP';
        urls.push( /** @type {string} */ (gets[i]['href']));
      }
    }
  }
  if (urls.length === 0) {
    requestEncoding = 'REST';
    l['ResourceURL'].forEach(function(element) {
      if (element['resourceType'] === 'tile') {
        format = element['format'];
        urls.push( /** @type {string} */ (element['template']));
      }
    });
  }

  return {
    urls: urls,
    layer: config['layer'],
    matrixSet: matrixSet,
    format: format,
    projection: projection,
    requestEncoding: requestEncoding,
    tileGrid: tileGrid,
    style: style,
    dimensions: dimensions,
    wrapX: wrapX,
    crossOrigin: config['crossOrigin']
  };
}

/**
 * Este comentario no se verá, es necesario incluir
 * una exportación por defecto para que el compilador
 * muestre las funciones.
 *
 * Esto se produce por al archivo normaliza-exports.js
 * @api stable
 */
 export default {};