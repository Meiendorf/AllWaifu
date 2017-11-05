from bs4 import BeautifulSoup
import requests

def execute_from_teg(teg, line):
    opener = "<"+teg+">"
    closer = "</"+teg+">"
    try:
        i = line.index(opener)
        start = i+len(opener)
        end = line.index(closer)
        return line[start:end]
    except ValueError:
        return None

url = "http://www.study.ru/support/verb/"

doc = requests.get(url)
soup = BeautifulSoup(doc.text, "lxml")
ls = []
table_blue = soup.findAll("div", {"class":"table_blue"})[1].find("table").find("tbody")
for tr in table_blue:
    for td in tr:
        ls.append(td)
for item in ls:
    if item=='\n':
        ls.remove('\n')
items = []
for item in ls:
    items.append(str(item)[4:len(str(item))-5])
with open("kek.txt", "wt") as fl:
    i = 0
    for verb in items:
        if i < 3:
            fl.write(verb+"|")
        else:
            fl.write(verb+":")
            i = -1
        i += 1