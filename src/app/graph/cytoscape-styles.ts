import { StylesheetStyle, StylesheetCSS } from "cytoscape";


type Stylesheet = StylesheetStyle | StylesheetCSS;

export const cytoscapeStyles: Stylesheet[] = [
    {
        selector: '.task-node',
        style: {
        'text-valign': 'bottom',
        label: 'data(id)'
        }
    },
    {
        selector: '.end-node',
        style: {
        'text-valign': 'bottom',
        label: 'data(id)'
        }
    },
    {
        selector: '.triangle-node',
        style: {
        'shape': 'triangle',
        'width': 30,
        'height': 30,
        label: 'data(id)',
        'text-valign': 'center',
        'text-halign': 'center'
        }
    },
    {
        selector: '.event-node',
        style: {
        'shape': 'triangle',
        'width': 30,
        'height': 30,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'left'
        }
    },
    {
        selector: '.decision-node',
        style: {
        'shape': 'diamond',
        'width': 40,
        'height': 40,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        selector: '.system-node',
        style: {
        'shape': 'pentagon',
        'width': 40,
        'height': 40,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        selector: '.separation-node',
        style: {
        'shape': 'vee',
        'width': 40,
        'height': 40,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        "selector": ".join-node",
        style: {
        'shape': 'polygon',
        'shape-polygon-points': '-0.33 -1 0.33 -1 0.33 -0.33 1 -0.33 1 0.33 0.33 0.33 0.33 1 -0.33 1 -0.33 0.33 -1 0.33 -1 -0.33 -0.33 -0.33',
        label: 'data(id)',
        'width': 40,
        'height': 40,
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        selector: '.subprocess-node',
        style: {
        'shape': 'round-rectangle',
        'background-color': '#E8F5E8',
        'width': 40,
        'height': 40,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'font-family': 'Arial, sans-serif',
        'text-wrap': 'wrap',
        'text-max-width': '90px',
        }
    },
    {
        selector: '.subprocess-node.active',
        style: {
        'background-color': '#C8E6C9',
        'border-color': '#4CAF50',
        }
    },
    {
        selector: '.subprocess-node.blocked',
        style: {
        'background-color': '#FFEBEE',
        'border-color': '#F44336',
        'color': '#C62828',
        label: 'data(label)',
        }
    },
    {
        selector: 'edge',
        style: {
        'line-style': 'solid',
        'width': 1,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': '',
        }
    },
    {
        selector: 'edge.dotted',
        style: {
        'line-style': 'dotted',
        }
    },
    {
        selector: 'edge.dashed',
        style: {
        'line-style': 'dashed',
        }
    },
    {
        selector: 'node:selected',
        style: {
        'border-width': 4,
        'border-color': '#ff6b6b'
        }
    },
    {
        selector: 'edge:selected',
        style: {
        'line-color': '#ff6b6b',
        'target-arrow-color': '#ff6b6b',
        'width': 4
        }
    }

]
