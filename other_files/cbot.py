import time
import vk_api
import threading
import json
import random
import requests
from bs4 import BeautifulSoup

# d4f357670aff1adc1fb0cfb05b314f3336d89b6dce2fc8f37a0b47208d54395f5e3d46fb2697b6c5431fc Нацуки
# a5c5ffbed923d9a3c6cc178a77d1ca06327a1b935838e8f159bcf0407c83869430528777e5d76cc79443e Я
# 43a2387b15fa2070e9440006bbf3c50bb64a9e9643d6e49e830b8b3a069e65e6edc2a1877ec4a3a9ec814 Тайяна, ыыы
vk = vk_api.VkApi(login='+37369949907', password='buraklox344',
                  token='d4f357670aff1adc1fb0cfb05b314f3336d89b6dce2fc8f37a0b47208d54395f5e3d46fb2697b6c5431fc')
vk.auth()

##Init info
hentai = vk.method('video.get', {'album_id': 1})
hentai_alb = hentai['items']
owner_id = "341518179"
##Hearhtsone Append##
all_cards = None
card_albums = None
card_url = "https://raw.githubusercontent.com/schmich/hearthstone-card-images/cd0f/rel/"
#with open('cards.json') as cards:
#   all_cards = json.load(cards)


def get_pack_info_list(pack_type):
    fl = open(pack_type+'.txt')
    common = []
    rare = []
    epic = []
    legendary = []
    for line in fl:
        line = line[0:len(line)-1]
        info = line.split(',')
        if info[1] == 'COMMON':
            common.append({'name':info[0], 'id':info[2]})
        elif info[1] == 'RARE':
            rare.append({'name': info[0], 'id': info[2]})
        elif info[1] == 'EPIC':
            epic.append({'name': info[0], 'id': info[2]})
        elif info[1] == 'LEGENDARY':
            legendary.append({'name': info[0], 'id': info[2]})

    return {'common':common, 'rare':rare, 'epic':epic, 'legendary':legendary}

def get_card_albums():
    all_alb = vk.method('photos.getAlbums')
    collection = {'expert1':{'common':[], 'rare':[], 'epic':[], 'legendary':[]},
                  'gvg':{'common':[], 'rare':[], 'epic':[], 'legendary':[]},
                  'tgt':{'common':[], 'rare':[], 'epic':[], 'legendary':[]},
                  'og':{'common':[], 'rare':[], 'epic':[], 'legendary':[]},
                  'gangs':{'common':[], 'rare':[], 'epic':[], 'legendary':[]},
                  'ungoro':{'common':[], 'rare':[], 'epic':[], 'legendary':[]},
                  'icecrown':{'common':[], 'rare':[], 'epic':[], 'legendary':[]}}
    for alb in all_alb['items']:
        if '_' in alb['title']:
            print(alb['title'])
            fname = alb['title'].split('_')
            cards = vk.method('photos.get', {'album_id':alb['id']})
            for card in cards['items']:
                collection[fname[0]][fname[1]].append({'name':card['text'], 'id':card['id'],
                                                            'album_id':card['album_id']})
    return collection

card_albums = get_card_albums()
pt = None
#pt = {'expert1' : get_pack_info_list('expert1'), 'gangs' : get_pack_info_list('GANGS'),
#      'gvg' : get_pack_info_list('GVG'), 'icecrown' : get_pack_info_list('ICECROWN'),
#      'og' : get_pack_info_list('OG'), 'tgt' : get_pack_info_list('TGT'),
#      'ungoro' : get_pack_info_list('ungoro')}

##Hearthstone Append##

def find_anime(body):
    try:
        print("kek")
        URL = "http://animeonline.su"
        search_url = "http://animeonline.su/search/"
        body.replace('"', '')
        l = body.split()
        l.remove("Нацуки,")
        l.remove("аниме")

        s = ""
        i = 0
        for word in l:
            i += 1
            s += word
            if i < len(l):
                s += "_"
        search_url += s

        doc = requests.get(search_url)
        soup = BeautifulSoup(doc.text, "lxml")

        anime_url = soup.find("div", {'class': "poster_container"}).find("a").get("href")
        doc_a = requests.get(anime_url)
        soup_a = BeautifulSoup(doc_a.text, "lxml")
        img = URL + soup_a.find("div", {'class': 'poster_container'}).find("img").get("src")

        name_rus = str(soup_a.find("h1", {"class": "nameMain"})).replace('<h1 class="nameMain" itemprop="name">',
                                                                         '').replace("</h1>", "")
        name_of = str(soup_a.find("h2", {"class": "nameAlt"})).replace(
            '<h2 class="nameAlt" itemprop="alternativeHeadline">', '').replace("</h2>", "")

        descr = requests.get(anime_url)
        descr_html = descr.text

        soup_descr = BeautifulSoup(descr_html, "lxml")
        description = soup_descr.find("meta", {"name": "description"}).get("content")
        if description == " " or description == "":
            description = "Отсутсвует."
        final_text = "Название : " + name_rus + " (" + name_of + ")" + '\n' + 'Описание : ' + description
        return {"image_url": img, "text": final_text}
    except:
        return None


