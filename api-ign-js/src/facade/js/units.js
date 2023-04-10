/**
 * @module M/units
 */
/**
 * 0.02540005080010160020 (Un valor predeterminado sensato)
 * @const {Number}
 */
const METERS_PER_INCH = 0.02540005080010160020;

/**
 * 72 (Un valor predeterminado sensato)
 * @const {Number}
 * @api
 */
export const DOTS_PER_INCH = 72;

/**
 * Pulgadas constantes por unidad -- tomado de MapServer mapscale.c
 * derivación de millas náuticas de http://en.wikipedia.org/wiki/Nautical_mile
 * Incluye el conjunto completo de unidades compatibles con CS-MAP (http://trac.osgeo.org/csmap/)
 * y PROJ.4 (http://trac.osgeo.org/proj/)
 * La tabla codificada se mantiene en un módulo de código fuente CS-MAP llamado CSdataU.c
 * La tabla codificada de unidades PROJ.4 está en pj_units.c.
 * @const {Object}
 * @api
 */
export const INCHES_PER_UNIT = {
  inches: 1.0,
  in: 1.0,
  Inch: 1.0,
  ft: 12.0,
  mi: 63360.0,
  m: 39.3701,
  dd: 4374754,
  yd: 36,
  d: 4374754,
  degrees: 4374754,
  nmi: 1852 * 39.3701,
  Meter: 1.0 / METERS_PER_INCH, // EPSG:9001
  Foot: 0.30480060960121920243 / METERS_PER_INCH, // EPSG:9003
  IFoot: 0.30480000000000000000 / METERS_PER_INCH, // EPSG:9002
  ClarkeFoot: 0.3047972651151 / METERS_PER_INCH, // EPSG:9005
  SearsFoot: 0.30479947153867624624 / METERS_PER_INCH, // EPSG:9041
  GoldCoastFoot: 0.30479971018150881758 / METERS_PER_INCH, // EPSG:9094
  IInch: 0.02540000000000000000 / METERS_PER_INCH,
  MicroInch: 0.00002540000000000000 / METERS_PER_INCH,
  Mil: 0.00000002540000000000 / METERS_PER_INCH,
  Centimeter: 0.01000000000000000000 / METERS_PER_INCH,
  Kilometer: 1000.00000000000000000000 / METERS_PER_INCH, // EPSG:9036
  Yard: 0.91440182880365760731 / METERS_PER_INCH,
  SearsYard: 0.914398414616029 / METERS_PER_INCH, // EPSG:9040
  IndianYard: 0.91439853074444079983 / METERS_PER_INCH, // EPSG:9084
  IndianYd37: 0.91439523 / METERS_PER_INCH, // EPSG:9085
  IndianYd62: 0.9143988 / METERS_PER_INCH, // EPSG:9086
  IndianYd75: 0.9143985 / METERS_PER_INCH, // EPSG:9087
  IndianFoot: 0.30479951 / METERS_PER_INCH, // EPSG:9080
  IndianFt37: 0.30479841 / METERS_PER_INCH, // EPSG:9081
  IndianFt62: 0.3047996 / METERS_PER_INCH, // EPSG:9082
  IndianFt75: 0.3047995 / METERS_PER_INCH, // EPSG:9083
  Mile: 1609.34721869443738887477 / METERS_PER_INCH,
  IYard: 0.91440000000000000000 / METERS_PER_INCH, // EPSG:9096
  IMile: 1609.34400000000000000000 / METERS_PER_INCH, // EPSG:9093
  NautM: 1852.00000000000000000000 / METERS_PER_INCH, // EPSG:9030
  'Lat-66': 110943.316488932731 / METERS_PER_INCH,
  'Lat-83': 110946.25736872234125 / METERS_PER_INCH,
  Decimeter: 0.10000000000000000000 / METERS_PER_INCH,
  Millimeter: 0.00100000000000000000 / METERS_PER_INCH,
  Dekameter: 10.00000000000000000000 / METERS_PER_INCH,
  Decameter: 10.00000000000000000000 / METERS_PER_INCH,
  Hectometer: 100.00000000000000000000 / METERS_PER_INCH,
  GermanMeter: 1.0000135965 / METERS_PER_INCH, // EPSG:9031
  CaGrid: 0.999738 / METERS_PER_INCH,
  ClarkeChain: 20.1166194976 / METERS_PER_INCH, // EPSG:9038
  GunterChain: 20.11684023368047 / METERS_PER_INCH, // EPSG:9033
  BenoitChain: 20.116782494375872 / METERS_PER_INCH, // EPSG:9062
  SearsChain: 20.11676512155 / METERS_PER_INCH, // EPSG:9042
  ClarkeLink: 0.201166194976 / METERS_PER_INCH, // EPSG:9039
  GunterLink: 0.2011684023368047 / METERS_PER_INCH, // EPSG:9034
  BenoitLink: 0.20116782494375872 / METERS_PER_INCH, // EPSG:9063
  SearsLink: 0.2011676512155 / METERS_PER_INCH, // EPSG:9043
  Rod: 5.02921005842012 / METERS_PER_INCH,
  IntnlChain: 20.1168 / METERS_PER_INCH, // EPSG:9097
  IntnlLink: 0.201168 / METERS_PER_INCH, // EPSG:9098
  Perch: 5.02921005842012 / METERS_PER_INCH,
  Pole: 5.02921005842012 / METERS_PER_INCH,
  Furlong: 201.1684023368046 / METERS_PER_INCH,
  Rood: 3.778266898 / METERS_PER_INCH,
  CapeFoot: 0.3047972615 / METERS_PER_INCH,
  Brealey: 375.00000000000000000000 / METERS_PER_INCH,
  ModAmFt: 0.304812252984505969011938 / METERS_PER_INCH,
  Fathom: 1.8288 / METERS_PER_INCH,
  'NautM-UK': 1853.184 / METERS_PER_INCH,
  '50kilometers': 50000.0 / METERS_PER_INCH,
  '150kilometers': 150000.0 / METERS_PER_INCH,
  mm: (1.0 / METERS_PER_INCH) / 1000.0,
  cm: (1.0 / METERS_PER_INCH) / 100.0,
  dm: (1.0 / METERS_PER_INCH) * 100.0,
  km: (1.0 / METERS_PER_INCH) * 1000.0,
  kmi: 1852 * 39.3701, // International Nautical Mile
  fath: 1.8288 / METERS_PER_INCH, // International Fathom
  ch: 20.1168 / METERS_PER_INCH, // International Chain
  link: 0.201168 / METERS_PER_INCH, // International Link
  'us-in': 1.0, // U.S. Surveyor's Inch
  'us-ft': 0.30480060960121920243 / METERS_PER_INCH, // U.S. Surveyor's Foot
  'us-yd': 0.91440182880365760731 / METERS_PER_INCH, // U.S. Surveyor's Yard
  'us-ch': 20.11684023368047 / METERS_PER_INCH, // U.S. Surveyor's Chain
  'us-mi': 1609.34721869443738887477 / METERS_PER_INCH, // U.S. Surveyor's Statute Mile
  'ind-yd': 0.91439523 / METERS_PER_INCH, // Indian Yard
  'ind-ft': 0.30479841 / METERS_PER_INCH, // Indian Foot
  'ind-ch': 20.11669506 / METERS_PER_INCH, // Indian Chain,
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
