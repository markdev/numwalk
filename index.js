var node = function (value, lesser, greater) {
  this.value = value;
  this.lesser = lesser;
  this.greater = greater;
};

var original_tree = new node(null, null, null);

var stream = [60, 120, 2, 35, 1, 70, 30, 50];

var tree_walk = function(tree, value) {
  if (tree == null) {
    var new_node = new node(value, null, null);
    return new_node;
  } else {
    if (value < tree.value) {
      tree.lesser = tree_walk(tree.lesser, value);
      return tree;
    } else if (value > tree.value) {
      tree.greater = tree_walk(tree.greater, value);
      return tree;
    }
  }
}

var insert_next_stream_value_into_tree = function(tree, stream) {
  if (stream.length == 0) return tree;
  var value = stream.pop();
  var new_tree = tree_walk(tree, value);
  return insert_next_stream_value_into_tree(new_tree, stream);
}


console.log("BUILDING");
var final_tree = insert_next_stream_value_into_tree(null, stream);

console.log(final_tree);
