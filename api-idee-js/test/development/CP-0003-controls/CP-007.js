import { map as Mmap } from 'M/idee';

const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['location*false*true'],
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
});
