var node = function (value, lesser, greater) {
  this.value = value;
  this.lesser = lesser;
  this.greater = greater;
};

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





var depth_walk = function(depth, nodes) {
  // loop through nodes and see if they are all empty
  var deeper_nodes = nodes.filter((n) => {
    return !(n.lesser == null && n.greater == null);
  });

  if (deeper_nodes.length == 0) return depth;

  // the unwholesome loop
  var next_level_nodes = [];

  for (var i = 0; i < deeper_nodes.length; i ++) {
    if (deeper_nodes[i].lesser !== null) next_level_nodes.push(deeper_nodes[i].lesser);
    if (deeper_nodes[i].greater !== null) next_level_nodes.push(deeper_nodes[i].greater);
  }

  return depth_walk(depth + 1, next_level_nodes);
}

var get_depth_of_tree = function(tree) {
  return depth_walk(1, [tree]);
}





var node_sum = function(depth, nodes, sum) {

  // Add parent node
  if (depth == 1) sum += nodes[0].value;

  // loop through nodes and see if they are all empty
  var deeper_nodes = nodes.filter((n) => {
    return !(n.lesser == null && n.greater == null);
  });

  if (deeper_nodes.length == 0) return sum;

  // the unwholesome loop
  var next_level_nodes = [];

  for (var i = 0; i < deeper_nodes.length; i ++) {
    if (deeper_nodes[i].lesser !== null) next_level_nodes.push(deeper_nodes[i].lesser);
    if (deeper_nodes[i].greater !== null) next_level_nodes.push(deeper_nodes[i].greater);

  }

  for (var i = 0; i < next_level_nodes.length; i ++) {
    sum += next_level_nodes[i].value;
  }

  return node_sum(depth + 1, next_level_nodes, sum);
}

var get_sum_of_values_in_tree = function(tree) {
  return node_sum(1, [tree], 0)
}





var node_max = function(depth, nodes, max) {

  // Add parent node
  if (depth == 1) max = nodes[0].value;

  // loop through nodes and see if they are all empty
  var deeper_nodes = nodes.filter((n) => {
    return !(n.lesser == null && n.greater == null);
  });

  if (deeper_nodes.length == 0) return max;

  // the unwholesome loop
  var next_level_nodes = [];

  for (var i = 0; i < deeper_nodes.length; i ++) {
    if (deeper_nodes[i].lesser !== null) next_level_nodes.push(deeper_nodes[i].lesser);
    if (deeper_nodes[i].greater !== null) next_level_nodes.push(deeper_nodes[i].greater);
  }

  for (var i = 0; i < next_level_nodes.length; i ++) {
    if (next_level_nodes[i].value > max) {
      max = next_level_nodes[i].value
    }
  }

  return node_max(depth + 1, next_level_nodes, max);
}

var get_max_of_values_in_tree = function(tree) {
  return node_max(1, [tree], 0)
}


var stream_1 = [30, 70, 1, 35, 60, 120, 2, 50]
var stream_1_tree = insert_next_stream_value_into_tree(null, stream_1);
console.log("get_depth_of_tree");
var stream_1_depth = get_depth_of_tree(stream_1_tree);
console.log(stream_1_depth);
console.log("get_sum_of_values_in_tree");
var stream_1_sum = get_sum_of_values_in_tree(stream_1_tree);
console.log(stream_1_sum);
var stream_1_max = get_max_of_values_in_tree(stream_1_tree);
console.log(stream_1_max);






// There are three params for the function: nodes, acc (accumulated state from previous levels), and func (lambda)
var level_walk_inner = function(nodes, acc, func) {

  // changed to 'current_level_nodes' for clarity
  var current_level_nodes = nodes.filter((n) => {
  // This has been changed to n != null....previous implementation was ignoring leaf nodes
    return n != null;
  });

  if (current_level_nodes.length == 0) return acc;

  // Values from a given level are extracted into a list, then the accumulator is pushed into the list as well.
  var node_values = current_level_nodes.map((n) => {return n.value});
  node_values.push(acc);
  acc = func(node_values);

  var next_level_nodes = [];

  for (var i = 0; i < current_level_nodes.length; i ++) {
    if (current_level_nodes[i].lesser !== null) next_level_nodes.push(current_level_nodes[i].lesser);
    if (current_level_nodes[i].greater !== null) next_level_nodes.push(current_level_nodes[i].greater);
  }

  return level_walk_inner(next_level_nodes, acc, func);
}

// Wrapper function so we only need to pass in the tree and the lambda
var level_walk = function(tree, func) {
  // inital accumulator state is always set to 0...this will work with sum() and max(), but will not work with something like product()
  return level_walk_inner([tree], 0, func);
}

var sum_func = function(values) {
  return values.reduce((acc, curr) => {
    return acc + curr;
  });
}

var max_func = function(values) {
  return values.reduce((acc, curr) => {
    return (curr > acc)? curr : acc;
  });
}


var stream_2 = [1,7,2,10,15,4,25,3];
var stream_2_tree = insert_next_stream_value_into_tree(null, stream_2);
console.log("THE STREAM");
console.log(stream_2_tree);

console.log("dynamic_sum");
var dynamic_sum = level_walk(stream_2_tree, sum_func);
console.log(dynamic_sum);

console.log("dynamic_max");
var dynamic_max = level_walk(stream_2_tree, max_func);
console.log(dynamic_max);
