import httplib2, urllib, sys, os
from apiclient import discovery
from PIL import Image as pillow
from ingestion.db_connection import get_conn
from libs.google import get_credentials
import libs.flickr as flickr

conn = get_conn()
cursor = conn.cursor()
FLICKR_DIR = "./scrapedFlickrIMGs"

def get_spreadsheet_data(attr_type):
    """Shows basic usage of the Sheets API.

    Creates a Sheets API service object and prints the names and majors of
    students in a sample spreadsheet:
    https://docs.google.com/spreadsheets/d/138W7Myt2sX1jDeER4JL1yDFFbDsUqt_NwnzMlMOvars/edit#gid=823925542
    """
    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    discoveryUrl = ('https://sheets.googleapis.com/$discovery/rest?' 'version=v4')
    service = discovery.build('sheets', 'v4', http=http, discoveryServiceUrl=discoveryUrl)

    spreadsheetId = '138W7Myt2sX1jDeER4JL1yDFFbDsUqt_NwnzMlMOvars'
    if attr_type == "place":
        rangeName = 'Place!A2:J'
    elif attr_type == "occupation":
        rangeName = 'Occupation!A2:J'
    elif attr_type == "person":
        rangeName = 'Person!A2:G'
        (id_col, name_col, data_cols) = 0, 1, [6,]
    result = service.spreadsheets().values().get(spreadsheetId=spreadsheetId, range=rangeName).execute()
    return {
        "rows": result.get('values', []),
        "id_col": id_col,
        "name_col": name_col,
        "data_cols": data_cols
    }

def download_img(id, flickr_url):
    imgdir = os.path.join(FLICKR_DIR, attr_type)
    if not os.path.exists(imgdir):
        os.makedirs(imgdir)
    pid = flickr_url.split("/")[-1]
    photo = flickr.Photo(pid)
    try:
        photo._load_properties()
    except:
        removedImages.append(uid)
        print "Can't find image with this URL: {}".format(flickr_url)
        return
    image = {"id": id, "url": flickr_url, "license": photo._Photo__license}
    # Check license
    if image["license"] in ("0",):
        print "Bad image license, can't use."
        return
    # Check size is big enough
    max_side = 1024
    sizes = [p for p in photo.getSizes() if p["width"] >= max_side]
    if len(sizes) == 0:
        print "Bad image size, too small."
        return
    download_url = min(sizes, key=lambda item: item["width"])["source"]
    imgpath = os.path.join(imgdir, "{}.jpg".format(id))
    urllib.urlretrieve(download_url, imgpath)
    img = pillow.open(imgpath).convert("RGB")
    img.thumbnail((max_side, max_side), pillow.ANTIALIAS)
    quality = 90
    img.save(imgpath, "JPEG", quality=quality)

def add_img_to_db(attr_type, id, flickr_url, flickr_author):
    query = 'UPDATE {} SET img_link=%s, img_author=%s WHERE id=%s;'.format(attr_type)
    data = (flickr_url, flickr_author, id)
    cursor.execute(query, data)
    conn.commit()

def add_youtube_to_db(id, youtube_id):
    query = 'UPDATE person SET youtube=%s WHERE id=%s;'
    data = (youtube_id, id)
    cursor.execute(query, data)
    conn.commit()

def main(attr_type):
    spreadsheet_data = get_spreadsheet_data(attr_type)
    if not spreadsheet_data["rows"]: sys.exit('No data found.')

    # print('ID, Name, img_link, img_author')
    for row in spreadsheet_data["rows"]:
        data = []
        for i in spreadsheet_data["data_cols"]:
            try:
                data.append(row[i])
            except IndexError:
                continue
        if not data: continue
        (id, name) = (row[spreadsheet_data["id_col"]], row[spreadsheet_data["name_col"]])
        print '%s, %s, %s' % (id, name, ",".join(data))
        if attr_type == "person":
            add_youtube_to_db(id, data[0])
        else:
            download_img(id, flickr_url)
            add_img_to_db(attr_type, id, flickr_url, flickr_author)


if __name__ == '__main__':
    attr_types = ["place", "occupation", "person"]
    if len(sys.argv) < 2:
        print "------------------------------------------"
        print "ERROR: Script requires 1 argument, an attribute type [place, occupation, person]."
        print "Example: python grab_attr_meta.py place"
        print "------------------------------------------"
        sys.exit()
    attr_type = sys.argv[1]
    if attr_type not in attr_types:
        print "------------------------------------------"
        print "ERROR: Invalid attribute type."
        print "Allowed keys: {}".format(", ".join(attr_types))
        print "------------------------------------------"
        sys.exit()
    main(attr_type)
