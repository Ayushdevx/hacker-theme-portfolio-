/**
 * Fallback declaration file for Three.js
 * This ensures TypeScript doesn't error if the @types/three package isn't recognized
 */
declare module 'three' {
  export class Points<TGeometry = any, TMaterial = any> extends Object3D {
    constructor(geometry?: TGeometry, material?: TMaterial);
    readonly isPoints: true;
    type: 'Points';
    geometry: TGeometry;
    material: TMaterial;
    morphTargetInfluences?: number[];
    morphTargetDictionary?: {
      [key: string]: number;
    };
  }

  export class Object3D {
    // Basic properties all Three.js objects would need
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  }
} 