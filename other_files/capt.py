import numpy as np 
import sys
import cv2
from urllib.request import urlopen

print(cv2.__version__)
print()

def getIpImage(url_):
    imgResp = None
    with urlopen(url_) as _url:
        imgResp = _url.read()
    imgNp = np.array(bytearray(imgResp), dtype=np.uint8)
    return cv2.imdecode(imgNp, -1)

capture = cv2.VideoCapture(0)
url = "http://192.168.0.35:8080/shot.jpg"
isGray = False
captOnce = False
captWeb = False
try:
    if sys.argv[1]=="once":
        captOnce = True
    elif sys.argv[1]=="ip":
        captWeb = True
except:
    pass
if captOnce:
    ret, frame = capture.read()
    print('Camera picture saved at ss.jpg')
    cv2.imwrite('ss.jpg', frame)
elif captWeb:
    while True:
        cv2.imshow('frame', getIpImage(url))
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break;
        if cv2.waitKey(1) & 0xFF == ord('s'):
            cv2.imwrite('ss.jpg', gray)
else:
    while True:
        ret, frame = capture.read()
        gray = frame
        if isGray:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) 

        cv2.imshow('frame', gray)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break;
        if cv2.waitKey(1) & 0xFF == ord('s'):
            cv2.imwrite('ss.jpg', gray)

capture.release()
#image = cv2.imread('book.jpg', 0)
#cv2.imshow('image', image)
#cv2.waitKey(0)
cv2.destroyAllWindows()