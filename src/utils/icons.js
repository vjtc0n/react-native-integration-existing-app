import iconAwesomeGlyphMap from 'react-native-vector-icons/glyphmaps/FontAwesome5Free.json';
import iconIonicGlyphMap from 'react-native-vector-icons/glyphmaps/Ionicons.json';
import { glyphMap as icomoonGlyphMap } from 'Zota/src/elements/Icon/icomoon';

const DEFAULT_OPTIONS = {
  fontName: 'FontAwesome',
  color: '#000000',
  fontSize: 30
};

const IONIC_OPTIONS = {
  fontName: 'Ionicons',
  color: '#000000',
  fontSize: 30
};

const GLYPH_MAPS = {
  [DEFAULT_OPTIONS.fontName]: iconAwesomeGlyphMap,
  [IONIC_OPTIONS.fontName]: iconIonicGlyphMap,
  icomoon: icomoonGlyphMap
};

export const getIcon = (iconName, options) => {
  const props = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const glyphMap = GLYPH_MAPS[props.fontName];
  if (glyphMap) {
    props.glyph = String.fromCharCode(glyphMap[iconName]);
    return props;
  }
};
