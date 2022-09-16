/**
 * @module M/impl/loader/JSONP
 */
import MObject from 'M/Object';
import { get as getRemote } from 'M/util/Remote';
import Exception from 'M/exception/exception';
import { isNullOrEmpty } from 'M/util/Utils';
import { getValue } from 'M/i18n/language';
/**
 * @classdesc
 * @api
 * @namespace M.impl.control
 */
class JSONP extends MObject {
  /**
   * @classdesc TODO
   * control
   * @param {function} element template of this control
   * @param {M.Map} map map to add the plugin
   * @constructor
   * @extends {M.Object}
   * @api stable
   */
  constructor(map, url, format) {
    super();

    /**
     * TODO
     * @private
     * @type {M.Map}
     */
    this.map_ = map;

    /**
     * TODO
     * @private
     * @type {M.impl.service.WFS}
     */
    this.url_ = url;

    /**
     * TODO
     * @private
     * @type {M.format.GeoJSON}
     */
    this.format_ = format;
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  getLoaderFn(callback) {
    return ((extent, resolution, projection) => {
      this.loadInternal_(projection).then((response) => {
        callback.apply(this, response);
      });
    });
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  loadInternal_(projection) {
    return new Promise((success) => {
      getRemote(this.url_).then((response) => {
        if (!isNullOrEmpty(response.text)) {
          const newText = response.text.replace('urn:ogc:def:crs:OGC:1.3:CRS84', 'urn:ogc:def:crs:EPSG::4326');
          const features = this.format_.read(newText, {
            featureProjection: projection,
          });
          success.call(this, [features]);
        } else {
          Exception(getValue('exception').no_service_response);
        }
      });
    });
  }
}

export default JSONP;
