if [ -z "$1" ]
  then
    echo "Must supply profile type and id eg person,David_Prowse"
    exit 1
fi

if [[ "$EUID" = 0 ]]; then
    echo "(1) already root"
else
    sudo -k # make sure to ask for password on next sudo
    if sudo true; then
        echo "(2) correct password"
    else
        echo "(3) wrong password"
        exit 1
    fi
fi

nxcacheof () {
  local url=$(echo -n "$1" | md5sum)
  echo "/home/deploy/cache/pantheon/${url:31:1}/${url:29:2}/${url:0:32}"
}

ARGS=$1
PROFILE_TYPE=$(echo $ARGS | cut -f1 -d',')
SLUG=$(echo $ARGS | cut -f2 -d',')

URL1="/person?slug=eq.$SLUG&select=occupation(*),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),*";
URL2="/person_ranks?slug=eq.$SLUG";
URL3="/profile/person/$SLUG"
URL4="/profile/person/$SLUG/"
URL5="/api/screenshot/person/$SLUG/"



declare -a URLS=($URL1 $URL2 $URL3 $URL4 $URL5)

for url in "${URLS[@]}"
do
   echo "$url"
   file_path="$(nxcacheof $url)"
   echo "$file_path"
   if [ "$2" == "DELETE" ]
      then
        echo "Deleting..."
        sudo rm $file_path
    fi
done

echo ""
echo "Deleting screenshot..."
rm /home/deploy/pantheon-site/static/images/screenshots/person/$SLUG.jpg
echo ""

if [[ -z "${CFLARE_EMAIL}" ]]; then
    echo "Must set CFLARE_EMAIL env var to clear cloudflare cache"
    exit 1
else
    if [[ -z "${CFLARE_KEY}" ]]; then
        echo "Must set CFLARE_KEY env var to clear cloudflare cache"
        exit 1
    else
        curl -X POST "https://api.cloudflare.com/client/v4/zones/27fdf411163aa475b413e1f8b8f8ac2c/purge_cache" \
            -H "X-Auth-Email: ${CFLARE_EMAIL}" \
            -H "X-Auth-Key: ${CFLARE_KEY}" \
            -H "Content-Type: application/json" \
            --data "{\"files\":[\"https://pantheon.world/person?slug=eq.$SLUG&select=occupation(*),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),*\",\"https://pantheon.world/profile/person/$SLUG\",\"https://pantheon.world/profile/person/$SLUG/\",\"https://pantheon.world/api/screenshot/person/$SLUG/\",\"https://pantheon.world/images/screenshots/person/$SLUG.jpg\"]}";

    fi
fi
