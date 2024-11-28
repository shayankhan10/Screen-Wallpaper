export const theme = {
    colors: {
        white: '#fff',
        black: '#000',
        grayBG: '#e5e5e5',
        neutral: (opacity) => `rgba(10, 10, 10, ${opacity})`, // Function for opacity-based color
    },
    fontWeights: {
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    radius: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
    },
    fontSize: {      // Add font size definitions
        sm: 14,      // Small font size
        md: 16,      // Medium font size
        lg: 18,      // Large font size
        xl: 22,      // Extra large font size
    },
};
