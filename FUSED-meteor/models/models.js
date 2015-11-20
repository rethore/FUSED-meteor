Items = new Mongo.Collection("items");
Params = new Mongo.Collection("params");

Problems = new FS.Collection("problems", {
  stores: [new FS.Store.FileSystem("problems", {path: "uploads/problems"})]
});
Inputs = new FS.Collection("inputs", {
  stores: [new FS.Store.FileSystem("inputs", {path: "uploads/inputs"})]
});
