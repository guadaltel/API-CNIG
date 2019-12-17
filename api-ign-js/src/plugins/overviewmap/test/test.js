import OverviewMap from 'facade/overviewmap';

const map = M.map({
  center: [-467062.8225, 4783459.6216],
  container: 'mapjs',
  layers: ['WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico?*PNOA2017*false*true'],
  zoom: 5,
});


const mp = new OverviewMap({
  position: 'BR',
  fixed: true,
  zoom: 4,
  baseLayer: 'WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true',
  //baseLayer: 'WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico?*PNOA2017*true*true',
}, {
  collapsed: true,
  collapsible: true,
});

map.addPlugin(mp);

window.map = map;
