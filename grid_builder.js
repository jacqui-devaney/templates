#!/usr/bin/env node

var LANDSCAPE_STYLE_COMPONENT = "landscape";
var PORTRAIT_STYLE_COMPONENT = "portrait";
var COLUMNS_STYLE_COMPONENT = "columns";
var LINES_STYLE_COMPONENT = "lines";
var XPOSITION_STYLE_COMPONENT = "xposition";
var YPOSITION_STYLE_COMPONENT = "yposition";
var STYLE_COMPONENT_SEPARATOR = "-";
var STYLE_COMPONENT_PREFIX = ".";

function styleTag(components) {
  var tag = STYLE_COMPONENT_PREFIX + components[0];
  components.splice(0, 1);
  for (var i = 0; i < components.length; i++) {
    tag += STYLE_COMPONENT_SEPARATOR + components[i];
  }
  return tag;
}

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
        screen: {
          width: 768
        },
        grid: {
          // Computed
        },
        column: {
          // Computed
        }
      },
      landscape: {
        columns: 16,
        margin: {
          left: 26,
          right: 26
        },
        gutter: 20,
        screen: {
          width: 1024
        },
        grid: {
          // Computed
        },
        column: {
          // Computed
        }
      }
    },
    vertical: {
      portrait: {
        margin: {
          top: 0,
          bottom: 0
        },
        lineHeight: 20,
        screen: {
          height: 768
        },
        grid: {
          // Computed
        }
      },
      landscape: {
        margin: {
          top: 0,
          bottom: 0
        },
        lineHeight: 20,
        screen: {
          height: 1024
        },
        grid: {
          // Computed
        }
      }
    }
  };


  // Computed

  // Vertical
  
  // Grid width (screen size minus the top and bottom margins)
  this.grid.vertical.portrait.grid.height = this.grid.vertical.portrait.screen.height - this.grid.vertical.portrait.margin.top - this.grid.vertical.portrait.margin.bottom;
  this.grid.vertical.landscape.grid.height = this.grid.vertical.landscape.screen.height - this.grid.vertical.landscape.margin.top - this.grid.vertical.landscape.margin.bottom;
  
  // Lines count
  this.grid.vertical.portrait.lines = this.grid.vertical.portrait.grid.height / this.grid.vertical.portrait.lineHeight;
  this.grid.vertical.landscape.lines = this.grid.vertical.landscape.grid.height / this.grid.vertical.landscape.lineHeight;
  
  // Horizontal

  // Grid width (screen size minus the left and right margins)
  this.grid.horizontal.portrait.grid.width = this.grid.horizontal.portrait.screen.width - this.grid.horizontal.portrait.margin.left - this.grid.horizontal.portrait.margin.right;
  this.grid.horizontal.landscape.grid.width = this.grid.horizontal.landscape.screen.width - this.grid.horizontal.landscape.margin.left - this.grid.horizontal.landscape.margin.right;

  // Column Width (width of each column, the "unit")
  this.grid.horizontal.portrait.column.width = (this.grid.horizontal.portrait.grid.width - (this.grid.horizontal.portrait.columns - 1) * this.grid.horizontal.portrait.gutter) / this.grid.horizontal.portrait.columns;
  this.grid.horizontal.landscape.column.width = (this.grid.horizontal.landscape.grid.width - (this.grid.horizontal.landscape.columns - 1) * this.grid.horizontal.landscape.gutter) / this.grid.horizontal.landscape.columns;
}

module.exports = grid_builder;

// Vertical Helpers

grid_builder.prototype.portraitHeightForLines = function(lineCount) {
  return this.grid.vertical.portrait.lineHeight * lineCount;
};

grid_builder.prototype.landscapeHeightForLines = function(lineCount) {
  return this.grid.vertical.landscape.lineHeight * lineCount;
};

grid_builder.prototype.portraitPositionYForIndex = function(positionIndex) {
  var startingValue = this.grid.vertical.portrait.margin.top;

  var finalPosition = startingValue + this.portraitHeightForLines(positionIndex);

  return finalPosition;
};

grid_builder.prototype.landscapePositionYForIndex = function(positionIndex) {
  var startingValue = this.grid.vertical.landscape.margin.top;

  var finalPosition = startingValue + this.landscapeHeightForLines(positionIndex);

  return finalPosition;
};

// Horizontal Helpers

grid_builder.prototype.portraitWidthForColumns = function(columnCount) {
  var baseWidth = this.grid.horizontal.portrait.column.width * columnCount;
  var gutterWidthSum = this.grid.horizontal.portrait.gutter * (columnCount - 1);

  var totalWidth = baseWidth + gutterWidthSum;
  return totalWidth;
};

grid_builder.prototype.landscapeWidthForColumns = function(columnCount) {
  var baseWidth = this.grid.horizontal.landscape.column.width * columnCount;
  var gutterWidthSum = this.grid.horizontal.portrait.gutter * (columnCount - 1);
  var totalWidth = baseWidth + gutterWidthSum;
  return totalWidth;
};

