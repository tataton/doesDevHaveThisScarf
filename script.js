var scarfInventory = [
  {name: "Arab Spring", type: "Keffiyeh", colorArray: ["Black", "Brown", "White"], charArray: ["Tasseled", "Worn"]},
  {name: "Dev's Formalwear", type: "Ascot", colorArray: ["Red", "Black"], charArray: ["Fancy"]},
  {name: "Leopard Infinity", type: "Shawl", colorArray: ["Yellow", "Black"], charArray: []},
  {name: "That One I Borrowed", type: "Pashmina", colorArray: ["Orange"], charArray: ["Soft"]}
];

/*

Tried to set up a constructor function Scarf for Scarf objects. I didn't get it to
work, not sure why.

var Scarf = function Scarf(name, type, colorArray, charArray){
  // Constructor function for Dev's scarves.
  this.name = name;
  this.type = type;
  this.colorArray = colorArray;
  this.charArray = charArray;
};

var scarfInventory = [
  // Starting inventory. We could also have this come from an external file.
  Scarf("Arab Spring", "Keffiyeh", ["Black", "Brown", "White"], ["Tasseled", "Worn"]),
  Scarf("Dev's Formalwear", "Ascot", ["Red", "Black"], ["Fancy"]),
  Scarf("Leopard Infinity", "Shawl", ["Yellow", "Black"], []),
  Scarf("That One I Borrowed", "Pashmina", ["Orange"], ["Soft"])
];
*/

var invColorArray = [
  /* Can be any array of colors. Code will construct HTML input fields from
  this array. */
  "Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Brown", "Black", "White"
];

var invCharArray = [
  /* Again, any array of characteristics works. Program will again construct
  HTML forms from this array. */
  "Fancy", "Soft", "Knit", "Tasseled", "Plaid", "Worn"
];

var invReport, colorAdd, charAdd, colorSearch, charSearch, searchReport;

window.onload = function() {
  invReport = document.getElementById("invReport");
  // Section of HTML that reports inventory size.
  colorAdd = document.getElementById("colorAdd");
  charAdd = document.getElementById("charAdd");
  colorSearch = document.getElementById("colorSearch");
  charSearch = document.getElementById("charSearch");
  // Forms for adding and searching for scarves by color and characteristic.
  searchReport = document.getElementById("searchReport");
  reportInventory();
  generateColorForms();
  generateCharForms();
};

function addScarf() {
  /* Gets info from HTML input forms and adds a scarf to the inventory.
  Importantly, each scarf can have multiple colors, and multiple characteristics,
  or no colors or no characteristics.
  */
  var newName = document.getElementById("addName").value;
  var newType = document.getElementById("addType").value;
  var newColorCheck = colorAdd.querySelectorAll("input");
  var newCharCheck = charAdd.querySelectorAll("input");
  var newColorArray = [];
  var newCharArray = [];
  for (var i = 0; i < invColorArray.length; i++) {
    if (newColorCheck[i].checked) {
      newColorArray.push(invColorArray[i]);
    }
  }
  for (i = 0; i < invCharArray.length; i++) {
    if (newCharCheck[i].checked) {
      newCharArray.push(invCharArray[i]);
    }
  }
  scarfInventory.push({
    name: newName, type: newType, colorArray: newColorArray, charArray: newCharArray
  });
//  scarfInventory.push(Scarf(newName, newType, newColorArray, newCharArray));
  reportInventory();
  return;
}

function searchScarf() {
  /* Searches for a scarf by color and/or characteristic. This is made a bit
  tricky by the fact that each scarf can have multiple colors and characteristics,
  so multiple opportunities to match, and each needs to be tested. However, each
  scarf should only be reported once. */
  var noColorIsChecked = true;
  var noCharIsChecked = true;
  /* Function needs to distinguish cases in which just one characteristic is
  checked, or neither is checked (reports an error to user), or both are
  checked. At first, we'll default to neither is checked. */
  var reportText;
  var foundColorArray = [];
  var foundCharArray = [];
  var searchResultIndices = [];
  var searchColorRadio = colorSearch.querySelectorAll("input");
  // Points to color search form.
  var searchCharRadio = charSearch.querySelectorAll("input");
  // Points to characteristic search form.
  var i, j;
  for (i = 0; i < invColorArray.length; i++) {
    if (searchColorRadio[i].checked) {
      // For the one color that is selected,
      noColorIsChecked = false;
      for (j = 0; j < scarfInventory.length; j++) {
        // the function searches through the scarves one by one,
        if (scarfInventory[j].colorArray.indexOf(invColorArray[i]) !== -1) {
          // and if the color is in this particular scarf,
          if (foundColorArray.indexOf(j) == -1) {
            // and the scarf hasn't already been added to the list,
            foundColorArray.push(j);
            // the scarf's inventory index number is added to the list.
          }
        }
      }
    }
  }
  // The exact same sequence occurs for scarf characteristics.
  for (i = 0; i < invCharArray.length; i++) {
    if (searchCharRadio[i].checked) {
      noCharIsChecked = false;
      for (j = 0; j < scarfInventory.length; j++) {
        if (scarfInventory[j].charArray.indexOf(invCharArray[i]) !== -1) {
          if (foundCharArray.indexOf(j) == -1) {
            foundCharArray.push(j);
          }
        }
      }
    }
  }
  if (noColorIsChecked && noCharIsChecked) {
    searchReport.innerHTML = "<p>Please select at least one color or characteristic.</p>";
  } else if (noColorIsChecked) {
    searchReport.innerHTML = generateSearchReport(foundCharArray);
  } else if (noCharIsChecked) {
    searchReport.innerHTML = generateSearchReport(foundColorArray);
  } else {
    searchReport.innerHTML = generateSearchReport(arrayIntersect(foundColorArray, foundCharArray));
  }
}

