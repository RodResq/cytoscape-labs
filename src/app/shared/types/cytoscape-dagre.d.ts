import cytoscape from "cytoscape";

declare module 'cytoscape' {
  interface DagreLayouteOptions extends cytoscape.BaseLayoutOptions {
    name: 'dagre';
    rankDir?: 'TB' | 'BT' | 'LR' | 'RL';
    align?: 'UL' | 'UR' | 'DL' | 'DR';
    nodeSep?: number;
    edgeSep?: number;
    rankSep?: number;
    marginX?: number;
    marginY?: number;
    acyclicer?: 'greedy' | undefined;
    ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
    minLen?: (edge: cytoscape.EdgeSingular) => number;
    edgeWeight?: (edge: cytoscape.EdgeSingular) => number;
    animate?: boolean;
    animationDuration?: number;
    animationEasing?: string;
    boundingBox?: cytoscape.BoundingBox12 | cytoscape.BoundingBoxWH;
    fit?: boolean;
    padding?: number;
    spacingFactor?: number;
    nodeDimensionsIncludeLabels?: boolean;
    sort?: (a: cytoscape.EdgeSingular, b: cytoscape.EdgeSingular) => number;
    ready?: () => void;
    stop?: () => void;
  }
}

export {};
