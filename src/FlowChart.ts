import {Graph} from 'graphlibrary'
import d3Renderer from 'dagre-d3-renderer'
import {FlowElement, FlowElementEdgeOptions} from './FlowElement'
import {select} from 'd3'
import wrap from 'word-wrap'

export interface FlowChartElementOptions {
  label?: string,
  rectStyle?: ElementCSSInlineStyle,
  textStyle?: ElementCSSInlineStyle
}

export interface FlowChartOptions {
  direction: 'LR' | 'TB' | 'BT' | 'RL'
  wordWrap?: wrap.IOptions
}

export class FlowChart {
  options: FlowChartOptions = {
    direction: 'LR'
  }
  elements: FlowElement[] = []

  constructor(options?: FlowChartOptions) {
    this.options = Object.assign(this.options, options)
  }

  addElement(id: string, options?: FlowChartElementOptions) {
    const el = new FlowElement(id, options)
    this.elements.push(el)
    return el
  }

  destroy() {
    this.elements.forEach((element) => { element.unregister() })
  }

  render(element: HTMLElement) {
    const svg = select(element)
      .append('svg')
      .attr('id', 'f' + element.id)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
    const svgGroup = svg.append('g')

    // Create the input mermaid.graph
    const g = new Graph({
      multigraph: true,
      compound: true
    })
      .setGraph({
        rankdir: this.options.direction,
        marginx: 20,
        marginy: 20
      })
      .setDefaultEdgeLabel(function () {
        return {}
      })

    // first create all nodes
    for (const i in this.elements) {
      const el = this.elements[i]
      const elData: FlowChartElementOptions = {
        label: el.id
      }

      if (el.options && el.options.label) {
        if (this.options.wordWrap) {
          elData.label = wrap(el.options.label, this.options.wordWrap)
        } else {
          elData.label = el.options.label
        }
      }
      g.setNode(el.id, elData)
      const node = g.node(el.id)

      // apply some styles
      node.rx = node.ry = 5

      // now create all edges
      for (const k in el.edges) {
        const edge = el.edges[k]
        const edgeData: FlowElementEdgeOptions = {}

        if (edge.options && edge.options.label) {
          edgeData.label = edge.options.label
        }

        g.setEdge(el.id, edge.otherId, edgeData)
      }
    }

    const render = new d3Renderer.render()

    const e = select('#f' + element.id + ' g')
    render(e, g)
    const svgElement = document.getElementById('f' + element.id)

    // now add the listeners after render
    e.selectAll('g.node')
      .each(function(v) {
        // get the flow element from the id
        const el = FlowElement.getById(v as string)

        if (!el) {
          throw new Error('Element with id ' + v + ' is not defined!')
        }

        // Add styles to the rectangle if they were specified
        if (el.options.rectStyle) {
          const rect = (this as HTMLElement).querySelector('rect')!
          for (const [key, value] of Object.entries(el.options.rectStyle)) {
            (rect.style as any)[key] = value
          }
        }
        // Add styles to the text element if they were specified
        if (el.options.textStyle) {
          const text = (this as HTMLElement).querySelector('text')!
          for (const [key, value] of Object.entries(el.options.textStyle)) {
            (text.style as any)[key] = value
          }
        }

        // now loop all listeners
        const d3Node = select(this)
        for (const listener of el.listeners) {
          d3Node.on(listener.event, listener.callback)
        }
      })

    if (!svgElement) {
      throw new Error('svgElement is null!')
    }

    const groupElement = svgElement.querySelector('g')

    if (!groupElement) {
      throw new Error('groupElement is null!')
    }

    svgElement.setAttribute('width', (groupElement.getBoundingClientRect().width + 40).toString())
    svgElement.setAttribute('height', (groupElement.getBoundingClientRect().height + 40).toString())
  }
}