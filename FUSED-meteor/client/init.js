//file:/client/init.js
Meteor.startup(function() {
  Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
  Uploader.finished = function(index, fileInfo, templateContext) {
    console.log(fileInfo);
    Meteor.call('addItem', fileInfo.name);
  }
});