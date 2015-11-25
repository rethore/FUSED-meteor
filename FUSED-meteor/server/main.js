

Meteor.startup(function () {
    // code to run on server at startup
});

Meteor.publish("items", () => Items.find());
Meteor.publish("problems", () => Problems.find());
Meteor.publish("inputs", () => Inputs.find());
Meteor.publish("params", () => Params.find());

Inputs.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
  download: () => false,
});

Inputs.allow({
  insert: () => true,
  remove: () => true,
  update: () => true,
  download: () => true,
});

Problems.deny({
  insert: () => false,
  update: () => false,
  remove: () => false,
  download: () => false,
});

Problems.allow({
  insert: () => true,
  remove: () => true,
  update: () => true,
  download: () => true,
});

var fs = Npm.require('fs');

Problems.on('stored', Meteor.bindEnvironment(function(fileObj) {
      let url1 = fileObj.collection.primaryStore.path + '/' + fileObj.collection.primaryStore.name + '-' + fileObj._id + '-' + fileObj.original.name;
      let str = fs.readFileSync(url1, 'utf8');
      let data = YAML.safeLoad(str);
      if (Problems.findOne({_id:fileObj._id}) != null) {
        console.log('PROBLEMS--------', fileObj.original.name);
        Items.insert({text: fileObj.original.name, problem: data, createdAt: new Date()});
      }
      if (Inputs.findOne({_id:fileObj._id}) != null) {
        console.log('INPUTS--------', fileObj.original.name, fileObj.related_problem);
        //Items.insert({text: fileObj.original.name, data: data, createdAt: new Date()});
        let pb = Items.findOne({text: fileObj.related_problem});
        console.log('pb:', pb, data)
        pb.params.forEach(function(element, index, array) {
            if (data.hasOwnProperty(element.key)) {
                element.value = data[element.key];
            }
          });
        Items.update(pb._id, {$set: {params: pb.params}});
    };
}));

Meteor.methods({
  addItem: function(text){
    Items.insert({
      text: text,
      createdAt: new Date(),
    });
  },
  removeItems: function(reg){
    Items.remove({text: {$regex: reg}})
  },
  addResult: function(id, text){
    Items.update(id, {$set: {result: text}})
  },
  reserve: function(id, pid){
    var item = Items.findOne({_id:id});
    if (! item.hasOwnProperty('pid')) {
      Items.update(id, {$set: {pid: pid}});
      console.log(id, pid, item);
      return Items.findOne({_id:id})
    } else {
      console.log(id, pid, item, item.pid);
      return item
    }
  },
  dangling: function(dangling_params, problem) {
    dangling_params.forEach(function(el, ind, arr){
      //Params.insert({key: el, problem: problem});
    });
  },
  add_params: function(problem) {
    console.log('receiving problem:', problem);
    Items.update(problem['_id'], problem);
  },
  clearParams: function() {
    Params.remove({key: {$regex: '.*'}})
  },
  clearCommands: function() {
    Items.remove({text: {$regex: '.*'}});
    Items.remove({problem: {$regex: '.*'}});
  },
  update_items: (id, fields) => Items.update(id, {$set: fields}),
  call_python: function(func_name, args, kwargs={}){
    let func_obj = {createdAt: new Date()};
    func_obj[func_name] = {'args':args, 'kwargs':kwargs};
    Items.insert(func_obj);
  },
 });
