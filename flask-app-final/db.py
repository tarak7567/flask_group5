import sqlite3
import json

# create a connection to the database
conn = sqlite3.connect('housing.db')

# create a cursor object
c = conn.cursor()

# Check if the table exists and drop it if it does
c.execute('''DROP TABLE IF EXISTS accommodations''')

# create a table for the accommodations data
c.execute('''CREATE TABLE accommodations
             (id INTEGER PRIMARY KEY,
              DistancefromCollege REAL,
              Furnished TEXT,
              PetsAllowed TEXT,
              TypesofHouses TEXT,
              TypesofAmenities TEXT,
              AccommodationName TEXT,
              Rent REAL,
              AvailabilityMonth TEXT)''')

accommodations_data =[]
# add the data to the table
with open('data.json') as f:
    accommodations_data = json.load(f)

with open('data.json') as f:
    accommodations_data = json.load(f)

for accommodation in accommodations_data:
    c.execute('''INSERT INTO accommodations
                 (DistancefromCollege, Furnished, PetsAllowed, TypesofHouses, TypesofAmenities, AccommodationName, Rent, AvailabilityMonth)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
              (accommodation["DistancefromCollege"], accommodation["Furnished"], accommodation["PetsAllowed"], accommodation["TypesofHouses"], accommodation["TypesofAmenities"], accommodation["AccommodationName"], accommodation["Rent"], accommodation["AvailabilityMonth"]))

# commit the changes and close the connection
conn.commit()
conn.close()