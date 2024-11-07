# M.plugin.PredefinedZoom


Centra el mapa en la/s vista/s indicada/s por parámetro.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **predefinedzoom.ol.min.js**
- **predefinedzoom.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/predefinedzoom/predefinedzoom.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/predefinedzoom/predefinedzoom.ol.min.js"></script>
```

# Uso del histórico de versiones

Existe un histórico de versiones de todos los plugins de API-CNIG en [api-idee-legacy](https://github.com/IGN-CNIG/API-CNIG/tree/master/api-idee-legacy/plugins) para hacer uso de versiones anteriores.
Ejemplo:
```html
 <link href="https://componentes.cnig.es/api-core/plugins/predefinedzoom/predefinedzoom-1.0.0.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/predefinedzoom/predefinedzoom-1.0.0.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **savedZooms**: Indica los zooms deseados en los que se podrá centrar el mapa. Por defecto, hay un solo zoom a España. Para añadir un zoom adicional se seguirá el siguiente formato:

```javascript
    savedZooms: [{
        name: 'Zoom a la extensión del mapa',
        bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
      },
      {
        name: 'Nuevo zoom',
        bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
      },
    ],
```

# Ejemplos de uso

```javascript
const mp = new M.plugin.PredefinedZoom();

map.addPlugin(mp);
```

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.PredefinedZoom({
        position: 'TL',
        savedZooms: [{
            name: 'Zoom a la extensión del mapa',
            bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
          },
        ],
      });

   map.addPlugin(mp);
```
