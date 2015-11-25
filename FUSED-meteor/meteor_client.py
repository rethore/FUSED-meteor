import time

import yaml
from MeteorClient import MeteorClient
import numpy as np
import scipy as sp
import os
import json
import importlib

from fusedwind.core.problem_builder import FUSEDProblem


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

problems = {}


def log_error(error, result):
    if error:
        print(error)
        return
    print(result)

def callback_register(error, item):
    if error:
        print(error)
        return

    print('here is the item', item, item.__class__.__name__)
    if item['pid'] == os.getpid():
        # try:
        if 'problem' in item.keys():
            pb = item['text']
            problems[pb] = FUSEDProblem(item['problem'])
            out = problems[pb].setup()
            indeps = problems[pb].list_indepvars()
            #client.call('dangling', [indeps, pb])
            print('out', out)
            item['params'] = [{'key':key } for key in out['dangling_params']]
            item['indeps'] = [{'key':key } for key in indeps]
            print('its a fusedwind problem',item)
            client.call('add_params', [item], callback_function)
        else:
            client.call('addResult', [item['_id'], str(eval(item['text']))+' (%d)'%(os.getpid())], callback_function)
        # except Exception as e:
        #     #client.call('addResult', [item['_id'], '??? (%d)'%(os.getpid())], callback_function)
        #     print('something failed',str(e))


def added(collection, id, fields):
    print('* ADDED {} {}'.format(collection, id))
    for key, value in fields.items():
        print('  - FIELD {} {}'.format(key, value))

    # query the data each time something has been added to
    # a collection to see the data `grow`
    # all_lists = client.find('items', selector={})
    # print('Lists: {}'.format(all_lists))
    # print('Num lists: {}'.format(len(all_lists)))

    if collection == 'items':
        if 'problem' in fields:
            pid = os.getpid()
            if 'pid' not in fields:
                client.call('reserve', [id, pid], callback_register)


def changed(collection, id, fields, cleared):
    print('* CHANGED {} {}'.format(collection, id))
    for key, value in fields.items():
        print('  - FIELD {} {}'.format(key, value))
    for key, value in cleared.items():
        print('  - CLEARED {} {}'.format(key, value))
    if collection=='params':
        param = client.find_one('params', selector={'_id':id})
        if param['problem'] in problems.keys():
            problems[param['problem']][param['key']] = param['value']
            print(param['problem'], param['key'], '=', param['value'])

def connected():
    print('* CONNECTED')


def subscription_callback(error):
    if error:
        print(error)


client.on('subscribed', subscribed)
client.on('unsubscribed', unsubscribed)
client.on('added', added)
client.on('changed', changed)
client.on('connected', connected)

client.connect()
client.subscribe('items')
client.subscribe('params')

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
