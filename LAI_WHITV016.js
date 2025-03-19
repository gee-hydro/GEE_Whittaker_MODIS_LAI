/**
 * Copyright (c) 2024 Dongdong Kong. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 * 
 * @author Dongdong Kong; 5 May, 2024
 */
// var list = require('users/kongdd/gee_PML2:scripts/mosaic_LAI_products.js');
// var col_lai_kong2019 = require('users/kongdd/gee_PML2:scripts/mosaic_LAI_Kong2019.js').smoothed; // 2000-2018
var pkg_main = require('users/kongdd/pkgs:pkg_main.js');
function tiles2col(imgcol, patterns, overlap_date_beg, old) {
  var bandname_sm = 'Lai_sm';
  var imgcol_sm = [];
  for (var i = 0; i < patterns.length; i++) {
    var pattern = !old ? '8day_' + patterns[i] + "_" : patterns[i] + "_";
    var img = imgcol.filterMetadata("system:index", "contains", pattern);
    // print(img);
    img = img.mosaic().divide(10);

    var ans = pkg_main.bands2imgcol(img, bandname_sm);
    ans = ee.ImageCollection(ans);
    if (i == patterns.length - 1 && overlap_date_beg) {
      ans = ans.filterDate(overlap_date_beg, '2024-12-31');
    }
    imgcol_sm = i === 0 ? ans : imgcol_sm.merge(ans);
  }
  return tidy_lai(imgcol_sm);
}

function tidy_lai(imgcol_sm) {
  return imgcol_sm.map(function (img) {
    img = ee.Image(img);
    return img.max(0)
      .copyProperties(img, img.propertyNames());
  });
}


/** MAIN SCRIPTS **************************************************************/
var col = ee.ImageCollection("MODIS/061/MOD15A2H");

var patterns = [2000, 2005, 2010, 2015, 2020];
var imgcol_v016 = ee.ImageCollection("projects/gee-hydro/MODIS_Terra_LAI/MOD15A2H_V061_LAI_whittaker_v16");
var imgcol_lai_v016 = tiles2col(imgcol_v016, patterns, "2020-01-01");


exports = {
  // LAI_SM_V011: imgcol_lai_v011,
  // LAI_SM_V013: imgcol_lai_v013,
  // LAI_SM_V014: imgcol_lai_v014,
  // LAI_SM_V015: imgcol_lai_v015,
  LAI_SM_V016: imgcol_lai_v016
};

// Map.addLayer(imgcol_lai);
print(exports);
