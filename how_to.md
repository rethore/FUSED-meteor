# Install Meteor


## On OSX and Linux
```bash
$ curl https://install.meteor.com/ | sh
``` 
## On Windows
[See the official install page](https://www.meteor.com/install)

# Create the app
[tutorial meteor](https://www.meteor.com/tutorials/blaze/creating-an-app)

```bash
$ meteor create FUSED-meteor
```

# Start the app

```bash
$ cd FUSED-meteor
$ meteor
```     

# Install Python virtual environment
## Create the virtual environment

I usually put all my virtual environment in $HOME/venv. 

```bash
$ virtualenv -p python3.5 $HOME/venv/python-meteor
```

Then I create a symbolic link in the local directory where I want to use this environment

```bash
$ ln -s $HOME/venv/python-meteor/bin/activate .
$ source activate
```

## Install python libary
The libraries we need to connect to meteor is [`python-meteor`](https://github.com/hharnisc/python-meteor). Once the virtual environement has been activated, you can
 simply do
 
```bash
$ pip install python-meteor
``` 

This should install all the dependencies

## Install jupyter
We are going to experiment with Jupyter to get started with the python client

```bash
$ pip install jupyter
```

# Make a simple meteor web-app

## Reorganizing the file structure
Starting from the base example, we are going to move the code around a bit.
First create 3 directories:

```bash
- client #where the client javascript code will be located
- server #where the server javascript code will be located
- models #Where the data model will be defined and shared between client and server code
```

In client, let's move the `.html`, `.css` and `.js` files. You can rename them as you wish. I called them `index.*`

```bash
- client
    +- index.html
    +- index.js
    +- index.css
- server
- models
```

In `index.js` cut the code 

```javascript
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
```

You can put the startup function in a file in the `server` directory. I put it in a file called `main.js`, but it could be 
any name. You can remove the code context `if (Meteor.isClient) {` in `client/index.js` and 
`if (Meteor.isServer) {` in `server/main.js` as it this is now unnecessary as the code context is created by the directory
structure.

We now have this directory structure.

```bash
- client
    +- index.html
    +- index.js
    +- index.css
- server
    +- main.js
- models
```

## Create a simple model

In a new file called `models/models.js` we create a new Mongodb collection called `items`. This is going to be a simple
list of text that we will interact between the web-ui, the mongodb database and the future python client.

```javascript
Items = new Mongo.Collection("items");
```

We now have this directory structure.

```bash
- client
    +- index.html
    +- index.js
    +- index.css
- server
    +- main.js
- models
    +- models.js
```

By default meteor is [unsecure](https://www.meteor.com/tutorials/blaze/security-with-methods) so that it's easier to get 
started to hack on it. That means that both the client and
 the server share the same database. That's OK when they are both located on the same machine, but as soon as the server 
 is running on a remote machine we will want to have a separation between the data cached locally by the client, and the
 real database hosted on the server. In order to work in that way, Meteor client has to `suscribe` to the database.

First we will remove the `insecure` and `autopublish` modules.
 
```bash
$ meteor remove insecure autopublish
``` 

