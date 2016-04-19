#!/usr/bin/env node

var LANDSCAPE_STYLE_COMPONENT = "landscape";
var PORTRAIT_STYLE_COMPONENT = "portrait";
var COLUMNS_STYLE_COMPONENT = "columns";
var XPOSITION_STYLE_COMPONENT = "xposition";
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
    }
  };

  // Computed
  this.grid.horizontal.portrait.grid.width = this.grid.horizontal.portrait.screen.width - this.grid.horizontal.portrait.margin.left - this.grid.horizontal.portrait.margin.right;
  this.grid.horizontal.landscape.grid.width = this.grid.horizontal.landscape.screen.width - this.grid.horizontal.landscape.margin.left - this.grid.horizontal.landscape.margin.right;

  this.grid.horizontal.portrait.column.width = (this.grid.horizontal.portrait.grid.width - (this.grid.horizontal.portrait.columns - 1) * this.grid.horizontal.portrait.gutter) / this.grid.horizontal.portrait.columns;
  this.grid.horizontal.landscape.column.width = (this.grid.horizontal.landscape.grid.width - (this.grid.horizontal.landscape.columns - 1) * this.grid.horizontal.landscape.gutter) / this.grid.horizontal.landscape.columns;
}

module.exports = grid_builder;

grid_builder.prototype.widthForPortraitColumnCount = function(columnCount) {
  var baseWidth = this.grid.horizontal.portrait.column.width * columnCount;
  var gutterWidthSum = this.grid.horizontal.portrait.gutter * (columnCount - 1);

  var totalWidth = baseWidth + gutterWidthSum;
  return totalWidth;
};

grid_builder.prototype.widthForLandscapeColumnCount = function(columnCount) {
  var baseWidth = this.grid.horizontal.landscape.column.width * columnCount;
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

  var finalPosition = startingIndex + this.widthForLandscapeColumnCount(positionIndex - 1) + this.grid.horizontal.landscape.gutter;
  return finalPosition;
};

grid_builder.prototype.getHorizontalStyles = function() {
  var styles = {};

  for (var i = 1; i <= this.grid.horizontal.landscape.columns; i++) {

    // Columns
    
    // All
    styles[styleTag([COLUMNS_STYLE_COMPONENT, i])] = {
      "width": {
        if: "=portrait",
        then: this.widthForPortraitColumnCount(i),
        else: this.widthForLandscapeColumnCount(i)
      }
    };
    // Portrait
    styles[styleTag([PORTRAIT_STYLE_COMPONENT, COLUMNS_STYLE_COMPONENT, i])] = {
      "width": {
        if: "=portrait",
        then: this.widthForPortraitColumnCount(i)
      }
    };
    // Landscape
    styles[styleTag([LANDSCAPE_STYLE_COMPONENT, COLUMNS_STYLE_COMPONENT, i])] = {
      "width": {
        if: "=landscape",
        then: this.widthForLandscapeColumnCount(i)
      }
    };

    // Positions
    // All
    styles[styleTag([XPOSITION_STYLE_COMPONENT, i])] = {
      left: {
        if: "=portrait",
        then: this.positionForPortraitPositionIndex(i),
        else: this.positionForLandscapePositionIndex(i)
      }
    };
   // Portrait
    styles[styleTag([PORTRAIT_STYLE_COMPONENT, XPOSITION_STYLE_COMPONENT, i])] = {
      left: {
        if: "=portrait",
        then: this.positionForPortraitPositionIndex(i)
      }
    };
    // Landscape
    styles[styleTag([LANDSCAPE_STYLE_COMPONENT, XPOSITION_STYLE_COMPONENT, i])] = {
      left: {
        if: "=landscape",
        then: this.positionForLandscapePositionIndex(i)
      }
    };
  }

  return styles;
};

grid_builder.prototype.generateStylesheet = function() {


  var grid = {};

  // Defaults
  grid[".column_full"] = {
      width: {
          if: "=landscape",
          then: this.grid.horizontal.landscape.screen.width,
          else: this.grid.horizontal.portrait.screen.width
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
  
  // Computed Styles
  var horizontalStyles = this.getHorizontalStyles();

  var key;
  for (key in horizontalStyles) {
    grid[key] = horizontalStyles[key];
  }

  return grid;

};

if (require.main === module) {
  var gridBuilder = new grid_builder();
  var allValues = gridBuilder.generateStylesheet();
  console.log(JSON.stringify(allValues, {}, 2).replace(/"/g, ''));
}
