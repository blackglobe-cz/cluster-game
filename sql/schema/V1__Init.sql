CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

create table "characters"
(
    id                  uuid primary key         default gen_random_uuid(),
    name                varchar(50)              not null,
    level               integer                  default 1,
    gender              varchar(20)              not null,
    external_account_id varchar(100)             not null,
    created_at          timestamp with time zone default now(),
    updated_at          timestamp with time zone null,
    deleted_at          timestamp with time zone null
);