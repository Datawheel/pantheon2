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


declare -a URLS=($URL1 $URL2 $URL3)

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
