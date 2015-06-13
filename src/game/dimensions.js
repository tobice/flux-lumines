
const dimensions = {
    SQUARE_SIZE: 10,
    GRID_COLUMNS: 16,
    GRID_ROWS: 10
};

dimensions.GRID_WIDTH = dimensions.SQUARE_SIZE * dimensions.GRID_COLUMNS;
dimensions.GRID_HEIGHT = dimensions.SQUARE_SIZE * dimensions.GRID_ROWS;
dimensions.SCAN_LINE_WIDTH = dimensions.SQUARE_SIZE * 2;

export default dimensions;

