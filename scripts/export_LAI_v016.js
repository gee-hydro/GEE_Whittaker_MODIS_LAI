var pkg_export = require('users/kongdd/pkgs:pkg_export.js');

var list = require('users/kongdd/gee_PML2:scripts/mosaic_LAI_products.js');
var col = list['LAI_SM_V016'];

var options = {
  type: "drive",
  range: [-180, -60, 180, 89],
  // range: [70, 15, 140, 55],
  cellsize: 1 / 10,
  crs: 'EPSG:4326',
  folder: 'PML-V2'
};

print(col);
pkg_export.ExportImgCol_multiBands(col, 'LAI_Global_2000-2023_WHIT_V016', options);
