import sys
from yandex_translate import YandexTranslate

translate = YandexTranslate('trnsl.1.1.20171003T210344Z.078c68feac3ca089.972307e58abdec918e156cbe709378bf1d71ee92')
try:
    if sys.argv[1]=='ru':
        text = ""
        for word in translate.translate(sys.argv[2], 'en')['text']:
            text+=word
        print(text)    
    elif sys.argv[1]=='en':
        text = ""
        for word in translate.translate(sys.argv[2], 'ru')['text']:
            text+=word
        print(text)
    else:
        print('Incorrect input')
except:
    print('Incorrect input')