function arrayIntersect(array1, array2) {
  var result = [];
  for (var i = 0; i < array1.length; i++) {
    var j = 0;
    var notFoundYet = true;
    while ((j < array2.length) && (notFoundYet)) {
      if (array1[i] == array2[j]) {
        result.push(array1[i]);
        notFoundYet = false;
      }
      j++;
    }
  }
  return result;
}

function generateSearchReport(indexArray) {
  var outputText;
  if (indexArray.length === 0) {
    outputText = "<p>No scarves match the selected criteria.</p>";
  } else {
    outputText = "<p>Search results:</p>\n<table>";
    for (var i = 0; i < indexArray.length; i++) {
      outputText += "\n<tr>\n<td>" + scarfInventory[indexArray[i]].name + "</td>";
      outputText += "\n<td>" + scarfInventory[indexArray[i]].type + "</td>\n<td>";
      for (var j = 0; j < (scarfInventory[indexArray[i]].colorArray.length); j++) {
        outputText += scarfInventory[indexArray[i]].colorArray[j];
        if (j < (scarfInventory[indexArray[i]].colorArray.length - 1)) {
          outputText += ", ";
        }
      }
      outputText += "</td>\n<td>";
      for (var k = 0; k < (scarfInventory[indexArray[i]].charArray.length); k++) {
        outputText += scarfInventory[indexArray[i]].charArray[k];
        if (j < (scarfInventory[indexArray[i]].charArray.length - 1)) {
          outputText += ", ";
        }
      }
      outputText += "</td>\n</tr>\n";
    }
    outputText += "\n</table>";
  }
  return outputText;
}

function reportInventory() {
  invReport.innerHTML = "<p>Dev currently has " + scarfInventory.length + " scarves.</p>";
  return;
}

function generateColorForms() {
  addOptions = "\n";
  searchOptions = "\n";
  for (var i = 0; i < invColorArray.length; i++) {
    addOptions += "<input type=\"checkbox\">" + invColorArray[i] + "\n";
    searchOptions += "<input type=\"radio\" name=\"colorSearched\">" + invColorArray[i] + "\n";
  }
  colorAdd.innerHTML = addOptions;
  colorSearch.innerHTML = searchOptions;
  return;
}

function generateCharForms() {
  addOptions = "\n";
  searchOptions = "\n";
  for (var j = 0; j < invCharArray.length; j++) {
    addOptions += "<input type=\"checkbox\">" + invCharArray[j] + "\n";
    searchOptions += "<input type=\"radio\" name=\"colorSearched\">" + invCharArray[j] + "\n";
  }
  charAdd.innerHTML = addOptions;
  charSearch.innerHTML = searchOptions;
  return;
}

function clearAdd() {
  var newColorCheck = colorAdd.querySelectorAll("input");
  var newCharCheck = charAdd.querySelectorAll("input");
  for (var i = 0; i < invColorArray.length; i++) {
    newColorCheck[i].checked = false;
  }
  for (var j = 0; j < invCharArray.length; j++) {
    newCharCheck[j].checked = false;
  }
}

function clearSearch() {
  var searchColorRadio = colorSearch.querySelectorAll("input");
  var searchCharRadio = charSearch.querySelectorAll("input");
  for (var i = 0; i < invColorArray.length; i++) {
    searchColorRadio[i].checked = false;
  }
  for (var j = 0; j < invCharArray.length; j++) {
    searchColorRadio[j].checked = false;
  }
}