def write_msg(user_id, s):
    vk.method('messages.send', {'user_id': user_id, 'message': s})


def send_attahc(user_id, at, s=None):
    if s == None:
        vk.method('messages.send', {'user_id': user_id, 'attachment': at})
    else:
        vk.method('messages.send', {'user_id': user_id, 'attachment': at, 'message': s})


def get_rand_video(album):
    video = random.choice(album)
    owner_id = video['owner_id']
    video_id = video['id']
    return "video{0}_{1}".format(owner_id, video_id)

def create_albums():
    albums = []
    i = 0
    alb_file = open('card_albums', 'w')
    for _set in pt.keys():
        curr_card = 0
        for rarity in pt[_set].keys():
            albums.append(vk.method('photos.createAlbum', {'title':_set+'_'+rarity, 'privacy_view':'only_me'})['id'])
            for card in pt[_set][rarity]:
                photo = download_photo_and_save_in_tempfile(card_url+card['id']+'.png')
                url = vk.method('photos.getUploadServer', {'album_id':albums[i]})
                file_ph = {'photo': open(photo, 'rb')}
                upload_resp = requests.post(url['upload_url'], files=file_ph)
                data = upload_resp.json()
                response = vk.method('photos.save',
                                     {'server': data['server'], 'photos_list': data['photos_list'], 'hash': data['hash'],
                                      'album_id':albums[i], 'caption':card['name']})
                curr_card+=1
            alb_file.write(_set+"_"+rarity+":"+str(albums[i])+'\n')
            i+=1
    alb_file.close()
    return


def download_photo_and_save_in_tempfile(photo_url, img_name='lel.png'):
    img_resp = requests.get(photo_url)
    img_file = open(img_name, 'wb')
    img_file.write(img_resp.content)
    img_file.close()
    return img_name


def upload_photo(photo):
    url = vk.method('photos.getMessagesUploadServer')
    file_ph = {'photo': open(photo, 'rb')}
    upload_resp = requests.post(url['upload_url'], files=file_ph)
    data = upload_resp.json()
    response = vk.method('photos.saveMessagesPhoto',
                         {'server': data['server'], 'photo': data['photo'], 'hash': data['hash']})
    print(response)
    return response[0]['id']


def send_photo_to_user(user_id, photo_name, mess=None):
    id_p = upload_photo(photo_name)
    attach_inf = 'photo{0}_{1}'.format(owner_id, id_p)
    if mess == None:
        send_attahc(user_id, attach_inf)
    else:
        send_attahc(user_id, attach_inf, mess)

def get_pakich_old(type):
    pakich = []
    gpakich = []
    for i in range(5):
        card_num = random.randint(0, 100)
        if card_num <= 72:
            pakich.append('common')
        elif 73<=card_num <= 95:
            pakich.append('rare')
        elif 96<=card_num<=99:
            pakich.append('epic')
        elif card_num == 100:
            pakich.append('legendary')
    isRareOrHigher = False
    for card in pakich:
        if card != 'common':
            isRareOrHigher = True
    if isRareOrHigher!=True:
        numb = random.randint(1, 5)
        pakich[card_num] = 'rare'
    for i in range(5):
        gpakich.append(random.choice(pt[type][pakich[i]]))
    return gpakich

def get_packich(_type):
    pakich = []
    gpakich = []
    for i in range(5):
        card_num = random.randint(0, 100)
        if card_num <= 72:
            pakich.append('common')
        elif 73 <= card_num <= 95:
            pakich.append('rare')
        elif 96 <= card_num <= 99:
            pakich.append('epic')
        elif card_num == 100:
            pakich.append('legendary')
    isRareOrHigher = False
    for card in pakich:
        if card != 'common':
            isRareOrHigher = True
    if isRareOrHigher != True:
        numb = random.randint(1, 5)
        pakich[card_num] = 'rare'
    for i in range(5):
        gpakich.append(random.choice(card_albums[_type][pakich[i]]))
    return gpakich

