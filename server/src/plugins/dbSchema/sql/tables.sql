select
  table_schema,
  table_name,
  obj_description((table_schema || '.' || table_name)::regclass, 'pg_class')

from information_schema.tables
where table_schema = ?
order by table_schema, table_name
