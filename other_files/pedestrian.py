#HOG/SVM PREDISTREAN DETECTION
import numpy as np
import imutils
import cv2
import argparse
from imutils.object_detection import non_max_suppression

def get_rects_with_nmn(hog, img):

    (rects, weights) = hog.detectMultiScale(img, winStride=(4,4), padding=(8,8), scale=1.05)

    rects = np.array([[x, y, x + w, y + h] for(x,y,w,h) in rects])
    for(x,y,w,h) in rects:
        cv2.rectangle(img, (x,y), (w,h), (0,0,0), 3)
    rects = non_max_suppression(rects, probs=None, overlapThresh=0.65)

    for(x,y,w,h) in rects:
        cv2.rectangle(img, (x,y), (w,h), (0,255,0), 2)

    #return img[rects[2][1]:rects[2][3], rects[2][0]:rects[2][2]]

    return img

args = argparse.ArgumentParser(description="Распознавание пешеходов на картинке.")
args.add_argument("--image", "-i", type=str, help="Путь к картинке.")
args.add_argument("--width", "-w", type=int, default=400, help="Максимальная ширина картинки.")
args.add_argument("--video", "-v", type=str, help="Путь к видео.")
arg = vars(args.parse_args())

img_path = arg['image']
width = arg['width']
video_path = arg['video']

hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())


if img_path != None:
    img = cv2.imread(img_path)
    img = imutils.resize(img, width=min(width, img.shape[1]))
    img = get_rects_with_nmn(hog, img)
    cv2.imshow("After NMS", img)
    cv2.waitKey(0)
elif video_path != None:
    capt = cv2.VideoCapture(video_path)
    while capt.isOpened():
        ret, frame = capt.read()
        frame = imutils.resize(frame, width=min(width, frame.shape[1]))
        frame = get_rects_with_nmn(hog, frame)
        cv2.imshow("After NMS", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break;
        cv2.waitKey(0)
    capt.release()
else:
    print("Image or video path wasnt found!")