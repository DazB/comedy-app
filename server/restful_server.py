#!flask/bin/python
from flask import Flask, jsonify
import requests
import json

app = Flask(__name__)

@app.route('/', methods=['GET'])
def get_tasks():
    """
    Called when GET request made
    :return:
    """
    client_id = '91fdea0e6e8de74094ad0495f34ba081903e8bea'
    client_secret = 'bfd40f1dcb565e9a0e206395c7ae7c6f108cd26a'
    username = 'dazbahri@hotmail.co.uk'
    password = 'ShitPissFuckCunt'

    # TODO: general exception handling. Check status codes (r.status_code), act appropriately.

    r = requests.post('https://api.ents24.com/auth/login', data={'client_id': client_id,
                                                                 'client_secret': client_secret,
                                                                 'username': username,
                                                                 'password': password})
    # TODO: timeouts for requests?
    # http://docs.python-requests.org/en/master/user/quickstart/#timeouts

    # Get auth token to make requests
    r_json = json.loads(r.text)
    access_token = r_json['access_token']

    headers = {'Authorization': access_token}

    # TODO: format url so custom request using parameters sent by client
    # Send url to ent24 api
    url = 'https://api.ents24.com/event/list?location=geo:53.9576300,-1.0827100&radius_distance=10&' \
          'distance_unit=mi&genre=comedy&date_from=2018-03-01&date_to=2018-04-25&results_per_page=50&' \
          'incl_artists=1&full_description=1'

    # TODO: error handling in case of bad request or receive bad data
    r = requests.get(url, headers=headers)
    r_json = json.loads(r.text)

    # Parse JSON TODO this shit gonna change gotta make it a database or something
    events = '['
    for event in r_json[:-1]:
        events += '{"headline" : "' + str(event['headline']) + '", "date" : "' + str(event['startDate']) + '"},'
    events += '{"headline" : "' + str(r_json[-1]['headline']) + '", "date" : "' + str(r_json[-1]['startDate']) + '"}]'

    json_response = json.loads(events)
    return jsonify(json_response)

if __name__ == '__main__':
    app.run(debug=True)