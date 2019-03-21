from __future__ import print_function
from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2
import ast
    
def create_data_model(datafile):
    f = open(datafile, "r")
    lines = f.readlines()

    _distances = []

    for i in lines[1:]:
        dist_from_i = []

        for j in lines[1:]:
            di = ast.literal_eval(i[:-1])
            dj = ast.literal_eval(j[:-1])
            dist_from_i.append(euclidean_dist(di["X"], di["Y"], dj["X"], dj["Y"]))

        _distances.append(dist_from_i)

    data = {}
    data["distances"] = _distances
    data["num_locations"] = len(_distances)
    data["num_vehicles"] = int(lines[0])
    data["depot"] = 0
    return data

def create_distance_callback(data):
    """Creates callback to return distance between points."""
    distances = data["distances"]

    def distance_callback(from_node, to_node):
        """Returns the manhattan distance between the two nodes"""
        return distances[from_node][to_node]
    return distance_callback

def add_distance_dimension(routing, distance_callback):
    """Add Global Span constraint"""
    distance = 'Distance'
    maximum_distance = 3000  # Maximum distance per vehicle.
    routing.AddDimension(
        distance_callback,
        0,  # null slack
        maximum_distance,
        True,  # start cumul to zero
        distance)
    distance_dimension = routing.GetDimensionOrDie(distance)
    # Try to minimize the max distance among vehicles.
    distance_dimension.SetGlobalSpanCostCoefficient(100)

def print_solution(data, routing, assignment):
    """Print routes on console."""
    total_distance = 0
    for vehicle_id in range(data["num_vehicles"]):
        index = routing.Start(vehicle_id)
        plan_output = 'Route for vehicle {}:\n'.format(vehicle_id)
        route_dist = 0
        while not routing.IsEnd(index):
            node_index = routing.IndexToNode(index)
            next_node_index = routing.IndexToNode(
                assignment.Value(routing.NextVar(index)))
            route_dist += routing.GetArcCostForVehicle(node_index, next_node_index, vehicle_id)
            plan_output += ' {0} ->'.format(node_index)
            index = assignment.Value(routing.NextVar(index))
        plan_output += ' {}\n'.format(routing.IndexToNode(index))
        plan_output += 'Distance of route: {}m\n'.format(route_dist)
        print(plan_output)
        total_distance += route_dist
    print('Total distance of all routes: {}m'.format(total_distance))

def solve(datafile = "info_load.dat"):
    # Instantiate the data problem.
    data = create_data_model(datafile)
    # Create Routing Model
    routing = pywrapcp.RoutingModel(
        data["num_locations"],
        data["num_vehicles"],
        data["depot"])
    # Define weight of each edge
    distance_callback = create_distance_callback(data)
    routing.SetArcCostEvaluatorOfAllVehicles(distance_callback)
    add_distance_dimension(routing, distance_callback)
    # Setting first solution heuristic (cheapest addition).
    search_parameters = pywrapcp.RoutingModel.DefaultSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC) # pylint: disable=no-member
    # Solve the problem.
    assignment = routing.SolveWithParameters(search_parameters)
    if assignment:
        print_solution(data, routing, assignment)
    
    response = {}

    total_distance = 0
    for vehicle_id in range(data["num_vehicles"]):
        index = routing.Start(vehicle_id)
        nodes = []
        dists = []
        route_dist = 0
        while not routing.IsEnd(index):
            node_index = routing.IndexToNode(index)
            next_node_index = routing.IndexToNode(
                assignment.Value(routing.NextVar(index)))
            dist_nodes = routing.GetArcCostForVehicle(node_index, next_node_index, vehicle_id)
            route_dist += dist_nodes

            nodes.append(node_index)
            dists.append(dist_nodes)

            index = assignment.Value(routing.NextVar(index))

        nodes.append(routing.IndexToNode(index))
        response[vehicle_id] = [nodes, dists, route_dist]
        total_distance += route_dist

    response["total_dist"] = total_distance
    
    return response

def euclidean_dist(x1, y1, x2, y2):
    return round(((x2-x1)**2 + (y2-y1)**2)**0.5) # rounded to nearest int