
# KLJ Stekene Backend

De backend voor een applicatie van KLJ Stekene voor het beheren van bestuursleden en zijn taken.

## Backend starten
Maak een ".env" bestand aan in de root folder van het project:
```text
NODE_ENV=development
```
Ook moet een ".env.development" toegevoegd worden aan dit project met dezelfde waarden als ".env":
```text
NODE_ENV=development
```
Wanneer het nodig is dit project LOKAAL te draaien als productie, dan moet ter vervanging van de Heroku variabelen een ".env.production" aangemaakt worden:
```text
NODE_ENV=production
DATABASE_HOST=[HOST]
DATABASE_NAME=[DBNAME]
DATABASE_USERNAME=[USERNAME]
DATABASE_PASSWORD=[PASSWORD]
JWT_SECRET=[JWT]
```


Voer het volgende in, in de terminal, om te starten als development:
```bash
yarn install
yarn start
```
of:
```bash
yarn install
yarn start:development
```
En voor de productie:
```bash
yarn install
yarn start:production
```
    
## Login gegevens voor alle bestuursleden
mail: voornaam.achternaam@kljstekene.be \
wachtwoord: 12345678
