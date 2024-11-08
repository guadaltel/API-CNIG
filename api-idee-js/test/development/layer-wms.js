import { map as Mmap } from 'M/idee';
import WMS from 'M/layer/WMS';

const mapjs = Mmap({
  container: 'map',
});
const layerUA = new WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});
window.mapjs = mapjs;
mapjs.addWMS(layerUA);