grid_builder.prototype.portraitPositionXForIndex = function(positionIndex) {
  var startingValue = this.grid.horizontal.portrait.margin.left;

  if (positionIndex <= 1) {
    return startingValue;
  }

  var finalPosition = startingValue + this.portraitWidthForColumns(positionIndex - 1) + this.grid.horizontal.portrait.gutter;

  return finalPosition;
};

grid_builder.prototype.landscapePositionXForIndex = function(positionIndex) {
  var startingIndex = this.grid.horizontal.landscape.margin.left;

  if (positionIndex <= 1) {
    return startingIndex;
  }

  var finalPosition = startingIndex + this.landscapeWidthForColumns(positionIndex - 1) + this.grid.horizontal.landscape.gutter;
  return finalPosition;
};

// Get Vertical Styles

grid_builder.prototype.getVerticalStyles = function() {
  var styles = {};

  var linesLength = Math.max(this.grid.vertical.landscape.lines, this.grid.vertical.portrait.lines);
  for (var i = 1; i <= this.grid.vertical.landscape.lines; i++) {
    
    // Lines
    
    // All
    styles[styleTag([LINES_STYLE_COMPONENT, i])] = {
      "height": {
        if: "=portrait",
        then: this.portraitHeightForLines(i),
        else: this.landscapeHeightForLines(i)
      }
    };
    // Portrait
    styles[styleTag([PORTRAIT_STYLE_COMPONENT, LINES_STYLE_COMPONENT, i])] = {
      "height": {
        if: "=portrait",
        then: this.portraitHeightForLines(i),
      }
    };
    // Landscape
    styles[styleTag([LANDSCAPE_STYLE_COMPONENT, LINES_STYLE_COMPONENT, i])] = {
      "height": {
        if: "=landscape",
        then: this.landscapeHeightForLines(i),
      }
    };
  
    // Lines
 
    // All
    styles[styleTag([YPOSITION_STYLE_COMPONENT, i])] = {
      top: {
        if: "=portrait",
        then: this.portraitPositionYForIndex(i),
        else: this.landscapePositionYForIndex(i),
      }
    };
    // Portait
    styles[styleTag([PORTRAIT_STYLE_COMPONENT, YPOSITION_STYLE_COMPONENT, i])] = {
      top: {
        if: "=portrait",
        then: this.portraitPositionYForIndex(i),
      }
    };
    // Landscape
    styles[styleTag([LANDSCAPE_STYLE_COMPONENT, YPOSITION_STYLE_COMPONENT, i])] = {
      top: {
        if: "=landscape",
        then: this.landscapePositionYForIndex(i),
      }
    };
  
  }

  return styles;
};

// Get Horizontal Styles

grid_builder.prototype.getHorizontalStyles = function() {
  var styles = {};

  var columnsLength = Math.max(this.grid.horizontal.landscape.columns, this.grid.horizontal.portrait.columns);
  for (var i = 1; i <= this.grid.horizontal.landscape.columns; i++) {

    // Columns
    
    // All
    styles[styleTag([COLUMNS_STYLE_COMPONENT, i])] = {
      "width": {
        if: "=portrait",
        then: this.portraitWidthForColumns(i),
        else: this.landscapeWidthForColumns(i)
      }
    };
    // Portrait
    styles[styleTag([PORTRAIT_STYLE_COMPONENT, COLUMNS_STYLE_COMPONENT, i])] = {
      "width": {
        if: "=portrait",
        then: this.portraitWidthForColumns(i)
      }
    };
    // Landscape
    styles[styleTag([LANDSCAPE_STYLE_COMPONENT, COLUMNS_STYLE_COMPONENT, i])] = {
      "width": {
        if: "=landscape",
        then: this.landscapeWidthForColumns(i)
      }
    };

    // Positions
    
    // All
    styles[styleTag([XPOSITION_STYLE_COMPONENT, i])] = {
      left: {
        if: "=portrait",
        then: this.portraitPositionXForIndex(i),
        else: this.landscapePositionXForIndex(i)
      }
    };
   // Portrait
    styles[styleTag([PORTRAIT_STYLE_COMPONENT, XPOSITION_STYLE_COMPONENT, i])] = {
      left: {
        if: "=portrait",
        then: this.portraitPositionXForIndex(i)
      }
    };
    // Landscape
    styles[styleTag([LANDSCAPE_STYLE_COMPONENT, XPOSITION_STYLE_COMPONENT, i])] = {
      left: {
        if: "=landscape",
        then: this.landscapePositionXForIndex(i)
      }
    };
  }

  return styles;
};

grid_builder.prototype.generateStylesheet = function() {

  var grid = {};

  // Computed Styles
  
  // Horizontal
  var horizontalStyles = this.getHorizontalStyles();
  var horizontalKey;
  for (horizontalKey in horizontalStyles) {
    grid[horizontalKey] = horizontalStyles[horizontalKey];
  }

  // Vertical
  var verticalStyles = this.getVerticalStyles();
  var verticalKey;
  for (verticalKey in verticalStyles) {
    grid[verticalKey] = verticalStyles[verticalKey];
  }
  
  return grid;
};

if (require.main === module) {
  var gridBuilder = new grid_builder();
  var allValues = gridBuilder.generateStylesheet();
  console.log(JSON.stringify(allValues, {}, 2).replace(/"/g, ''));
}
