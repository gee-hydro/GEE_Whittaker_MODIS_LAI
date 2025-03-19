using Ipaper, Ipaper.sf, ArchGDAL, NetCDFTools

fs = dir(".", r"tif$")
f = fs[1]

box = bbox(-180, -60, 180, 90)

dates = Date.(str_extract(bandnames(f), "\\d{4}_\\d{2}_\\d{2}"), "yyyy_mm_dd")
lon, lat = bbox2dims(box; cellsize=0.1)

fout = "./LAI_Global_2000-2024_WHIT_V016.nc"
_dims = [
  NcDim("lon", lon),
  NcDim("lat", lat),
  NcDim_time(dates)
]
nc_write(fout, "LAI", Float32, _dims; compress=1, 
  attrib=Dict(
    "author" => "Dongdong Kong, <kongdd.sysu@gmail.com>",
    "date" => string(Dates.now()),
    "url_download" => "https://code.earthengine.google.com/2feea0498c3b9c1db7a5fe192b4a50ca"
  ))

## 然后往里填数据
nc = nc_open(fout, "a")
var = nc["LAI"]
cellsize = 0.1
@showprogress for f = fs
  A = read_gdal(f)
  replace!(A, 9.96921f36 => NaN32)
  
  b = st_bbox(f)
  ilon, ilat = bbox_overlap(b, box; cellsize)
  ilon = _zip(ilon)
  ilat = _zip(ilat)
  var[ilon, ilat, :] = A
end
nc_close(nc)
