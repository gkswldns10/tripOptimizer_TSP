import sys


if __name__ == '__main__':
    start_coord = sys.argv[1]
    x_coord = sys.argv[2]
    y_coord = sys.argv[3]
    pid = sys.argv[4]
    indicator = sys.argv[5]

    start_coord_list = start_coord.split(",")
    x_coord_list = x_coord.split(",")
    y_coord_list = y_coord.split(",")
    pid_list = pid.split(",")
    indicator_list = indicator.split(",")
    places = []
    restaurants = []
    start = start_coord_list[0] + "," + start_coord_list[1]

    print(start)