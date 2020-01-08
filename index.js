// Constant for drop-down menu
const ddMenu = document.getElementById("ddmenu");
// Constants for the array size slider
const slider = document.getElementById("myRange");
const outputSlider = document.getElementById("length");
// Constants for the rate slider
const sliderRate = document.getElementById("sizeRange");
const outputSliderRate = document.getElementById("rate");
// Constant for the sort button
const sortButton = document.getElementById("sort-button");

var array = []; // Array to be sorted
var states = [];  // Corresponding state for each element in the array
// (0 -> not touched)
// (1 -> evaluating)
var sorting = false;
var sortingRate;
outputSlider.innerHTML = slider.value; // Display the default slider value
outputSliderRate.innerHTML = sliderRate.value;
values = createBars(); // Return is array type
array = values[0];
states = values[1];

// Update the current slider value (each time you drag the slider handle)
// Create new random bars
slider.oninput = function() {
  sliderRate.disabled = false;
  sorting = false;
  outputSlider.innerHTML = this.value;
  values = createBars();  // Return is array type
  array = values[0];
  states = values[1];
}

// Create new random bars
window.onresize = function() {
  sliderRate.disabled = false;
  sorting = false;
  values = createBars();  // Return is array type
  array = values[0];
  states = values[1];
}

// Update the current sorting rate (each time you drag the slider handle for sorting rate)
sliderRate.oninput = function() {
  outputSliderRate.innerHTML = sliderRate.value;
  sortingRate = sliderRate.value;
  console.log("changing rate..." + sortingRate);
}

ddMenu.oninput = function() {
  sliderRate.disabled = false;
  sorting = false;
  values = createBars();  // Return is array type
  array = values[0];
  states = values[1];
}

function getSortingRate() {
  return sliderRate.value;
}

// When the sort button is clicked
sortButton.onclick = function() {
  sorting = true;
  sliderRate.disabled = true;
  const algo = ddMenu.options[ddMenu.selectedIndex].value;
  switch(algo) {
    case "selectionSort":
      var sortedArray = selectionSort(array, states);
      break;
    case "bubbleSort":
      var sortedArray = bubbleSort(array, states);
      break;
    case "quickSort":
      var sortedArray = quickSort(array, 0, array.length-1, states);
      break;
    case "insertionSort":
      var sortedArray = insertionSort(array, states);
      break;
    default:
      alert("A problem occured, please refresh the page.");
  }
  displayChanges(sortedArray);
}

// Function to create random bars and display them
function createBars() {
  const canvasWidth = document.getElementById("bars-canvas").offsetWidth;
  var originalArray = [];
  var originalStates = [];
  const max = 256;
  const min = 1;
  var bars = '';
  for(var i=0; i<(slider.value); i++) {
    // Assign random value to each array element
    originalArray[i] = Math.floor(Math.random()*(max - min)) + min;
    // Assign the value 0 for each of the created values since they have not been handled yet
    originalStates[i] = 0;
    var barColor = getColorStart(originalArray[i]);
    bars += '<td valign="bottom"><div style="height:' + originalArray[i] + 'px; width: ' + ((canvasWidth-slider.value)/2/(slider.value)-1) + 'px; background-color:'+ barColor +'; color: '+ barColor +'; font-size: 1px; margin: 1px"></div></td>';
  }
  document.getElementById("bars-canvas").innerHTML = '<div style="position: absolute; bottom: 0; left: 25%"><table cellspacing="0" cellpadding="0"><tr>' + bars + '</tr></table></div>';
  console.log(originalArray);
  console.log(originalStates);
  return [originalArray, originalStates];
}

// Function to store the changes made by the algorithm
function stageChanges(stagedArray, stagedChanges) {
  var bars = '';
  var canvasWidth = document.getElementById("bars-canvas").offsetWidth;
  for(var i=0; i<stagedArray.length; i++) {
    var barColor = getColor(stagedArray[i], stagedChanges[i]);
    bars += '<td valign="bottom"><div style="height:' + stagedArray[i] + 'px; width: ' + ((canvasWidth-slider.value)/2/(slider.value)-1) + 'px; background-color: '+ barColor +'; color: '+ barColor +'; font-size: 1px; margin: 1px"></div></td>';
  }
  return('<div style="position: absolute; bottom: 0; left: 25%"><table cellspacing="0" cellpadding="0"><tr>' + bars + '</tr></table></div>');
}

// Function to display the sorting of the bars
function displayChanges(changedArray) {
  var i = 0;
  var refreshIntervalId = setInterval(function() {
		if (i < (changedArray.length) && sorting) {
	    document.getElementById("bars-canvas").innerHTML = changedArray[i];
      } else {
          clearInterval(refreshIntervalId);
      }
		i++

  }, (1000/(sortingRate*3)));
}

