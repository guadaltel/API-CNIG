import { map as Mmap } from 'M/idee';

Mmap({
  container: 'map',
  layers: [
    'WMS*Capa wms1*http://www.ideandalucia.es/wms/mta400r_2008?*MTA400*false',
    'WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas*true',
  ],
  controls: ['layerSwitcher'],
  projection: 'EPSG:4326',
});
