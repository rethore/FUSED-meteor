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



