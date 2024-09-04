import * as Cesium from 'cesium';

export interface PopupCreator {
  /**
   * Creates a new instance of the PopupCreator.
   * @param viewer - The Cesium Viewer instance.
   * @param options - Options for the popup.
   * @param pathOfVueComponentMap - Map of component paths.
   * @param clickHandler - Callback when the popup is clicked.
   */
  constructor(
    viewer: Cesium.Viewer,
    options: PopupOptions,
    pathOfVueComponentMap: Record<string, () => Promise<{ default: any }>>,
    clickHandler: () => void
  ): void;

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
  addLabel(type: string, options?: Partial<PopupOptions>): Promise<HTMLElement | null>;

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
