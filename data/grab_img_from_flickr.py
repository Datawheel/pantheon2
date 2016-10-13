import csv, flickr, os, sys, urllib
from db_connection import cursor
from PIL import Image as pillow

FLICKR_DIR = "./scapedFlickrIMGs"
attrs = ("place",)

def read_csv():

    max_side = 1600
    thumb_side = 425
    feat_side = 850
    quality = 90

    if len(sys.argv) < 3:
        print "------------------------------------------"
        print "ERROR: Script requires 2 variables, an attribute type and a filename."
        print "Example: python grab.py cip file.csv"
        print "------------------------------------------"
        return

    attr_type = sys.argv[1]
    if attr_type not in attrs:
        print "------------------------------------------"
        print "ERROR: Invalid attribute type."
        print "Allowed keys: {}".format(", ".join(attrs))
        print "------------------------------------------"
        return

    input_file = csv.DictReader(open(sys.argv[2]))
    imgdir = os.path.join(FLICKR_DIR, attr_type)
    badImages = []
    smallImages = []
    goodImages = []
    removedImages = []

    if not os.path.exists(imgdir):
        os.makedirs(imgdir)

    for row in input_file:
        print row["name"]
        uid = row["id"]

        # Check if there even is an image in this row...
        if "image_link" not in row: continue
        if not row["image_link"]: continue

        # Next check if it's already in the DB
        q = 'SELECT id from {} where id=%s AND img_link IS NOT NULL;'.format(attr_type)
        cursor.execute(q, (uid,))
        if cursor.fetchone(): continue

        # OK, we have a link and it's not in the DB... carry on
        image = row["image_link"]
        pid = image.split("/")[-1]
        photo = flickr.Photo(pid)
        try:
            photo._load_properties()
        except:
            removedImages.append(uid)
            continue

        image = {"id": uid, "url": image, "license": photo._Photo__license, "meta":row["image_meta"]}

        if image["license"] in ("0",):
            badImages.append(image)
            continue

        sizes = [p for p in photo.getSizes() if p["width"] >= max_side]
        if len(sizes) == 0:
            smallImages.append(image)
            continue

        download_url = min(sizes, key=lambda item: item["width"])["source"]
        imgpath = os.path.join(imgdir, "{}.jpg".format(uid))
        urllib.urlretrieve(download_url, imgpath)
        img = pillow.open(imgpath).convert("RGB")
        img.thumbnail((max_side, max_side), pillow.ANTIALIAS)
        img.save(imgpath, "JPEG", quality=quality)

        author = photo._Photo__owner
        author = author.realname if author.realname else author.username
        image["author"] = author.replace("'", "\\'")
        goodImages.append(image)

        # update DB
        query = 'UPDATE {} SET img_link=%s, img_author=%s WHERE id=%s;'.format(attr_type)
        data = (image["url"], image["author"], uid)

        cursor.execute(query, data)
        conn.commit()


    print "{} new images have been processed.".format(len(goodImages))
    if badImages:
        print "The following images have bad licenses: {}".format(", ".join([i["id"] for i in badImages]))
    if smallImages:
        print "The following images are too small: {}".format(", ".join([i["id"] for i in smallImages]))


if __name__ == '__main__':
    read_csv()
