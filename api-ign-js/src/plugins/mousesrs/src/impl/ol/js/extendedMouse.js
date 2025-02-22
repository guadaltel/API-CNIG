/**
 * @module M/impl/control/Mouse
 */

import { getValue } from '../../../facade/js/i18n/language';
import WCSLoaderManager from './wcsloadermanager';

/**
 * @classdesc
 * @api
 */
class Mouse extends ol.control.MousePosition {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {ol.control.Control}
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(vendorOptions) {
    super(vendorOptions);

    /**
     * Coordinate format given in OpenLayers format.
     * @private
     * @type {Object}
     */
    this.coordinateFormat = vendorOptions.coordinateFormat;

    this.label = vendorOptions.label;

    this.mapProjection_ = vendorOptions.projection;

    this.target = vendorOptions.target;

    this.geoDecimalDigits = vendorOptions.geoDecimalDigits;

    this.utmDecimalDigits = vendorOptions.utmDecimalDigits;

    this.activeZ = vendorOptions.activeZ;

    this.order = vendorOptions.order;
  }

  initWCSLoaderManager(map) {
    this.facadeMap_ = map;
    if (this.activeZ) {
      this.wcsloadermanager = new WCSLoaderManager();
      const layers = [
        {
          url: 'https://servicios.idee.es/wcs-inspire/mdt',
          options: {
            coverage: 'Elevacion4258_200',
            crs: 'EPSG:4326',
            format: 'ArcGrid',
            height: 500,
            interpolationMethod: 'bilinear',
            service: 'WCS',
            version: '1.0.0',
            width: 500,
          },
        },
        {
          url: 'https://servicios.idee.es/wcs-inspire/mdt',
          options: {
            coverage: 'Elevacion4258_25',
            crs: 'EPSG:4326',
            format: 'ArcGrid',
            height: 500,
            interpolationMethod: 'bilinear',
            service: 'WCS',
            version: '1.0.0',
            width: 500,
          },
        },
        {
          url: 'https://servicios.idee.es/wcs-inspire/mdt',
          options: {
            coverage: 'Elevacion4258_500',
            crs: 'EPSG:4326',
            format: 'ArcGrid',
            height: 500,
            interpolationMethod: 'bilinear',
            service: 'WCS',
            version: '1.0.0',
            width: 500,
          },
        },
        {
          url: 'https://servicios.idee.es/wcs-inspire/mdt',
          options: {
            coverage: 'Elevacion4258_5',
            crs: 'EPSG:4326',
            format: 'ArcGrid',
            height: 500,
            interpolationMethod: 'bilinear',
            service: 'WCS',
            version: '1.0.0',
            width: 500,
          },
        },
      ];

      this.wcsloadermanager.addLayers(layers);
      map.getMapImpl().on('moveend', () => {
        this.updateDataGrid(map);
      });
    }
  }

  updateDataGrid(map) {
    const innerMap = this.facadeMap_ !== undefined ? this.facadeMap_ : map;
    const bbox = innerMap.getBbox();
    let extent = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
    extent = ol.proj.transformExtent(extent, innerMap.getProjection().code, 'EPSG:4326');
    this.wcsloadermanager.updateDataGrid(extent, 'EPSG:4326');
  }

  /**
   * function remove the event 'click'
   *
   * @public
   * @function
   * @api
   */
  getElement() {
    return this.element;
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   * @export
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }

  /**
   * @param {Event} event Browser event.
   * @protected
   */
  handleMouseMove(event) {
    const map = this.getMap();
    this.lastMouseMovePixel_ = map.getEventPixel(event);
    this.updateHTML_(this.lastMouseMovePixel_);
  }

  /**
   * @param {Event} event Browser event.
   * @protected
   */
  handleMouseOut(event) {
    this.updateHTML_(this.lastMouseMovePixel_);
    this.lastMouseMovePixel_ = null;
  }

  /**
   * @private
   * @function
   */
  updateHTML_(pixel) {
    let html = '';
    const projection = this.getProjection();
    if (pixel && this.mapProjection_) {
      if (!this.transform_) {
        if (projection) {
          this.transform_ = ol.proj.getTransform(this.mapProjection_, projection);
        } else {
          this.transform_ = ol.proj.identityTransform;
        }
      }

      const map = this.getMap();
      const coordinate = map.getCoordinateFromPixel(pixel);
      if (coordinate) {
        this.transform_(coordinate, coordinate);
        html = `${this.coordinateFormat(coordinate)}`.replace('.', ',').replace('.', ',').replace(', ', '&nbsp;&nbsp;&nbsp;');
        if (this.activeZ && this.wcsloadermanager !== undefined) {
          const orgCoord = map.getCoordinateFromPixel(pixel);
          const tCoord = ol.proj.transform(orgCoord, this.facadeMap_.getProjection().code, 'EPSG:4326');
          const value = Math.round(this.wcsloadermanager.getValue(tCoord, 'EPSG:4326'));
          if (!Number.isNaN(value)) {
            html += `&nbsp;&nbsp;&nbsp;${value}`;
          }
        }
      }

      html += ` | <b role="button" tabindex="${this.order}" aria-label="${getValue('accessibility.src')}" class="m-mousesrs-pointer">${this.label}</b>`;
    }

    if (!this.renderedHTML_ || html !== this.renderedHTML_) {
      this.element.innerHTML = html;
      this.renderedHTML_ = html;
    }
  }
}

export default Mouse;
