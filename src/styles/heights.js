import { mapValue } from '../utils';

export const heights = mapValue(
  {
    h1: 1,
    h2: 2,
    h3: 4,
    h4: 8,
    h5: 16,
    h6: 32
  },
  val => ({ height: val })
);

export const maxHeights = mapValue(
  {
    'max-h1': 1,
    'max-h2': 2,
    'max-h3': 4,
    'max-h4': 8,
    'max-h5': 16,
    'max-h6': 32
  },
  val => ({ maxHeight: val })
);

export const minHeights = mapValue(
  {
    'min-h1': 1,
    'min-h2': 2,
    'min-h3': 4,
    'min-h4': 8,
    'min-h5': 16,
    'min-h6': 32
  },
  val => ({ minHeight: val })
);
