import { map as Mmap } from 'M/idee';

const mapjs = Mmap({
  container: 'map',
  controls: ['scale*1'],
});
window.mapjs = mapjs;
