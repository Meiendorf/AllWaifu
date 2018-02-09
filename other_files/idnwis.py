import numpy as np
import cv2
import imutils
import argparse
import time
from imutils.object_detection import non_max_suppression

def reinit_tracker(frame, hog, cascade, _type="hog"):
    tracker = cv2.MultiTracker_create()
    if _type == "hog":
        (rects, weights) = hog.detectMultiScale(frame, winStride=(3,3), padding=(8,8), scale=1.03)
    elif _type == "haar":
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rects = cascade.detectMultiScale(frame, 1.1, 6, minSize=(MIN_SIZE,MIN_SIZE), maxSize=(MAX_SIZE,MAX_SIZE))
    #rects = np.array([(x, y, x + w, y + h) for(x,y,w,h) in rects])
    #rects = non_max_suppression(rects, probs=None, overlapThresh=0.65)
    for rect in rects:
        print(tuple(rect))
        tracker.add(cv2.TrackerKCF_create(), frame, tuple(rect))

    return tracker

def distance_to_camera(knownWidth, focalLength, perWidth):
    # compute and return the distance from the maker to the camera
    return (knownWidth * focalLength) / perWidth

args = argparse.ArgumentParser(description=
    "Детектирование и отслеживание пешеходов.")

args.add_argument("-v", "--video", type=str, required=True, help=
    "Путь к видео")
args.add_argument("-s", "--speed", type=int, default=5, help=
    "Максимальная допустимая скорость движения")
args.add_argument("-d", "--detector", type=str, default="haar", help=
    'Метод детектрования("hog or haar").')
args.add_argument("-w", "--width", type=int, default=800, help=
    "Максимальная ширина видео.")
args.add_argument("-ms", "--minsize", type=int, default=60, help=
    "Минимальные размеры объекта.")
args.add_argument("-mx", "--maxsize", type=int, default=190, help=
    "Максимальные размеры объекта.")
args.add_argument("-m", "--mlseconds", type=int, default=0, help=
    "Сколько нужно перемотать в миллисекундах.")
args.add_argument("-n", "--number", type=int, default=20, help=
    "Частота применения детекции для обновления трекера.")
arg = vars(args.parse_args())



body_cascade = cv2.CascadeClassifier('haarcascade_fullbody.xml')
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
tracker = cv2.MultiTracker_create()
fgbg = cv2.createBackgroundSubtractorMOG2()

HOG_VERIF_TRESH = arg['number']
MAX_DISTANCE = arg['speed']
MIN_SIZE = arg['minsize']
MAX_SIZE = arg['maxsize']
KNOWN_WIDTH = 11.0
KNOWN_DISTANCE = 24.0
METHOD = "haar"
if arg['detector'] == 'hog':
    METHOD = "hog"
FILE_NAME = arg['video']

width = arg['width']
focalLength = 0
capture = cv2.VideoCapture(FILE_NAME)
capture.set(cv2.CAP_PROP_POS_MSEC, arg['mlseconds'])
needHogVerif = 0

speedBoxes = []
allBoxes = []
isNew = True
#idnwis -v pet.mp4 -w 700 -n 15 -d haar -m 38000 -ms 40 -mx 190 -s 5
#Run with these params
while True:
    nBox = 0
    ok, frame = capture.read()
    frame = imutils.resize(frame, width=width)
    
    ok, boxes = tracker.update(frame)

    if not ok or boxes is () or needHogVerif > HOG_VERIF_TRESH: 
        needHogVerif = 0
        #print(ok)
        print(boxes)
        cv2.imshow('Idnwis', frame)
        if cv2.waitKey(1) & 0xff == 27:
            break
        tracker = reinit_tracker(frame, hog, body_cascade, METHOD)
        print('Reinitilization...')
        isNew = True
        speedBoxes = []
        allBoxes = []
        continue
    violators = []
    for box in boxes:
        if focalLength == 0:
            focalLength = ((box[2]+box[0]) * KNOWN_DISTANCE) / KNOWN_WIDTH
        #distance = distance_to_camera(KNOWN_WIDTH, focalLength, box[2]+box[0])
        distance = (box[0]+box[1]+box[2]+box[3]) / 4
        l_distance = 0
        if isNew:
            allBoxes.append([box])
            speedBoxes.append([distance])
        else:
            l_distance =  abs(speedBoxes[nBox][len(speedBoxes[nBox])-1] - distance)
            speedBoxes[nBox].append(distance)
            allBoxes[nBox].append(box)

        p1 = (int(box[0]), int(box[1]))
        p2 = (int(box[2])+int(box[0]), int(box[3])+int(box[1]))

        cv2.rectangle(frame, p1, p2, (255,255,0), 2)

        for pbox in allBoxes[nBox]:
            pointCor = (int(pbox[0]+pbox[2]/2), int(pbox[1]+pbox[3]))
            cv2.circle(frame, pointCor, 3, (0,0,255), -1)

        print(str(box)+" "+str(l_distance))
        if l_distance > MAX_DISTANCE:
            violators.append((p1,p2))
        cv2.putText(frame,str((l_distance)),(int(box[0])-20, int(box[1])-30), cv2.FONT_HERSHEY_SIMPLEX, 1,(0,0,0), 3)
        nBox+=1
    if len(violators)>0:
        for a in violators:
            cv2.rectangle(frame, a[0], a[1], (0,0,255), 2)
    cv2.imshow('Idnwis', frame)
    if len(violators)>0:
        #cv2.waitKey(0)
        print('Замечен нарушитель!')
        #needHogVerif = HOG_VERIF_TRESH
        violators = []
    isNew = False
    if cv2.waitKey(30) & 0xff == 27:
        print(speedBoxes)
        cv2.waitKey(0)
        break

    needHogVerif+=1