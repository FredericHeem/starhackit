select
  distinct on (view_schema, view_name, column_name)
  view_schema,
  view_name,
  column_name,
  column_default,
  is_nullable,
  is_updatable,
  is_trigger_updatable,
  is_insertable_into,
  is_trigger_insertable_into,
  is_trigger_deletable,
  data_type,
  ordinal_position,
  col_description((view_schema || '.' || view_name)::regclass, ordinal_position),
  obj_description((view_schema || '.' || view_name)::regclass, 'pg_class'),
  constraint_name,
  constraint_type,
  unique_constraint_name,
  position_in_unique_constraint

from information_schema.columns
natural full join information_schema.views
natural full join information_schema.constraint_column_usage
natural full join information_schema.key_column_usage
natural full join information_schema.view_column_usage
natural full join information_schema.view_table_usage
natural full join information_schema.table_constraints
natural full join information_schema.referential_constraints

where view_schema not in ('information_schema', 'pg_catalog')
and column_name is not null
order by view_name