// Function to get the color of a bar given its height
function getColor(height, val) {
  switch(val) {
    case 0:
      if(height >= 0 && height <= 64)
        return "#FF0000";
      if(height > 64 && height <= 128)
        return "#ff7315";
      if(height > 128 && height <= 192)
        return "#e9ea77";
      if(height > 192 && height <= 256)
        return "#85ef47";
    case 1:
      return "#0000ff";
  }
}

function getColorStart(height) {
  if(height >= 0 && height <= 64)
    return "#FF0000";
  if(height > 64 && height <= 128)
    return "#ff7315";
  if(height > 128 && height <= 192)
    return "#e9ea77";
  if(height > 192 && height <= 256)
    return "#85ef47";
}

// SORTING ALGORITHMS
// Function for bubble sort
function bubbleSort(arr, states) {
  var swapped;
  var j = 1;
  var stop = arr.length;
  var stages = [];
  do {
    swapped = false;
    for (var i=0; i < arr.length-1; i++) {
      if (arr[i] > arr[i+1]) {
        var temp = arr[i];
        arr[i] = arr[i+1];
        arr[i+1] = temp;
        // states[i+1] = 1;
        states[i] = 0;
        swapped = true;
        stages.push(stageChanges(arr, states));
      }
      else if(i < stop)
          states[i]=0;
    }
    states[arr.length-j] = 0; // Was 2
    j++;
    stop--;
  } while (swapped);
  for(var k = 0; k < arr.length; k++) {
    states[k] = 0;  // Was 2
  }
  stages.push(stageChanges(arr, states));
  return stages;
}

// Function for selection sort
function selectionSort(arr, states) {
  var stages = [];
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    states[i] = 1;
    stages.push(stageChanges(array, states));
    for (let j = i + 1; j < arr.length; j++) {
      states[j] = 1;
      states[j-1] = 0;
      if (arr[min] > arr[j])
        min = j;
      stages.push(stageChanges(array, states));
    }
    if (min != i) {
      let tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp;
    }
    states[arr.length-1]=0;
    states[i] = 0;  // Was 2
    stages.push(stageChanges(array, states));
  }
  for(var k = 0; k < arr.length; k++) {
    states[k] = 0; // Was 2
  }
  stages.push(stageChanges(arr, states));
  return stages;
}

// Function for quick sort
function quickSort(arr, left, right, states) {

  function partition(arr, left, right, states) {
    var pivot   = arr[Math.floor((right + left) / 2)], //middle element
      i       = left, //left pointer
      j       = right; //right pointer
    while (i <= j) {
      while (arr[i] < pivot) {
        states[i]=0;  // Was 1
        if (i-1 >= 0)
          states[i-1]=0;
        stages.push(stageChanges(arr, states));
        i++;
      }
      while (arr[j] > pivot) {
        states[j]=0; // Was 1
        if (j+1 < arr.length)
          states[j+1]=0;
        stages.push(stageChanges(arr, states));
        j--;
      }
      if (i <= j) {
        swap(arr, i, j, states); //swapping two elements
        stages.push(stageChanges(arr, states));
        i++;
        j--;
      }
      stages.push(stageChanges(arr, states));
    }
    stages.push(stageChanges(arr, states));
    return i;
  }

  function swap(arr, leftIndex, rightIndex, states){
    var temp = arr[leftIndex];
    arr[leftIndex] = arr[rightIndex];
    arr[rightIndex] = temp;
    stages.push(stageChanges(arr, states));
  }

  var stages = [];
  var index;
  stages.push(stageChanges(arr, states));
  if (arr.length > 1) {
    index = partition(arr, left, right, states); //index returned from partition
    if (left < index - 1) { //more elements on the left side of the pivot
      stages.push(stageChanges(arr, states));
      quickSort(arr, left, index - 1, states);
    }
    if (index < right) { //more elements on the right side of the pivot
      stages.push(stageChanges(arr, states));
      quickSort(arr, index, right, states);
    }
  }
  for(var k = 0; k < arr.length; k++) {
    states[k] = 0; // Was 2
  }
  stages.push(stageChanges(arr, states));
  console.log(arr);
  return stages;

}

// Function for insertion sort
function insertionSort(arr, states) {
  var stages = [];
  for(var j = 1; j < arr.length; j++) {
    var key = arr[j];
    states[key] = 0;
    stages.push(stageChanges(arr, states));
    var i = j - 1;
    while(i >= 0 && arr[i] > key) {
      arr[i+1] = arr[i];
      i--;
    }
    arr[i+1] = key;
  }
  for(var k = 0; k < arr.length; k++) {
    states[k] = 0;
  }
  stages.push(stageChanges(arr, states));
  return stages;
}
