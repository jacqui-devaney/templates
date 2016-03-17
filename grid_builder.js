//TODO: Implmenet column_full, rail_content, jpml

var util = require('util');
var extend = require('util')._extend;

function grid_builder() {
  this.portraitColCount = 12;
  this.landscapeColCount = 16;
  this.leftMargin = 10; //Col widths don't use this; positions do
  this.rightMargin = 10; //Col widths don't use this; positions do
  this.interColumnMargin = 12;
  this.portraitPixelCount = 768;
  this.landscapePixelCount = 1024;



  //Computed
  this.gridPortraitSize = this.portraitPixelCount - this.leftMargin - this.rightMargin;
  this.gridLandscapeSize = this.landscapePixelCount - this.leftMargin - this.rightMargin;

  this.columnWidth = this.gridLandscapeSize / this.landscapeColCount - this.interColumnMargin;
}

module.exports = grid_builder;


grid_builder.prototype.widthForColumnCount = function(columnCount) {
  var baseWidth = this.columnWidth * columnCount;
  var marginWidth = this.interColumnMargin * (columnCount - 1);

  var finalWidth = baseWidth + marginWidth;
  return finalWidth;
};


grid_builder.prototype.positionForPositionIndex = function(positionIndex) {
  var startingIndex = this.leftMargin;

  if (positionIndex <= 1) {
    return startingIndex;
  }

  var finalPosition = startingIndex + this.widthForColumnCount(positionIndex - 1);

  return finalPosition;
};

grid_builder.prototype.landscapeAndPortraitPositionsForIndices = function(landscapeIndex, portraitIndex) {
  var landscapePosition = this.positionForPositionIndex(landscapeIndex);
  var portraitPosition = this.positionForPositionIndex(portraitIndex);

  return [landscapePosition, portraitPosition];
};


//As of now, width of portrait and landscape is the same
grid_builder.prototype.landscapeAndPortaitWidthsForColumnCount = function(landscapeIndex, portraitIndex) {
  var width = this.widthForColumnCount(landscapeIndex);
  return width;
};


grid_builder.prototype.basicColumnStyles = function() {
  var styles = {};
  for(var i = 1; i <= this.landscapeColCount; i++) {
    var columnName = ".column" + i;

    var columnWidth = this.widthForColumnCount(i);
    var style = {
    };

    styles[columnName] = {
      "width": columnWidth
    };
  }

  return styles;
};

grid_builder.prototype.allColumnStylePermutations = function() {
  var styles = {};
  for(var landscapeIndex = 1; landscapeIndex <= this.landscapeColCount; landscapeIndex++) {
    var landscapeWidth = this.widthForColumnCount(landscapeIndex);
    for(var portraitIndex = 1; portraitIndex <= this.portraitColCount; portraitIndex++) {
      var portraitWidth = this.widthForColumnCount(portraitIndex);

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

  for(var i = 1; i <= this.landscapeColCount; i++) {
    var positionValue = this.positionForPositionIndex(i);

    var positionName = util.format('.positionx%s', i);

    positions[positionName] = {
      left: positionValue
    };


  }
  return positions;
};

grid_builder.prototype.allPositionPermutations = function() {
  var positions = {};
  for(var landscapeIndex = 1; landscapeIndex <= this.landscapeColCount; landscapeIndex++) {
    var landscapePosition = this.positionForPositionIndex(landscapeIndex);
    for(var portraitIndex = 1; portraitIndex <= this.portraitColCount; portraitIndex++) {
      var portraitPosition = this.positionForPositionIndex(portraitIndex);

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

  // var basicColumns = gridBuilder.basicColumnStyles();
  // var allColPermutations = gridBuilder.allColumnStylePermutations();

  // var basicPositions = gridBuilder.basicPositions();

  // var allPositionPermutations = gridBuilder.allPositionPermutations();
  var allValues = gridBuilder.generateStylesheet();

  console.log(JSON.stringify(allValues, {}, 2).replace(/"/g, ''));

  // console.log("BLAH IS: " + gridBuilder.widthForColumnCount(2));
}