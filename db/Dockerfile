FROM postgres

ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB reviews

COPY init.sql /docker-entrypoint-initdb.d/

VOLUME /var/lib/postgresql/data