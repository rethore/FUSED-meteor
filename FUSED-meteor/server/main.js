

Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.publish("items", function () {
  return Items.find();
});

Meteor.methods({
  addItem: function(text){
    Items.insert({
      text: text,
      createdAt: new Date(),
    });
  }
});