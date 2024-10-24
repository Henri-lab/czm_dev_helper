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
   * Parses entity options and separates extra and graphic options.
   * @param entityOption - The configuration options for the entity.
   * @returns A parsed configuration object.
   */
  _parseConfig(entityOption: I_EntityOption): I_ParsedEntityOptions;

  /**
   * Prepares and draws a dynamic entity with specific options and event handlers.
   * @param typeOfEntity - The type of the entity (e.g., point, polyline).
   * @param entityOption - The options to configure the entity.
   * @param getNewPosition - A function to get the new position for the dynamic entity.
   * @returns The created dynamic entity.
   */
  _startDynamicEntity(
    typeOfEntity: string,
    entityOption: I_EntityOption,
    getNewPosition: () => Cesium.Cartesian3[]
  ): Cesium.Entity | undefined;

  /**
   * Updates the entity's position options with new coordinates.
   * @param options - The entity options to update.
   * @param newPos - The new position for the entity.
   */
  _updatePos(options: I_EntityOption, newPos: Cesium.Cartesian3[]): void;

  /**
   * Updates the positions for specific entity types (polyline, rectangle, etc.).
   * @param type - The type of the entity (e.g., polyline, rectangle).
   * @param pickedPosCollection - The collection of positions already picked.
   * @param newPickPos - The new position to be added.
   * @param entityOptions - The entity options to update.
   * @param isClose - Whether the shape should be closed (for polygons).
   * @returns A boolean indicating whether the update was successful.
   */
  _updatePosByType(
    type: string,
    pickedPosCollection: Cesium.Cartesian3[],
    newPickPos: Cesium.Cartesian3,
    entityOptions: I_EntityOption,
    isClose: boolean
  ): void;

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
