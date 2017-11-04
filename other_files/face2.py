import numpy as np 
import cv2
import argparse
import imgutils
from urllib.request import urlopen

url = "http://192.168.0.35:8080/shot.jpg"

ap = argparse.ArgumentParser()
ap.add_argument("-i",
    help="capture video from ip webcam")
ap.add_argument('-b',
    help='detects body')
ap.add_argument('-v',
    help='detect from video')
args = vars(ap.parse_args())

def getIpImage(url_):
    imgResp = None
    with urlopen(url_) as _url:
        imgResp = _url.read()
    imgNp = np.array(bytearray(imgResp), dtype=np.uint8)
    return cv2.imdecode(imgNp, -1)

face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
body_cascade = cv2.CascadeClassifier('haarcascade_fullbody.xml')
main_cascade = face_cascade


captIp = False
path = 0
if args.get('b'):
    main_cascade = body_cascade
if args.get('i'):
    captIp = True
if args.get('v'):
    path = args.get('v')

capture = cv2.VideoCapture(path)
i = 0
frame_count = 2
while(capture.isOpened()):
    frames = []
    faces = []
    ret = False
    
    if captIp==False:
        for c in range(frame_count):
            ret, frame = capture.read()
            #cv2.flip(frame, 1)
            imutils.resize(frame, width=800)
            frames.append(frame)
    else:
        for c in range(frame_count):
            frames.append(getIpImage(url))
        ret = True
    for el in frames:
        gray =  cv2.cvtColor(el, cv2.COLOR_BGR2GRAY)
        faces.append( main_cascade.detectMultiScale(gray, 1.3, 5))
    verifed = True
    for c in range(len(faces)-1):
        if len(faces[c])!=len(faces[c+1]):
            verifed = False
    if verifed==False:
        for (x,y,w,h) in faces[len(faces)-1]:
            cv2.rectangle(frames[len(frames)-1], (x,y), (x+w, y+h), (225,0,0), 2)
            if i>100:
                i = 0
            cv2.imwrite('collection/capt{0}.jpg'.format(i), frames[len(frames)-1])
            i+=1
    else:
        for j in range(len(faces)-1):
            for(x,y,w,h) in faces[j+1]:
                min_del = 200
                for(x1,y1,w1,h1) in faces[j]:
                    num = abs((x+y+w+h)-(x1+y1+w1+h1))
                    if num < min_del:
                        min_del = num
                cv2.rectangle(frames[len(frames)-1], (x,y), (x+w, y+h), (255, 0,0), 2)
                cv2.putText(frames[len(frames)-1],str(min_del),(x-20, y-30), cv2.FONT_HERSHEY_COMPLEX, 1,(255,255,255), 1)
                if i>100:
                    i = 0
                cv2.imwrite('collection/capt{0}.jpg'.format(i), frames[len(frames)-1])
                i+=1

    cv2.imshow('frame', frames[len(frames)-1])
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break;
    if cv2.waitKey(1) & 0xFF == ord('s'):
        cv2.imwrite('ss.jpg', gray)

capture.release()