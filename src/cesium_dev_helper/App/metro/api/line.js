import api from "./request";
import { lineColors } from "../store/staticData";
import { DataPrepocesser } from "../../../_lib/Data";
import { CoordTransformer } from '../../../_lib/Compute'

export const getLine = async (params) => {
    try {
        const { data, code } = await api.get(`/getLine`, { params });
        if (code === 200) {
            const metroLines = data.map((metroLine, index) => {
                const { xs, ys, stationsList } = metroLine;
                const colorIndex = index % lineColors.length;
                const color = lineColors[colorIndex];
                const posArr = new DataPrepocesser().xsysLoader(xs, ys); // 整理坐标
                metroLine.color = color;
                metroLine.checked = true;
                metroLine.paths = posArr;

                if (stationsList.length) {
                    metroLine.stationsList = stationsList.map(station => {
                        const { xy_coords, ...rest } = station
                        const [lng, lat] = xy_coords.split(";").map(Number)
                        const [lngWgs84, latWgs84] = new CoordTransformer().GCJ02ToWGS84(
                            lng,
                            lat
                        );
                        return { position: { lng: lngWgs84, lat: latWgs84 }, ...rest }
                    })
                }
                return metroLine;
            });
            return metroLines;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error);
    }
};
export const getLinePlan = (params) => api.get(`/getLinePlan`, { params });

// by name
export const getStationInfo = (params) =>
    api.get(`/getStationInfo`, { params });

// https://restapi.amap.com/v3/weather/weatherInfo?parameters
export const getWeather = async () => {
    const params = {
        key: import.meta.env.VITE_gaodeKey,
        city: '420100'//wuhan
    }

    const data = await api.get('https://restapi.amap.com/v3/weather/weatherInfo', { params })
    return data
}
