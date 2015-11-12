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

Starting from the base example, we are going to move the code around a bit.
First create 3 directories:

```bash
- client #where the client javascript code will be located
- server #where the server javascript code will be located
- model #Where the data model will be defined and shared between client and server code
```

In client, let's move the `.html`, `.css` and `.js` files. You can rename them as you wish. I called them `index.*`

```bash
- client
    +- index.html
    +- index.js
    +- index.css
- server
- model
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
any name. You can remove the code context `if (Meteor.isClient) {` in `client/index.js` as it is now unecessary.

We now have this directory structure.

```bash
- client
    +- index.html
    +- index.js
    +- index.css
- server
    +- main.js
- model
```

