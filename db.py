import pymysql

host = "cs411-tripoptimizer.c3jbpbfvqkol.us-east-2.rds.amazonaws.com"
port = 3293
dbname = "cs411_tripoptimizer"
user = "master"
password = "uiuccs411"

createUser_sql = \
    "\
        CREATE TABLE User(\
        email VARCHAR(50) PRIMARY KEY,\
        name VARCHAR(50),\
        age TINYINT,\
        birthDate VARCHAR(20),\
        address VARCHAR(255)\
        );\
    "

dropUser_sql = \
    "\
        DROP TABLE User;\
    "

addUser_sql = \
    "\
        INSERT INTO User(email, name, age, birthDate, address)\
        VALUES (\"{email}\", \"{name}\", {age}, \"{dob}\", \"{addr}\");\
    "

createPlace_sql = \
    "\
        CREATE TABLE Place(\
        pid INT PRIMARY KEY,\
        name VARCHAR(50),\
        address VARCHAR(255),\
        city VARCHAR(20),\
        category VARCHAR(50),\
        openTime VARCHAR(8),\
        closeTime VARCHAR(8),\
        latitude VARCHAR(10),\
        longitude VARCHAR(10)\
        );\
    "

dropPlace_sql = \
    "\
        DROP TABLE Place;\
    "

addPlace_sql = \
    "\
        INSERT INTO Place(pid, name, address, city, category, openTime, closeTime, latitude, longitude)\
        VALUES ({pid}, \"{name}\", \"{addr}\", \"{city}\", \"{cat}\", \"{open}\", \"{close}\", \"{lat}\", \"{lon}\");\
    "

createTrip_sql = \
    "\
        CREATE TABLE Trip(\
        tid VARCHAR(100) PRIMARY KEY,\
        email VARCHAR(50),\
        city VARCHAR(50),\
        itinerary VARCHAR(255),\
        startLocation VARCHAR(100),\
        startDate BIGINT,\
        endDate BIGINT\
        );\
    "

dropTrip_sql = \
    "\
        DROP TABLE Trip;\
    "

addTrip_sql = \
    "\
        INSERT INTO Trip(tid, email, city, itinerary, startLocation, startDate, endDate)\
        VALUES (\"{tid}\", \"{email}\", \"{city}\", \"{itin}\", \"{loc}\", {start}, {end});\
    "

createContain_sql = \
    "\
        CREATE TABLE Contain(\
        tid VARCHAR(100),\
        pid INT,\
        ord INT,\
        PRIMARY KEY(tid, pid)\
        );\
    "

dropContain_sql = \
    "\
        DROP TABLE Contain;\
    "
selectPlace = \
    "\
        Select latitude, longitude, category, pid FROM Place WHERE ;\
    "
def connect():
    conn = pymysql.connect(host, user=user, port=port,
                           passwd=password, db=dbname)
    cur = conn.cursor(pymysql.cursors.DictCursor)
    return conn, cur


def createTable_User(cur):
    cur.execute(createUser_sql)


def dropTable_User(cur):
    cur.execute(dropUser_sql)


def createTable_Place(cur):
    cur.execute(createPlace_sql)


def dropTable_Place(cur):
    cur.execute(dropPlace_sql)


def createTable_Trip(cur):
    cur.execute(createTrip_sql)


def dropTable_Trip(cur):
    cur.execute(dropTrip_sql)


def createTable_Contain(cur):
    cur.execute(createContain_sql)


def dropTable_Contain(cur):
    cur.execute(dropContain_sql)


def addUser(cur, email, name, age, dob, addr):
    cur.execute(addUser_sql.format(
        email=email, name=name, age=age, dob=dob, addr=addr))


def addPlace(cur, name, addr, city, cat, open, close, lat, lon, pid):
    cur.execute(addPlace_sql.format(pid=pid, name=name[0], addr=", ".join(
        addr), city=city, cat=cat, open=open, close=close, lat=lat, lon=lon))


def addTrip(cur, tid, email, city, itin, loc, start, end):
    cur.execute(addTrip_sql.format(tid=tid, email=email, city=city,
                                   itin=itin, loc=loc, start=start, end=end))