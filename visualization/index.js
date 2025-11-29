/**
 * Visualization Module - HD Knowledge Engine V3
 *
 * Provides SVG coordinate conversion, document manipulation,
 * and attribute mapping for Human Design wheel visualizations.
 *
 * @version 1.0.0
 */

const SVGGeometry = require('./core/svg-geometry.js');
const SVGDocument = require('./core/svg-document.js');
const AttributeMapper = require('./core/attribute-mapper.js');
const V3Adapter = require('./core/v3-adapter.js');
const attributeSchema = require('./core/attribute-schema.js');

module.exports = {
  // Core classes
  SVGGeometry,
  SVGDocument,
  AttributeMapper,
  V3Adapter,

  // Schema utilities
  attributeSchema,

  // Convenience re-exports from schema
  GATE_ATTRIBUTES: attributeSchema.GATE_ATTRIBUTES,
  LINE_ATTRIBUTES: attributeSchema.LINE_ATTRIBUTES,
  SVG_ATTRIBUTES: attributeSchema.SVG_ATTRIBUTES
};