def send_packich_old(user_id):
    attach = ""
    i = 1
    pack = get_pakich_old('expert1')
    for card in pack:
        print(card)
        id = upload_photo(download_photo_and_save_in_tempfile(card_url+card['id']+'.png', "cards_cache/"+str(i)+'.png'))
        if i<5:
            attach += 'photo{0}_{1}'.format(owner_id, id)+','
        else:
            attach += 'photo{0}_{1}'.format(owner_id, id)
        i+=1
    send_attahc(user_id, attach, "Ваш пак.")
    return 0

def send_packich(user_id, pakich_type, msg="Ваш пак."):
    attach = ""
    print(pakich_type)
    if pakich_type=='expert2':
        msg = "Выбранный вами набор не найден. Открываю классический."
        pakich_type = 'expert1'
    pakich = get_packich(pakich_type)
    i = 0
    for card in pakich:
        if i<4:
            attach+='photo{0}_{1}'.format(owner_id, card['id'])+','
        else:
            attach += 'photo{0}_{1}'.format(owner_id, card['id'])

    send_attahc(user_id, attach, msg)
    return

def get_packich_type(msg):
    gvg = ['гоблины и гномы', 'гвг', 'gvg', 'гоблин', 'гном']
    expert1 = ['классический', 'обычный', 'стандартный', 'classic']
    og = ['древние боги', 'боги', 'old gods']
    tgt = ['турнир', 'tgt']
    gangs = ['прибамбасск', 'прибамбаск', 'гаджетан', 'gadgetzan']
    ungoro = ['унгоро', "унг'оро", "ungoro"]
    icecrown = ['рлт', 'лич', 'рыцари ледяного трона', 'icecrown', 'frozen']

    sets = {'gvg':gvg, 'expert1':expert1, 'og':og, 'tgt':tgt, 'gangs':gangs, 'ungoro':ungoro, 'icecrown':icecrown}

    for _set in sets.keys():
        for word in sets[_set]:
            if word in msg:
                return _set
    return 'expert2'

def save_in_file_cards(pack_type):
    fl = open(pack_type+'.txt', 'w')
    for card in all_cards:
        try:
            if card['set']==pack_type:
                collectible = False
                try:
                    collectible = bool(card['collectible'])
                except:
                    pass
                if collectible:
                    fl.write(card['name']+","+str(card['rarity'])+","+str(card['dbfId'])+'\n')
        except Exception as e:
            print(card)
            print(e)
    fl.close()
    print(all_cards[0])
    return 0

def mogvai(user_id, body=None):
    if body.lower().startswith("нацуки привет") or body.lower().startswith("нацуки, привет"):
        write_msg(user_id, "Команда подтверждена.\n Открываю пятые врата.\n -Здравствуй, друг.")
    if body.lower().startswith("нацуки проверь") or body.lower().startswith("нацуки, проверь"):
        write_msg(user_id, "Вероятность этого - {0}%, я полагаю.".format(random.randint(0, 100)))
    if body == "Нацуки, голос":
        write_msg(user_id, 'В рот тебя ебала, хули надо?')
    elif "проверка связи" in body.lower():
        write_msg(user_id, 'Нахуй иди')
    elif body.lower().startswith("нацуки, хентай") or body.lower().startswith("нацуки, развлеки меня"):
        send_attahc(user_id, get_rand_video(hentai_alb), "Прошу.")
        print("KEK")
    elif body.lower().startswith("нацуки, аниме"):
        anime_info = find_anime(body)
        if anime_info is not None:
            name = download_photo_and_save_in_tempfile(anime_info['image_url'])
            send_photo_to_user(user_id, name, anime_info['text'])
        else:
            write_msg(user_id, "Прошу прощения. Аниме не было найдено.")
    elif "пакич" in body.lower():
        send_packich(user_id, get_packich_type(body.lower()))
    else:
        return None


getmsg_values = {'out': 0, 'count': 10, 'time_offset': 2}
print("*****STARTED*****")
for tupe in card_albums.keys():
    print(tupe)
    print(card_albums[tupe]['legendary'][0])
while True:
    try:
        msg = vk.method('messages.get', getmsg_values)
        for item in msg['items']:
            if item['read_state'] != 1:
                vk.method('messages.markAsRead', {'peer_id':item['user_id']})
                print("#############NEW ITEM###############")
                print(str(item['user_id'])+" "+item['body'])
                #threading.Thread(target=mogvai, args=(item['user_id'], item['body'])).start()
                mogvai(item['user_id'], item['body'])
        time.sleep(0.5)
    except:
        pass
    # msg = vk.method('messages.get', getmsg_values)
    # print(msg)
    # write_msg('341518179', 'Анастастия Мейендорф')
