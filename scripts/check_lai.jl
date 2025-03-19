using MakieLayers, GLMakie, NetCDFTools, Ipaper, Ipaper.sf
using Dates

f = "./LAI_Global_2000-2024_WHIT_V016.nc"
period=(2024, 2024)

# @time A = nc_read(f);
# replace!(A, 9.96921f36 => NaN32)
# _dims = nc_dims(f)
# nc_write("LAI_Global_2000-2024_WHIT_V016_V5.nc", "LAI", A, _dims; 
#   overwrite=true,
#   attrib = Dict(
#     "author" => "Dongdong Kong, <kongdd.sysu@gmail.com>",
#     "date" => string(Dates.now()),
#     "url_download" => "https://code.earthengine.google.com/2feea0498c3b9c1db7a5fe192b4a50ca"
#   ))

@time A = nc_read(f; period);

lon, lat = st_dims(f)
dates = nc_date(f; period)
titles = string.(Date.(dates))

begin
  fig = Figure(; size=(1400, 800))
  imagesc!(fig, lon, lat, A[:, :, 1:16]; titles=titles[1:16])
  fig
end
