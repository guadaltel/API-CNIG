/**
 * @module M/control/StereoscopicControl
 */

import StereoscopicImplControl from 'impl/stereoscopiccontrol';
import template from 'templates/stereoscopic';
import { getValue } from './i18n/language';

export default class StereoscopicControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(orbitControls = false,  anaglyphActive = false) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(StereoscopicImplControl)) {
      M.exception(getValue('exception.impl'));
    }
    // 2. implementation of this control
    const impl = new StereoscopicImplControl();
    super(impl, 'Stereoscopic');
    this.active = false;
    this.orbitControls_ = orbitControls;
    this.anaglyphActive_ =  anaglyphActive;
    this.toggle = false;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.map_ = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template, {
        vars: {
          translations: {
            generate_3d_view: getValue('generate_3d_view'),
            magnify: getValue('magnify'),
            mode_3d: getValue('mode_3d'),
            optimized: getValue('optimized'),
            normal: getValue('normal'),
            middle: getValue('middle'),
            gray: getValue('gray'),
            between: getValue('between'),
            generate_3d: getValue('generate_3d'),
            anaglyph_active: this.anaglyphActive_,
            orbitControls: this.orbitControls_,
            activate3d: getValue('activate3d'),
          },
        },
      });
      this.addEvent(html, this.map_ );
      success(html);
    });
  }

  enableOptionView3D(id) {
    document.querySelector(id).disabled = false;
    document.querySelector(id).classList.remove('disabled3Dview');
    document.querySelector(id).classList.add('enable3Dview');
  }

  disableOptionView3D(id) {
    document.querySelector(id).disabled = true;
    document.querySelector(id).classList.remove('enable3Dview');
    document.querySelector(id).classList.add('disabled3Dview');
  }

  addEvent(html, mapjs) {
    html.querySelector('#range3d').addEventListener('change', ({target})=> {
      // eslint-disable-next-line no-undef
      TR3.formatMeasure(TR3.tPixMesh);
      // eslint-disable-next-line no-undef
      TR3.setMagniValues(target.value);
    });

    html.querySelector('#toggle3D').addEventListener('click', ({ target }) => {
      this.toggle = !this.toggle;
      window.toggle3D = this.toggle;
      target.classList.toggle('toggle3D');
      document.querySelector('#anaglyph-type').classList.toggle('selectorToggle');
      if (this.toggle === true) {
        document.querySelector('.map canvas').style.display = 'none';
        setTimeout(() => { // View3D Resolve Window White
          const {x, y} = mapjs.getCenter();
          mapjs.setCenter({ x: x + 1, y: y+1 });
        }, 100);

        target.innerHTML = target.innerHTML.replace(getValue('activate3d'), getValue('disable3d'));
        this.enableOptionView3D('#anaglyph-type');
        this.enableOptionView3D('#range3d');
      } else {
        document.querySelector('.map canvas').style.display = 'block';
        target.innerHTML = target.innerHTML.replace(getValue('disable3d'), getValue('activate3d'));
        this.disableOptionView3D('#anaglyph-type');
        this.disableOptionView3D('#range3d');
      }
    });
  }



  addScript() {
    const newScript = document.createElement('script');
    newScript.type = 'module';

    const url = M.config.MAPEA_URL+'plugins/stereoscopic/'

    // visor = '../'; // local
    // visor = 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/estereoscopico/plugins/stereoscopic/'; // en visor

    const inlineScript = document.createTextNode(` const TR3cfg = new Array();

    import * as THREE from '${url}TR3-pack/THREE/three.module.js';
    import { OrbitControls } from '${url}TR3-pack/THREE/OrbitControls.js';
    import { TransformControls } from '${url}TR3-pack/THREE/TransformControls.js';
    import { SkeletonUtils } from '${url}TR3-pack/THREE/SkeletonUtils.js';
    import { BufferGeometryUtils } from '${url}TR3-pack/THREE/BufferGeometryUtils.js';
    import { GLTFExporter } from '${url}TR3-pack/THREE/GLTFExporter.js';
    import { GLTFLoader } from '${url}TR3-pack/THREE/GLTFLoader.js';
    import { IFCLoader } from '${url}TR3-pack/THREE/IFCLoader.js';
    import { Sky } from '${url}TR3-pack/THREE/Sky.js';
    TR3cfg.THREE = THREE;
    TR3cfg.OrbitControls = OrbitControls;
    TR3cfg.TransformControls = TransformControls;
    TR3cfg.SkeletonUtils = SkeletonUtils;
    TR3cfg.BufferGeometryUtils = BufferGeometryUtils;
    TR3cfg.GLTFExporter = GLTFExporter;
    TR3cfg.GLTFLoader = GLTFLoader;
    TR3cfg.IFCLoader = IFCLoader;
    TR3cfg.Sky = Sky;

    TR3.setLoader('${url}TR3-pack/', TR3cfg);
    document.getElementById('tools').innerHTML = TR3.setPanel();

    const opts = {
        imgControl: ${this.orbitControls_},	//desvía los controles de manejo de escena a ina imagen externa
        cursor3d: false,		//visiviliza el cusrso 3D
        anaglyph: ${this.anaglyphActive_},		//Activa el modo Anaglifo
        autoRotate: false,	//Activa la rotación
        wireframeMesh: false, //Muestra la malla del terreno
        tentative: true, 	//Muestra los elelemtos interactivos realzando su tamaño
        cheapMode: false	//Activa el modo ahorro de rendimiento
    }

    TR3.setOpts(opts);

    $("#tools").dialog({ position: { my: "right top", at: "right top", of: window }, width: 215 });
    document.querySelector('.ui-icon-closethick').click();

    function setTR3(changeZoom = true) {
        const bbox = map.getMapImpl().getView().calculateExtent(map.getMapImpl().getSize());
        const code = map.getMapImpl().getView().getProjection().getCode();

        const desty = document.getElementById('TR3');
        // const ori = document.getElementsByTagName('CANVAS')[0]; // 1
        const ori = document.querySelector('.ol-layer canvas');

        const TR3pms = {
            ori: ori,
            desty: desty,
            bbox: bbox,
            projCode: code
        };

        TR3.setStart(TR3pms).then(function (obj) {
            TR3.scene.remove();
            changeZoom ? TR3.setMagniValues('auto') 
            : TR3.setMagniValues(document.querySelector('#range3d').value);
        });
    }

    let changeZoom = 0;
    map.getMapImpl().on('moveend', (e) => {
      if(changeZoom !== e.frameState.viewState.zoom) {
        changeZoom = e.frameState.viewState.zoom;
        if(window.toggle3D) {setTR3(true);}
        document.querySelector('#range3d').max = TR3.setMagniValues('auto') + 1;
        document.querySelector('#range3d').value = TR3.valuesSet.magnification;
      } else {
        if(window.toggle3D) {setTR3(false);}
      }

    });

        // https://openlayers.org/en/latest/examples/tile-load-events.html
    /**
     * Renders a progress bar.
     * @param {HTMLElement} el The target element.
     * @constructor
     */
    function Progress(el) {
        this.el = el;
        this.loading = 0;
        this.loaded = 0;
    }

    /**
     * Increment the count of loading tiles.
     */
    Progress.prototype.addLoading = function () {
        if (this.loading === 0) {
            this.show();
        }
        ++this.loading;
        this.update();
    };

    /**
     * Increment the count of loaded tiles.
     */
    Progress.prototype.addLoaded = function () {
        const this_ = this;
        setTimeout(function () {
            ++this_.loaded;
            this_.update();
        }, 100);
    };

    /**
     * Update the progress bar.
     */
    Progress.prototype.update = function () {
        const width = ((this.loaded / this.loading) * 100).toFixed(1) + '%';
        this.el.style.width = width;
        if (this.loading === this.loaded) {
            this.loading = 0;
            this.loaded = 0;
            const this_ = this;
            setTimeout(function () {
                this_.hide();
            }, 1700);
        }
    };

    /**
     * Show the progress bar.
     */
    Progress.prototype.show = function () {
        this.el.style.visibility = 'visible';
    };

    /**
     * Hide the progress bar.
     */
    Progress.prototype.hide = function () {
        if (this.loading === this.loaded) {
            this.el.style.visibility = 'hidden';
            this.el.style.width = 0;
        }
    };

    /**
     * Update the progress bar.
     */
    Progress.prototype.update = function () {
        const width = ((this.loaded / this.loading) * 100).toFixed(1) + '%';
        this.el.style.width = width;
        if (this.loading === this.loaded) {
            this.loading = 0;
            this.loaded = 0;
            const this_ = this;
            setTimeout(function () {
                setTR3();
            }, 1700);
        }
    };

    const progress = new Progress(document.getElementById('progress'));

    map.getLayers()[0].getImpl().getOL3Layer().getSource().on('tileloadstart', function () {
        progress.addLoading();
    });

    map.getLayers()[0].getImpl().getOL3Layer().getSource().on('tileloadend', function () {
        progress.addLoaded();
    });
    map.getLayers()[0].getImpl().getOL3Layer().getSource().on('tileloaderror', function () {
        progress.addLoaded();
    });
`);
    newScript.appendChild(inlineScript);
    document.body.appendChild(newScript);
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof StereoscopicControl;
  }

  // Add your own functions
}
