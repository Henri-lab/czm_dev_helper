import * as Cesium from "cesium";
export interface PopupCreator {
  // 接口不需要constructor

  /**
   * Calculates the display grade based on distance.
   * @param curValue - Current value to calculate the grade for.
   * @param stdNearFar - Standard near far scalar configuration.
   * @returns The calculated display grade.
   */
  calcaluteGrade(curValue: number, stdNearFar: Cesium.NearFarScalar): number;

  /**
   * Updates the popup's position and visibility based on the current scene.
   */
  postRender(): void;

  /**
   * Adds a post-render event listener to update the popup.
   */
  addPostRender(): void;

  /**
   * Adds a label to the scene.
   * @param type - Type of the popup.
   * @param options - Additional options for the label.
   * @returns The DOM element representing the label.
   */
  addLabel(
    type: string,
    options?: Partial<PopupOptions>
  ): Promise<HTMLElement | null>;

  /**
   * Removes the popup from the scene.
   */
  removeMarker(): void;
}

export interface PopupOptions {
  position?: Cesium.Cartesian3;
  label?: string;
  isShow?: boolean;
  color?: string;
  fields?: any[];
  values?: any[];
  attr?: Record<string, any>;
  type?: string;
  offset?: [number, number];
  scaleByDistance?: Cesium.NearFarScalar;
}

export default PopupCreator;
