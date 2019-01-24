import { StyleSheet, Dimensions, Platform } from 'react-native';
import { options, build, styles } from 'MyNewApp/themes';

import { heights, minHeights, maxHeights } from './styles/heights';
import { widths, minWidths, maxWidths } from './styles/widths';
import * as borders from './styles/borders';
import flexbox from './styles/flexbox';
import spacing from './styles/spacing';
import typeScale from './styles/typeScale';
import text from './styles/text';
import images from './styles/images';
import fontWeights from './styles/fontWeights';
import opacity from './styles/opacity';
import { tops, rights, bottoms, lefts } from './styles/absolute';
import lineHeight from './styles/lineHeight';
import tracked from './styles/tracked';

const fontRem = 20;
const device = Dimensions.get('window');

// We need to export this because sometimes we use colors inside static defaultProps
export const colors = {
  strongTextTitle: '#37517e',
  textDescription: '#7e7e7e',
  boxColor: '#e1f0ff',
  transparent: 'transparent',
  white: '#FFFFFF',
  opacityWhite: '#FFFFFF60',
  black: '#000000',
  primary: 'rgb(4, 126, 242)',
  homeHeader: 'rgb(0, 185, 255)',
  lightPrimary: 'rgb(244, 250, 255)',
  dark: '#212121',
  strongBlue: '#0369ca',
  blue: '#0463f2',
  darkBlue: 'rgb(55,81,126)',
  slightLightBlue: '#1f76c7',
  red: '#EA0029',
  opacityRed: '#EA002930',
  superLightRed: '#ffccd5',
  lightRed: '#ff6682',
  gray: 'rgb(210, 210, 210)',
  boldGray: '#a6a6a6',
  strongGray: 'rgb(184,184,184)',
  middleLightGray: 'rgb(153,153,153)',
  extremeGray: 'rgb(84,84,84)',
  gray700: 'rgb(102,102,102)',
  veryLightGray: 'rgb(230,230,230)',
  lightGray: 'rgb(246,246,246)',
  strongLightGray: '#ecf1f9',
  lowLightGray: 'rgb(193, 193, 193)',
  extremeLightRed: '#ffe6ea',
  lightBlue: '#0099ff',
  superLightGray: 'rgb(239,239,239)',
  backdrop: '#00000080',
  green: '#5ED882',
  yellow: 'rgb(255,220,85)',
  lightYellow: '#ffe998',
  strongLightYellow: '#fbf9e1',
  extremeLightYellow: '#FFF8E7',
  darkGray: '#999999',
  boldGreen: '#3C7429',
  orange: '#FB9738',
  extremeBlue: '#1A4F5A',
  purple: '#6754A3',
  textInput: '#7e7e7e',
  lightGreen: '#6cfeb5'
};

const DEFAULT_OPTIONS = {
  remScaled: [
    heights,
    minHeights,
    maxHeights,
    widths,
    minWidths,
    maxWidths,
    spacing,
    typeScale,
    borders.radii,
    lineHeight,
    tracked,
    tops,
    rights,
    bottoms,
    lefts
  ],
  /* fontRem parameter is optional to allow adjustment in font-scaling. default falls back to rem */
  fontRem,
  colors,
  styles: [
    borders.styles,
    flexbox,
    fontWeights,
    images,
    text,
    opacity,
    // custom styles => should put into seperated files
    {
      // this is optional, so it is removed from styles/absolute.js
      absolute_fill: StyleSheet.absoluteFillObject,
      underline: {
        textDecorationLine: 'underline'
      },
      textInputBorderBottom: {
        borderBottomColor: '#ccc'
      },
      fullView: {
        width: '100%',
        height: '100%'
      },
      fullWidth: {
        width: '100%'
      },
      fullheight: {
        height: '100%'
      },
      topicText: {
        fontSize: options.rem * 0.75
      },
      dateNotificationText: {
        fontSize: options.rem * 0.7
      },
      notificationNumberText: {
        fontSize: options.rem * 0.5
      },
      divider: {
        height: 1
      },
      deviceWidth: {
        width: device.width
      },
      lightFont: {
        fontFamily: 'Roboto-Light'
      },
      boldFont: {
        fontFamily: 'Roboto-Bold'
      },
      regularFont: {
        fontFamily: 'Roboto-Regular'
      },
      mediumFont: {
        fontFamily: 'Roboto-Medium'
      }
    }
  ],
  fn: {
    // alternative: styles.title = [styles.f9, styles.black]
    title: () => [styles.boldFont, styles.f4, styles.strongTextTitle],

    subtitle: () => [styles.textDescription, styles.f9, styles.mt2, styles.regularFont],

    icon: () => [styles.f5, styles.gray],

    fullViewLoading: () => [
      styles.absolute,
      styles.fullView,
      styles.aic,
      styles.jcc,
      styles.bg_opacityWhite,
      styles.o_80
    ],
    myStyle(color) {
      const ret = options.fn.bg.call(this, color);
      if (this.type.name !== 'View') {
        ret.color = color;
      }

      return ret;
    },
    // borderW: number => ({
    //   borderWidth: Number(number)
    // }),
    flexFn: flex => ({
      flex: Number(flex)
    }),
    colorTextFn: color => ({
      color
    }),
    circleFn: size => {
      const height = Number(size);
      const width = height;
      const borderRadius = height / 2;
      return {
        height,
        width,
        borderRadius
      };
    },
    squareFn: size => {
      const height = Number(size);
      const width = height;
      return {
        height,
        width
      };
    },
    zIndexFn: zIndex => ({
      zIndex: Number(zIndex)
    }),
    widthPercentageFn: width => ({
      width: `${width}%`
    }),
    elevationFn: elevation => ({
      elevation: Number(elevation)
    }),
    absoluteBottomFn: size => ({
      top: device.height - Number(size)
    }),
    iconTintColorFn: color => ({
      tintColor: colors[`${color}`]
    }),
    borderTypeFn: bordertype => ({
      borderStyle: bordertype
    })
  }
};

export const buildTheme = (updatedOptions = DEFAULT_OPTIONS) => build(updatedOptions, StyleSheet);
