import { map as Mmap } from 'M/idee';

const mapa = Mmap({
  container: 'map',
});

window.mapa = mapa;
mapa.addLayers('QUICK*BTN_Completa_MapLibre');
