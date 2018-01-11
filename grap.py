p = [[0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,-1,0,0,0,0,0],
     [0,0,0,0,0,0,0,-1,0,0],
     [0,0,0,0,0,0,0,0,0,0],
     [0,0,-1,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0],
     [0,0,0,0,-1,0,0,0,0,0],
     [0,-1,0,0,0,0,0,0,0,0],
     [0,0,0,0,0,0,0,0,0,0]]


def matol(p, row=5, col=5):
    glaues = []
    l = []
    k = 0
    for i in range(col):
       for j in range(row):
            l.append(dict());
            glaues.append(p[i][j])
            #if(j!=0):
            #   l[k][k-1] = p[i][j-1]
            try:
                
                l[k][k+1] = p[i][j+1]
            except:
                pass
            #if(i!=0):
            #    l[k][k-row] = p[i-1][j]
            try:
                l[k][k+row] = p[i+1][j]
            except:
                pass
            k+=1
    return (l, glaues)

def find_ways(start, value, last_row_id):
    global way_log
    global ways
    global colues
    way_log.append(start)

    if start >= last_row_id:
        
        ways.append(way_log.copy())
        colues.append(value+glaues[start])
        way_log.remove(start)
        return

    for w in l[start]:
        if not w in way_log and glaues[w] is not -1:
            res = find_ways(w, value+glaues[start], last_row_id)
    way_log.remove(start)

def rolton(p, row=5, col=5):
    mines = []
    for i in range(row):
        for j in range(col):
            if p[i][j] == -1:
                mines.append((i, j))
    for mine in mines:
        i = mine[0]
        for j in range(col):
            if j != mine[1]:
                if (p[i][j] > abs(mine[1]-j)) or (p[i][j] == 0):
                    p[i][j] = abs(mine[1]-j)
        for i in range(col):
            for j in range(row):
                if p[j][i] != -1:
                    res = p[mine[0]][i]
                    if res == -1:
                        res += 1
                    value = abs(mine[0]-j)+res
                    if (p[j][i] > value) or (p[j][i] == 0):
                        p[j][i] = value
    return p

ways = []
colues = []
glaues = []
way_log = []
l = []
allWays = []
allValues = []

p = rolton(p, len(p), len(p[0]))
for i in range(len(p)):
    print(p[i])
maximum = 0
for i in range(len(p)):
    for j in range(len(p[i])):
        if p[i][j] is not -1 and p[i][j] > maximum:
            maximum = p[i][j]

l_max = []
r_max = []
for i in range(maximum):
    l_max.append(maximum-i)
    r_max.append(i+1)
for i in range(len(p)):
    for j in range(len(p[i])):
        for l in range(maximum):
            if p[i][j] is r_max[l]:
                p[i][j] = l_max[l]
                break

#for i in range(len(p)):
#    print(p[i])
(l, glaues) = matol(p, len(p), len(p[0]))

for i in range(len(p[0])):
    find_ways(i, 0, (len(p)*len(p[0]))-len(p[0]))
    for way in ways:
        allWays.append(way.copy())
    for col in colues:
        allValues.append(col)
    ways.clear()
    colues.clear()

(finalCol, index) = (999999,0)
print()
print("Length : ", len(allValues))
print()
for i in range(len(allValues)):
    if allValues[i]<finalCol:
        finalCol = allValues[i]
        index = i

print(allWays[index]," - ", finalCol)
print()

for i in range(len(glaues)):
    for l in range(maximum):
        if glaues[i] is l_max[l]:
            glaues[i] = r_max[l]
            break

maxPirate = maximum
for i in allWays[index]:
    if glaues[i] < maxPirate:
        maxPirate = glaues[i]

print("Result : ", maxPirate+1)

