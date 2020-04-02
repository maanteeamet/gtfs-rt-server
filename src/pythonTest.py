import requests

def send_to_mnt():
    filename = 'VehiclePositions.pb'
    file = open("../" + filename, "r")
    print('saadan')
    url='https://api.dev.peatus.ee/gtfs/upload/' + filename
    r = requests.post(url, file)
    print(r.text)
    print('saadetud')
    return

send_to_mnt()