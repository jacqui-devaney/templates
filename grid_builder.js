#!/usr/bin/env node

var util = require('util');
var extend = require('util')._extend;

function grid_builder() {
  this.grid = {
    horizontal: {
      portrait: {
        columns: 12,
        margin: {
          left: 22,
          right: 22
        },
        gutter: 20,
        width: 768
      },
      landscape: {
        columns: 16,
        margin: {
          left: 26,
          right: 26
        },
        gutter: 20,
        width: 1024
      }
    }
  };

  // Computed
  this.gridPortraitSize = this.grid.horizontal.portrait.width - this.grid.horizontal.portrait.margin.left - this.grid.horizontal.portrait.margin.right;
  this.gridLandscapeSize = this.grid.horizontal.landscape.width - this.grid.horizontal.landscape.margin.left - this.grid.horizontal.landscape.margin.right;

  this.portraitColumnWidth = (this.gridPortraitSize - (this.grid.horizontal.portrait.columns - 1) * this.grid.horizontal.portrait.gutter) / this.grid.horizontal.portrait.columns;
  this.landscapeColumnWidth = (this.gridLandscapeSize - (this.grid.horizontal.landscape.columns - 1) * this.grid.horizontal.portrait.gutter) / this.grid.horizontal.landscape.columns;
}

module.exports = grid_builder;


grid_builder.prototype.widthForPortraitColumnCount = function(columnCount) {
  var baseWidth = this.portraitColumnWidth * columnCount;
  var gutterWidthSum = this.grid.horizontal.portrait.gutter * (columnCount - 1);

  var totalWidth = baseWidth + gutterWidthSum;
  return totalWidth;
};

grid_builder.prototype.widthForLandscapeColumnCount = function(columnCount) {
  var baseWidth = this.landscapeColumnWidth * columnCount;
  var gutterWidthSum = this.grid.horizontal.portrait.gutter * (columnCount - 1);
  var totalWidth = baseWidth + gutterWidthSum;
  return totalWidth;
};

grid_builder.prototype.positionForPortraitPositionIndex = function(positionIndex) {
  var startingValue = this.grid.horizontal.portrait.margin.left;

  if (positionIndex <= 1) {
    return startingValue;
  }

  var finalPosition = startingValue + this.widthForPortraitColumnCount(positionIndex - 1) + this.grid.horizontal.portrait.gutter;

  return finalPosition;
};

grid_builder.prototype.positionForLandscapePositionIndex = function(positionIndex) {
  var startingIndex = this.grid.horizontal.landscape.margin.left;

  if (positionIndex <= 1) {
    return startingIndex;
  }

  var finalPosition = startingIndex + this.widthForLandscapeColumnCount(positionIndex - 1) + this.grid.horizontal.portrait.gutter;
  return finalPosition;
};


grid_builder.prototype.landscapeAndPortraitPositionsForIndices = function(landscapeIndex, portraitIndex) {
  var landscapePosition = this.positionForLandscapePositionIndex(landscapeIndex);
  var portraitPosition = this.positionForPortraitPositionIndex(portraitIndex);

  return [landscapePosition, portraitPosition];
};



grid_builder.prototype.basicColumnStyles = function() {
  var styles = {};
  for(var i = 1; i <= this.grid.horizontal.landscape.columns; i++) {
    var columnName = ".column" + i;

    var portraitWidth = this.widthForPortraitColumnCount(i);
    var landscapeWidth = this.widthForLandscapeColumnCount(i);
    styles[columnName] = {
      "width": {
        if: "=landscape",
        then: landscapeWidth,
        else: portraitWidth
      }
    };
  }

  return styles;
};

grid_builder.prototype.allColumnStylePermutations = function() {
  var styles = {};
  for(var landscapeIndex = 1; landscapeIndex <= this.grid.horizontal.landscape.columns; landscapeIndex++) {
    var landscapeWidth = this.widthForLandscapeColumnCount(landscapeIndex);
    for(var portraitIndex = 1; portraitIndex <= this.grid.horizontal.portrait.columns; portraitIndex++) {
      var portraitWidth = this.widthForPortraitColumnCount(portraitIndex);

      var styleName = util.format(".column%s-%s", landscapeIndex, portraitIndex);
      styles[styleName] = {
        width: {
          if: "=landscape",
          then: landscapeWidth,
          else: portraitWidth
        }
      };

    }
  }

  return styles;
};

//TODO: Come back for different left and right margins
grid_builder.prototype.basicPositions = function() {
  var positions = {};

  for(var i = 1; i <= this.grid.horizontal.landscape.columns; i++) {
    var landscapeValue = this.positionForLandscapePositionIndex(i);
    var portraitValue = this.positionForPortraitPositionIndex(i);

    var positionName = util.format('.positionx%s', i);

    positions[positionName] = {
      left: {
        if: "=landscape",
        then: landscapeValue,
        else: portraitValue
      }
    };


  }
  return positions;
};

grid_builder.prototype.allPositionPermutations = function() {
  var positions = {};
  for (var landscapeIndex = 1; landscapeIndex <= this.grid.horizontal.landscape.columns; landscapeIndex++) {
    var landscapePosition = this.positionForLandscapePositionIndex(landscapeIndex);
    for (var portraitIndex = 1; portraitIndex <= this.grid.horizontal.portrait.columns; portraitIndex++) {
      var portraitPosition = this.positionForPortraitPositionIndex(portraitIndex);

      var positionName = util.format('.positionx%s-%s', landscapeIndex, portraitIndex);

      positions[positionName] = {
        left: {
          if: "=landscape",
          then: landscapePosition,
          else: portraitPosition
        }
      };
    }

  }

  return positions;
};

grid_builder.prototype.generateStylesheet = function() {

  var basicColumns = this.basicColumnStyles();
  var allColPermutations = this.allColumnStylePermutations();
  var basicPositions = this.basicPositions();
  var allPositionPermutations = this.allPositionPermutations();

  var grid = {};

  //Setup defaults
  grid[".column_full"] = {
      width: {
          if: "=landscape",
          then: this.grid.horizontal.landscape.width,
          else: this.grid.horizontal.portrait.width
      }
  };

  grid["#rail_content"] = {
      top: 0,
      height: {
          if: "=landscape",
          then: 658,
          else: 914
      },
      "border-width": [0,0,0,1],
      "border-color": "#d8d8d8"
  };

  grid.jpml = {
    padding: {
      if: "=scale.phone",
      else: {
        if: "=portrait",
        then: [{if: "=intent.article", then:80, else:104}, 0, 0, 0],
        else: [{if: "=intent.article", then:80, else:108}, 0, 0, 0]
      }



    }
  };

  var key;
  for(key in basicColumns) {
    grid[key] = basicColumns[key];
  }

  for(key in allColPermutations) {
    grid[key] = allColPermutations[key];
  }

  for(key in basicPositions) {
    grid[key] = basicPositions[key];
  }

  for(key in allPositionPermutations) {
    grid[key] = allPositionPermutations[key];
  }

  return grid;

};

if (require.main === module) {
  var gridBuilder = new grid_builder();

  var basicColumns = gridBuilder.basicColumnStyles();
  // var allColPermutations = gridBuilder.allColumnStylePermutations();

  // var basicPositions = gridBuilder.basicPositions();

  // var allPositionPermutations = gridBuilder.allPositionPermutations();
  var allValues = gridBuilder.generateStylesheet();

  console.log(JSON.stringify(allValues, {}, 2).replace(/"/g, ''));

  // console.log("BLAH IS: " + gridBuilder.widthForColumnCount(2));
}
