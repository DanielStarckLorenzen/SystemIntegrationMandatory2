# Database Documentation with SchemaSpy

## Introduction
SchemaSpy is an open-source database documentation tool that automatically generates HTML documentation for your database including tables, columns, relationships, and entity-relationship diagrams.

## Installation

1. Install Java (SchemaSpy requires Java 8 or higher):
   ```
   # For Debian/Ubuntu
   sudo apt install default-jre
   
   # For macOS using Homebrew
   brew install java
   ```

2. Download SchemaSpy JAR file:
   ```
   wget https://github.com/schemaspy/schemaspy/releases/download/v6.1.0/schemaspy-6.1.0.jar
   ```

3. Download the appropriate JDBC driver for your database:
   - For MySQL: https://dev.mysql.com/downloads/connector/j/
   - For PostgreSQL: https://jdbc.postgresql.org/download/
   - For SQL Server: https://docs.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server
   - For Oracle: https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html

## Usage

Basic command structure:
```
java -jar schemaspy-6.1.0.jar -t [database-type] -dp [path-to-driver] -db [database-name] -s [schema] -u [username] -p [password] -host [hostname] -port [port] -o [output-directory]
```

### Example for PostgreSQL

```
java -jar schemaspy-6.1.0.jar -t pgsql -dp postgresql-42.2.23.jar -db mydb -s public -u postgres -p password -host localhost -port 5432 -o output
```

### Example for MySQL

```
java -jar schemaspy-6.1.0.jar -t mysql -dp mysql-connector-java-8.0.27.jar -db mydb -u root -p password -host localhost -port 3306 -o output
```

## Viewing Documentation

Once SchemaSpy has completed, open the `index.html` file in the output directory to view the documentation:

```
cd output
open index.html  # On macOS
# OR
xdg-open index.html  # On Linux
# OR 
start index.html  # On Windows
```

## Features

SchemaSpy generates:
- Tables listing with details of columns, indexes, and constraints
- Foreign key relationships
- Entity-relationship diagrams
- Table dependencies
- Column data type distributions

## Integrating with CI/CD

SchemaSpy can be integrated into CI/CD pipelines to generate up-to-date documentation with each database change:

```yaml
# Example GitHub Actions workflow
name: Generate DB Docs
on:
  push:
    branches: [main]
jobs:
  document:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK
        uses: actions/setup-java@v1
        with:
          java-version: '11'
      - name: Generate docs
        run: |
          wget https://github.com/schemaspy/schemaspy/releases/download/v6.1.0/schemaspy-6.1.0.jar
          wget https://jdbc.postgresql.org/download/postgresql-42.2.23.jar
          java -jar schemaspy-6.1.0.jar -t pgsql -dp postgresql-42.2.23.jar -db ${{ secrets.DB_NAME }} -s public -u ${{ secrets.DB_USER }} -p ${{ secrets.DB_PASS }} -host ${{ secrets.DB_HOST }} -o docs
      - name: Deploy docs
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Alternative Tools

If SchemaSpy doesn't meet your needs, consider these alternatives:
- [dbdiagram.io](https://dbdiagram.io) - Online tool for creating database diagrams
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - For MySQL databases
- [pgAdmin](https://www.pgadmin.org/) - For PostgreSQL databases
- [DBeaver](https://dbeaver.io/) - Universal database tool with documentation features 