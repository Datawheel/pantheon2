# pantheon2
2.0 Update to the Pantheon Site

## Running locally
1. Install node dependencies
  ```
  > npm install
  ```

2. Make entry for pantheon-api in hosts file
  ```
  > nano /etc/hosts

  10.1.10.129     pantheon-api.local
  ```

3. Run site
  ```
  > npm run dev
  ```

## Running API locally
1. Install postgresql && postgrest via Homebrew
  ```
  # Ensure brew is up to date
  > brew update

  # Check for any problems with brew's setup
  > brew doctor

  # Install the postgrest package
  > brew install postgrest postgresql
  ```

2. Initialize the DB
  ```
  > createdb pantheon
  ```

3. Copy data to local DB
  ```
  > cat pantheon_db_dump_MM-DD-YYYY.sql | psql pantheon
  ```

4. Run postgrest and point to local copy of DB
```
> postgrest postgres://[username]:@localhost:5432/pantheon -a [username] --schema public -p 3100
```

## Import pantheon data from scratch

1. Initialize the DB
  ```
  > createdb pantheon
  ```

2. Create tables via DB schema file
  ```
  > psql pantheon < data/pantheon_schema.sql
  ```

3. Run data ETL process (warning: need the following python libs)
  ```
  > python data/import_to_db.py
  ```

4. Add dates of sovereignty
  ```
  > python data/import_soverign_dates_to_db.py
  ```

5. Run post data insert SQL commands
  ```
  > psql pantheon < data/post_insert_updates.sql
  ```

6. Import page creation data
  ```
  > python data/import_creation_to_db.py
  ```

7. Fix duplicate place & person name slugs
  ```
  > python data/fix_duplicate_slugs.py
  ```


## Downloading images

Currently the images folder is ~300mb so it doesn't make sense to host them here. I will put instructions on how to download them or maybe setup a CDN to host them soon.


### Caveats

#### FOUC (Flash of Unstyled Content)
To make the hot reloading of CSS work, we are not extracting CSS in development. Ideally, during server rendering, we will be extracting CSS, and we will get a .css file, and we can use it in the html template. That's what we are doing in production.

In development, after all scripts get loaded, react loads the CSS as BLOBs. That's why there is a second of FOUC in development.

#### Client and Server Markup Mismatch
This warning is visible only on development and totally harmless. This occurs to hash difference in `react-router`. To solve it, react router docs asks you to use `match` function. If we use `match`, `react-hot-reloader` stops working.
