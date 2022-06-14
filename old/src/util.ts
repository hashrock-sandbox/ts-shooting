export class Util {
  static toDegrees(rad: number) {
    return rad * 180.0 / Math.PI;
  }
  static toRadians(deg: number) {
    return deg * Math.PI / 180.0;
  }
  static normalize(y: number) {
    return -y + 500;
  }
}
