import { map as Mmap } from 'M/mapea';
import { generic_001, generic_002 } from '../layers/generic/generic';
import WMS from 'M/layer/WMS';


const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
  controls: ['scale', 'getfeatureinfo'],
});

// mapa.addLayers([generic_001]);
mapa.addLayers([generic_002]);


window.mapa = mapa;
