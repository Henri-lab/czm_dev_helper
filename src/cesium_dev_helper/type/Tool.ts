import * as Cesium from 'cesium';
import { EditorPluginFunction } from '.';

/**
 * EntityDrawer Interface for drawing entities with event handling in Cesium.
 * @interface
 */
export interface I_EntityDrawerClass {
  /**
   * Viewer instance of the Cesium viewer.
   */
  viewer: Cesium.Viewer;

  /**
   * Initializes the drawing layer with the given name, ensuring its uniqueness.
   * @param name - The name of the layer.
   */
  initLayer(name: string): void;

  /**
   * Converts a screen position (pixel) to a Cartesian3 coordinate.
   * @param position - The screen position.
   * @returns The Cartesian3 coordinate of the given screen position.
   */
  _getCartesian3FromPX(
    position: Cesium.Cartesian2
  ): Cesium.Cartesian3 | undefined;

  /**
   * Creates a dynamic Cesium entity that updates when the entity's options are changed.
   * @param data - Data to set the dynamic property.
   * @returns A CallbackProperty for the entity.
   */
  _CallBack(data: any): Cesium.CallbackProperty;

  /**
   * Prepares and draws a dynamic entity with specific options and event handlers.
   * @param typeOfEntity - The type of the entity (e.g., point, polyline).
   * @param entityOption - The options to configure the entity.
   * @param getNewPosition - A function to get the new position for the dynamic entity.
   * @returns The created dynamic entity.
   */
  _createDynamicEntity(
    typeOfEntity: string,
    entityOption: I_EntityOption,
    getNewPosition: () => Cesium.Cartesian3[]
  ): Cesium.Entity | undefined;

  /**
   * Draws an entity with default event handling (left click, right click, etc.).
   * @param Type - The type of the entity (e.g., polyline, polygon).
   * @param options - Configuration options for the entity.
   * @param pluginFunction - Optional callback for additional processing during entity creation.
   * @returns The created entity or null if creation fails.
   */
  drawWithDefaultEvent(
    Type: string,
    options: I_EntityOption,
    pluginFunction?: EditorPluginFunction
  ): Cesium.Entity | null;

  /**
   * Removes all entities from the current drawing layer.
   */
  removeAll(): void;

  /**
   * Removes event handlers associated with the current drawing.
   */
  removeEventHandler(): void;

  /**
   * Destroys the event handler associated with the current drawing.
   */
  destroyHandler(): void;

  /**
   * Fakes drawing of polylines, typically for visualization purposes.
   * @param getPos - Function to get the positions.
   * @param option - The options for the polyline.
   */
  fakeDrawPolyLine(
    getPos?: () => Cesium.Cartesian3,
    option?: I_EntityOption
  ): void;

  /**
   * Fake drawing functionality for visualization of polylines or polygons.
   * @param getPos - Function to get positions.
   * @param option - Drawing options.
   * @param type - The type of entity to fake draw (e.g., polyline, polygon).
   */
  fakeDraw(
    type: string,
    getPos?: () => Cesium.Cartesian3,
    option?: I_EntityOption
  ): void;
}

/**
 * Entity options for creating and updating Cesium entities.
 */
export interface I_EntityOption {
  created_time?: number | string;
  name?: string;
  description?: string;
  positions?: Cesium.Cartesian3[];
  semiMajorAxis?: Cesium.CallbackProperty | number;
  semiMinorAxis?: Cesium.CallbackProperty | number;
  datasource?: Cesium.DataSource;
  mode?: string;
  after?: Function;
  [key: string]: any; // Any additional configuration properties.
}

/**
 * Parsed options after parsing entity configurations.
 */
export interface I_ParsedEntityOptions {
  extraOption: {
    created_time?: number | string;
    name?: string;
    description?: string;
  };
  graphicOption: Omit<I_EntityOption, 'created_time' | 'name' | 'description'>;
  datasource: Cesium.DataSource | Cesium.CustomDataSource;
}
