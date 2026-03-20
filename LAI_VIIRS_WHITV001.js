/**
 * Copyright (c) 2024 Dongdong Kong. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 * 
 * @author Dongdong Kong; 8 Mar, 2026
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

        // 
        if (i == patterns.length - 1 && overlap_date_beg) {
            ans = ans.filterDate(overlap_date_beg, '2099-12-31'); // last image
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
// var patterns = [2000, 2005, 2010, 2015, 2020];
// var imgcol_v01 = ee.ImageCollection("projects/gee-hydro/MODIS_Terra_LAI/MOD15A2H_V061_LAI_whittaker_v16");
// var imgcol_lai_v01 = tiles2col(imgcol_v01, patterns, "2020-01-01");

// 2012-2016, 2017-2021, 2020-2025 (2022-2025)
var patterns = [2012, 2017, 2020];

var tiles = ee.ImageCollection("projects/pml_evapotranspiration/MODIS/LAI/VNP15A2H_V002_LAI_whittaker_v01");
var col_lai_v01 = tiles2col(tiles, patterns, "2022-01-01");

exports = {
    LAI_SM_V01: col_lai_v01
};

// var vis = { min: 0, max: 5, palette: ['red', 'yellow', 'white', 'green'] };
// print(tiles);
// var img = tiles.mosaic().reduce('mean').divide(10);
// Map.addLayer(img, vis);

// Map.addLayer(col_lai_v01.mean(), vis, "LAI_smoothed");
// print(exports);
