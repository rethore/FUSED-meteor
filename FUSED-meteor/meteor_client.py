import time
from MeteorClient import MeteorClient
import numpy as np
import scipy as sp
import os

client = MeteorClient('ws://127.0.0.1:3000/websocket')


def callback_function(error, result):
    if error:
        print(error)
        return

    print(result)


def subscribed(subscription):
    print('* SUBSCRIBED {}'.format(subscription))


def unsubscribed(subscription):
    print('* UNSUBSCRIBED {}'.format(subscription))


def added(collection, id, fields):
    print('* ADDED {} {}'.format(collection, id))
    for key, value in fields.items():
        print('  - FIELD {} {}'.format(key, value))

    # query the data each time something has been added to
    # a collection to see the data `grow`
    all_lists = client.find('items', selector={})
    # print('Lists: {}'.format(all_lists))
    print('Num lists: {}'.format(len(all_lists)))

    if not 'result' in fields:
        item = {}
        # while 'pid' not in item.keys():
        #     client.call('reserve', [id, os.getpid()], callback_function)
        #     time.sleep(0.1)
        #     item = client.find_one('items', selector={'_id':id})
        #     print(item)
        #if item['pid'] == os.getpid():
        try:
            client.call('addResult', [id, str(eval(fields['text']))], callback_function)
        except Exception as e:
            client.call('addResult', [id, '???'], callback_function)
            print(str(e))

        # if collection == 'list' you could subscribe to the list here
        # with something like
        # client.subscribe('todos', id)
        # all_todos = client.find('todos', selector={})
        # print 'Todos: {}'.format(all_todos)


def connected():
    print('* CONNECTED')


def subscription_callback(error):
    if error:
        print(error)


client.on('subscribed', subscribed)
client.on('unsubscribed', unsubscribed)
client.on('added', added)
client.on('connected', connected)

client.connect()
client.subscribe('items')

client.call('removeItems', ['Python*'], callback_function)
#client.call('addItem', ['1+1'], callback_function)

# (sort of) hacky way to keep the client alive
# ctrl + c to kill the script
while True:
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        break

client.unsubscribe('items')

client.close()
