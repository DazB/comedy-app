import asyncore
import socket
import requests
import json


class Handler(asyncore.dispatcher):
    """
    Socket handler for client connections made to server
    """

    def handle_write(self):
        """
        Called when data can be written to the socket
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

        comedy_events = r.text.encode('utf-8')

        self.send("yo")

        # ticketmaster_api_key = 'xoGWGgRDOLHGsutqGIk0YLGaNXaYhsAA'

        # # TODO: format url so custom request using parameters sent by client
        # # Send url to ticketmaster api with parameters
        # url = 'https://app.ticketmaster.com/discovery/v2/events.json?latlong=53.9600%2C-1.0873&radius=10&' \
        #       'classificationName=comedy'
        #
        # # Add api key
        # url += '&apikey=' + ticketmaster_api_key
        #
        # r = requests.get(url)
        # comedy_events = r.text.encode('utf-8')
        #
        # self.send(comedy_events)

        # TODO: send all data in standardised format. Send separately or all at once?
        self.close()


class Server(asyncore.dispatcher):

    def __init__(self, host, port):
        asyncore.dispatcher.__init__(self)
        self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
        self.set_reuse_addr()
        self.bind((host, port))
        self.listen(5)

    def handle_accept(self):
        """
        Called connection request made to a listening socket. Callback calls accept method to get client socket.
        Creates socket handler to handle actual communication.
        :return:
        """
        pair = self.accept()
        if pair is not None:
            sock, addr = pair
            print 'Incoming connection from %s' % repr(addr)
            handler = Handler(sock)


if __name__ == "__main__":
    print "starting server"
    server = Server('localhost', 8000)
    asyncore.loop()
    print "done"
