import colors from './colors';
import {moderateScale, msc, sc, verticalScale, vsc} from './size';

export const tStyle = (
  font = 'Manrope-Regular',
  weight = '400',
  style = 'normal',
  size = 12,
  lineHeight = 16,
  color = colors.type.primary,
) => ({
  fontFamily: font,
  fontWeight: weight,
  fontStyle: style,
  fontSize: moderateScale(size),
  lineHeight: moderateScale(lineHeight),
  color,
});
