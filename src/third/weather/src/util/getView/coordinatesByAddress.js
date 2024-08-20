import { geoByAddress } from "@/api";
async function coordinatesByAddress(address) {
    const res = await geoByAddress(address);
    const coordinates = res.data.geocodes[0].location
    return coordinates.split(",").map(item => +item)
}
export { coordinatesByAddress }












// const arr="109.749853,38.286098".split(",").map(item => +item)
// console.log(arr)