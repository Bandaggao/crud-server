

# Installation

### Install the dependencies

In the project directory, run:

```bash
npm install
```

### Start Api in development environment

```bash
npm start
```

### Start Api in production environment

```
npm prod
```

### Migration Create

```
db-migrate create seed --config _Database/config/dev.json
```

### Migration Up

```
db-migrate up --config _Database/config/dev.json
```

### Migration Down

```
db-migrate down --config _Database/config/dev.json
```