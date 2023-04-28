from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
# route to get all accommodations

@app.route('/')
def index():
    return render_template('home.html')


@app.route('/about')
def about():
    return render_template('aboutus.html')

@app.route('/filters')
def filters():
    return render_template('filters.html')

@app.route('/feedback')
def feedback():
    return render_template('feedback.html')


@app.route('/housing')
def get_accommodations():
    conn = sqlite3.connect('housing.db')
    c = conn.cursor()
    c.execute('SELECT * FROM accommodations')
    rows = c.fetchall()
    conn.close()
    accommodations = []
    for row in rows:
        accommodation = {
            'id': row[0],
            'DistancefromCollege': row[1],
            'Furnished': row[2],
            'PetsAllowed': row[3],
            'TypesofHouses': row[4],
            'TypesofAmenities': row[5],
            'AccommodationName': row[6],
            'Rent': row[7],
            'AvailabilityMonth': row[8]
        }
        accommodations.append(accommodation)
        response = jsonify(accommodations)
        response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(debug=True)
