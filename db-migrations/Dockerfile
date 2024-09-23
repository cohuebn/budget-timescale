FROM flyway/flyway:10.11.1

WORKDIR /migrations/

COPY . .

ENTRYPOINT [ "flyway" ]
CMD ["-configFiles=flyway.config.toml", "migrate"]
