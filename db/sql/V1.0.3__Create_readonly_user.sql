do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = '${dbReadonlyUser}') then
    create role ${dbReadonlyUser};
  end if;
  alter role ${dbReadonlyUser} with password '${dbReadonlyPassword}' login;
end$$;

grant readonly to ${dbReadonlyUser}
