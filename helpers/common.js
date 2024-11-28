import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

/**
 * Calculates width percentage of the device screen.
 * @param {number} percentage - Percentage value (0-100).
 * @returns {number} Calculated width based on the percentage.
 */
export const wp = (percentage) => (percentage * deviceWidth) / 100;

/**
 * Calculates height percentage of the device screen.
 * @param {number} percentage - Percentage value (0-100).
 * @returns {number} Calculated height based on the percentage.
 */
export const hp = (percentage) => (percentage * deviceHeight) / 100;

/**
 * Determines the number of columns for the image grid based on screen width.
 * @returns {number} Number of columns (2, 3, or 4).
 */
export const getColumnCount = () => {
  if (deviceWidth >= 1024) {
    return 4;
  } else if (deviceWidth >= 768) {
    return 3;
  } else {
    return 2;
  }
};

/**
 * Determines the size of the image based on its aspect ratio.
 * @param {number} height - Height of the image.
 * @param {number} width - Width of the image.
 * @returns {number} Suggested size for the image (250, 300, or 200).
 */
export const getImageSize = (height, width) => {
  if (width > height) {
    return 250; // Landscape orientation
  } else if (width < height) {
    return 300; // Portrait orientation
  } else {
    return 200; // Square orientation
  }
};

/**
 * Capitalizes the first letter of every word in a string.
 * @param {string} str - Input string.
 * @returns {string} String with the first letter of each word capitalized.
 */
export const capitalize = (str) => str.replace(/\b\w/g, (l) => l.toUpperCase());
