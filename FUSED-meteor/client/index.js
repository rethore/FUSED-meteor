
Meteor.subscribe("items");
Meteor.subscribe("images");
Meteor.subscribe("problems");

// counter starts at 0
Session.setDefault('counter', 0);

Template.hello.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.hello.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});

Template.add_items.events({
  'submit .new_item': function(event) {
    event.preventDefault();
    var text = event.target.item.value;
    Meteor.call("addItem", text);
    event.target.item.value = '';
  }
});

Template.loaded_files.helpers({
  images: () => Images.find({}),
  problems: () => Problems.find({}),
});

Template.load_file.events({
   'change .myFileInput': function(event) {
     console.log('hello world');
     FS.Utility.eachFile(event, function(file){
       console.log('doing stuff', file);
       //try {
       //  var data = YAML.safeLoad(file.data);
       //  console.log(data);
       //} catch (e) {
       //  console.log(e);
       //}
       var fileObj = new FS.File(file);
       //Images.insert(fileObj);
       Problems.insert(fileObj);
       console.log('success!:',fileObj);
       //  , function (err, fileObj) {
       // // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
       //   if (err) {console.log('there is an error',err)}
       //   else     {console.log('success!:',fileObj)}
       //});
       //Problems.insert(file, function (err, fileObj) {
       //  if (err){
       //    // handle error
       //    console.log('there is an error',err)
       //  } else {
       //    // handle success depending what you need to do
       //    //var userId = Meteor.userId();
       //    //var imagesURL = {
       //    //  "profile.problems": "/cfs/files/problems/" + fileObj._id
       //    //};
       //    //Meteor.users.update(userId, {$set: imagesURL});
       //    console.log('new file: '+fileObj._id, imagesURL);
       //  }
       //});
     })},
});

Template.item_list.helpers({
  items: () => Items.find({}),
});