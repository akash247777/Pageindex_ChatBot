import AssignVehicle from "../models/assignevheicles.model.js";
import Vehicle from "../models/vehicledetails.model.js";

export async function getActiveTripByDriver(driverId) {
    return AssignVehicle.findOne({
        driverId,
        tripStarted: true
    });
}

export async function getVehicleNumber(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId, {
        vehicleNumber: 1
    });
    return vehicle?.vehicleNumber || null;
}
