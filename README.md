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
1. Install postgrest via Homebrew

```
# Ensure brew is up to date
> brew update

# Check for any problems with brew's setup
> brew doctor

# Install the postgrest package
> brew install postgrest
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


## Downloading images

Currently the images folder is ~300mb so it doesn't make sense to host them here. I will put instructions on how to download them or maybe setup a CDN to host them soon.
