import { StylesheetStyle, StylesheetCSS } from "cytoscape";


type Stylesheet = StylesheetStyle | StylesheetCSS;

export const cytoscapeStyles: Stylesheet[] = [
    {
        selector: '.start',
        style: {
        'shape': 'ellipse',
        'background-color': '#27ae60',
        'border-color': '#229954',
        'border-width': 5,
        'width': 80,
        'height': 80,
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#fff',
        'font-size': '12px',
        'font-weight': 'bold',
        label: 'data(label)'
        }
    },
    {
        selector: '.fluxo',
        style: {
        'shape': 'ellipse',
        'background-color': '#3498db',
        'border-color': '#2980b9',
        'border-width': 5,
        'width': 60,
        'height': 60,
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#fff',
        'font-size': '12px',
        'font-weight': 'bold',
        label: 'data(label)'
        }
    },
    {
        selector: '.task-node',
        style: {
        'shape': 'rectangle',
        'background-color': '#5dade2',
        'width': 200,
        'height': 60,
        'text-valign': 'center',
        'text-halign': 'center',
        label: 'data(id)'
        }
    },
    {
        selector: '.node',
        style: {
        'shape': 'rectangle',
        'background-color': '#5dade2',
        'width': 200,
        'height': 60,
        'text-valign': 'center',
        'text-halign': 'center',
        label: 'data(label)'
        }
    },
    {
        selector: '.end-node',
        style: {
        'shape': 'ellipse',
        'background-color': '#e74c3c',
        'border-color': '#c0392b',
        'border-width': 5,
        'width': 80,
        'height': 80,
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#fff',
        'font-weight': 'bold',
        label: 'data(label)'
        }
    },
    {
        selector: '.triangle-node',
        style: {
        'shape': 'triangle',
        'width': 30,
        'height': 30,
        'text-valign': 'center',
        'text-halign': 'center',
        label: 'data(id)'
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
        'background-color': '#f39c12',
        'width': 50,
        'height': 50,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        selector: '.system-node',
        style: {
        'shape': 'pentagon',
        'background-color': '#9b59b6',
        'width': 50,
        'height': 50,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        selector: '.separation-node',
        style: {
        'shape': 'vee',
        'background-color': '#16a085',
        'width': 50,
        'height': 50,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        selector: ".join-node",
        style: {
        'shape': 'octagon',
        'background-color': '#4A90E2',
        'width': 50,
        'height': 50,
        label: 'data(id)',
        'text-valign': 'bottom',
        'text-halign': 'center'
        }
    },
    {
        selector: '.subprocess-node',
        style: {
        'shape': 'rectangle',
        'background-color': '#E8F5E8',
        'width': 200,
        'height': 80,
        'text-valign': 'center',
        'text-halign': 'center',
        'font-family': 'Arial, sans-serif',
        'text-wrap': 'wrap',
        'text-max-width': '90px',
        label: 'data(label)',
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
        label: 'data(id)',
        }
    },
    {
        selector: 'edge',
        style: {
        'line-style': 'solid',
        'width': 2,
        'line-color': '#95a5a6',
        'target-arrow-color': '#95a5a6',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'text-rotation': 'autorotate',
        'font-size': '10px'
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
        'border-width': 6,
        'border-color': '#ff6b6b',
        'overlay-color': '#ff6b6b',
        'overlay-opacity': 0.2,
        'overlay-padding': 5
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
