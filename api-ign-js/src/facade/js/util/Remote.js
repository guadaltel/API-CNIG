/**
 * @module M/remote
 */

import { addParameters, generateRandom, isNullOrEmpty, isObject } from './Utils';
import { useproxy } from '../mapea';
import Response from './Response';

/**
 * Métodos HTTP POST y GET
 * @const
 * @type {object}
 * @public
 * @api
 */
export const method = {
  GET: 'GET',
  POST: 'POST',
};

/**
 * Crea una etiqueta "script" para el proxy.
 *
 * @function
 * @param {String} proxyUrl URL del proxy.
 * @param {String} jsonpHandlerName Nombre del identificador.
 */
const createScriptTag = (proxyUrl, jsonpHandlerName) => {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.id = jsonpHandlerName;
  scriptTag.src = proxyUrl;
  scriptTag.setAttribute('async', '');
  window.document.body.appendChild(scriptTag);
};

/**
 * Elimina la etiqueta "script" para el proxy.
 *
 * @function
 * @param {String} jsonpHandlerName Nombre del identificador.
 */
const removeScriptTag = (jsonpHandlerName) => {
  const scriptTag = document.getElementById(jsonpHandlerName);
  scriptTag.parentNode.removeChild(scriptTag);
};

/**
 * Esta función maneja el proxy.
 *
 * @function
 * @param {String} url URL del proxy (M.config.PROXY_URL).
 * @param {String} methodType Tipo de petición.
 * @returns {String} Devuelve el proxy.
 */
const manageProxy = (url, methodType) => {
  // deafult GET
  let proxyUrl = M.config.PROXY_URL;
  if (methodType === method.POST) {
    proxyUrl = M.config.PROXY_POST_URL;
  }

  proxyUrl = addParameters(proxyUrl, {
    url,
  });

  return proxyUrl;
};

/**
 * Petición basada en "jsonp".
 *
 * @function
 * @param {String} urlVar URL.
 * @param {String} data Parámetros.
 * @param {Object} options Opciones.
 * @returns {String} Devuelve la respuesta.
 */
const jsonp = (urlVar, data, options) => {
  let url = urlVar;
  if (!isNullOrEmpty(data)) {
    url = addParameters(url, data);
  }

  if (useproxy) {
    url = manageProxy(url, method.GET);
  }

  // creates a random name to avoid clonflicts
  const jsonpHandlerName = generateRandom('mapea_jsonphandler_');
  url = addParameters(url, {
    callback: jsonpHandlerName,
  });

  const req = new Promise((success, fail) => {
    const userCallback = success;
    // get the promise of the script tag
    const scriptTagPromise = new Promise((scriptTagSuccess) => {
      window[jsonpHandlerName] = scriptTagSuccess;
    });
    /* when the script tag was executed remove
     * the handler and execute the callback
     */
    scriptTagPromise.then((proxyResponse) => {
      // remove the jsonp handler from global window
      delete window[jsonpHandlerName];

      // remove the script tag from the html
      removeScriptTag(jsonpHandlerName);

      const response = new Response();
      response.parseProxy(proxyResponse);

      userCallback(response);
    });
  });

  // creates the script tag
  createScriptTag(url, jsonpHandlerName);

  return req;
};

/**
 * Petición ajax.
 *
 * @function
 * @param {String} urlVar URL.
 * @param {String} dataVar Parámetros.
 * @param {Object} methodType Tipo de petición.
 * @param {Object} useProxy Verdadero para usar el proxy.
 * @returns {String} Devuelve la respuesta.
 */
const ajax = (urlVar, dataVar, methodType, useProxy) => {
  let url = urlVar;
  let data = dataVar;
  if ((useProxy !== false) && (useproxy === true)) {
    url = manageProxy(url, methodType);
  }

  // parses parameters to string
  if (isObject(data)) {
    data = JSON.stringify(data);
  }

  return new Promise((success, fail) => {
    let xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = new Response();
        response.parseXmlHttp(xhr);
        success(response);
      }
    };
    xhr.open(methodType, url, true);
    xhr.send(data);
  });
};

/**
 * Esta función obtiene un recurso lanza un
 * Método HTTP GET y comprueba si la solicitud
 * está basado en ajax o jsonp.
 *
 * @function
 * @param {string} url URL.
 * @param {string} data Parámetros.
 * @param {Object} options Opciones.
 * @returns {Promise}
 * @api
 */
export const get = (url, data, options) => {
  let req;

  const useProxy = ((isNullOrEmpty(options) || (options.jsonp !== false)) &&
    useproxy !== false);

  if (useProxy === true) {
    req = jsonp(url, data, options);
  } else {
    req = ajax(url, data, method.GET, false);
  }

  return req;
};

/**
 * Esta función obtiene un recurso lanznado una petición
 * HTTP POST usando ajax.
 *
 * @function
 * @param {string} url URL.
 * @param {Object} data Parámetros.
 * @param {Object} options Opciones.
 *
 * @returns {Promise} Respuesta.
 * @api
 */
export const post = (url, data, options) => {
  return ajax(url, data, method.POST);
};

/**
 * Este comentario no se verá, es necesario incluir
 * una exportación por defecto para que el compilador
 * muestre las funciones.
 *
 * Esto se produce por al archivo normaliza-exports.js
 * @api stable
 */
export default {};
