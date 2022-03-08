package es.cnig.mapea.database.persistence.repository;

import java.util.List;
import java.util.Map;

import es.cnig.mapea.database.persistence.domain.Columna;
import es.cnig.mapea.database.persistence.domain.DatosTabla;
import es.cnig.mapea.database.persistence.domain.Tabla;
import es.cnig.mapea.database.utils.CustomPagination;

public interface DatabaseRepository {

	public List<Tabla> getGeomTables(CustomPagination paginacion);
	
	public List<Columna> getTableColumns(String schema, String table, CustomPagination paginacion);
	
	public List<DatosTabla> getFilteredData(String schema, String table, Map<String, List<String>> filtros, CustomPagination paginacion);
}
